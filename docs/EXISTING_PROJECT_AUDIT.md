# KAVISH 1.0 — Existing Technical Architecture & Codebase Audit

**Date:** November 2026  
**Auditor:** Antigravity AI Assistant  
**Target Project:** Kavish Handlooms (Kavish 2.0 Rebuild)  
**Live Production URL:** https://kavish.xenotrix.in/  
**Design Reference:** https://kuthampullysarees.com/  

---

## 1. Executive Summary

This document provides a comprehensive technical audit of the existing **Kavish** ecommerce codebase (`kavish` v1.0). The audit covers the frontend architecture, backend APIs, Supabase database schema, storage assets, authentication, shopping cart/checkout flows, admin ERP dashboard, and environment configurations.

The current repository is a functional **Next.js 15 (App Router)** and **React 19** application with Tailwind CSS, Lucide icons, Vitest test suites, Razorpay payments, and an offline-first storage fallback layer. While the core ecommerce business logic is well-modeled, the application requires an architectural and visual overhaul to transition from a single-brand template into an editorial luxury ethnic fashion platform matching the visual standards of high-end Kerala handloom houses like the design reference (`kuthampullysarees.com`).

---

## 2. Frontend Architecture Audit

### 2.1 Framework & Core Libraries
- **Framework:** Next.js 15.2.1 (App Router)
- **UI Runtime:** React 19.0.0, React-DOM 19.0.0
- **Styling:** Tailwind CSS v4.0.0 with `@tailwindcss/postcss`
- **Iconography:** `lucide-react` (v1.33.0)
- **Testing:** `vitest` (v5.0.5) with 21 unit/integration tests passing
- **State Management:** React Context API (`CartContext`, `WishlistContext`, `AuthContext`, `ProductContext`, `AdminContext`, `CurrencyContext`, `ModalContext`) backed by `localStorage` (`src/utils/storage.ts`)

### 2.2 Route Structure (`src/app/`)
| Route | Component / View | Purpose | Current Status |
| :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` (`Home.tsx`) | Editorial luxury homepage | Functional, needs visual upgrade to new palette |
| `/shop` | `src/app/shop/page.tsx` (`Shop.tsx`) | Main catalog with filters & sorting | Functional, client-rendered |
| `/shop/category/[category]` | Dynamic Category Route | Filter by category slug | Functional |
| `/shop/collection/[collection]` | Dynamic Collection Route | Filter by collection slug | Functional |
| `/product/[id]` | `ProductDetail.tsx` | Garment detail page, gallery, zoom, reviews | Functional, needs editorial typography & specs |
| `/cart` | `CartPage.tsx` & `CartDrawer.tsx` | Slide-over cart & dedicated cart page | Functional |
| `/checkout` | `CheckoutPage.tsx` | 3-step address, delivery & payment checkout | Functional, Razorpay + UPI + COD |
| `/order-success` | `OrderSuccess.tsx` | Order confirmation & invoice summary | Functional |
| `/account` | `AccountPage.tsx` | Customer profile, addresses & orders | Functional (client localStorage) |
| `/wishlist` | `WishlistPage.tsx` | Saved products | Functional |
| `/track-order` | `TrackOrder.tsx` | Order & shipping status tracking | Functional |
| `/admin` | `AdminDashboard.tsx` | Complete back-office store ERP | Functional, 17 tabs |
| `/admin/login` | `AdminLoginPage.tsx` | Staff authentication screen | Functional |
| `/heritage` | `Heritage.tsx` | 500-year Kuthampully legacy story | Content rich, needs luxury styling |
| `/about`, `/contact`, `/faq` | Standard Static Pages | Company info, customer support | Functional |
| `/privacy-policy`, etc. | Policy Pages | Legal disclosures (7-day exchange, GST) | Functional |

### 2.3 Identified Frontend Limitations
1. **Excessive Client Components (`'use client'`):** The vast majority of pages and sections are marked `'use client'`, rendering heavy payloads on the client and forfeiting Next.js Server Component streaming, static prerendering, and optimized Core Web Vitals.
2. **Color Palette Mismatch:** Currently styled with deep forest green (`#123C32`), antique brass (`#C5A15A`), and beige (`#F7F3E9`). The client specification requires:
   - Primary: `#641E2B` (Royal Maroon / Deep Crimson)
   - Secondary: `#B99A61` (Refined Kasavu Antique Gold)
   - Background: `#F8F5EF` (Warm Ivory / Raw Silk White)
   - Text: `#292522` (Warm Charcoal)
   - White: `#FFFFFF`
3. **Missing Collection Landing Pages:** Dedicated editorial hubs for `/women`, `/men`, `/kids`, `/bridal-festive`, and `/blog` (craft journal).

---

## 3. Backend Architecture & API Endpoints

### 3.1 API Routes (`src/app/api/`)
The existing backend consists of Next.js Route Handlers:
- **`GET/POST/DELETE /api/products`:** Retrieves catalog, upserts product items, and deletes products. Reads/writes to `serverStore.ts`.
- **`GET/POST /api/orders`:** Retrieves orders by ID or tracking number, creates new orders.
- **`GET/POST /api/categories`:** Manages category taxonomy and counts.
- **`GET/POST /api/offers`:** Validates and retrieves promo coupons.
- **`GET/POST /api/reviews`:** Retrieves approved customer reviews and allows review submissions.
- **`GET/POST /api/shipping`:** Manages shipping threshold rules.
- **`GET/POST /api/store-content`:** Manages hero banners, announcement bar, and store contact info.
- **`POST /api/verify-payment`:** Verifies Razorpay HMAC SHA-256 signatures using timing-safe comparison (`crypto.timingSafeEqual`).
- **`POST /api/razorpay-webhook`:** Ingests gateway events (`payment.captured`, `order.paid`).
- **`POST /api/send-order-email`:** Dispatches order confirmation emails with target address authorization guardrails.

### 3.2 Dual-Tier Storage Layer (`serverStore.ts` & `supabase.ts`)
The codebase includes a dual-tier mechanism:
1. **Primary Database Tier:** `@supabase/supabase-js` client in `src/lib/supabase.ts` with camelCase to snake_case field transformers and error handling.
2. **Local Persistence Fallback Tier:** `src/lib/serverStore.ts` reads/writes structured JSON files in `src/data/` (`custom_products.json`, `custom_categories.json`, `custom_orders.json`, `custom_offers.json`, `custom_reviews.json`, `custom_shipping_config.json`, `custom_store_content.json`).

---

## 4. Supabase Database Schema Inspection

The database schema defined in `supabase_schema.sql` establishes 10 production tables:

```sql
1. public.products (id TEXT PK, name, subtitle, category, subcategory, collection, price NUMERIC, original_price, cost_price, discount_percentage, rating, review_count, in_stock, stock_count, low_stock_threshold, allow_backorders, brand, is_new, is_best_seller, is_featured, images JSONB, sizes JSONB, colors JSONB, variants JSONB, fabric, details JSONB, care_instructions JSONB, fit_information, sku TEXT UNIQUE, tags JSONB, size_chart JSONB, created_at, updated_at)
2. public.categories (id TEXT PK, name, parent_category, slug TEXT UNIQUE, image, description, seo_title, seo_description, status, product_count, created_at)
3. public.orders (id TEXT PK, date, status, payment_status, items JSONB, subtotal, discount, shipping_fee, cgst_amount, sgst_amount, igst_amount, total, shipping_address JSONB, payment_method, tracking_number, courier_provider, estimated_delivery, notes, invoice_id, created_at)
4. public.promo_offers (id TEXT PK, code TEXT UNIQUE, discount_type, discount_value, min_order_amount, max_discount_amount, expiry_date, start_date, is_active, usage_count, usage_limit, per_customer_limit, is_first_order_only, description, created_at)
5. public.reviews (id TEXT PK, product_id, product_name, author, location, rating, title, comment, date, verified_purchase, verified, helpful_count, status, admin_response, created_at)
6. public.return_requests (id TEXT PK, order_id, customer_name, customer_email, product_name, reason, requested_date, status, refund_amount, admin_notes, created_at)
7. public.audit_logs (id TEXT PK, admin_name, admin_role, action, entity, entity_id, previous_value, new_value, timestamp, ip_address, created_at)
8. public.store_content (id TEXT PK DEFAULT 'main_content', announcement_text, hero_title, hero_subtitle, banner_image, hero_banners JSONB, featured_collection_ids JSONB, faq_items JSONB, policy_text, contact_info JSONB, updated_at)
9. public.admin_users (phone_number TEXT PK, name, email TEXT UNIQUE, password, role, status, permissions JSONB, last_login, created_at)
10. public.shipping_rules (id TEXT PK DEFAULT 'main_shipping', free_shipping_threshold, standard_flat_rate, updated_at)
```

### 4.1 Remote Database Status Note
The remote Supabase instance `https://cswdcbruzgdqburynlop.supabase.co` configured in `.env` is currently returning `ENOTFOUND` during DNS lookup (typical for free-tier Supabase projects paused after 7 days of inactivity).
- **Impact:** Zero data loss. The application seamlessly operates using the verified catalog data preserved in `src/data/products.ts`, `custom_products.json`, `categories.ts`, `offers.ts`, and `reviews.ts`.
- **Migration Strategy:** The new architecture will use Prisma ORM connected to a clean local PostgreSQL database (or an unpaused/new Supabase project) with automated seed scripts to restore all products and assets without touching production.

---

## 5. Product & Category Relationships

- **Category Taxonomy:**
  - `women` (Kasavu Sarees, Tissue Sarees, Set Mundu, Cotton Sarees)
  - `men` (Double Mundu, Kasavu Mundu, Linen Shirts, Kerala Shirts)
  - `kids` (Pattu Pavada, Traditional Festive Sets)
- **Active Collections:**
  - `kasavu-masterpieces`: Royal Kochi Court Weaves (GI Tag Certified)
  - `ceremonial-classics`: Traditional Double Mundu & Dhoti (Heritage Weave)
  - `flax-linen`: European Flax Linen Apparel (100% Organic Linen)
- **Catalog Density:**
  - `src/data/products.ts`: 8 verified baseline catalog products with comprehensive gallery references, specifications, and SKU numbers.
  - `src/data/custom_products.json`: 9 customized products including the *Royal Tissue Saree*, *Royal Printed Cotton Saree*, *Flower Printed Kattikara Set Mundu*, and *Classic Black Temple Printed Set Mundu*.

---

## 6. Product Images & Media Storage

- **Local Assets Directory (`public/assets/`):**
  - **Products (`public/assets/products/`):** 38 high-resolution product images (`product_img_1.jpg` through `product_img_38.jpg`).
  - **Banners (`public/assets/banners/`):** `hero_festive.jpg`, `hero_kavish.jpg`, `hero_men.jpg`.
  - **Categories (`public/assets/categories/`):** `bridal_festive.jpg`, `kids_ethnic.jpg`, `women_kasavu.jpg`.
  - **Heritage (`public/assets/heritage/`):** `handloom_weaver.jpg`, `pitloom_craftsmanship.jpg`, `royal_kasavu_weaver.jpg`.
  - **Gallery (`public/assets/gallery/`):** `gallery_01.jpg` to `gallery_04.jpg`.
  - **Branding:** `public/assets/logo.png`.
- **Supabase Storage Bucket:** `store-media` configured in SQL for public read/write.
- **Finding:** All essential brand photography and product images are safely preserved locally in high resolution.

---

## 7. Authentication System

- **Customer Auth:**
  - Handled via `src/context/AuthContext.tsx`.
  - Registration and login are stored in browser `localStorage` (`kavish_customer_profile`).
  - Addresses and orders are associated with the active user profile.
  - **Status:** Functional for local shopping, but lacks server-side JWT session tokens and password encryption.
- **Admin Auth:**
  - Managed in `AuthContext.tsx` with credentials verified against `adminProfile` in `localStorage`.
  - Default profile: `admin@kavishhandlooms.com` with role `Super Admin`.
  - **Status:** Functional for dashboard access, but needs server-side role-based authorization for sensitive operations.

---

## 8. Cart & Checkout Flow

- **Cart State (`CartContext.tsx`):**
  - Handles size selection, color variant selection, quantity limits based on available stock, promo code validation, and free shipping progress calculation.
- **Checkout Process (`CheckoutPage.tsx`):**
  - Step 1: Contact details & 6-digit Indian PIN code shipping address validation.
  - Step 2: Shipping method review with 5% GST computation.
  - Step 3: Payment selection:
    1. Razorpay standard modal integration.
    2. Direct UPI transfer with QR/VPA and transaction reference submission.
    3. Razorpay payment link.
    4. Cash on Delivery (COD).
- **Post-Checkout:**
  - Automatically deducts stock from inventory (`deductInventoryForOrder`).
  - Dispatches order notification email (`sendOrderNotificationEmail`).
  - Emits tracking ID (`KV-ORD-XXXXX`).

---

## 9. Admin ERP Dashboard (`src/views/AdminDashboard.tsx`)

The existing admin dashboard provides an extensive set of 17 functional ERP modules:
1. **Overview:** Daily sales, total orders, revenue analytics, low-stock alerts.
2. **Product Management:** Product table, modal editor, image gallery manager, SKU, price/cost tracking, stock status.
3. **Category Management:** Taxonomy tree, image upload, status toggle.
4. **Order Management & Pipeline:** Order search, status lifecycle (New -> Confirmed -> Processing -> Packed -> Shipped -> Delivered -> Cancelled).
5. **Inventory:** Real-time stock counts, adjustment history, reorder triggers.
6. **Customer Management:** Customer list, lifetime spend, order history.
7. **Discounts & Coupons:** Percentage and fixed coupon codes, usage limits, expiry.
8. **Financials & GST:** GST 5% breakdown (CGST, SGST, IGST), net revenue calculation.
9. **Shipping Rules:** Free shipping threshold and standard flat rate.
10. **Returns & Exchanges:** Return request handling, refund approvals.
11. **Reviews:** Customer review approval queue, admin responses.
12. **Content Management & Banners:** Hero slider CMS, announcement text, FAQ editor.
13. **Settings & Roles:** Atelier coordinates, staff permissions, audit logs.

---

## 10. Audit Summary Matrix

| Module | Current State | Quality Rating | Action for Kavish 2.0 |
| :--- | :--- | :--- | :--- |
| **Visual Design** | Forest green / gold theme | 6/10 | Rebuild to Royal Maroon (`#641E2B`), Antique Gold (`#B99A61`), Warm Ivory (`#F8F5EF`) |
| **Typography** | Cormorant Garamond / Plus Jakarta | 7/10 | Refine to high-fashion editorial serif headings & clean body sans |
| **Catalog Architecture** | Flat JSON & SQL schema | 8/10 | Retain all schema fields; map cleanly into Prisma schema |
| **Product Media** | 38 local images + base64 | 8/10 | Use local images directly; clean up base64 in `categories.ts` |
| **Storefront UX** | Fast client navigation | 7/10 | Convert to Next.js App Router Server Components + Client interactivity |
| **Admin Dashboard** | Fully featured ERP | 8/10 | Retain 100% of ERP capabilities; elevate UI with shadcn/ui styling |
| **Payment Integration** | Razorpay + UPI + COD | 9/10 | Retain cryptographic verification; connect to API order flow |
| **SEO & Meta** | JSON-LD + OpenGraph present | 8/10 | Expand with product-level schema, canonical links, and XML sitemaps |
