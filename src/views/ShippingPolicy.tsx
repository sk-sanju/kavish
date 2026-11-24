'use client';

import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, Gift, AlertCircle, PackageCheck, Phone, Mail } from 'lucide-react';
import { POLICY_CONFIG } from '../config/policyConfig';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

export const ShippingPolicy: React.FC = () => {
  const { shippingConfig } = useCart();
  const { storeContent } = useAdmin();

  const standardRate = shippingConfig?.standardFlatRate ?? POLICY_CONFIG.SHIPPING_CHARGE;
  const freeThreshold = shippingConfig?.freeShippingThreshold ?? POLICY_CONFIG.FREE_SHIPPING_THRESHOLD;
  const contact = storeContent?.contactInfo;

  const rateDisplayText = standardRate === 0 
    ? 'Complimentary Free Delivery' 
    : `Flat ₹${standardRate} Shipping Charge`;

  const thresholdNote = freeThreshold > 0
    ? ` (Free on orders above ₹${freeThreshold})`
    : standardRate === 0
      ? ' (100% Free on all orders)'
      : '';

  return (
    <div className="py-8 sm:py-12 bg-[#FFFFFF] min-h-screen animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-[#111111] text-[#FFFFFF] p-8 sm:p-12 rounded-3xl shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#C5A15A]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15A] font-bold block">
              Pan-India Logistics &amp; Delivery
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#E5E7EB] font-light leading-relaxed">
              Standard Express Delivery across India (4–10 days) | {rateDisplayText}{thresholdNote}
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#111111] border border-[#C5A15A] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#C5A15A]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#111111]">Dispatch: {POLICY_CONFIG.PROCESSING_TIME}</strong>
              <span className="text-[11px] text-[#6B7280]">Direct from Kuthampully loom</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#111111] border border-[#C5A15A] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#C5A15A]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#111111]">Delivery: {POLICY_CONFIG.STANDARD_DELIVERY_TIME}</strong>
              <span className="text-[11px] text-[#6B7280]">Pan-India Express Delivery</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#111111] border border-[#C5A15A] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#C5A15A]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#111111]">
                Shipping: {standardRate === 0 ? 'Free' : `₹${standardRate}`}
              </strong>
              <span className="text-[11px] text-[#6B7280]">
                {freeThreshold > 0 ? `Free over ₹${freeThreshold}` : 'Across India'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white p-6 sm:p-10 border border-[#E5E7EB] rounded-3xl shadow-xs space-y-8 text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
          
          {/* Section 1: Coverage */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#111111]">
              <MapPin className="w-5 h-5 text-[#C5A15A] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">1. Delivery Locations &amp; Pan-India Coverage</h2>
            </div>
            <p className="text-[#6B7280]">
              Kavish delivers across all PIN codes in India. Every handloom piece is safely dispatched from our Kuthampully loom atelier to ensure timely and tamper-proof delivery within <strong>4–10 days (Inside India)</strong>.
            </p>
          </section>

          {/* Section 2: Rates and Thresholds */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#111111]">
              <Truck className="w-5 h-5 text-[#C5A15A] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">2. Shipping Charges &amp; Timeline</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-[#E5E7EB] text-xs">
                <thead>
                  <tr className="bg-[#FFFFFF] text-[#111111]">
                    <th className="p-3 border border-[#E5E7EB] font-bold">Coverage</th>
                    <th className="p-3 border border-[#E5E7EB] font-bold">Delivery Tier</th>
                    <th className="p-3 border border-[#E5E7EB] font-bold">Shipping Fee</th>
                    <th className="p-3 border border-[#E5E7EB] font-bold">Delivery Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#6B7280]">
                  <tr>
                    <td className="p-3 border border-[#E5E7EB] font-semibold text-[#111111]">Inside India (All States)</td>
                    <td className="p-3 border border-[#E5E7EB]">Standard Express Handloom Delivery</td>
                    <td className="p-3 border border-[#E5E7EB] font-bold text-[#111111]">
                      {standardRate === 0 ? 'FREE' : `₹${standardRate}`}
                      {freeThreshold > 0 && (
                        <span className="block text-[11px] font-normal text-emerald-700">
                          (Complimentary on orders ≥ ₹{freeThreshold})
                        </span>
                      )}
                    </td>
                    <td className="p-3 border border-[#E5E7EB]">4–10 Days (Inside India)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Packaging & Seal Protection */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#111111]">
              <PackageCheck className="w-5 h-5 text-[#C5A15A] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">3. Luxury Handloom Packaging &amp; Fabric Protection</h2>
            </div>
            <p className="text-[#6B7280]">
              Each handloom saree and garment is wrapped in breathable archival butter-paper, sealed with our authentic Kuthampully handloom hallmark seal, and presented inside a rigid gold-embossed Kavish keepsake atelier box. All packages are encased in waterproof outer polybags with tamper-evident security tape.
            </p>
          </section>

          {/* Section 4: Real-Time Tracking */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#111111]">
              <ShieldCheck className="w-5 h-5 text-[#C5A15A] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">4. Real-Time Order Tracking &amp; Notifications</h2>
            </div>
            <p className="text-[#6B7280]">
              As soon as your parcel is dispatched, an automated dispatch notification containing your unique <strong>Tracking Number</strong> is sent via email and SMS. You can also track your live parcel milestones anytime on our dedicated <a href="/track-order" className="text-[#111111] underline font-semibold">Track Order</a> page.
            </p>
          </section>

          {/* Section 5: Undelivered & RTO Shipments */}
          <section className="space-y-3 pt-4 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-[#111111]">
              <AlertCircle className="w-5 h-5 text-[#C5A15A] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">5. Failed Deliveries &amp; Address Issues</h2>
            </div>
            <p className="text-[#6B7280]">
              Delivery attempts will be made to your designated address. If delivery fails due to an incorrect address or customer unavailability, our concierge team will reach out to coordinate re-dispatch.
            </p>
            <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E5E7EB] text-xs flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A15A]" />
                <span>Concierge: <strong>{contact?.phone || POLICY_CONFIG.SUPPORT_PHONE}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A15A]" />
                <span>Email: <a href={`mailto:${contact?.email || POLICY_CONFIG.SUPPORT_EMAIL}`} className="underline text-[#111111] font-semibold">{contact?.email || POLICY_CONFIG.SUPPORT_EMAIL}</a></span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
