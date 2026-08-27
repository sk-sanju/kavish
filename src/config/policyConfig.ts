/**
 * Kavish E-Commerce Website - Centralized Policy & Business Configuration
 * 
 * All business parameters, delivery timelines, return windows, contact coordinates,
 * and legal details are centralized here for easy business updates without editing markup.
 */

export const POLICY_CONFIG = {
  // Brand & Company Identity
  BRAND_NAME: 'KAVISH',
  COMPANY_LEGAL_NAME: 'Kavish Handlooms Pvt. Ltd.',
  TAGLINE: 'Authentic Kerala Handlooms & GI-Certified Kuthampully Kasavu Weaves',
  GI_TAG_REG_NO: 'Kuthampully GI Reg No. 2011 (Govt. of India)',
  
  // Atelier & Physical Coordinates
  ATELIER_ADDRESS: {
    LINE_1: 'Kuthampully Handloom Village, Near Thiruvilwamala',
    LINE_2: 'Thrissur District',
    STATE: 'Kerala',
    PINCODE: '680594',
    COUNTRY: 'India',
    FULL: 'Kuthampully Handloom Village, Near Thiruvilwamala, Thrissur District, Kerala - 680594, India.'
  },

  // Customer Concierge & Support Coordinates
  SUPPORT_EMAIL: 'kavishlooms@gmail.com',
  ADMIN_NOTIFICATION_EMAIL: 'sanjayskpy7@gmail.com',
  SUPPORT_PHONE: '+91 9539251789',
  SUPPORT_PHONE_ALT: '+91 9539251789',
  WHATSAPP_NUMBER: '919539251789',
  WORKING_HOURS: 'Monday – Saturday: 9:30 AM – 7:00 PM IST (Sunday by Appointment)',

  // Shipping & Logistics Parameters
  PROCESSING_TIME: '24–48 hours',
  STANDARD_DELIVERY_TIME: '4–10 days (Inside India)',
  EXPRESS_COURIER_PARTNERS: ['Standard Express Delivery', 'Express Handloom Delivery'],
  SHIPPING_CHARGE: 150, // Flat ₹150 for orders inside India
  FREE_SHIPPING_THRESHOLD: 0, // Flat standard delivery across India
  INTERNATIONAL_SHIPPING_AVAILABLE: false,

  // Return, Refund & Exchange Parameters
  RETURN_WINDOW_DAYS: 7, // 7-day hassle-free doorstep exchange / return window
  REFUND_PROCESSING_DAYS: '5–7 business days',
  EXCHANGE_AVAILABLE: true,
  RETURN_SHIPPING_CHARGE: 0, // Complimentary doorstep pickup for exchanges/verified returns
  CANCELLATION_WINDOW_HOURS: 12, // Order cancellation window before dispatch

  // Payment Configuration
  ONLINE_PAYMENTS_ENABLED: true,
  ACCEPTED_PAYMENT_METHODS: [
    'Instant UPI (GPay, PhonePe, Paytm, BHIM, CRED, Any UPI App)',
    'Credit Cards (Visa, MasterCard, RuPay, American Express)',
    'Debit Cards (All Major Indian Banks)',
    'Net Banking (50+ Leading Indian Banks)',
    'Direct UPI Transfer (sanjayskpy1@oksbi)'
  ],
  COD_ENABLED: true, // Optional Cash on Delivery for customer convenience
  UPI_ID: 'sanjayskpy1@oksbi',
  UPI_NAME: 'Kavish Handlooms',
  PAYMENT_GATEWAY_PROVIDER: 'Razorpay (256-bit SSL Encrypted & PCI-DSS Compliant)',
  RAZORPAY_PORTAL_LINK: 'https://razorpay.me/@kavishbysanjaysuresh',

  // Taxation
  GST_REGISTERED: true,
  PRICES_INCLUDE_TAX: true,
  TAX_DISCLOSURE: 'All listed prices are inclusive of applicable GST (Goods and Services Tax).'
} as const;

export default POLICY_CONFIG;
