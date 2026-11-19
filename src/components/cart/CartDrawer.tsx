'use client';

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
      <div className="bg-[#F8F5EF] w-full sm:max-w-md h-full flex flex-col justify-between shadow-2xl animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8DFD0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#641E2B]" />
            <h3 className="font-serif font-bold text-xl text-[#641E2B]">Your Shopping Bag</h3>
            <span className="text-xs bg-[#B99A61]/20 text-[#641E2B] font-bold px-2.5 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-[#292522] hover:text-[#641E2B] transition-colors w-8 h-8 rounded-full hover:bg-[#F8F5EF] flex items-center justify-center cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#46141D] text-[#F8F5EF] px-5 py-3">
          <div className="flex justify-between text-[11px] font-medium mb-1.5">
            {amountNeededForFreeShipping > 0 ? (
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#B99A61]" /> Add <span className="text-[#B99A61] font-bold">{formatPrice(amountNeededForFreeShipping)}</span> more for Free Shipping
              </span>
            ) : (
              <span className="text-[#B99A61] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> You've unlocked Complimentary Express Shipping!
              </span>
            )}
            <span className="text-[#B99A61] font-bold">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full bg-[#641E2B] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B99A61] to-[#D1B784] h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#6E685D]">
              <div className="w-16 h-16 rounded-full bg-[#B99A61]/20 flex items-center justify-center text-[#641E2B]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#641E2B]">Your Bag is Empty</h4>
              <p className="text-xs max-w-xs font-light">
                Explore our authentic Kerala Kasavu sarees, handloom mundus, and European flax linen collections.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 bg-[#641E2B] text-[#F8F5EF] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#B99A61] hover:text-[#46141D] transition-all cursor-pointer"
              >
                Browse Atelier
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 border border-[#E8DFD0] rounded-2xl flex gap-3.5 items-center shadow-xs"
              >
                <div className="w-16 h-20 bg-[#F8F5EF] rounded-xl overflow-hidden shrink-0 relative border border-[#E8DFD0]">
                  <OptimizedImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    preset="thumbnail"
                    aspectRatio="3/4"
                    containerClassName="w-full h-full"
                    imageClassName="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-[#292522] truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#6E685D] mt-0.5">
                    <span>Size: <strong>{item.selectedSize}</strong></span>
                    <span>•</span>
                    <span>Zari: <strong>{item.selectedColor.name}</strong></span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-xs text-[#641E2B]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#E8DFD0] rounded-lg bg-[#F8F5EF] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-[#292522] hover:bg-[#E8DFD0] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-[#641E2B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-[#292522] hover:bg-[#E8DFD0] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#E8DFD0] space-y-3">
            {/* Promo Code Input */}
            <div>
              {appliedPromoCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedPromoCode}' applied!</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-red-600 text-[10px] font-bold uppercase underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon / Promo Code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border border-[#E8DFD0] rounded-xl text-xs uppercase font-medium focus:outline-none focus:border-[#B99A61] bg-[#F8F5EF]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#641E2B] text-[#F8F5EF] text-xs font-bold uppercase rounded-xl hover:bg-[#B99A61] hover:text-[#46141D] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoFeedback && !appliedPromoCode && (
                <p className={`text-[10px] mt-1 ${promoFeedback.success ? 'text-emerald-600' : 'text-red-500'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#292522] pt-2 border-t border-[#E8DFD0]">
              <div className="flex justify-between">
                <span className="text-[#6E685D]">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Savings Discount</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6E685D]">Shipping Fee</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#641E2B] pt-2 border-t border-[#E8DFD0]">
                <span>Total Amount (Inc. GST)</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-[#641E2B] text-[#F8F5EF] hover:bg-[#B99A61] hover:text-[#46141D] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#6E685D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B99A61]" />
              <span>Razorpay 256-bit Encrypted Checkout</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
