import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, ArrowRight, ShieldCheck, AlertCircle, ShoppingCart } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { initializeRazorpayPayment } from '../utils/razorpay';
import { sendOrderNotificationEmail } from '../utils/emailService';
import { POLICY_CONFIG } from '../config/policyConfig';
import type { Address, Order } from '../types';

interface CheckoutPageProps {
  onOrderSuccess?: (order: Order) => void;
  onNavigateHome: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onNavigateHome }) => {
  const navigate = useNavigate();
  const { cart, subtotal, discount, shippingFee, total, clearCart } = useCart();
  const { user, addOrder, setSelectedTrackingOrder } = useAuth();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address State
  const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0] || {
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
  const [customerEmail, setCustomerEmail] = useState<string>(user.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  // Legal Consent Checkbox
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Processing & Error State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Validation function
  const validateAddressForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!shippingAddress.name || shippingAddress.name.trim().length < 2) {
      errors.name = 'Please enter your full name (minimum 2 characters).';
    }

    const cleanPhone = shippingAddress.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errors.email = 'Please enter a valid email address for your order confirmation receipt.';
    }

    if (!shippingAddress.street || shippingAddress.street.trim().length < 5) {
      errors.street = 'Please enter your street address / apartment / house details.';
    }

    if (!shippingAddress.city || shippingAddress.city.trim().length < 2) {
      errors.city = 'Please enter your city/town.';
    }

    const cleanPin = shippingAddress.pincode.replace(/[^0-9]/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pincode = 'Please enter a valid 6-digit postal PIN code.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToDelivery = () => {
    if (validateAddressForm()) {
      setStep(2);
    }
  };

  // Finalize order upon verified payment
  const finalizeOrder = (paymentDetailsMethod: string, customOrderId?: string, customInvoiceId?: string) => {
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const finalOrderId = customOrderId || `KV-ORD-${orderNum}`;
    const finalInvoiceId = customInvoiceId || `KV-INV-2026-${orderNum}`;

    const newOrder: Order = {
      id: finalOrderId,
      invoiceId: finalInvoiceId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      items: cart.map((c) => ({
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
      shippingAddress: {
        ...shippingAddress,
        phone: shippingAddress.phone.trim()
      },
      paymentMethod: paymentDetailsMethod,
      trackingNumber: `BLRD-KAV-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: 'August 26, 2026'
    };

    addOrder(newOrder);
    clearCart();
    setIsProcessingPayment(false);
    setSelectedTrackingOrder(newOrder);

    // Trigger customer and admin notifications
    sendOrderNotificationEmail(newOrder, POLICY_CONFIG.ADMIN_NOTIFICATION_EMAIL);

    if (onOrderSuccess) {
      onOrderSuccess(newOrder);
    }

    // Navigate to dedicated Order Success route
    navigate(`/order-success?orderId=${newOrder.id}`, { state: { order: newOrder } });
  };

  const handleProcessPayment = () => {
    if (!agreedToTerms) {
      setPaymentError('Please accept the store Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    if (cart.length === 0) {
      setPaymentError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setPaymentError(null);
    setIsProcessingPayment(true);

    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const generatedOrderId = `KV-ORD-${orderNum}`;
    const generatedInvoiceId = `KV-INV-2026-${orderNum}`;

    initializeRazorpayPayment({
      amountInINR: total,
      orderId: generatedOrderId,
      invoiceId: generatedInvoiceId,
      customerName: shippingAddress.name,
      customerEmail: customerEmail.trim(),
      customerPhone: shippingAddress.phone.trim(),
      onSuccess: (paymentId) => {
        const methodTitle =
          paymentMethod === 'upi'
            ? `Razorpay Instant UPI (${paymentId})`
            : `Razorpay Card/NetBanking (${paymentId})`;
        finalizeOrder(methodTitle, generatedOrderId, generatedInvoiceId);
      },
      onFailure: (err) => {
        setIsProcessingPayment(false);
        setPaymentError(err);
      }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 bg-[#FAF8F1] min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white p-8 sm:p-12 border border-[#E8DDC7] rounded-3xl shadow-xl max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#12372A] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A]">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-[#6B5846] leading-relaxed">
            Please select authentic handlooms from our collection to begin checkout.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#D4AF37] shadow-md cursor-pointer"
          >
            Explore Handloom Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Atelier Logo Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 flex flex-col items-center">
          <img
            src={logoImg}
            alt="KAVISH - Kerala Ethnic Wear"
            className="h-12 sm:h-14 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onNavigateHome}
          />
          <p className="text-[10px] sm:text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mt-1">
            Secure Atelier Checkout
          </p>
        </div>

        {/* Stepper Navigation */}
        <div className="flex flex-wrap items-center justify-center max-w-2xl mx-auto mb-8 sm:mb-12 text-[11px] sm:text-xs font-semibold gap-2 sm:gap-0">
          {[
            { num: 1, label: 'Address & Contact' },
            { num: 2, label: 'Delivery Tier' },
            { num: 3, label: 'Payment & Confirm' }
          ].map((s) => (
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
              {s.num < 3 && <div className="hidden sm:block w-8 md:w-16 h-0.5 bg-[#E8DDC7] mr-4" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-8 border border-[#E8DDC7] rounded-3xl shadow-xs">
            
            {/* Step 1: Shipping Address & Contact */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8DDC7] pb-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A]">
                    1. Shipping Address &amp; Contact
                  </h3>
                  <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                    256-Bit SSL Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, name: e.target.value });
                        if (validationErrors.name) setValidationErrors({ ...validationErrors, name: '' });
                      }}
                      placeholder="e.g. Ananya Suresh"
                      className={`w-full border p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl ${
                        validationErrors.name ? 'border-red-500 bg-red-50/50' : 'border-[#E8DDC7]'
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-red-600 text-[10px] mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, phone: e.target.value });
                        if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: '' });
                      }}
                      placeholder="e.g. 9847012345"
                      className={`w-full border p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl ${
                        validationErrors.phone ? 'border-red-500 bg-red-50/50' : 'border-[#E8DDC7]'
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-600 text-[10px] mt-1">{validationErrors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#6B5846] font-semibold mb-1">
                      Email Address (For Tax Invoice &amp; Tracking) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (validationErrors.email) setValidationErrors({ ...validationErrors, email: '' });
                      }}
                      placeholder="e.g. patron@kavish.com"
                      className={`w-full border p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl ${
                        validationErrors.email ? 'border-red-500 bg-red-50/50' : 'border-[#E8DDC7]'
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-[10px] mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#6B5846] font-semibold mb-1">
                      Street Address / House No. / Villa / Apartment <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, street: e.target.value });
                        if (validationErrors.street) setValidationErrors({ ...validationErrors, street: '' });
                      }}
                      placeholder="e.g. Flat 4B, Kuthampully Heritage Enclave, Main Road"
                      className={`w-full border p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl ${
                        validationErrors.street ? 'border-red-500 bg-red-50/50' : 'border-[#E8DDC7]'
                      }`}
                    />
                    {validationErrors.street && (
                      <p className="text-red-600 text-[10px] mt-1">{validationErrors.street}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">
                      City / District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, city: e.target.value });
                        if (validationErrors.city) setValidationErrors({ ...validationErrors, city: '' });
                      }}
                      placeholder="e.g. Thrissur / Kochi / Bengaluru"
                      className={`w-full border p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl ${
                        validationErrors.city ? 'border-red-500 bg-red-50/50' : 'border-[#E8DDC7]'
                      }`}
                    />
                    {validationErrors.city && (
                      <p className="text-red-600 text-[10px] mt-1">{validationErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">
                      Postal PIN Code (6 Digits) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={shippingAddress.pincode}
                      onChange={(e) => {
                        setShippingAddress({ ...shippingAddress, pincode: e.target.value.replace(/[^0-9]/g, '') });
                        if (validationErrors.pincode) setValidationErrors({ ...validationErrors, pincode: '' });
                      }}
                      placeholder="e.g. 680590"
                      className={`w-full border p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl ${
                        validationErrors.pincode ? 'border-red-500 bg-red-50/50' : 'border-[#E8DDC7]'
                      }`}
                    />
                    {validationErrors.pincode && (
                      <p className="text-red-600 text-[10px] mt-1">{validationErrors.pincode}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleContinueToDelivery}
                  className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-md cursor-pointer"
                >
                  <span>Continue to Delivery Options</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Delivery Method */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8DDC7] pb-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A]">
                    2. Delivery Method &amp; Timeline
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="p-4 border-2 border-[#12372A] bg-[#FAF8F1] rounded-2xl block transition-all shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="radio" checked readOnly className="mr-3 accent-[#12372A]" />
                        <strong className="text-[#12372A]">
                          Standard Express Courier ({shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)})
                        </strong>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold uppercase">
                        {shippingFee === 0 ? 'Free Express' : 'Priority Air'}
                      </span>
                    </div>
                    <p className="text-[#6B5846] mt-1.5 pl-6 font-light">
                      Delivered in 2–4 business days via BlueDart Air / Delhivery Express with tamper-proof gift box packaging.
                    </p>
                  </label>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3.5 border border-[#12372A] text-xs font-bold uppercase rounded-xl hover:bg-[#FAF8F1] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-md cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method & Legal Agreement */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8DDC7] pb-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A]">
                    3. Payment &amp; Consent
                  </h3>
                  <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                    Razorpay 256-bit SSL Gateway
                  </span>
                </div>

                {paymentError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{paymentError}</span>
                    </div>
                    <button onClick={() => setPaymentError(null)} className="font-bold underline text-[10px] cursor-pointer ml-2">
                      Dismiss
                    </button>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <label
                    className={`p-4 border rounded-2xl block cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-[#12372A] bg-[#FAF8F1] shadow-xs' : 'border-[#E8DDC7]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="mr-3 accent-[#12372A]"
                        />
                        <strong className="text-[#12372A]">Instant 1-Click UPI (GPay / PhonePe / Paytm / BHIM / CRED)</strong>
                      </div>
                      <span className="text-[10px] bg-[#D4AF37] text-[#12372A] px-2 py-0.5 rounded-full font-bold uppercase">
                        Fastest
                      </span>
                    </div>
                    <p className="text-[#6B5846] mt-1 pl-6 font-light">
                      Zero processing fee. Instant UPI app intent or QR code via Razorpay.
                    </p>
                  </label>

                  <label
                    className={`p-4 border rounded-2xl block cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-[#12372A] bg-[#FAF8F1] shadow-xs' : 'border-[#E8DDC7]'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mr-3 accent-[#12372A]"
                      />
                      <strong className="text-[#12372A]">Credit / Debit Card &amp; Net Banking</strong>
                    </div>
                    <p className="text-[#6B5846] mt-1 pl-6 font-light">
                      Visa, MasterCard, RuPay, Amex, and 50+ Indian banks supported with 3D Secure OTP.
                    </p>
                  </label>
                </div>

                {/* Legal Consent Checkbox */}
                <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-2xl text-xs space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 accent-[#12372A] w-4 h-4 shrink-0 rounded"
                    />
                    <span className="text-[#6B5846] text-[11px] leading-relaxed">
                      I have reviewed my order and agree to the Kavish{' '}
                      <a href="/terms-and-conditions" target="_blank" className="text-[#12372A] underline font-semibold">
                        Terms &amp; Conditions
                      </a>
                      ,{' '}
                      <a href="/privacy-policy" target="_blank" className="text-[#12372A] underline font-semibold">
                        Privacy Policy
                      </a>
                      , and{' '}
                      <a href="/return-refund-policy" target="_blank" className="text-[#12372A] underline font-semibold">
                        Return &amp; Refund Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isProcessingPayment}
                    className="px-6 py-3.5 border border-[#12372A] text-xs font-bold uppercase rounded-xl hover:bg-[#FAF8F1] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProcessPayment}
                    disabled={isProcessingPayment || !agreedToTerms}
                    className={`flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-lg cursor-pointer ${
                      isProcessingPayment || !agreedToTerms ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {isProcessingPayment ? 'Opening Razorpay Gateway...' : `Pay ${formatPrice(total)} & Complete Order`}
                    </span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 border border-[#E8DDC7] rounded-3xl shadow-xs self-start space-y-4 text-xs">
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#12372A] border-b border-[#E8DDC7] pb-2">
              Order Summary ({cart.reduce((acc, it) => acc + it.quantity, 0)} Items)
            </h4>

            <div className="divide-y divide-[#E8DDC7] max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 aspect-[3/4] object-cover rounded-lg border border-[#E8DDC7]"
                    />
                    <div>
                      <h5 className="font-bold text-[#12372A] line-clamp-1">{item.product.name}</h5>
                      <p className="text-[10px] text-[#6B5846]">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#12372A]">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8DDC7] space-y-2 text-[#6B5846]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#171717]">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Special Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier</span>
                <span className="font-semibold text-green-700">
                  {shippingFee === 0 ? 'Complimentary (FREE)' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#12372A] pt-2 border-t border-[#E8DDC7]">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Quality Guarantee Box */}
            <div className="p-3 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl text-[11px] text-[#6B5846] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#12372A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>GI Tag Certified Handloom</span>
              </div>
              <p>Authentic Chendamangalam craft with {POLICY_CONFIG.RETURN_WINDOW_DAYS}-day hassle-free doorstep size exchange.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
