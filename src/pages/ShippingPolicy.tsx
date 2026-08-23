import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, Gift, AlertCircle, PackageCheck } from 'lucide-react';
import { POLICY_CONFIG } from '../config/policyConfig';

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-[#12372A] text-[#FAF8F1] p-8 sm:p-12 rounded-3xl shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              Pan-India Logistics &amp; Delivery
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DDC7] font-light leading-relaxed">
              Complimentary Express Air Courier for all orders over ₹{POLICY_CONFIG.FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">Dispatch: {POLICY_CONFIG.PROCESSING_TIME}</strong>
              <span className="text-[11px] text-[#6B5846]">Direct from Kuthampully loom</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">Delivery: {POLICY_CONFIG.STANDARD_DELIVERY_TIME}</strong>
              <span className="text-[11px] text-[#6B5846]">Via BlueDart &amp; Delhivery Air</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">Free Shipping &gt; ₹{POLICY_CONFIG.FREE_SHIPPING_THRESHOLD}</strong>
              <span className="text-[11px] text-[#6B5846]">No hidden delivery surcharges</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white p-6 sm:p-10 border border-[#E8DDC7] rounded-3xl shadow-xs space-y-8 text-xs sm:text-sm text-[#171717] leading-relaxed">
          
          {/* Section 1: Coverage */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">1. Delivery Locations &amp; Pan-India Coverage</h2>
            </div>
            <p className="text-[#6B5846]">
              Kavish delivers to over <strong>27,000+ PIN codes across all 28 states and 8 union territories</strong> in India. We partner exclusively with top-tier express courier services including <strong>{POLICY_CONFIG.EXPRESS_COURIER_PARTNERS.join(', ')}</strong> to guarantee prompt and tamper-proof delivery.
            </p>
          </section>

          {/* Section 2: Rates and Thresholds */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">2. Shipping Charges &amp; Free Delivery Threshold</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-[#E8DDC7] text-xs">
                <thead>
                  <tr className="bg-[#FAF8F1] text-[#12372A]">
                    <th className="p-3 border border-[#E8DDC7] font-bold">Order Value</th>
                    <th className="p-3 border border-[#E8DDC7] font-bold">Courier Tier</th>
                    <th className="p-3 border border-[#E8DDC7] font-bold">Shipping Fee</th>
                    <th className="p-3 border border-[#E8DDC7] font-bold">Estimated Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDC7] text-[#6B5846]">
                  <tr>
                    <td className="p-3 border border-[#E8DDC7] font-semibold text-[#12372A]">₹{POLICY_CONFIG.FREE_SHIPPING_THRESHOLD} and above</td>
                    <td className="p-3 border border-[#E8DDC7]">BlueDart Express Air / Delhivery Priority</td>
                    <td className="p-3 border border-[#E8DDC7] font-bold text-green-700">FREE (Complimentary)</td>
                    <td className="p-3 border border-[#E8DDC7]">2–4 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#E8DDC7] font-semibold text-[#12372A]">Under ₹{POLICY_CONFIG.FREE_SHIPPING_THRESHOLD}</td>
                    <td className="p-3 border border-[#E8DDC7]">Standard Express Surface / Air</td>
                    <td className="p-3 border border-[#E8DDC7] font-bold">₹{POLICY_CONFIG.SHIPPING_CHARGE} flat fee</td>
                    <td className="p-3 border border-[#E8DDC7]">3–6 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Packaging & GI Seal Protection */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <PackageCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">3. Luxury Handloom Packaging &amp; GI Tag Protection</h2>
            </div>
            <p className="text-[#6B5846]">
              Each handloom saree and garment is wrapped in breathable archival butter-paper, sealed with our authentic Kuthampully GI certification tag, and presented inside a rigid gold-embossed Kavish keepsake atelier box. All packages are encased in waterproof outer courier polybags with tamper-evident security tape.
            </p>
          </section>

          {/* Section 4: Real-Time Tracking */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">4. Real-Time Order Tracking &amp; Notifications</h2>
            </div>
            <p className="text-[#6B5846]">
              As soon as your parcel is handed over to the courier partner, an automated dispatch notification containing your unique <strong>AWB Tracking Number</strong> is sent via email and SMS. You can also track your live parcel milestones anytime on our dedicated <a href="/track-order" className="text-[#12372A] underline font-semibold">Track Order</a> page.
            </p>
          </section>

          {/* Section 5: Undelivered & RTO Shipments */}
          <section className="space-y-3 pt-4 border-t border-[#E8DDC7]">
            <div className="flex items-center gap-2 text-[#12372A]">
              <AlertCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">5. Failed Deliveries &amp; Address Issues</h2>
            </div>
            <p className="text-[#6B5846]">
              Our courier partners attempt delivery up to <strong>3 times</strong>. If delivery fails due to an incorrect address or customer unavailability, our concierge team will reach out to coordinate re-dispatch. If the shipment returns to our origin atelier (RTO), we will re-attempt delivery upon receiving updated instructions.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
