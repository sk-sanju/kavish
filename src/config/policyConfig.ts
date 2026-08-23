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
  TAGLINE: 'Authentic Kerala Handlooms & GI-Certified Kasavu Weaves',
  GI_TAG_REG_NO: 'Kuthampully GI Reg No. 2011 (Govt. of India)',
  
  // Atelier & Physical Coordinates
  ATELIER_ADDRESS: {
    LINE_1: 'Kuthampully Handloom Village, Near Thiruvilwamala',
    LINE_2: 'Thrissur District',
    STATE: 'Kerala',
    PINCODE: '679121',
    COUNTRY: 'India',
    FULL: 'Kuthampully Handloom Village, Near Thiruvilwamala, Thrissur District, Kerala - 679121, India'
  },

  // Customer Concierge & Support Coordinates
  SUPPORT_EMAIL: 'concierge@kavishhandlooms.com',
  ADMIN_NOTIFICATION_EMAIL: 'sanjayskpy7@gmail.com',
  SUPPORT_PHONE: '+91 98470 55111',
  SUPPORT_PHONE_ALT: '+91 4884 282 100',
  WHATSAPP_NUMBER: '919847055111',
  WORKING_HOURS: 'Monday – Saturday: 9:30 AM – 7:00 PM IST (Sunday by Appointment)',

  // Shipping & Logistics Parameters
  PROCESSING_TIME: '24–48 hours',
  STANDARD_DELIVERY_TIME: '2–4 business days (Metros) | 3–6 business days (Rest of India)',
  EXPRESS_COURIER_PARTNERS: ['BlueDart Air', 'Delhivery Express', 'India Post SpeedPost'],
  SHIPPING_CHARGE: 150, // INR for orders below threshold
  FREE_SHIPPING_THRESHOLD: 2000, // INR threshold for complimentary express delivery
  INTERNATIONAL_SHIPPING_AVAILABLE: false, // Planned for future releases

  // Return, Refund & Exchange Parameters
  RETURN_WINDOW_DAYS: 7, // 7-day hassle-free doorstep exchange / return window
  REFUND_PROCESSING_DAYS: '5–7 business days',
  EXCHANGE_AVAILABLE: true,
  RETURN_SHIPPING_CHARGE: 0, // Complimentary doorstep pickup for exchanges/verified returns
  CANCELLATION_WINDOW_HOURS: 12, // Order cancellation window before dispatch

  // Payment Configuration
  ONLINE_PAYMENTS_ENABLED: true,
  ACCEPTED_PAYMENT_METHODS: [
    'UPI (Google Pay, PhonePe, Paytm, BHIM, Cred, Any UPI App)',
    'Credit Cards (Visa, MasterCard, RuPay, American Express, Diners Club)',
    'Debit Cards (All Major Indian Banks)',
    'Net Banking (50+ Leading Indian Banks)',
    'Wallets (Amazon Pay, Mobikwik, Airtel Money)'
  ],
  COD_ENABLED: false, // Cash on Delivery currently disabled for bespoke handloom authenticity
  PAYMENT_GATEWAY_PROVIDER: 'Razorpay (256-bit SSL Encrypted & PCI-DSS Compliant)',
  RAZORPAY_PORTAL_LINK: 'https://razorpay.me/@kavishbysanjaysuresh',

  // Taxation
  GST_REGISTERED: true,
  PRICES_INCLUDE_TAX: true,
  TAX_DISCLOSURE: 'All listed prices are inclusive of applicable GST (Goods and Services Tax).'
} as const;

export default POLICY_CONFIG;
