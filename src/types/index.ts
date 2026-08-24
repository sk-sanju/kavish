export type ProductCategory = 'women' | 'men' | 'kids';

export type ProductSubcategory =
  | 'Kasavu Sarees'
  | 'Set Mundu'
  | 'Double Mundu'
  | 'Kasavu Mundu'
  | 'Linen Shirts'
  | 'Kerala Shirts'
  | 'Pattu Pavada'
  | 'Kids Ethnic Wear'
  | 'Festive Wear'
  | string;

export interface ProductColor {
  name: string;
  hex: string;
}

export interface SizeChartRow {
  size: string;
  chest?: string;
  shoulder?: string;
  length?: string;
  waist?: string;
  dimensions?: string;
}

export interface SizeChartConfig {
  title?: string;
  description?: string;
  rows: SizeChartRow[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: ProductColor;
  fabric?: string;
  price?: number;
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  collection: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  lowStockThreshold?: number;
  allowBackorders?: boolean;
  brand?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  variants?: ProductVariant[];
  fabric: string;
  details: string[];
  careInstructions: string[];
  fitInformation?: string;
  sku: string;
  tags?: string[];
  sizeChart?: SizeChartConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface FilterState {
  gender: string[];
  category: string[];
  collection: string[];
  fabric: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'recommended' | 'price-low-high' | 'price-high-low' | 'newest' | 'rating';
  searchQuery: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Dispatched'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded'
  | 'Quality Check';

export interface OrderItem {
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
  price: number;
}

export interface Order {
  id: string; // Order ID e.g. KV-ORD-83921
  invoiceId?: string; // Invoice ID e.g. KV-INV-2026-83921
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber: string;
  courierProvider?: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  orders: Order[];
  status?: 'Active' | 'Disabled';
  totalSpent?: number;
  internalNotes?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
  verified?: boolean;
  helpfulCount?: number;
  status?: 'Approved' | 'Pending' | 'Rejected' | 'Hidden';
  adminResponse?: string;
}

export interface PromoOffer {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  startDate?: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
  perCustomerLimit?: number;
  isFirstOrderOnly?: boolean;
  description: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  adminRole: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress?: string;
}

export type ReturnStatus =
  | 'Requested'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Pickup Scheduled'
  | 'Returned'
  | 'Refund Processing'
  | 'Refunded';

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  reason: string;
  requestedDate: string;
  status: ReturnStatus;
  refundAmount: number;
  adminNotes?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  parentCategory: ProductCategory;
  slug: string;
  image: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  status: 'Active' | 'Disabled';
  productCount: number;
}

export type AdminRole =
  | 'Super Admin'
  | 'Store Manager'
  | 'Product Manager'
  | 'Order Manager'
  | 'Inventory Manager'
  | 'Marketing Manager'
  | 'Accountant'
  | 'Support Staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: AdminRole;
  status: 'Active' | 'Disabled';
  permissions: string[];
  lastLogin?: string;
}

export interface AdminProfile {
  phone: string; // Primary Key (PK)
  name: string;
  email: string;
  password?: string;
  role?: string;
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'return' | 'review' | 'system';
  timestamp: string;
  read: boolean;
  targetId?: string;
}

export interface StoreContactConfig {
  atelierTitle: string;
  atelierSubtitle: string;
  addressLine1: string;
  addressLine2: string;
  visitingHoursLine1: string;
  visitingHoursLine2: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  badgeText: string;
}

export interface StoreContentConfig {
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  bannerImage: string;
  featuredCollectionIds: string[];
  faqItems: { question: string; answer: string }[];
  policyText: string;
  contactInfo?: StoreContactConfig;
}

export interface GSTConfig {
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  hsnCode: string;
  includeTaxInPrice: boolean;
}

export interface ShippingConfig {
  freeShippingThreshold: number;
  standardFlatRate: number;
}
