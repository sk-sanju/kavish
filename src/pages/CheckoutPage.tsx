import React, { useState } from 'react';
import { CheckCircle2, Lock, Truck, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { initializeRazorpayPayment } from '../utils/razorpay';
import type { Address, Order } from '../types';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onNavigateHome: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onNavigateHome }) => {
  const { cart, subtotal, discount, shippingFee, total, clearCart } = useCart();
  const { user, addOrder, setSelectedTrackingOrder } = useAuth();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0] || {
    id: 'addr-new',
    name: user.name !== 'Valued Customer' ? user.name : '',
    phone: user.phone || '',
    street: '',
    locality: '',
    city: '',
    state: 'Kerala',
    pincode: ''
  };

  const [shippingAddress, setShippingAddress] = useState<Address>(defaultAddr);
  const [shippingOption, setShippingOption] = useState<'standard' | 'gift'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const finalizeOrder = (paymentDetailsMethod: string) => {
    const newOrder: Order = {
      id: `KV-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      items: cart.map(c => ({
        product: c.product,
        size: c.selectedSize,
        color: c.selectedColor,
        quantity: c.quantity,
        price: c.product.price
      })),
      subtotal,
      discount,
      shippingFee,
      total,
      shippingAddress,
      paymentMethod: paymentDetailsMethod,
      trackingNumber: `BLRD-KAV-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: 'August 24, 2026'
    };

    addOrder(newOrder);
    setPlacedOrder(newOrder);
    clearCart();
    setIsProcessingPayment(false);
    setStep(4);
    onOrderSuccess(newOrder);
  };

  const handleProcessPayment = () => {
    setPaymentError(null);

    if (paymentMethod === 'cod') {
      finalizeOrder('Cash on Delivery (COD)');
      return;
    }

    setIsProcessingPayment(true);

    initializeRazorpayPayment({
      amountInINR: total,
      customerName: shippingAddress.name,
      customerEmail: user.email,
      customerPhone: shippingAddress.phone,
      onSuccess: (paymentId) => {
        const methodTitle = paymentMethod === 'upi' ? `Razorpay Instant UPI (${paymentId})` : `Razorpay Card (${paymentId})`;
        finalizeOrder(methodTitle);
      },
      onFailure: (err) => {
        setIsProcessingPayment(false);
        setPaymentError(err);
      },
    });
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 flex flex-col items-center">
          <img
            src={logoImg}
            alt="KAVISH - Kerala Ethnic Wear"
            className="h-12 sm:h-14 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onNavigateHome}
          />
          <p className="text-[10px] sm:text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mt-1">Secure Atelier Checkout</p>
        </div>

        <div className="flex flex-wrap items-center justify-center max-w-2xl mx-auto mb-8 sm:mb-12 text-[11px] sm:text-xs font-semibold gap-2 sm:gap-0">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Confirmation' },
          ].map(s => (
            <div key={s.num} className="flex items-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === s.num
                    ? 'bg-[#12372A] text-[#D4AF37] border-2 border-[#D4AF37]'
                    : step > s.num
                    ? 'bg-[#D4AF37] text-[#12372A]'
                    : 'bg-white text-gray-400 border border-[#E8DDC7]'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`ml-1.5 mr-2 sm:ml-2 sm:mr-4 ${step === s.num ? 'text-[#12372A] font-bold' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {s.num < 4 && <div className="hidden sm:block w-6 md:w-12 h-0.5 bg-[#E8DDC7] mr-4" />}
            </div>
          ))}
        </div>

        {step === 4 && placedOrder ? (
          <div className="bg-white p-6 sm:p-12 border border-[#D4AF37] shadow-2xl rounded-3xl max-w-2xl mx-auto text-center space-y-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#12372A] text-[#D4AF37] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A]">Order Confirmed!</h2>
            <p className="text-xs text-[#6B5846]">
              Thank you for choosing Kavish. Your order <strong className="text-[#12372A]">{placedOrder.id}</strong> has been received by our Chendamangalam handloom team.
            </p>

            <div className="bg-[#FAF8F1] p-4 border border-[#E8DDC7] text-left text-xs space-y-2 rounded-2xl">
              <div className="flex justify-between border-b border-[#E8DDC7] pb-2">
                <span>AWB Tracking Number:</span>
                <strong className="font-mono text-[#12372A]">{placedOrder.trackingNumber}</strong>
              </div>
              <div className="flex justify-between border-b border-[#E8DDC7] pb-2">
                <span>Estimated Delivery:</span>
                <strong className="text-[#12372A]">{placedOrder.estimatedDelivery}</strong>
              </div>
              <div className="flex justify-between border-b border-[#E8DDC7] pb-2">
                <span>Payment Reference / Status:</span>
                <strong className="text-green-700 font-mono text-[11px]">{placedOrder.paymentMethod}</strong>
              </div>
              <div className="flex justify-between font-medium pt-1">
                <span>Total Paid:</span>
                <strong className="text-[#12372A]">{formatPrice(placedOrder.total)}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <a
                href="https://razorpay.me/@kavishbysanjaysuresh"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white text-[#12372A] border border-[#12372A] hover:bg-[#FAF8F1] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>💳 View Razorpay Portal (@kavishbysanjaysuresh)</span>
              </a>
              <button
                onClick={() => setSelectedTrackingOrder(placedOrder)}
                className="flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xl border border-[#D4AF37] shadow-md flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Track Delivery Package</span>
              </button>

              <button
                onClick={onNavigateHome}
                className="flex-1 bg-white text-[#12372A] border border-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#FAF8F1] rounded-xl"
              >
                Return to Store
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            <div className="lg:col-span-7 bg-white p-5 sm:p-8 border border-[#E8DDC7] rounded-2xl shadow-xs">
              
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A]">1. Shipping Address &amp; Contact</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div>
                      <label className="block text-[#6B5846] font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                        className="w-full border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B5846] font-semibold mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[#6B5846] font-semibold mb-1">Street Address / Villa / Apartment</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        className="w-full border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B5846] font-semibold mb-1">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B5846] font-semibold mb-1">Pincode</label>
                      <input
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                        className="w-full border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-md"
                  >
                    <span>Continue to Delivery Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A]">2. Delivery Method</h3>
                  
                  <div className="space-y-3 text-xs">
                    <label className={`p-4 border rounded-xl block cursor-pointer transition-all ${shippingOption === 'standard' ? 'border-[#12372A] bg-[#FAF8F1]' : 'border-[#E8DDC7]'}`}>
                      <input type="radio" checked={shippingOption === 'standard'} onChange={() => setShippingOption('standard')} className="mr-3 accent-[#12372A]" />
                      <strong>Standard Express Courier (Complimentary)</strong>
                      <p className="text-[#6B5846] mt-1 pl-6 font-light">Delivered in 2-4 business days via BlueDart Air.</p>
                    </label>

                    <label className={`p-4 border rounded-xl block cursor-pointer transition-all ${shippingOption === 'gift' ? 'border-[#12372A] bg-[#FAF8F1]' : 'border-[#E8DDC7]'}`}>
                      <input type="radio" checked={shippingOption === 'gift'} onChange={() => setShippingOption('gift')} className="mr-3 accent-[#12372A]" />
                      <strong>Royal Gift Box Packaging (+{formatPrice(250)})</strong>
                      <p className="text-[#6B5846] mt-1 pl-6 font-light">Includes velvet gold casing, personalized handwritten note &amp; gift wrap.</p>
                    </label>
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    <button onClick={() => setStep(1)} className="px-5 sm:px-6 py-3.5 border border-[#12372A] text-xs font-bold uppercase rounded-xl">Back</button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-md"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E8DDC7] pb-3">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A]">3. Payment Method</h3>
                    <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                      Razorpay 256-bit SSL Encrypted
                    </span>
                  </div>

                  {paymentError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex justify-between items-center">
                      <span>{paymentError}</span>
                      <button onClick={() => setPaymentError(null)} className="font-bold underline text-[10px]">Dismiss</button>
                    </div>
                  )}
                  
                  <div className="space-y-3 text-xs">
                    <label className={`p-4 border rounded-xl block cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#12372A] bg-[#FAF8F1]' : 'border-[#E8DDC7]'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-3 accent-[#12372A]" />
                          <strong>Razorpay Instant UPI (Google Pay / PhonePe / Paytm / BHIM)</strong>
                        </div>
                        <span className="text-[10px] bg-[#D4AF37] text-[#12372A] px-2 py-0.5 rounded-full font-bold uppercase">Popular</span>
                      </div>
                      <p className="text-[#6B5846] mt-1.5 pl-6 font-light">Zero transaction fee. Instant 1-click checkout modal via Razorpay.</p>
                    </label>

                    <label className={`p-4 border rounded-xl block cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#12372A] bg-[#FAF8F1]' : 'border-[#E8DDC7]'}`}>
                      <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-3 accent-[#12372A]" />
                      <strong>Razorpay Credit / Debit Card &amp; Netbanking</strong>
                      <p className="text-[#6B5846] mt-1.5 pl-6 font-light">Visa, Mastercard, RuPay, Amex, and 50+ Indian banks supported.</p>
                    </label>

                    <label className={`p-4 border rounded-xl block cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#12372A] bg-[#FAF8F1]' : 'border-[#E8DDC7]'}`}>
                      <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-3 accent-[#12372A]" />
                      <strong>Cash on Delivery (COD)</strong>
                      <p className="text-[#6B5846] mt-1.5 pl-6 font-light">Pay cash or scan QR upon courier delivery to your doorstep.</p>
                    </label>
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    <button onClick={() => setStep(2)} className="px-5 sm:px-6 py-3.5 border border-[#12372A] text-xs font-bold uppercase rounded-xl">Back</button>
                    <button
                      onClick={handleProcessPayment}
                      disabled={isProcessingPayment}
                      className={`flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-lg ${
                        isProcessingPayment ? 'opacity-70 cursor-wait' : ''
                      }`}
                    >
                      <Lock className="w-4 h-4 text-[#D4AF37]" />
                      <span>
                        {isProcessingPayment
                          ? 'Opening Razorpay Gateway...'
                          : `Pay ${formatPrice(total)} & Complete Order`}
                      </span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            <div className="lg:col-span-5 bg-white p-5 sm:p-6 border border-[#E8DDC7] rounded-2xl shadow-xs self-start space-y-4 text-xs">
              <h4 className="font-serif font-bold text-base sm:text-lg text-[#12372A] border-b border-[#E8DDC7] pb-2">Order Summary</h4>
              <div className="divide-y divide-[#E8DDC7] max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="py-2.5 flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 aspect-[3/4] object-cover rounded-lg" />
                      <div>
                        <h5 className="font-bold text-[#12372A] line-clamp-1">{item.product.name}</h5>
                        <p className="text-[10px] text-[#6B5846]">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#12372A]">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E8DDC7] space-y-2 text-[#6B5846]">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold text-[#171717]">{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span></div>
                <div className="flex justify-between text-base font-serif font-bold text-[#12372A] pt-2 border-t border-[#E8DDC7]">
                  <span>Total Payable</span><span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
