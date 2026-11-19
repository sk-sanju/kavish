# KAVISH 2.0 — Development Roadmap & Implementation Plan

**Objective:** Complete rebuild of Kavish into a modern, editorial luxury Indian ethnic fashion & Kerala handloom ecommerce platform.  
**Design Reference:** https://kuthampullysarees.com/  
**Existing Website:** https://kavish.xenotrix.in/  

---

## Brand Identity & Aesthetic Parameters

- **Atmosphere:** High-end Indian luxury handloom house, royal heritage, refined editorial craftsmanship.
- **Color Palette:**
  - **Background:** `#F8F5EF` (Warm Ivory / Raw Silk White)
  - **Primary:** `#641E2B` (Royal Kasavu Maroon / Deep Crimson Atelier Wine)
  - **Secondary:** `#B99A61` (Refined Antique Temple Kasavu Gold)
  - **Text:** `#292522` (Warm Charcoal / Deep Espresso)
  - **Card / Surface White:** `#FFFFFF`
- **Typography:**
  - **Headings & Accents:** Elegant Serif (`Playfair Display` & `Cormorant Garamond`)
  - **Body & Controls:** Crisp Modern Sans-Serif (`Plus Jakarta Sans` / System Sans)

---

## 8-Phase Implementation Roadmap

### Phase 1: Technical Audit & Baseline Verification (Completed)
- [x] Inspect existing frontend architecture, components, and routing.
- [x] Inspect backend API endpoints and security implementations.
- [x] Inspect Supabase database schema and RLS policies.
- [x] Audit product catalog, pricing, SKU, images, and category relationships.
- [x] Audit authentication systems (customer & admin).
- [x] Audit shopping cart, checkout, and Razorpay payment verification.
- [x] Audit admin ERP modules (products, categories, orders, pipeline, inventory, CMS, financials).
- [x] Create `docs/EXISTING_PROJECT_AUDIT.md`.
- [x] Create `docs/DATABASE_MIGRATION_PLAN.md`.
- [x] Create `docs/DEVELOPMENT_ROADMAP.md`.
- [x] Document `.env.example` and update `README.md`.

---

### Phase 2: Design System & Architectural Foundation (Completed)
- [x] Configure Tailwind CSS color tokens (`primary: #641E2B`, `secondary: #B99A61`, `background: #F8F5EF`, `text: #292522`).
- [x] Setup modern luxury UI component primitives (Button, Badge, Card, Modal, Dropdown, Table, Input, Drawer).
- [x] Implement Framer Motion transitions and fluid editorial layout animations.
- [x] Establish global responsive layout shell (Header with mega menu, announcement bar, mobile drawer, luxury footer).
- [x] Create Zustand/Context state stores for Cart, Wishlist, Currency, and UI Modals.

---

### Phase 3: Complete Storefront UI & Pages Rebuild (Completed)
Build all 25 storefront pages with luxury editorial presentation:
- [x] **1. Homepage:**
  - Luxury announcement bar with multi-currency selector and GI Tag assurance.
  - Sticky glass header with desktop mega menu and mobile navigation drawer.
  - Large promotional hero banner with auto-sliding editorial campaigns.
  - Shop by category showcase (Women, Men, Kids, Festive).
  - Curated tabs: New Arrivals, Trending Products, Best Sellers, Festive Edit.
  - Bridal & Festive Heritage highlight banner.
  - Kavish 500-year Kuthampully heritage and craftsmanship spotlight.
  - Featured collections grid with hover zoom effects.
  - Customer review carousel with verified purchase badges.
  - Instagram-style atelier journal & community gallery.
  - Craft journal & blog preview section.
  - VIP newsletter subscription with welcome perk.
  - Luxury footer with atelier coordinates, value pillars, and legal links.
- [x] **2. All Products (`/shop`):** Filter sidebar (price, fabric, zari, color, rating, in-stock), sorting, search, quick view.
- [x] **3. Women Collection (`/women` or `/shop/category/women`):** Dedicated landing with subcategory pills (Kasavu Sarees, Tissue Sarees, Set Mundu, Cotton Sarees).
- [x] **4. Men Collection (`/men` or `/shop/category/men`):** Double Mundu, Kasavu Mundu, Pure European Linen shirts, combo sets.
- [x] **5. Kids Collection (`/kids` or `/shop/category/kids`):** Pattu Pavada and festive ethnic attire.
- [x] **6. Bridal & Festive Collection (`/bridal-festive`):** High-zari wedding edit.
- [x] **7. Dynamic Category & Collection Pages (`/shop/category/[slug]`, `/shop/collection/[slug]`).**
- [x] **8. Product Detail Page (`/product/[id]`):**
  - High-res image gallery with interactive thumbnail selector and cursor zoom.
  - Product title, SKU, selling price, strike-through original price, savings discount badge.
  - Stock availability status, low-stock urgency alerts, backorder indicator.
  - Size selector, interactive size guide modal, color swatch selector.
  - Quantity picker, "Add to Cart", and "Buy Now" instant checkout CTA.
  - Pincode delivery estimator with delivery date calculation.
  - Detailed product specifications tab (Fabric, Weave, Zari, Dimensions, GI Certification, Blouse piece, Care instructions).
  - Customer review submission form and verified reviews list.
  - Related garments recommendation carousel.
- [x] **9. Search Results (`/shop?q=...` & interactive search modal):** Instant predictive search with product thumbnails and pricing.
- [x] **10. Shopping Cart (`/cart` & slide-out CartDrawer):** Quantity management, promo code input, free shipping progress bar, checkout CTA.
- [x] **11. Checkout (`/checkout`):** 3-step checkout with address validation (Indian 6-digit PIN code), delivery options, Razorpay checkout, Direct UPI, and Cash on Delivery.
- [x] **12. Login & Registration (`/account` & auth modals):** Customer authentication with tabs for sign-in and account creation.
- [x] **13. Customer Profile (`/account`):** Personal details, saved addresses manager, order history.
- [x] **14. Wishlist (`/wishlist`):** Saved items grid with one-click "Move to Cart".
- [x] **15. Order History (`/account` orders tab):** List of previous orders with date, status, items, invoice download link.
- [x] **16. Order Tracking (`/track-order`):** Search by Order ID or tracking number with visual progress step tracker.
- [x] **17. About Kavish (`/about`):** Brand mission, atelier philosophy, artisan empowerment.
- [x] **18. Heritage & Craftsmanship (`/heritage`):** 500-year Kuthampully Devanga weaving history, pit-loom artistry, 24k electroplated zari.
- [x] **19. Contact Us (`/contact`):** Atelier address, visiting hours, WhatsApp chat CTA, support form.
- [x] **20. FAQ (`/faq`):** Accordion FAQ on handloom authenticity, shipping, sizing, returns, and international delivery.
- [x] **21. Blog / Atelier Journal (`/blog`):** Articles on Kerala handloom care, Onam styling guides, Kasavu history.
- [x] **22. Privacy Policy (`/privacy-policy`).**
- [x] **23. Shipping Policy (`/shipping-policy`).**
- [x] **24. Return & Refund Policy (`/return-refund-policy`).**
- [x] **25. Terms & Conditions (`/terms-and-conditions`).**

---

### Phase 4: Admin ERP Dashboard Rebuild (`/admin`) (Completed)
Build a comprehensive, modern admin interface styled with clean luxury cards and data tables:
- [x] **Dashboard Overview:** Real-time metrics (Total sales, today's sales, total orders, pending orders, total customers, low-stock alerts, monthly sales chart).
- [x] **Product Management:** Product table with search/filters, product creation/editing modal, multiple image reordering, price/cost/discount fields, stock quantity, specifications editor, archive/publish toggle.
- [x] **Category Management:** Taxonomy list, create/edit category, assign banner image, slug configuration, subcategory grouping.
- [x] **Inventory Control:** Stock adjustments with reason logging (restock, physical damage, return), SKU manager, low-stock warnings.
- [x] **Order Management & Pipeline:** Full order table with status filters, detailed order view modal, invoice generator, status pipeline updater (New -> Confirmed -> Processing -> Packed -> Shipped -> Delivered -> Cancelled), tracking number & courier assignment.
- [x] **Customer Management:** Customer list, contact details, address book, lifetime spending, order history.
- [x] **Marketing & Coupons:** Promo code creation (percentage or flat discount), minimum order requirements, usage limits, expiration dates.
- [x] **Homepage CMS:** Hero banner slider management (title, subtitle, image, CTAs, display order, toggle active), announcement bar text editor, featured collections selector.
- [x] **Content Management:** FAQ manager, heritage story editor, policy content updates, contact coordinates.
- [x] **Returns & Refunds:** Return request queue, approval/rejection actions, refund status tracking.
- [x] **Review Management:** Customer review moderation queue (Approve, Reject, feature), staff response replies.
- [x] **Financial & Tax Reports:** Net sales, GST 5% breakdown (CGST, SGST, IGST), downloadable CSV export.
- [x] **Settings:** Store info, atelier address, WhatsApp number, shipping rules (flat rate, free shipping threshold), tax configuration.

---

### Phase 5: Backend & Database Integration (Completed)
- [x] Modularize backend API route handlers under Next.js App Router API (`/api/products`, `/api/orders`, `/api/categories`, `/api/shipping`, `/api/verify-payment`, `/api/razorpay-webhook`, `/api/reviews`, `/api/offers`, `/api/store-content`, `/api/send-order-email`).
- [x] Offline and local filesystem persistence store (`src/lib/serverStore.ts`) ensuring 100% resilient operation when remote Supabase instance is paused or offline.
- [x] Implement robust request validation for product upserts, order placement, and address submission.
- [x] Preserve Razorpay HMAC SHA-256 constant-time verification (`crypto.timingSafeEqual`) for secure payments.

---

### Phase 6: End-to-End API Wiring (Completed)
- [x] Connect storefront catalog, product details, and category pages to real backend API endpoints.
- [x] Connect Cart & Checkout to real Order placement API with automatic inventory deduction.
- [x] Connect Admin dashboard actions (create product, update status, change inventory, save banners) to real APIs with instant feedback.
- [x] Connect customer review submission and order tracking to backend endpoints.

---

### Phase 7: Product & Data Migration (Completed)
- [x] Preserve all 10 verified master products, 38 local images, 4 categories, 3 collections, and store configurations.
- [x] Verify SKU uniqueness, pricing accuracy, and gallery image link integrity across local storage.

---

### Phase 8: Verification & Local Testing (Completed)
- [x] Execute complete Vitest test suite (`npm test`) covering ecommerce flows, inventory restoration, GST calculations, and payment security (21/21 tests passed).
- [x] Perform full end-to-end user journey verification: Home -> Catalog -> PDP -> Add to Cart -> Checkout -> Order Confirmation -> Order Tracking -> Admin Order Pipeline Processing.
- [x] Verify responsive mobile layout across all screen breakpoints.
