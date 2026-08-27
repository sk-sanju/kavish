import { createClient } from '@supabase/supabase-js';

const url = 'https://cswdcbruzgdqburynlop.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';
const supabase = createClient(url, key);

async function testAllTables() {
  const tables = [
    { name: 'products', testObj: { id: 'test-p', name: 'Test', category: 'women', subcategory: 'test', price: 100, sku: 'TEST-SKU-001' } },
    { name: 'categories', testObj: { id: 'test-c', name: 'Test Cat', parent_category: 'women', slug: 'test-cat' } },
    { name: 'orders', testObj: { id: 'test-o', date: 'August 27, 2026', status: 'Processing', items: [], subtotal: 100, total: 100, shipping_address: {}, payment_method: 'Test' } },
    { name: 'promo_offers', testObj: { id: 'test-off', code: 'TESTCOUPON', discount_type: 'percentage', discount_value: 10 } },
    { name: 'reviews', testObj: { id: 'test-r', author: 'Test Author', rating: 5, comment: 'Test', date: 'August 27, 2026' } },
    { name: 'return_requests', testObj: { id: 'test-ret', order_id: 'test-o', customer_name: 'Test', customer_email: 'test@kavish.com', product_name: 'Test', reason: 'Test', requested_date: 'August 27, 2026', refund_amount: 100 } },
    { name: 'audit_logs', testObj: { id: 'test-log', admin_name: 'Test Admin', admin_role: 'Admin', action: 'Test Action', entity: 'Test', entity_id: 'test-1', timestamp: 'Aug 27, 2026' } },
    { name: 'store_content', testObj: { id: 'main_content', hero_title: '500 Years of Kuthampully Handloom Mastery' } }
  ];

  for (const t of tables) {
    const res = await supabase.from(t.name).upsert([t.testObj]);
    console.log(`Table ${t.name} UPSERT test:`, res.error ? `FAILED (${res.error.code}: ${res.error.message})` : 'SUCCESS');
    if (!res.error && t.name !== 'store_content') {
      // Clean up test row
      await supabase.from(t.name).delete().eq('id', t.testObj.id);
    }
  }
}

testAllTables().catch(console.error);
