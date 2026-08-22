import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, ProductColor, ShippingConfig } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: string, selectedColor: ProductColor, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  shippingConfig: ShippingConfig;
  updateShippingConfig: (config: ShippingConfig) => void;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;
  appliedPromoCode: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const SHIPPING_STORAGE_KEY = 'kavish_shipping_config_v1';
export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  freeShippingThreshold: 0,
  standardFlatRate: 0
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kavish_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>(() => {
    try {
      const saved = localStorage.getItem(SHIPPING_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SHIPPING_CONFIG;
  });

  const updateShippingConfig = (config: ShippingConfig) => {
    const cleanConfig: ShippingConfig = {
      freeShippingThreshold: Number(config.freeShippingThreshold) || 0,
      standardFlatRate: Number(config.standardFlatRate) || 0
    };
    setShippingConfig(cleanConfig);
    try {
      localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(cleanConfig));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SHIPPING_STORAGE_KEY && e.newValue) {
        try {
          setShippingConfig(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('kavish_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product: Product, selectedSize: string, selectedColor: ProductColor, quantity = 1) => {
    const itemId = `${product.id}-${selectedSize}-${selectedColor.name}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, selectedSize, selectedColor, quantity }];
    });

    showToast(`Added "${product.name}" to your shopping bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const [discountAmountFixed, setDiscountAmountFixed] = useState<number>(0);

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode(null);
    setDiscountPercent(0);
    setDiscountAmountFixed(0);
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a coupon code.' };

    const currentSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // 1. Check dynamic offers from Admin Panel stored in localStorage
    try {
      const savedOffers = localStorage.getItem('kavish_live_offers_v1');
      if (savedOffers) {
        const offersList = JSON.parse(savedOffers);
        if (Array.isArray(offersList)) {
          const matched = offersList.find(
            (o: any) => o.code && o.code.toUpperCase() === cleanCode && (o.isActive === undefined || o.isActive === true)
          );
          if (matched) {
            if (matched.minOrderAmount && currentSubtotal < matched.minOrderAmount) {
              return {
                success: false,
                message: `Minimum order of ₹${matched.minOrderAmount} required for code ${cleanCode}.`
              };
            }
            setAppliedPromoCode(cleanCode);
            if (matched.discountType === 'fixed') {
              setDiscountPercent(0);
              setDiscountAmountFixed(matched.discountValue || 0);
              return { success: true, message: `₹${matched.discountValue} Off Discount Applied!` };
            } else {
              setDiscountAmountFixed(0);
              setDiscountPercent(matched.discountValue || 10);
              return { success: true, message: `${matched.discountValue}% Heritage Discount Applied!` };
            }
          }
        }
      }
    } catch (e) {
      console.error('Error reading offers for promo code:', e);
    }

    // 2. Default Built-in Codes Fallback
    if (cleanCode === 'KAVISH10' || cleanCode === 'ONAM2026') {
      setAppliedPromoCode(cleanCode);
      setDiscountPercent(10);
      setDiscountAmountFixed(0);
      return { success: true, message: '10% Kerala Heritage Discount Applied!' };
    }
    if (cleanCode === 'ROYALFESTIVE') {
      setAppliedPromoCode(cleanCode);
      setDiscountPercent(15);
      setDiscountAmountFixed(0);
      return { success: true, message: '15% Royal Festive Discount Applied!' };
    }
    return { success: false, message: 'Invalid promo code. Check code spelling or expiry.' };
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
    setDiscountPercent(0);
    setDiscountAmountFixed(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const percentDiscount = Math.round((subtotal * discountPercent) / 100);
  const discount = percentDiscount > 0 ? percentDiscount : discountAmountFixed;

  // Free shipping conditions: cart empty, flat rate is 0, threshold is 0, or subtotal >= threshold
  const isFreeShipping =
    cart.length === 0 ||
    shippingConfig.standardFlatRate === 0 ||
    shippingConfig.freeShippingThreshold === 0 ||
    (shippingConfig.freeShippingThreshold > 0 && subtotal >= shippingConfig.freeShippingThreshold);

  const shippingFee = isFreeShipping ? 0 : shippingConfig.standardFlatRate;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const effectiveThreshold = shippingConfig.freeShippingThreshold > 0 ? shippingConfig.freeShippingThreshold : 0;
  const freeShippingProgress = effectiveThreshold === 0 ? 100 : Math.min(100, (subtotal / effectiveThreshold) * 100);
  const amountNeededForFreeShipping = effectiveThreshold === 0 ? 0 : Math.max(0, effectiveThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        discount,
        shippingFee,
        total,
        itemCount,
        shippingConfig,
        updateShippingConfig,
        freeShippingThreshold: effectiveThreshold,
        freeShippingProgress,
        amountNeededForFreeShipping,
        appliedPromoCode,
        applyPromoCode,
        removePromoCode,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
