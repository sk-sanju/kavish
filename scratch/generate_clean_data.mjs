import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let url = 'https://cswdcbruzgdqburynlop.supabase.co';
let key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';

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
    sizes: Array.isArray(row.sizes) ? row.sizes : ['Free Size'],
    colors: Array.isArray(row.colors) ? row.colors : [{ name: 'Traditional Kasavu', hex: '#D4AF37' }],
    variants: Array.isArray(row.variants) ? row.variants : [],
    fabric: row.fabric || '100% Pure Handloom Weave',
    details: Array.isArray(row.details) ? row.details : ['Authentic Kuthampully Handloom', 'GI Certified Heritage Craft'],
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : ['Dry Clean or Gentle Cold Wash'],
    fitInformation: row.fit_information || 'Traditional authentic drape',
    sku: row.sku || row.id,
    tags: Array.isArray(row.tags) ? row.tags : ['Handloom', 'Kuthampully', 'Kerala'],
    sizeChart: row.size_chart || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function run() {
  const { data: dbProducts } = await supabase.from('products').select('*');
  const products = (dbProducts || []).map(mapProductFromDb);
  
  const content = `import type { Product } from '../types';\n\n// Verified live catalog from Supabase Database (${products.length} products)\nexport const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};\n`;
  fs.writeFileSync('src/data/products.ts', content, 'utf-8');
  console.log('Saved src/data/products.ts with', products.length, 'products');

  const { data: dbCats } = await supabase.from('categories').select('*');
  const cats = (dbCats || []).map(c => ({
    id: c.id,
    name: c.name,
    parentCategory: c.parent_category,
    slug: c.slug,
    image: c.image || (c.parent_category === 'men' ? 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80' : c.parent_category === 'kids' ? 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'),
    description: c.description || 'Authentic Kuthampully handloom craft, fine textures and pure organic weaves.',
    seoTitle: c.seo_title || `${c.name} - Kavish`,
    seoDescription: c.seo_description || `Shop authentic ${c.name} handwoven by master Devanga weavers.`,
    status: c.status || 'Active',
    productCount: Number(c.product_count ?? 0)
  }));

  const catContent = `import type { CategoryItem } from '../types';\n\n// Verified live categories from Supabase Database (${cats.length} categories)\nexport const INITIAL_CATEGORIES: CategoryItem[] = ${JSON.stringify(cats, null, 2)};\n`;
  fs.writeFileSync('src/data/categories.ts', catContent, 'utf-8');
  console.log('Saved src/data/categories.ts with', cats.length, 'categories');
}

run();
