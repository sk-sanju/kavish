import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let url = 'https://cswdcbruzgdqburynlop.supabase.co';
let key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';

try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) url = trimmed.split('=')[1].trim();
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) key = trimmed.split('=')[1].trim();
  }
} catch (e) {}

const supabase = createClient(url, key);

function mapProductFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || '',
    category: row.category,
    subcategory: row.subcategory,
    collection: row.collection || '',
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    costPrice: row.cost_price != null ? Number(row.cost_price) : undefined,
    discountPercentage: row.discount_percentage != null ? Number(row.discount_percentage) : undefined,
    rating: Number(row.rating ?? 5.0),
    reviewCount: Number(row.review_count ?? 0),
    inStock: Boolean(row.in_stock ?? true),
    stockCount: row.stock_count != null ? Number(row.stock_count) : 10,
    lowStockThreshold: row.low_stock_threshold != null ? Number(row.low_stock_threshold) : 5,
    allowBackorders: Boolean(row.allow_backorders ?? false),
    brand: row.brand || 'Kavish Kuthampully Atelier',
    isNew: Boolean(row.is_new ?? true),
    isBestSeller: Boolean(row.is_best_seller ?? false),
    isFeatured: Boolean(row.is_featured ?? true),
    images: Array.isArray(row.images) ? row.images : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    variants: Array.isArray(row.variants) ? row.variants : [],
    fabric: row.fabric || '',
    details: Array.isArray(row.details) ? row.details : [],
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : [],
    fitInformation: row.fit_information || '',
    sku: row.sku,
    tags: Array.isArray(row.tags) ? row.tags : [],
    sizeChart: row.size_chart || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCategoryFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    parentCategory: row.parent_category,
    slug: row.slug,
    image: row.image || '',
    description: row.description || '',
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    status: row.status || 'Active',
    productCount: Number(row.product_count ?? 0)
  };
}

async function syncRealData() {
  console.log('Fetching live products from Supabase...');
  const { data: dbProducts, error: pErr } = await supabase.from('products').select('*');
  if (pErr) {
    console.error('Failed to fetch products:', pErr);
    return;
  }
  const products = dbProducts.map(mapProductFromDb);

  const productFileContent = `import type { Product } from '../types';\n\n// Verified live catalog from Supabase Database (${products.length} products)\nexport const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};\n`;
  fs.writeFileSync('src/data/products.ts', productFileContent, 'utf-8');
  console.log(`Updated src/data/products.ts with ${products.length} real products!`);

  console.log('Fetching live categories from Supabase...');
  const { data: dbCategories, error: cErr } = await supabase.from('categories').select('*');
  if (cErr) {
    console.error('Failed to fetch categories:', cErr);
    return;
  }
  const categories = dbCategories.map(mapCategoryFromDb);

  const categoryFileContent = `import type { CategoryItem } from '../types';\n\n// Verified live categories from Supabase Database (${categories.length} categories)\nexport const INITIAL_CATEGORIES: CategoryItem[] = ${JSON.stringify(categories, null, 2)};\n`;
  fs.writeFileSync('src/data/categories.ts', categoryFileContent, 'utf-8');
  console.log(`Updated src/data/categories.ts with ${categories.length} real categories!`);
}

syncRealData();
