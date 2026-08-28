import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Truck, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { OptimizedImage } from '../common/OptimizedImage';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingProgress,
    amountNeededForFreeShipping,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();
  const { formatPrice } = useCurrency();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.success) setPromoInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end">
      <div className="bg-[#FAF8F1] w-full sm:max-w-md h-full flex flex-col justify-between shadow-2xl animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8DDC7] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#12372A]" />
            <h3 className="font-serif font-bold text-xl text-[#12372A]">Your Shopping Bag</h3>
            <span className="text-xs bg-[#E8DDC7] text-[#12372A] font-bold px-2.5 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-[#171717] hover:text-[#D4AF37] transition-colors w-8 h-8 rounded-full hover:bg-[#FAF8F1] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#12372A] text-[#FAF8F1] px-5 py-3">
          <div className="flex justify-between text-[11px] font-medium mb-1.5">
            {amountNeededForFreeShipping > 0 ? (
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Add <span className="text-[#D4AF37] font-bold">{formatPrice(amountNeededForFreeShipping)}</span> more for Free Shipping
              </span>
            ) : (
              <span className="text-[#D4AF37] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> You've unlocked Complimentary Express Shipping!
              </span>
            )}
            <span className="text-[#D4AF37] font-bold">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full bg-[#0B241B] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#6B5846]">
              <div className="w-16 h-16 rounded-full bg-[#E8DDC7]/40 flex items-center justify-center text-[#12372A]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#12372A]">Your Bag is Empty</h4>
              <p className="text-xs max-w-xs font-light">
                Explore our authentic Kerala Kasavu sarees, handloom mundus, and European flax linen collections.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-[#12372A] text-[#FAF8F1] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#12372A] transition-all rounded-full shadow-md"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-3.5 border border-[#E8DDC7] rounded-2xl flex gap-3 relative group shadow-xs">
                {/* Thumbnail */}
                <div className="w-20 aspect-[3/4] bg-[#FAF8F1] shrink-0 overflow-hidden rounded-xl">
                  <OptimizedImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    preset="thumbnail"
                    aspectRatio="3/4"
                    containerClassName="w-full h-full rounded-xl"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif font-bold text-[#12372A] text-sm line-clamp-1 pr-6">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-700 transition-colors absolute top-3 right-3 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex gap-2 text-[10px] text-[#6B5846] mt-0.5">
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Color:
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FAF8F1]">
                    <div className="flex items-center border border-[#E8DDC7] bg-[#FAF8F1] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs font-bold text-[#171717] hover:bg-[#E8DDC7]"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-[#12372A]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs font-bold text-[#171717] hover:bg-[#E8DDC7]"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-[#12372A] text-sm">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E8DDC7] bg-white space-y-3.5 text-xs">
            
            {/* Promo Code Input */}
            <div>
              {appliedPromoCode ? (
                <div className="flex items-center justify-between bg-[#FAF8F1] p-2.5 border border-[#D4AF37]/50 text-xs rounded-xl">
                  <span className="flex items-center gap-1.5 text-[#12372A] font-bold">
                    <Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> Promo Code "{appliedPromoCode}" Applied
                  </span>
                  <button onClick={removePromoCode} className="text-red-700 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. KAVISH10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 border border-[#E8DDC7] px-3.5 py-2 text-xs focus:outline-none focus:border-[#D4AF37] rounded-xl"
                  />
                  <button
                    type="submit"
                    className="bg-[#12372A] text-[#FAF8F1] px-4 py-2 uppercase font-bold text-[10px] tracking-wider hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors rounded-xl shadow-xs"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoFeedback && (
                <p className={`text-[10px] mt-1 ${promoFeedback.success ? 'text-green-700 font-bold' : 'text-red-600'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-[#6B5846] pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#171717]">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Special Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                {shippingFee === 0 ? (
                  <span className="text-[#D4AF37] font-bold uppercase text-[10px]">Complimentary</span>
                ) : (
                  <span className="font-semibold text-[#171717]">{formatPrice(shippingFee)}</span>
                )}
              </div>

              <div className="flex justify-between text-base font-serif font-bold text-[#12372A] pt-2.5 border-t border-[#E8DDC7]">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-[#D4AF37] rounded-xl shadow-lg"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#6B5846] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>100% Guaranteed Handloom &amp; Safe Payment Encryption</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
