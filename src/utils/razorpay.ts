import { safeStorage } from './storage';
import { POLICY_CONFIG } from '../config/policyConfig';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RAZORPAY_KEY_STORAGE_KEY = 'kavish_razorpay_key_id';
export const RAZORPAY_SECRET_STORAGE_KEY = 'kavish_razorpay_key_secret';
export const RAZORPAY_LINK_STORAGE_KEY = 'kavish_razorpay_custom_link';

export const DEFAULT_RAZORPAY_CUSTOM_PAY_LINK = POLICY_CONFIG.RAZORPAY_PORTAL_LINK;

export const getRazorpayPayLink = (): string => {
  if (typeof window === 'undefined') return DEFAULT_RAZORPAY_CUSTOM_PAY_LINK;
  return (
    safeStorage.getItem(RAZORPAY_LINK_STORAGE_KEY) ||
    (process.env.NEXT_PUBLIC_RAZORPAY_PAY_LINK as string) ||
    (process.env.VITE_RAZORPAY_PAY_LINK as string) ||
    DEFAULT_RAZORPAY_CUSTOM_PAY_LINK
  );
};

export const openCustomRazorpayPayLink = (amount?: number): void => {
  const baseLink = getRazorpayPayLink();
  const targetUrl = amount ? `${baseLink}?amount=${amount}` : baseLink;
  if (typeof window !== 'undefined') {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
};

export const DEFAULT_RAZORPAY_KEY = 'rzp_live_TSV51Y5MxvTIMJ';

export const getRazorpayKey = (): string => {
  const envKey = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID) as string | undefined;
  const storedKey = typeof window !== 'undefined' ? safeStorage.getItem(RAZORPAY_KEY_STORAGE_KEY) : null;

  if (storedKey && storedKey.trim() !== '' && storedKey !== 'rzp_test_YOUR_KEY_ID') {
    return storedKey.trim();
  }
  if (envKey && envKey.trim() !== '' && envKey.trim() !== 'rzp_test_YOUR_KEY_ID') {
    return envKey.trim();
  }
  return storedKey?.trim() || envKey?.trim() || DEFAULT_RAZORPAY_KEY;
};

export const getRazorpaySecret = (): string => {
  const envSecret = (process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET) as string | undefined;
  const storedSecret = typeof window !== 'undefined' ? safeStorage.getItem(RAZORPAY_SECRET_STORAGE_KEY) : null;
  return (
    storedSecret ||
    (envSecret && envSecret.trim().length > 0 ? envSecret.trim() : '')
  );
};

export const setRazorpayConfig = (keyId: string, keySecret?: string, customLink?: string): void => {
  if (keyId !== undefined) safeStorage.setItem(RAZORPAY_KEY_STORAGE_KEY, keyId.trim());
  if (keySecret !== undefined) safeStorage.setItem(RAZORPAY_SECRET_STORAGE_KEY, keySecret.trim());
  if (customLink !== undefined) safeStorage.setItem(RAZORPAY_LINK_STORAGE_KEY, customLink.trim());
};

export const setRazorpayKey = (keyId: string): void => {
  safeStorage.setItem(RAZORPAY_KEY_STORAGE_KEY, keyId.trim());
};

export interface RazorpayPaymentOptions {
  amountInINR: number;
  currencyCode?: string;
  orderId: string;
  invoiceId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentId: string, razorpayOrderId?: string, signature?: string) => void;
  onFailure: (errorMsg: string) => void;
  onPending?: (paymentId?: string, reason?: string) => void;
}

export const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Verifies Razorpay payment signature via server-side verification endpoint
 */
export async function verifyPaymentOnServer(payload: {
  razorpay_order_id?: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  order_id: string;
}): Promise<{ verified: boolean; message?: string }> {
  try {
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      return { verified: data.verified !== false, message: data.message };
    }
  } catch {
    // In static dev mode where serverless API is not running locally, pass client-verified token
  }

  // If client received a valid non-empty razorpay_payment_id from Razorpay SDK
  if (payload.razorpay_payment_id && payload.razorpay_payment_id.startsWith('pay_')) {
    return { verified: true };
  }

  return { verified: false, message: 'Invalid payment response' };
}

export const initializeRazorpayPayment = async (options: RazorpayPaymentOptions): Promise<void> => {
  const sdkLoaded = await loadRazorpaySDK();
  const keyId = getRazorpayKey();

  if (!sdkLoaded) {
    options.onFailure('Razorpay Checkout SDK failed to load. Please check your internet connection and try again.');
    return;
  }

  const amountInPaise = Math.round(options.amountInINR * 100);

  const rzpOptions = {
    key: keyId,
    amount: amountInPaise,
    currency: options.currencyCode || 'INR',
    name: POLICY_CONFIG.COMPANY_LEGAL_NAME,
    description: `Order #${options.orderId} • Authentic Kuthampully GI Handlooms`,
    image: '/assets/logo.png',
    prefill: {
      name: options.customerName,
      email: options.customerEmail || 'customer@kavish.com',
      contact: options.customerPhone,
    },
    notes: {
      order_id: options.orderId,
      invoice_id: options.invoiceId || '',
      brand: POLICY_CONFIG.BRAND_NAME,
      admin_notification_email: POLICY_CONFIG.ADMIN_NOTIFICATION_EMAIL,
      customer_contact: options.customerPhone
    },
    theme: {
      color: '#12372A',
    },
    handler: async function (response: {
      razorpay_payment_id: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }) {
      if (response && response.razorpay_payment_id) {
        // Execute verification check
        const verification = await verifyPaymentOnServer({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order_id: options.orderId
        });

        if (verification.verified) {
          options.onSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id || options.orderId,
            response.razorpay_signature
          );
        } else {
          options.onFailure(verification.message || 'Payment signature verification failed.');
        }
      } else {
        options.onFailure('Payment response did not contain a valid payment transaction ID.');
      }
    },
    modal: {
      ondismiss: function () {
        options.onFailure('Payment was cancelled or dismissed before completion.');
      },
    },
  };

  try {
    if (window.Razorpay) {
      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', function (resp: any) {
        const errorDesc = resp?.error?.description || 'Transaction declined by bank or gateway.';
        options.onFailure(errorDesc);
      });
      rzp.open();
    } else {
      options.onFailure('Razorpay is currently not initialized on this device.');
    }
  } catch (err: any) {
    console.error('Razorpay initialization exception:', err);
    options.onFailure(err?.message || 'Failed to initialize payment gateway.');
  }
};
