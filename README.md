# Kavish 2.0 — Luxury Kerala Handlooms & Ethnic Wear Ecommerce

Kavish 2.0 is an editorial, modern ecommerce platform dedicated to authentic Kerala handloom Kasavu sarees, ceremonial men's mundus, pure flax linen shirts, and kids festive wear. Inspired by 500 years of royal Devanga weaving traditions in Kuthampully, Thrissur, Kerala.

- **Existing Website:** https://kavish.xenotrix.in/
- **Design Inspiration:** Editorial luxury experience inspired by https://kuthampullysarees.com/

---

## 💎 Design System & Palette

- **Primary:** `#641E2B` (Royal Kasavu Maroon / Deep Crimson Atelier Wine)
- **Secondary:** `#B99A61` (Refined Antique Temple Kasavu Gold)
- **Background:** `#F8F5EF` (Warm Ivory / Raw Silk White)
- **Text / Ebony:** `#292522` (Warm Charcoal)
- **Surface / Card White:** `#FFFFFF`
- **Typography:**
  - Headings: *Playfair Display* & *Cormorant Garamond* (Serif)
  - Body & UI: *Plus Jakarta Sans* (Sans-Serif)

---

## 🏗️ Technical Architecture

- **Frontend:** Next.js 15 (App Router) with React 19 & TypeScript
- **Styling:** Tailwind CSS v4 with custom luxury design tokens
- **State Management:** Zustand / React Context with safe local storage persistence
- **Admin Dashboard:** Full-featured ERP suite at `/admin`
- **Payments:** Razorpay Checkout SDK, Direct UPI QR, and Cash on Delivery with HMAC SHA-256 signature verification
- **Database:** Supabase PostgreSQL with local resilient offline fallback layer (`serverStore.ts`)
- **Testing:** Vitest with comprehensive ecommerce business flow and payment security test suites

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ (tested with Node 20 / 22 / 24)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/your-username/kavish.git
cd kavish
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the store management dashboard.

### 5. Running Tests
```bash
npm test
```

---

## 📚 Project Documentation

- [Existing Project Audit](docs/EXISTING_PROJECT_AUDIT.md) — Comprehensive technical audit of frontend, backend, database, and auth.
- [Database Migration Plan](docs/DATABASE_MIGRATION_PLAN.md) — Schema mapping, identifier preservation, and seeding plan.
- [Development Roadmap](docs/DEVELOPMENT_ROADMAP.md) — 8-phase execution roadmap from UI rebuild to testing.

---

## 🛡️ License

Private and confidential. Copyright © Kavish Handlooms Pvt. Ltd. All rights reserved.
