import { createClient } from '@supabase/supabase-js';
import type {
  Product,
  PromoOffer,
  Review,
  Order,
  AuditLog,
  ReturnRequest,
  CategoryItem,
  AdminUser,
  StoreContentConfig,
  ShippingConfig
} from '../types';

function isValidHttpUrl(stringToTest?: string): boolean {
  if (!stringToTest) return false;
  try {
    const url = new URL(stringToTest);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const defaultUrl = 'https://cswdcbruzgdqburynlop.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';

const activeUrl = isValidHttpUrl(envUrl) ? envUrl : defaultUrl;
const activeKey = envKey && envKey.length > 20 ? envKey : defaultKey;

export const isSupabaseConfigured = isValidHttpUrl(activeUrl) && Boolean(activeKey && activeKey.length > 20);

// Initialize client safely - guaranteed valid URL prevents top-level bundle crashes
export const supabase = createClient(
  isValidHttpUrl(activeUrl) ? activeUrl : 'https://placeholder.supabase.co',
  activeKey || 'placeholder-anon-key'
);

// ====================================================================
// FIELD TRANSFORMERS (CAMELCASE <-> SNAKE_CASE)
// ====================================================================

function mapProductFromDb(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || '',
    category: row.category,
    subcategory: row.subcategory,
    collection: row.collection || '',
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    costPrice: row.cost_price != null ? Number(row.cost_price) : undefined,
    discountPercentage: row.discount_percentage != null ? Number(row.discount_percentage) : undefined,
    rating: Number(row.rating ?? 5.0),
    reviewCount: Number(row.review_count ?? 0),
    inStock: Boolean(row.in_stock ?? true),
    stockCount: row.stock_count != null ? Number(row.stock_count) : 10,
    lowStockThreshold: row.low_stock_threshold != null ? Number(row.low_stock_threshold) : 5,
    allowBackorders: Boolean(row.allow_backorders ?? false),
    brand: row.brand || 'Kavish Kuthampully Atelier',
    isNew: Boolean(row.is_new ?? true),
    isBestSeller: Boolean(row.is_best_seller ?? false),
    isFeatured: Boolean(row.is_featured ?? true),
    images: Array.isArray(row.images) ? row.images : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    variants: Array.isArray(row.variants) ? row.variants : [],
    fabric: row.fabric || '',
    details: Array.isArray(row.details) ? row.details : [],
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : [],
    fitInformation: row.fit_information || '',
    sku: row.sku,
    tags: Array.isArray(row.tags) ? row.tags : [],
    sizeChart: row.size_chart || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapProductToDb(p: Product): Record<string, any> {
  return {
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    category: p.category,
    subcategory: p.subcategory,
    collection: p.collection,
    price: p.price,
    original_price: p.originalPrice ?? null,
    cost_price: p.costPrice ?? null,
    discount_percentage: p.discountPercentage ?? null,
    rating: p.rating,
    review_count: p.reviewCount,
    in_stock: p.inStock,
    stock_count: p.stockCount ?? 10,
    low_stock_threshold: p.lowStockThreshold ?? 5,
    allow_backorders: p.allowBackorders ?? false,
    brand: p.brand || 'Kavish Kuthampully Atelier',
    is_new: p.isNew ?? true,
    is_best_seller: p.isBestSeller ?? false,
    is_featured: p.isFeatured ?? true,
    images: p.images || [],
    sizes: p.sizes || [],
    colors: p.colors || [],
    variants: p.variants || [],
    fabric: p.fabric || '',
    details: p.details || [],
    care_instructions: p.careInstructions || [],
    fit_information: p.fitInformation || '',
    sku: p.sku,
    tags: p.tags || [],
    size_chart: p.sizeChart || null
  };
}

function mapOrderFromDb(row: any): Order {
  return {
    id: row.id,
    invoiceId: row.invoice_id || `KV-INV-2026-${row.id ? row.id.replace('KV-ORD-', '') : '001'}`,
    date: row.date,
    status: row.status,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal),
    discount: Number(row.discount ?? 0),
    shippingFee: Number(row.shipping_fee ?? 0),
    cgstAmount: row.cgst_amount != null ? Number(row.cgst_amount) : undefined,
    sgstAmount: row.sgst_amount != null ? Number(row.sgst_amount) : undefined,
    igstAmount: row.igst_amount != null ? Number(row.igst_amount) : undefined,
    total: Number(row.total),
    shippingAddress: row.shipping_address || {},
    paymentMethod: row.payment_method,
    trackingNumber: row.tracking_number,
    courierProvider: row.courier_provider || undefined,
    estimatedDelivery: row.estimated_delivery,
    notes: row.notes || undefined
  };
}

function mapOrderToDb(o: Order): Record<string, any> {
  return {
    id: o.id,
    invoice_id: o.invoiceId || `KV-INV-2026-${o.id.replace('KV-ORD-', '')}`,
    date: o.date,
    status: o.status,
    items: o.items,
    subtotal: o.subtotal,
    discount: o.discount,
    shipping_fee: o.shippingFee,
    cgst_amount: o.cgstAmount ?? null,
    sgst_amount: o.sgstAmount ?? null,
    igst_amount: o.igstAmount ?? null,
    total: o.total,
    shipping_address: o.shippingAddress,
    payment_method: o.paymentMethod,
    tracking_number: o.trackingNumber,
    courier_provider: o.courierProvider ?? null,
    estimated_delivery: o.estimatedDelivery,
    notes: o.notes ?? null
  };
}

function mapOfferFromDb(row: any): PromoOffer {
  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    minOrderAmount: Number(row.min_order_amount ?? 0),
    maxDiscountAmount: row.max_discount_amount != null ? Number(row.max_discount_amount) : undefined,
    expiryDate: row.expiry_date,
    startDate: row.start_date || undefined,
    isActive: Boolean(row.is_active ?? true),
    usageCount: Number(row.usage_count ?? 0),
    usageLimit: row.usage_limit != null ? Number(row.usage_limit) : undefined,
    perCustomerLimit: row.per_customer_limit != null ? Number(row.per_customer_limit) : undefined,
    isFirstOrderOnly: Boolean(row.is_first_order_only ?? false),
    description: row.description || ''
  };
}

function mapOfferToDb(off: PromoOffer): Record<string, any> {
  return {
    id: off.id,
    code: off.code,
    discount_type: off.discountType,
    discount_value: off.discountValue,
    min_order_amount: off.minOrderAmount,
    max_discount_amount: off.maxDiscountAmount ?? null,
    expiry_date: off.expiryDate,
    start_date: off.startDate ?? null,
    is_active: off.isActive,
    usage_count: off.usageCount,
    usage_limit: off.usageLimit ?? null,
    per_customer_limit: off.perCustomerLimit ?? 1,
    is_first_order_only: off.isFirstOrderOnly ?? false,
    description: off.description
  };
}

function mapReviewFromDb(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id || undefined,
    productName: row.product_name || undefined,
    author: row.author,
    location: row.location || '',
    rating: Number(row.rating ?? 5),
    title: row.title || '',
    comment: row.comment,
    date: row.date,
    verifiedPurchase: Boolean(row.verified_purchase ?? true),
    verified: Boolean(row.verified ?? true),
    helpfulCount: Number(row.helpful_count ?? 0),
    status: row.status || 'Approved',
    adminResponse: row.admin_response || undefined
  };
}

function mapReviewToDb(rev: Review): Record<string, any> {
  return {
    id: rev.id,
    product_id: rev.productId ?? null,
    product_name: rev.productName ?? null,
    author: rev.author,
    location: rev.location,
    rating: rev.rating,
    title: rev.title,
    comment: rev.comment,
    date: rev.date,
    verified_purchase: rev.verifiedPurchase ?? true,
    verified: rev.verified ?? true,
    helpful_count: rev.helpfulCount ?? 0,
    status: rev.status || 'Approved',
    admin_response: rev.adminResponse ?? null
  };
}

function mapAuditLogFromDb(row: any): AuditLog {
  return {
    id: row.id,
    adminName: row.admin_name,
    adminRole: row.admin_role,
    action: row.action,
    entity: row.entity,
    entityId: row.entity_id,
    previousValue: row.previous_value || undefined,
    newValue: row.new_value || undefined,
    timestamp: row.timestamp,
    ipAddress: row.ip_address || undefined
  };
}

function mapAuditLogToDb(log: AuditLog): Record<string, any> {
  return {
    id: log.id,
    admin_name: log.adminName,
    admin_role: log.adminRole,
    action: log.action,
    entity: log.entity,
    entity_id: log.entityId,
    previous_value: log.previousValue ?? null,
    new_value: log.newValue ?? null,
    timestamp: log.timestamp,
    ip_address: log.ipAddress ?? null
  };
}

function mapReturnRequestFromDb(row: any): ReturnRequest {
  return {
    id: row.id,
    orderId: row.order_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    productName: row.product_name,
    reason: row.reason,
    requestedDate: row.requested_date,
    status: row.status,
    refundAmount: Number(row.refund_amount),
    adminNotes: row.admin_notes || undefined
  };
}

function mapReturnRequestToDb(req: ReturnRequest): Record<string, any> {
  return {
    id: req.id,
    order_id: req.orderId,
    customer_name: req.customerName,
    customer_email: req.customerEmail,
    product_name: req.productName,
    reason: req.reason,
    requested_date: req.requestedDate,
    status: req.status,
    refund_amount: req.refundAmount,
    admin_notes: req.adminNotes ?? null
  };
}

function mapCategoryFromDb(row: any): CategoryItem {
  return {
    id: row.id,
    name: row.name,
    parentCategory: row.parent_category,
    slug: row.slug,
    image: row.image || '',
    description: row.description || '',
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    status: row.status || 'Active',
    productCount: Number(row.product_count ?? 0)
  };
}

function mapCategoryToDb(cat: CategoryItem): Record<string, any> {
  return {
    id: cat.id,
    name: cat.name,
    parent_category: cat.parentCategory,
    slug: cat.slug,
    image: cat.image,
    description: cat.description,
    seo_title: cat.seoTitle,
    seo_description: cat.seoDescription,
    status: cat.status,
    product_count: cat.productCount
  };
}

function mapAdminUserFromDb(row: any): AdminUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status || 'Active',
    permissions: Array.isArray(row.permissions) ? row.permissions : ['all'],
    lastLogin: row.last_login || undefined
  };
}

function mapAdminUserToDb(u: AdminUser): Record<string, any> {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    permissions: u.permissions || ['all'],
    last_login: u.lastLogin ?? null
  };
}

function mapStoreContentFromDb(row: any): StoreContentConfig {
  let heroBanners = Array.isArray(row.hero_banners) && row.hero_banners.length > 0 ? row.hero_banners : undefined;
  let contactInfo = row.contact_info || undefined;
  let categories: CategoryItem[] | undefined = undefined;
  let policyText = row.policy_text || '';

  // Fallback: If hero_banners / categories / contact_info were stored in policy_text metadata payload
  if (policyText.includes('__KV_META__')) {
    try {
      const parts = policyText.split('__KV_META__');
      policyText = parts[0];
      const meta = JSON.parse(parts[1]);
      if (meta.heroBanners && Array.isArray(meta.heroBanners) && meta.heroBanners.length > 0 && !heroBanners) {
        heroBanners = meta.heroBanners;
      }
      if (meta.categories && Array.isArray(meta.categories) && meta.categories.length > 0) {
        categories = meta.categories;
      }
      if (meta.contactInfo && !contactInfo) {
        contactInfo = meta.contactInfo;
      }
    } catch {
      // Ignore parse failure
    }
  }

  return {
    announcementText: row.announcement_text || '',
    heroTitle: row.hero_title || '',
    heroSubtitle: row.hero_subtitle || '',
    bannerImage: row.banner_image || '',
    heroBanners,
    categories,
    featuredCollectionIds: Array.isArray(row.featured_collection_ids) ? row.featured_collection_ids : [],
    faqItems: Array.isArray(row.faq_items) ? row.faq_items : [],
    policyText,
    contactInfo
  };
}

function mapStoreContentToDb(sc: StoreContentConfig): Record<string, any> {
  const meta = {
    heroBanners: sc.heroBanners || [],
    categories: sc.categories || [],
    contactInfo: sc.contactInfo || null
  };
  const cleanPolicy = (sc.policyText || '').split('__KV_META__')[0];
  const combinedPolicyText = `${cleanPolicy}__KV_META__${JSON.stringify(meta)}`;

  return {
    id: 'main_content',
    announcement_text: sc.announcementText,
    hero_title: sc.heroTitle,
    hero_subtitle: sc.heroSubtitle,
    banner_image: sc.bannerImage,
    hero_banners: sc.heroBanners || null,
    featured_collection_ids: sc.featuredCollectionIds,
    faq_items: sc.faqItems,
    policy_text: combinedPolicyText,
    contact_info: sc.contactInfo || null
  };
}

// ==========================================
// SUPABASE DATABASE HELPER METHODS
// ==========================================

export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data) {
      if (error) console.warn('Supabase fetch products error:', error.message);
      return null;
    }
    return data.map(mapProductFromDb);
  } catch (err) {
    console.warn('Supabase product fetch failed:', err);
    return null;
  }
}

export async function upsertSupabaseProduct(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapProductToDb(product);
    const { error } = await supabase.from('products').upsert([dbPayload]);
    if (error) {
      console.warn('Supabase product upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase product upsert failed:', err);
    return false;
  }
}

export async function removeSupabaseProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchSupabaseOrders(): Promise<Order[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error || !data) return null;
    return data.map(mapOrderFromDb);
  } catch (err) {
    return null;
  }
}

export async function upsertSupabaseOrder(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapOrderToDb(order);
    const { error } = await supabase.from('orders').upsert([dbPayload]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchSupabaseOffers(): Promise<PromoOffer[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('promo_offers').select('*');
    if (error || !data) return null;
    return data.map(mapOfferFromDb);
  } catch (err) {
    return null;
  }
}

export async function upsertSupabaseOffer(offer: PromoOffer): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapOfferToDb(offer);
    const { error } = await supabase.from('promo_offers').upsert([dbPayload]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchSupabaseReviews(): Promise<Review[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error || !data) return null;
    return data.map(mapReviewFromDb);
  } catch (err) {
    return null;
  }
}

export async function upsertSupabaseReview(review: Review): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapReviewToDb(review);
    const { error } = await supabase.from('reviews').upsert([dbPayload]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchSupabaseAuditLogs(): Promise<AuditLog[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('audit_logs').select('*');
    if (error || !data) return null;
    return data.map(mapAuditLogFromDb);
  } catch (err) {
    return null;
  }
}

export async function insertSupabaseAuditLog(log: AuditLog): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapAuditLogToDb(log);
    const { error } = await supabase.from('audit_logs').insert([dbPayload]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchSupabaseReturnRequests(): Promise<ReturnRequest[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('return_requests').select('*');
    if (error || !data) return null;
    return data.map(mapReturnRequestFromDb);
  } catch (err) {
    return null;
  }
}

export async function upsertSupabaseReturnRequest(req: ReturnRequest): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapReturnRequestToDb(req);
    const { error } = await supabase.from('return_requests').upsert([dbPayload]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchSupabaseCategories(): Promise<CategoryItem[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error || !data) return null;
    return data.map(mapCategoryFromDb);
  } catch (err) {
    return null;
  }
}

export async function upsertSupabaseCategory(cat: CategoryItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapCategoryToDb(cat);
    const { error } = await supabase.from('categories').upsert([dbPayload]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function syncAllSupabaseCategories(categories: CategoryItem[]): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const currContent = await fetchSupabaseStoreContent();
    if (currContent) {
      await upsertSupabaseStoreContent({
        ...currContent,
        categories
      });
    }
    await Promise.allSettled(categories.map(c => upsertSupabaseCategory(c)));
    return true;
  } catch (err) {
    console.warn('syncAllSupabaseCategories warning:', err);
    return false;
  }
}

export async function removeSupabaseCategory(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchSupabaseAdminUsers(): Promise<AdminUser[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('admin_users').select('*');
    if (error || !data) return null;
    return data.map(mapAdminUserFromDb);
  } catch (err) {
    return null;
  }
}

export async function upsertSupabaseAdminUser(user: AdminUser): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapAdminUserToDb(user);
    const { error } = await supabase.from('admin_users').upsert([dbPayload]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchSupabaseStoreContent(): Promise<StoreContentConfig | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('store_content').select('*').single();
    if (error || !data) return null;
    return mapStoreContentFromDb(data);
  } catch (err) {
    return null;
  }
}

export async function upsertSupabaseStoreContent(sc: StoreContentConfig): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const dbPayload = mapStoreContentToDb(sc);
    const { error } = await supabase.from('store_content').upsert([dbPayload]);
    if (error) {
      console.warn('Upsert store_content full payload error, trying base columns fallback:', error.message);
      // Fallback: In case hero_banners or contact_info column has not been migrated yet in Supabase
      const basePayload: Record<string, any> = {
        id: 'main_content',
        announcement_text: sc.announcementText,
        hero_title: sc.heroTitle,
        hero_subtitle: sc.heroSubtitle,
        banner_image: sc.bannerImage,
        featured_collection_ids: sc.featuredCollectionIds,
        faq_items: sc.faqItems,
        policy_text: dbPayload.policy_text
      };
      const { error: baseError } = await supabase.from('store_content').upsert([basePayload]);
      if (baseError) {
        console.error('Supabase store_content fallback failed:', baseError.message);
        return false;
      }
      return true;
    }
    return true;
  } catch (err) {
    console.error('Supabase store_content exception:', err);
    return false;
  }
}

export async function fetchSupabaseShippingConfig(): Promise<ShippingConfig | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('shipping_rules').select('*').limit(1).single();
    if (error || !data) return null;
    return {
      freeShippingThreshold: Number(data.free_shipping_threshold) || 0,
      standardFlatRate: Number(data.standard_flat_rate) || 0
    };
  } catch (err) {
    return null;
  }
}

export async function upsertSupabaseShippingConfig(config: ShippingConfig): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('shipping_rules').upsert([
      {
        id: 'main_shipping',
        free_shipping_threshold: Number(config.freeShippingThreshold) || 0,
        standard_flat_rate: Number(config.standardFlatRate) || 0,
        updated_at: new Date().toISOString()
      }
    ]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}
