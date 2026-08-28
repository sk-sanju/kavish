import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let url = 'https://cswdcbruzgdqburynlop.supabase.co';
let key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';

const supabase = createClient(url, key);

async function check() {
  const { data: categories } = await supabase.from('categories').select('*');
  categories?.forEach((c, idx) => {
    console.log(`Cat ${idx + 1}: ${c.id} - ${c.name} - img length: ${c.image?.length || 0} - startsWith: ${c.image?.substring(0, 30)}`);
  });
}

check();
