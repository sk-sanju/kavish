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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  per_customer_limit INTEGER DEFAULT 1,
  is_first_order_only BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  featured_collection_ids JSONB DEFAULT '[]'::jsonb,
  faq_items JSONB DEFAULT '[]'::jsonb,
  policy_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Allow Public Read Access for Storefront
CREATE POLICY "Allow Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Offers" ON public.promo_offers FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Store Content" ON public.store_content FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Shipping" ON public.shipping_rules FOR SELECT USING (true);

-- Allow Public Write / Admin Full Access
CREATE POLICY "Allow All Products Access" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow All Orders Access" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow All Offers Access" ON public.promo_offers FOR ALL USING (true);
CREATE POLICY "Allow All Reviews Access" ON public.reviews FOR ALL USING (true);
CREATE POLICY "Allow All Returns Access" ON public.return_requests FOR ALL USING (true);
CREATE POLICY "Allow All Audit Logs Access" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Allow All Content Access" ON public.store_content FOR ALL USING (true);
CREATE POLICY "Allow All Admin Users Access" ON public.admin_users FOR ALL USING (true);
CREATE POLICY "Allow All Shipping Access" ON public.shipping_rules FOR ALL USING (true);
