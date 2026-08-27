import { createClient } from '@supabase/supabase-js';

const url = 'https://cswdcbruzgdqburynlop.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';
const supabase = createClient(url, key);

async function main() {
  console.log('Testing category upsert...');
  const cat = {
    id: 'cat-women-kasavu',
    name: "Women's Kasavu Sarees",
    parent_category: 'women',
    slug: 'kasavu-sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic Kuthampully handloom pure cotton and tissue Kasavu sarees with 24k gold zari borders.',
    seo_title: 'Authentic Kuthampully Kasavu Sarees | Kavish',
    seo_description: 'Shop certified GI Tagged Kerala Kasavu Sarees woven by master Devanga weavers.',
    status: 'Active',
    product_count: 8
  };
  const res = await supabase.from('categories').upsert([cat]);
  console.log('Category upsert result:', res.error ? res.error : 'SUCCESS');

  console.log('\nTesting store_content upsert with hero_banners...');
  const storeRes = await supabase.from('store_content').upsert([{
    id: 'main_content',
    hero_banners: [{ id: 'b1', title: 'Test banner' }]
  }]);
  console.log('Store content upsert result:', storeRes.error ? storeRes.error : 'SUCCESS');

  const { data: cols } = await supabase.from('store_content').select('*').limit(1);
  console.log('Store content columns in DB:', cols ? Object.keys(cols[0] || {}) : 'None');
  console.log('Store content current row:', cols);
}

main().catch(console.error);
