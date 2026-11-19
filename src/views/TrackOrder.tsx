'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, Truck, CheckCircle2, Clock, MapPin, Package, AlertCircle, 
  Phone, ArrowRight, ExternalLink, Calendar, ShieldCheck, UserCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { POLICY_CONFIG } from '../config/policyConfig';
import { fetchSupabaseOrderById } from '../lib/supabase';
import { safeStorage } from '../utils/storage';
import type { Order, OrderStatus } from '../types';

// The 8 standard pipeline steps in order
const STANDARD_PIPELINE_STAGES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'New Order', label: 'Order Received', desc: 'Order placed & payment verified' },
  { status: 'Confirmed', label: 'Order Confirmed', desc: 'Atelier verified & assigned to loom master' },
  { status: 'Processing', label: 'Artisan Weaving', desc: 'Quality inspection & weave verification' },
  { status: 'Packed', label: 'Luxury Packed', desc: 'GI hallmark tag attached & sealed in gift box' },
  { status: 'Ready to Dispatch', label: 'Ready for Pickup', desc: 'Manifested for courier partner handoff' },
  { status: 'Shipped', label: 'In Transit', desc: 'En route from Kuthampully loom house' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier agent en route to recipient destination' },
  { status: 'Delivered', label: 'Delivered', desc: 'Handed over in tamper-evident sealed luxury box' }
];

const STAGE_ORDER: Record<string, number> = {
  'Pending': 0,
  'New Order': 0,
  'Confirmed': 1,
  'Processing': 2,
  'Packed': 3,
  'Ready to Dispatch': 4,
  'Dispatched': 5,
  'Shipped': 5,
  'Out for Delivery': 6,
  'Delivered': 7
};

export const TrackOrder: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, selectedTrackingOrder } = useAuth();
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

  const findOrder = async (query: string) => {
    const clean = query.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Please enter a valid Order ID (e.g., KV-ORD-12345) or Tracking AWB number.');
      setSearchedOrder(null);
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);

    // 1. Check selectedTrackingOrder
    if (
      selectedTrackingOrder &&
      (selectedTrackingOrder.id.toUpperCase() === clean ||
        selectedTrackingOrder.id.replace('KV-ORD-', '') === clean ||
        (selectedTrackingOrder.trackingNumber && selectedTrackingOrder.trackingNumber.toUpperCase().includes(clean)) ||
        (selectedTrackingOrder.invoiceId && selectedTrackingOrder.invoiceId.toUpperCase().includes(clean)))
    ) {
      setSearchedOrder(selectedTrackingOrder);
      setIsSearching(false);
      return;
    }

    // 2. Search in user orders
    const foundInUser = (user.orders || []).find(
      (o) =>
        o.id.toUpperCase() === clean ||
        o.id.replace('KV-ORD-', '') === clean ||
        (o.trackingNumber && o.trackingNumber.toUpperCase().includes(clean)) ||
        (o.invoiceId && o.invoiceId.toUpperCase().includes(clean))
    );

    if (foundInUser) {
      setSearchedOrder(foundInUser);
      setIsSearching(false);
      return;
    }

    // 3. Check locally stored recent orders
    try {
      const recentRaw = safeStorage.getItem('kavish_recent_order');
      if (recentRaw) {
        const recent: Order = JSON.parse(recentRaw);
        if (
          recent.id.toUpperCase() === clean ||
          recent.id.replace('KV-ORD-', '') === clean ||
          (recent.trackingNumber && recent.trackingNumber.toUpperCase().includes(clean))
        ) {
          setSearchedOrder(recent);
          setIsSearching(false);
          return;
        }
      }
    } catch {
      // Ignore parse error
    }

    // 4. Try server orders API lookup
    try {
      const apiRes = await fetch(`/api/orders?id=${encodeURIComponent(clean)}`);
      if (apiRes.ok) {
        const orderData = await apiRes.json();
        if (orderData && orderData.id) {
          setSearchedOrder(orderData);
          setIsSearching(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API order search error:', err);
    }

    // 5. Try remote Supabase database lookup
    try {
      const remoteOrder = await fetchSupabaseOrderById(clean);
      if (remoteOrder) {
        setSearchedOrder(remoteOrder);
        setIsSearching(false);
        return;
      }
    } catch (err) {
      console.warn('Remote order search error:', err);
    }

    setIsSearching(false);
    setErrorMsg(`No active shipment found matching "${clean}". Please verify your Order ID from your confirmation email/SMS or reach out to our customer concierge.`);
    setSearchedOrder(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    findOrder(inputQuery);
  };

  const currentStageIndex = searchedOrder ? (STAGE_ORDER[searchedOrder.status] ?? 0) : 0;
  const isCancelled = searchedOrder?.status === 'Cancelled';
  const isReturnFlow = searchedOrder?.status?.startsWith('Return') || searchedOrder?.status?.startsWith('Refund');

  return (
    <div className="py-8 sm:py-12 bg-[#FFFFFF] min-h-screen animate-fadeIn pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-[#111111] text-[#FFFFFF] p-8 sm:p-12 rounded-3xl shadow-xl mb-8 relative overflow-hidden text-center sm:text-left border border-[#C5A15A]/30">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#C5A15A]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15A] font-bold block">
              Direct From Kuthampully Loom House
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Track Your Shipment
            </h1>
            <p className="text-xs sm:text-sm text-[#E5E7EB] font-light leading-relaxed">
              Enter your Order ID (e.g. <code className="bg-[#000000] px-2 py-0.5 rounded text-[#C5A15A]">KV-ORD-83921</code>) or Courier AWB Tracking Number to view live weaving &amp; logistics milestones.
            </p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5E7EB] rounded-3xl shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. KV-ORD-12345) or Tracking AWB..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111111] font-medium focus:outline-none focus:border-[#C5A15A] uppercase transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#111111] text-[#FFFFFF] hover:bg-[#C5A15A] hover:text-[#111111] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-[#C5A15A] shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Truck className="w-4 h-4 text-[#C5A15A]" />
              <span>{isSearching ? 'Verifying...' : 'Track Package'}</span>
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
          <div className="bg-white p-6 sm:p-10 border border-[#C5A15A] rounded-3xl shadow-xl space-y-8 animate-fadeIn">
            
            {/* Status Header Box */}
            <div className="bg-[#111111] text-[#FFFFFF] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-[#C5A15A]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A15A] tracking-widest block mb-0.5">
                  Shipment Status
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Order #{searchedOrder.id}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#E5E7EB] mt-1 font-mono">
                  <span>Courier: <strong className="text-white">{searchedOrder.courierProvider || 'Standard Express'}</strong></span>
                  {searchedOrder.trackingNumber && (
                    <>
                      <span>•</span>
                      <span>AWB: <strong className="text-[#C5A15A]">{searchedOrder.trackingNumber}</strong></span>
                    </>
                  )}
                  {searchedOrder.dispatchDate && (
                    <>
                      <span>•</span>
                      <span>Dispatched: <strong className="text-white">{new Date(searchedOrder.dispatchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong></span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {searchedOrder.trackingUrl && (
                  <a
                    href={searchedOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C5A15A] text-[#111111] hover:bg-[#D9BA78] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Courier Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <div className="text-left sm:text-right bg-[#000000] p-3 rounded-xl border border-[#C5A15A]/30">
                  <span className="text-[10px] uppercase text-[#C5A15A] block">Estimated Delivery</span>
                  <strong className="font-serif text-base text-[#FFFFFF]">
                    {searchedOrder.estimatedDelivery || POLICY_CONFIG.STANDARD_DELIVERY_TIME}
                  </strong>
                </div>
              </div>
            </div>

            {/* Special status warning if cancelled or return */}
            {isCancelled && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-2xl flex items-center gap-3 text-red-800 text-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <strong className="block font-bold">This order was cancelled</strong>
                  <p>If payment was captured, the refund will be credited back to your original source within 5–7 business days.</p>
                </div>
              </div>
            )}

            {isReturnFlow && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <strong className="block font-bold">Return Status: {searchedOrder.status}</strong>
                  <p>Your return request is being coordinated by our Kuthampully handloom care desk.</p>
                </div>
              </div>
            )}

            {/* Visual 8-Stage Progress Tracker */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#111111] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A15A]" />
                <span>Fulfillment Milestones</span>
              </h4>

              <div className="space-y-6 relative pl-6 sm:pl-8 border-l-2 border-[#C5A15A]/40 text-xs pt-2">
                {STANDARD_PIPELINE_STAGES.map((step, idx) => {
                  const isDone = !isCancelled && currentStageIndex >= idx;
                  const isCurrent = !isCancelled && currentStageIndex === idx;

                  return (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCurrent
                            ? 'bg-[#C5A15A] border-[#111111] text-[#111111] ring-4 ring-[#C5A15A]/30 shadow-md'
                            : isDone
                            ? 'bg-[#111111] border-[#C5A15A] text-[#C5A15A] shadow-xs'
                            : 'bg-white border-gray-300 text-gray-300'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h5
                            className={`font-serif text-sm sm:text-base font-bold ${
                              isCurrent
                                ? 'text-[#111111] font-black'
                                : isDone
                                ? 'text-[#111111]'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 text-[10px] bg-[#111111] text-[#C5A15A] px-2 py-0.5 rounded-full uppercase tracking-wider font-sans font-bold">
                                Current Milestone
                              </span>
                            )}
                          </h5>
                          <span className="text-[10px] text-[#6B7280] font-medium bg-[#FFFFFF] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                            Stage {idx + 1} of 8
                          </span>
                        </div>
                        <p className={`text-xs ${isDone ? 'text-[#6B7280]' : 'text-gray-400'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Activity Timeline / Staff Notes History */}
            {searchedOrder.timeline && searchedOrder.timeline.length > 0 && (
              <div className="pt-6 border-t border-[#E5E7EB] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#111111] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C5A15A]" />
                  <span>Verified Activity Trail</span>
                </h4>
                <div className="space-y-2 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E5E7EB]">
                  {searchedOrder.timeline.map((entry, tIdx) => (
                    <div key={tIdx} className="text-xs flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#E5E7EB]/60 last:border-0 gap-1">
                      <div>
                        <strong className="text-[#111111] font-semibold">
                          {entry.previousStatus ? `${entry.previousStatus} → ` : ''}{entry.newStatus}
                        </strong>
                        {entry.remarks && (
                          <p className="text-[#6B7280] text-[11px] italic mt-0.5">"{entry.remarks}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#6B7280] shrink-0 font-mono">
                        <Calendar className="w-3 h-3 text-[#C5A15A]" />
                        <span>{new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                        <span>•</span>
                        <span className="text-[#111111] font-medium">{entry.staffName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Destination & Package Contents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E7EB]">
              
              <div className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                  <MapPin className="w-4 h-4 text-[#C5A15A]" />
                  <span>Delivery Destination</span>
                </div>
                <p className="text-[#6B7280] leading-relaxed">
                  <strong className="text-[#111111]">{searchedOrder.shippingAddress.name}</strong><br />
                  {searchedOrder.shippingAddress.street}<br />
                  {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} - {searchedOrder.shippingAddress.pincode}<br />
                  Phone: {searchedOrder.shippingAddress.phone}
                </p>
              </div>

              <div className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                  <Package className="w-4 h-4 text-[#C5A15A]" />
                  <span>Package Contents</span>
                </div>
                <div className="divide-y divide-[#E5E7EB]">
                  {searchedOrder.items.map((it, i) => (
                    <div key={i} className="py-2 flex justify-between items-center">
                      <span className="font-semibold text-[#111111] line-clamp-1">{it.product.name} (x{it.quantity})</span>
                      <strong className="text-[#111111] shrink-0 ml-2">{formatPrice(it.price * it.quantity)}</strong>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-serif font-bold text-xs text-[#111111]">
                    <span>Total Paid:</span>
                    <span className="text-[#111111] font-bold text-sm">{formatPrice(searchedOrder.total)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Assistance Box */}
        <div className="mt-8 p-6 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111111] text-[#C5A15A] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-[#111111] block font-bold">Need Personal Logistics Support?</strong>
              <p className="text-[#6B7280]">Reach our Kuthampully Atelier logistics concierge desk at {POLICY_CONFIG.SUPPORT_PHONE}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/contact')}
            className="text-[#111111] hover:text-[#C5A15A] font-bold uppercase text-xs flex items-center gap-1.5 cursor-pointer bg-[#FFFFFF] px-4 py-2.5 rounded-xl border border-[#E5E7EB] transition-colors"
          >
            <span>Contact Concierge</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A15A]" />
          </button>
        </div>

      </div>
    </div>
  );
};
