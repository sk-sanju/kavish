import { createClient } from '@supabase/supabase-js';

let url = 'https://cswdcbruzgdqburynlop.supabase.co';
let key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';

const supabase = createClient(url, key);

async function check() {
  const { data: products } = await supabase.from('products').select('*');
  products?.forEach((p, idx) => {
    console.log(`Product ${idx + 1}: ${p.id} - ${p.name} - img count: ${p.images?.length || 0}`);
    p.images?.forEach((img, i) => {
      console.log(`  Img ${i + 1} [length: ${img.length}]: ${img.substring(0, 80)}...`);
    });
  });
}

check();
