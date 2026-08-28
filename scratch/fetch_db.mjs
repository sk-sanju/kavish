import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let url = 'https://cswdcbruzgdqburynlop.supabase.co';
let key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';

try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      url = trimmed.split('=')[1].trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      key = trimmed.split('=')[1].trim();
    }
  }
} catch (e) {
  // ignore
}

const supabase = createClient(url, key);

async function testFetch() {
  console.log('Testing Supabase DB Connection:', url);

  const tables = ['products', 'categories', 'offers', 'orders', 'reviews', 'store_content', 'admin_users', 'audit_logs'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.log(`Table [${table}]: Error ->`, error.message);
      } else {
        console.log(`Table [${table}]: OK -> ${data?.length || 0} rows found.`);
        if (data && data.length > 0) {
          console.log(`  Sample ${table} [0]:`, JSON.stringify(data[0]).substring(0, 120) + '...');
        }
      }
    } catch (e) {
      console.log(`Table [${table}]: Exception ->`, e.message);
    }
  }
}

testFetch();
