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

async function inspectDb() {
  const { data: products } = await supabase.from('products').select('*');
  console.log('=== PRODUCTS IN SUPABASE DB (' + (products?.length || 0) + ') ===');
  products?.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.id}] ${p.name} - ₹${p.price} (Category: ${p.category}/${p.subcategory}, Images: ${p.images?.length || 0})`);
  });

  const { data: categories } = await supabase.from('categories').select('*');
  console.log('\n=== CATEGORIES IN SUPABASE DB (' + (categories?.length || 0) + ') ===');
  categories?.forEach((c, idx) => {
    console.log(`${idx + 1}. [${c.id}] ${c.name} (${c.parent_category}) - Slug: ${c.slug}`);
  });
}

inspectDb();
