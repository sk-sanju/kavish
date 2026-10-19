-- ====================================================================
-- KAVISH LUXURY HANDLOOMS - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- ====================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  collection TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  cost_price NUMERIC,
  discount_percentage NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 10,
  low_stock_threshold INTEGER DEFAULT 5,
  allow_backorders BOOLEAN DEFAULT false,
  brand TEXT DEFAULT 'Kavish Kuthampully Atelier',
  is_new BOOLEAN DEFAULT true,
  is_best_seller BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  fabric TEXT,
  details JSONB DEFAULT '[]'::jsonb,
  care_instructions JSONB DEFAULT '[]'::jsonb,
  fit_information TEXT,
  sku TEXT UNIQUE NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  size_chart JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_category TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT DEFAULT 'Active',
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Pending',
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  cgst_amount NUMERIC,
  sgst_amount NUMERIC,
  igst_amount NUMERIC,
  total NUMERIC NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  tracking_number TEXT,
  courier_provider TEXT,
  estimated_delivery TEXT,
  notes TEXT,
  invoice_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration for existing orders tables
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending';

-- 4. PROMO OFFERS & COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.promo_offers (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  max_discount_amount NUMERIC,
  expiry_date TEXT,
  start_date TEXT,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER,
  per_customer_limit INTEGER DEFAULT 1,
  is_first_order_only BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration for existing promo_offers
ALTER TABLE public.promo_offers ADD COLUMN IF NOT EXISTS usage_limit INTEGER;

-- 5. REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT,
  author TEXT NOT NULL,
  location TEXT,
  rating INTEGER DEFAULT 5,
  title TEXT,
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Approved',
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RETURN REQUESTS & EXCHANGES TABLE
CREATE TABLE IF NOT EXISTS public.return_requests (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  product_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  requested_date TEXT NOT NULL,
  status TEXT DEFAULT 'Requested',
  refund_amount NUMERIC NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AUDIT TRAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  admin_name TEXT NOT NULL,
  admin_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  timestamp TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STORE CONTENT & CMS TABLE
CREATE TABLE IF NOT EXISTS public.store_content (
  id TEXT PRIMARY KEY DEFAULT 'main_content',
  announcement_text TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  banner_image TEXT,
  hero_banners JSONB DEFAULT '[]'::jsonb,
  featured_collection_ids JSONB DEFAULT '[]'::jsonb,
  faq_items JSONB DEFAULT '[]'::jsonb,
  policy_text TEXT,
  contact_info JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration for existing store_content tables
ALTER TABLE public.store_content ADD COLUMN IF NOT EXISTS hero_banners JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.store_content ADD COLUMN IF NOT EXISTS contact_info JSONB;

-- 9. ADMIN USERS TABLE (Primary Key: phone_number)
CREATE TABLE IF NOT EXISTS public.admin_users (
  phone_number TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'Super Admin',
  status TEXT DEFAULT 'Active',
  permissions JSONB DEFAULT '["all"]'::jsonb,
  last_login TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SHIPPING RULES & LOGISTICS CONFIG
CREATE TABLE IF NOT EXISTS public.shipping_rules (
  id TEXT PRIMARY KEY DEFAULT 'main_shipping',
  free_shipping_threshold NUMERIC DEFAULT 0,
  standard_flat_rate NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rules ENABLE ROW LEVEL SECURITY;

-- Drop legacy insecure wildcard policies if present
DROP POLICY IF EXISTS "Allow All Products Access" ON public.products;
DROP POLICY IF EXISTS "Allow All Categories Access" ON public.categories;
DROP POLICY IF EXISTS "Allow All Orders Access" ON public.orders;
DROP POLICY IF EXISTS "Allow All Offers Access" ON public.promo_offers;
DROP POLICY IF EXISTS "Allow All Reviews Access" ON public.reviews;
DROP POLICY IF EXISTS "Allow All Returns Access" ON public.return_requests;
DROP POLICY IF EXISTS "Allow All Audit Logs Access" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow All Content Access" ON public.store_content;
DROP POLICY IF EXISTS "Allow All Admin Users Access" ON public.admin_users;
DROP POLICY IF EXISTS "Allow All Shipping Access" ON public.shipping_rules;

-- Allow Public Read Access for Storefront
CREATE POLICY "Allow Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Offers" ON public.promo_offers FOR SELECT USING (is_active = true);
CREATE POLICY "Allow Public Read Reviews" ON public.reviews FOR SELECT USING (status = 'Approved');
CREATE POLICY "Allow Public Read Store Content" ON public.store_content FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Shipping" ON public.shipping_rules FOR SELECT USING (true);

-- Storefront Customer Order Creation (Customers can insert their checkout order)
CREATE POLICY "Allow Customer Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Customer Read Orders" ON public.orders FOR SELECT USING (true);

-- Customer Review Submission & Return Requests
CREATE POLICY "Allow Customer Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Customer Insert Returns" ON public.return_requests FOR INSERT WITH CHECK (true);

-- Admin & Service Role Full Access (Service Role and authenticated admins can manage records)
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Categories" ON public.categories FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Offers" ON public.promo_offers FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Reviews" ON public.reviews FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Returns" ON public.return_requests FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Content" ON public.store_content FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Shipping" ON public.shipping_rules FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Audit Logs" ON public.audit_logs FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- Admin Users: NEVER expose admin credentials to anon public
CREATE POLICY "Admin Users Protected Access" ON public.admin_users FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);


-- 11. SUPABASE STORAGE BUCKET FOR MEDIA (Images, Banners, Categories, Products)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-media', 'store-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Public Media Select Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Media Insert Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Media Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Media Delete Access" ON storage.objects;

-- Create Storage Access Policies
CREATE POLICY "Public Media Select Access" ON storage.objects FOR SELECT USING (bucket_id = 'store-media');
CREATE POLICY "Public Media Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'store-media');
CREATE POLICY "Public Media Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'store-media');
CREATE POLICY "Public Media Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'store-media');
