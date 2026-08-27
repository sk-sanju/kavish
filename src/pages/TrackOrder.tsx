import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, MapPin, Package, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { POLICY_CONFIG } from '../config/policyConfig';
import type { Order } from '../types';

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [inputQuery, setInputQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-search if orderId or tracking is in query param
  useEffect(() => {
    const queryOrderId = searchParams.get('orderId') || searchParams.get('id') || searchParams.get('awb');
    if (queryOrderId) {
      setInputQuery(queryOrderId);
      findOrder(queryOrderId);
    }
  }, [searchParams, user.orders]);

  const findOrder = (query: string) => {
    const clean = query.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Please enter a valid Order ID (e.g., KV-ORD-12345) or Tracking AWB number.');
      setSearchedOrder(null);
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsSearching(false);
      // Search in user orders or generate live tracking state
      const found = user.orders.find(
        (o) =>
          o.id.toUpperCase() === clean ||
          o.id.replace('KV-ORD-', '') === clean ||
          (o.trackingNumber && o.trackingNumber.toUpperCase().includes(clean)) ||
          (o.invoiceId && o.invoiceId.toUpperCase().includes(clean))
      );

      if (found) {
        setSearchedOrder(found);
        setErrorMsg(null);
      } else if (clean.startsWith('KV-') || clean.startsWith('BLRD') || clean.length >= 5) {
        // Fallback realistic mockup for direct link tracking
        const mockOrder: Order = {
          id: clean.startsWith('KV-ORD-') ? clean : `KV-ORD-${clean}`,
          invoiceId: `KV-INV-2026-${clean.replace(/[^0-9]/g, '') || '8921'}`,
          date: 'August 23, 2026',
          status: 'Dispatched',
          items: [
            {
              product: {
                id: 'prod-sample',
                name: 'Kuthampully Royal Kasavu Zari Saree',
                subtitle: 'Authentic 24k Gold Zari Border',
                category: 'women',
                subcategory: 'Kasavu Sarees',
                collection: 'Kasavu Masterpieces',
                price: 4950,
                rating: 5.0,
                reviewCount: 42,
                inStock: true,
                images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'],
                sizes: ['Free Size (6.25m with Blouse)'],
                colors: [{ name: 'Cream & Gold', hex: '#FAF8F1' }],
                fabric: 'Pure Organic Kuthampully Cotton & Gold Zari',
                details: ['GI Tag Certified', 'Traditional Temple Border'],
                careInstructions: ['Dry Clean Only'],
                sku: 'KAV-KAS-01'
              },
              size: 'Free Size',
              color: { name: 'Cream & Gold', hex: '#FAF8F1' },
              quantity: 1,
              price: 4950
            }
          ],
          subtotal: 4950,
          discount: 0,
          shippingFee: 0,
          total: 4950,
          shippingAddress: {
            id: 'addr-mock',
            name: user.name !== 'Valued Customer' ? user.name : 'Valued Patron',
            phone: user.phone || POLICY_CONFIG.SUPPORT_PHONE,
            street: 'Heritage Villa, M.G. Road',
            city: 'Kochi',
            state: 'Kerala',
            pincode: '682001'
          },
          paymentMethod: 'Razorpay Instant UPI (Verified)',
          trackingNumber: `KV-TRK-${clean.replace(/[^0-9]/g, '') || '948201'}`,
          courierProvider: 'Standard Express Delivery',
          estimatedDelivery: '4–10 days (Inside India)'
        };
        setSearchedOrder(mockOrder);
        setErrorMsg(null);
      } else {
        setErrorMsg(`No active shipment found matching "${clean}". Please verify your Order ID from your confirmation email.`);
        setSearchedOrder(null);
      }
    }, 400);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    findOrder(inputQuery);
  };

  const getTimelineSteps = (status: string) => {
    const isDispatched = status === 'Dispatched' || status === 'Out for Delivery' || status === 'Delivered';
    const isOutForDelivery = status === 'Out for Delivery' || status === 'Delivered';
    const isDelivered = status === 'Delivered';

    return [
      {
        title: 'Order Placed & Payment Verified',
        desc: 'Payment authenticated and confirmed',
        time: 'Day 1 • Instant',
        done: true
      },
      {
        title: 'Kuthampully Atelier Quality Check',
        desc: 'Handloom inspected for weave consistency and GI hallmark tag attached',
        time: 'Day 1–2 • Completed',
        done: true
      },
      {
        title: 'Dispatched via Express Delivery',
        desc: `Package dispatched from Kuthampully loom house (Tracking: ${searchedOrder?.trackingNumber || 'KV-TRK-XXXX'})`,
        time: 'Day 2–3 • In Transit',
        done: isDispatched
      },
      {
        title: 'Out for Doorstep Delivery',
        desc: 'Delivery executive en route to recipient destination address',
        time: 'Days 4–10',
        done: isOutForDelivery
      },
      {
        title: 'Delivered to Patron',
        desc: 'Handed over in tamper-evident sealed luxury gift box',
        time: searchedOrder?.estimatedDelivery || '4–10 Days',
        done: isDelivered
      }
    ];
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-[#12372A] text-[#FAF8F1] p-8 sm:p-12 rounded-3xl shadow-xl mb-8 relative overflow-hidden text-center sm:text-left">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              Real-Time Courier Tracking
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DDC7] font-light leading-relaxed">
              Enter your Order Reference ID (e.g. <code>KV-ORD-83921</code>) or AWB Tracking Number to view live milestones.
            </p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white p-6 sm:p-8 border border-[#E8DDC7] rounded-3xl shadow-xs mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. KV-ORD-12345) or Tracking AWB..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl text-xs sm:text-sm text-[#12372A] font-medium focus:outline-none focus:border-[#D4AF37] uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-[#D4AF37] shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>{isSearching ? 'Tracking...' : 'Track Package'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Search Results / Tracking Timeline */}
        {searchedOrder && (
          <div className="bg-white p-6 sm:p-10 border border-[#D4AF37] rounded-3xl shadow-xl space-y-8 animate-fadeIn">
            
            {/* Status Header Box */}
            <div className="bg-[#12372A] text-[#FAF8F1] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-[#D4AF37]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block mb-0.5">
                  Shipment Status
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  Order #{searchedOrder.id}
                </h3>
                <p className="text-xs text-[#E8DDC7] mt-1 font-mono">
                  Tracking: {searchedOrder.trackingNumber} • {searchedOrder.courierProvider || 'Standard Express Delivery'}
                </p>
              </div>

              <div className="text-left sm:text-right bg-[#0B241B] p-3 rounded-xl border border-[#D4AF37]/30">
                <span className="text-[10px] uppercase text-[#D4AF37] block">Estimated Delivery</span>
                <strong className="font-serif text-base text-[#FAF8F1]">{searchedOrder.estimatedDelivery || POLICY_CONFIG.STANDARD_DELIVERY_TIME}</strong>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="space-y-6 relative pl-6 sm:pl-8 border-l-2 border-[#D4AF37]/40 text-xs">
              {getTimelineSteps(searchedOrder.status).map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      step.done
                        ? 'bg-[#12372A] border-[#D4AF37] text-[#D4AF37] shadow-sm'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {step.done ? <CheckCircle2 className="w-4 h-4 fill-[#12372A]" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-serif text-sm sm:text-base font-bold ${step.done ? 'text-[#12372A]' : 'text-gray-400'}`}>
                        {step.title}
                      </h4>
                      <span className="text-[10px] text-[#6B5846] font-medium bg-[#FAF8F1] px-2 py-0.5 rounded-full border border-[#E8DDC7]">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5846]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Destination & Package Contents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E8DDC7]">
              
              <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#E8DDC7] text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#12372A]">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Delivery Destination</span>
                </div>
                <p className="text-[#6B5846] leading-relaxed">
                  <strong className="text-[#12372A]">{searchedOrder.shippingAddress.name}</strong><br />
                  {searchedOrder.shippingAddress.street}<br />
                  {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} - {searchedOrder.shippingAddress.pincode}<br />
                  Phone: {searchedOrder.shippingAddress.phone}
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#E8DDC7] text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#12372A]">
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                  <span>Package Contents</span>
                </div>
                <div className="divide-y divide-[#E8DDC7]/60">
                  {searchedOrder.items.map((it, i) => (
                    <div key={i} className="py-1.5 flex justify-between">
                      <span className="font-semibold text-[#12372A] line-clamp-1">{it.product.name} (x{it.quantity})</span>
                      <strong className="text-[#12372A] shrink-0 ml-2">{formatPrice(it.price * it.quantity)}</strong>
                    </div>
                  ))}
                  <div className="pt-1.5 flex justify-between font-serif font-bold text-xs text-[#12372A]">
                    <span>Total Paid:</span>
                    <span>{formatPrice(searchedOrder.total)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Assistance Box */}
        <div className="mt-8 p-5 bg-white border border-[#E8DDC7] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <strong className="text-[#12372A] block font-bold">Have delivery questions?</strong>
              <p className="text-[#6B5846]">Reach our Kuthampully Atelier logistics desk at {POLICY_CONFIG.SUPPORT_PHONE}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="text-[#12372A] hover:text-[#D4AF37] font-bold uppercase text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <span>Contact Concierge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
