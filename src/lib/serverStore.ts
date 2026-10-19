import fs from 'node:fs';
import path from 'node:path';
import type { Product, CategoryItem, PromoOffer, StoreContentConfig, HeroBanner, ShippingConfig, Review, Order } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_OFFERS } from '../data/offers';
import { REVIEWS as INITIAL_REVIEWS } from '../data/reviews';

const DATA_DIR = path.resolve(process.cwd(), 'src/data');

function getFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

function safeReadJson<T>(filename: string, fallback: T): T {
  try {
    const filePath = getFilePath(filename);
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[serverStore] Error reading ${filename}:`, err);
    return fallback;
  }
}

function safeWriteJson<T>(filename: string, data: T): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const filePath = getFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`[serverStore] Error writing ${filename}:`, err);
    return false;
  }
}

// ==========================================
// PRODUCTS
// ==========================================
export function getLiveProducts(): Product[] {
  const customProducts = safeReadJson<Product[]>('custom_products.json', []);
  const customIds = new Set(customProducts.map(p => p.id));
  const baseFiltered = INITIAL_PRODUCTS.filter(p => !customIds.has(p.id));
  return [...customProducts, ...baseFiltered];
}

export function saveLiveProducts(products: Product[]): boolean {
  return safeWriteJson('custom_products.json', products);
}

export function getProductById(id: string): Product | undefined {
  const all = getLiveProducts();
  return all.find(p => p.id === id);
}

// ==========================================
// CATEGORIES
// ==========================================
export function getLiveCategories(): CategoryItem[] {
  const customCats = safeReadJson<CategoryItem[]>('custom_categories.json', []);
  if (customCats && customCats.length > 0) {
    return customCats;
  }
  return INITIAL_CATEGORIES;
}

export function saveLiveCategories(categories: CategoryItem[]): boolean {
  return safeWriteJson('custom_categories.json', categories);
}

// ==========================================
// STORE CONTENT & BANNERS
// ==========================================
export function getLiveStoreContent(): Partial<StoreContentConfig> {
  return safeReadJson<Partial<StoreContentConfig>>('custom_store_content.json', {});
}

export function saveLiveStoreContent(content: Partial<StoreContentConfig>): boolean {
  return safeWriteJson('custom_store_content.json', content);
}

// ==========================================
// PROMO OFFERS
// ==========================================
export function getLiveOffers(): PromoOffer[] {
  const customOffers = safeReadJson<PromoOffer[]>('custom_offers.json', []);
  if (customOffers && customOffers.length > 0) {
    return customOffers;
  }
  return INITIAL_OFFERS;
}

export function saveLiveOffers(offers: PromoOffer[]): boolean {
  return safeWriteJson('custom_offers.json', offers);
}

// ==========================================
// REVIEWS
// ==========================================
export function getLiveReviews(): Review[] {
  const customReviews = safeReadJson<Review[]>('custom_reviews.json', []);
  if (customReviews && customReviews.length > 0) {
    return customReviews;
  }
  return INITIAL_REVIEWS;
}

export function saveLiveReviews(reviews: Review[]): boolean {
  return safeWriteJson('custom_reviews.json', reviews);
}

// ==========================================
// SHIPPING CONFIGURATION
// ==========================================
export const DEFAULT_SERVER_SHIPPING_CONFIG: ShippingConfig = {
  freeShippingThreshold: 0,
  standardFlatRate: 150
};

export function getLiveShippingConfig(): ShippingConfig {
  return safeReadJson<ShippingConfig>('custom_shipping_config.json', DEFAULT_SERVER_SHIPPING_CONFIG);
}

export function saveLiveShippingConfig(config: ShippingConfig): boolean {
  return safeWriteJson('custom_shipping_config.json', config);
}

// ==========================================
// ORDERS
// ==========================================
export function getLiveOrders(): Order[] {
  return safeReadJson<Order[]>('custom_orders.json', []);
}

export function saveLiveOrders(orders: Order[]): boolean {
  return safeWriteJson('custom_orders.json', orders);
}

export function getOrderById(idOrTracking: string): Order | undefined {
  const clean = idOrTracking.trim().toUpperCase();
  const all = getLiveOrders();
  return all.find(
    (o) =>
      o.id.toUpperCase() === clean ||
      o.id.replace('KV-ORD-', '') === clean ||
      (o.trackingNumber && o.trackingNumber.toUpperCase().includes(clean)) ||
      (o.invoiceId && o.invoiceId.toUpperCase().includes(clean))
  );
}
