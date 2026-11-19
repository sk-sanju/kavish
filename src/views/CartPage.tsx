'use client';

import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { OptimizedImage } from '../components/common/OptimizedImage';

interface CartPageProps {
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
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

  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ success: boolean; message: string } | null>(null);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code) {
      const res = applyPromoCode(code);
      setMsg(res);
      if (res.success) setCode('');
    }
  };

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#641E2B] mb-2">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-[#6E685D] mb-8 font-light">
          Review your handcrafted Kerala garments before proceeding to checkout.
        </p>

        {cart.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#E8DFD0] rounded-3xl shadow-xs space-y-4 max-w-xl mx-auto my-12">
            <ShoppingBag className="w-12 h-12 text-[#B99A61] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#641E2B]">Your Shopping Bag is Empty</h3>
            <p className="text-xs text-[#6E685D] font-light">Discover traditional Kerala Kasavu sarees, set mundus, and linen apparel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-4">
              
              <div className="bg-[#641E2B] text-[#F8F5EF] p-4 border-l-4 border-[#B99A61] rounded-2xl shadow-xs">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  {amountNeededForFreeShipping > 0 ? (
                    <span>Add {formatPrice(amountNeededForFreeShipping)} more to unlock Complimentary Express Shipping</span>
                  ) : (
                    <span className="text-[#B99A61] font-bold">Complimentary Express Shipping Unlocked!</span>
                  )}
                  <span className="text-[#B99A61]">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-[#0B241B] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#B99A61] h-full transition-all duration-500 rounded-full" style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>

              <div className="bg-white border border-[#E8DFD0] rounded-2xl shadow-xs divide-y divide-[#E8DFD0] overflow-hidden">
                {cart.map(item => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <OptimizedImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        preset="thumbnail"
                        aspectRatio="3/4"
                        containerClassName="w-20 aspect-[3/4] rounded-xl shrink-0"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#641E2B]">{item.product.name}</h4>
                        <p className="text-xs text-[#6E685D]">{item.product.subtitle}</p>
                        <div className="flex gap-3 text-[11px] text-[#6E685D] mt-2">
                          <span>Size: <strong>{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span>Color: <strong>{item.selectedColor.name}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F8F5EF]">
                      <div className="flex items-center border border-[#E8DFD0] rounded-xl overflow-hidden bg-[#F8F5EF]">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-xs font-bold text-[#171717]">-</button>
                        <span className="px-3 py-1 text-xs font-bold text-[#641E2B]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-xs font-bold text-[#171717]">+</button>
                      </div>

                      <span className="font-serif text-lg font-bold text-[#641E2B]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 border border-[#E8DFD0] rounded-2xl shadow-xs space-y-6 self-start">
              <h3 className="font-serif text-xl font-bold text-[#641E2B] border-b border-[#E8DFD0] pb-3">Order Summary</h3>
              
              <div>
                {appliedPromoCode ? (
                  <div className="flex items-center justify-between bg-[#F8F5EF] p-2.5 border border-[#B99A61] text-xs rounded-xl">
                    <span className="font-bold text-[#641E2B]">Code "{appliedPromoCode}" Applied</span>
                    <button onClick={removePromoCode} className="text-red-700 font-bold hover:underline">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleCodeSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="flex-1 border border-[#E8DFD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#B99A61] rounded-xl"
                    />
                    <button type="submit" className="bg-[#641E2B] text-[#F8F5EF] px-4 py-2 text-xs font-bold uppercase rounded-xl">Apply</button>
                  </form>
                )}
                {msg && <p className={`text-[10px] mt-1 ${msg.success ? 'text-green-700 font-bold' : 'text-red-600'}`}>{msg.message}</p>}
              </div>

              <div className="space-y-2 text-xs text-[#6E685D]">
                <div className="flex justify-between"><span>Bag Subtotal</span><span className="font-semibold text-[#171717]">{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-700"><span>Promo Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span>Estimated Delivery</span><span>{shippingFee === 0 ? 'Complimentary Free' : formatPrice(shippingFee)}</span></div>
                <div className="flex justify-between text-base font-serif font-bold text-[#641E2B] pt-3 border-t border-[#E8DFD0]">
                  <span>Total Amount</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full bg-[#641E2B] text-[#F8F5EF] hover:bg-[#B99A61] hover:text-[#641E2B] py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-[#B99A61] rounded-xl shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
