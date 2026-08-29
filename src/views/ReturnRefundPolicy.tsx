import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Truck, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { POLICY_CONFIG } from '../config/policyConfig';

export const ReturnRefundPolicy: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-[#12372A] text-[#FAF8F1] p-8 sm:p-12 rounded-3xl shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              Patron Assurance &amp; Satisfaction
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Return &amp; Refund Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DDC7] font-light leading-relaxed">
              Hassle-Free {POLICY_CONFIG.RETURN_WINDOW_DAYS}-Day Doorstep Exchange &amp; Full Refund Guarantee
            </p>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">{POLICY_CONFIG.RETURN_WINDOW_DAYS}-Day Window</strong>
              <span className="text-[11px] text-[#6B5846]">From package delivery date</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">Doorstep Reverse Pickup</strong>
              <span className="text-[11px] text-[#6B5846]">Complimentary across India</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">{POLICY_CONFIG.REFUND_PROCESSING_DAYS}</strong>
              <span className="text-[11px] text-[#6B5846]">Back to original payment source</span>
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="bg-white p-6 sm:p-10 border border-[#E8DDC7] rounded-3xl shadow-xs space-y-8 text-xs sm:text-sm text-[#171717] leading-relaxed">
          
          {/* Section 1: Return Eligibility */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <RefreshCw className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">1. Return &amp; Exchange Eligibility</h2>
            </div>
            <p className="text-[#6B5846]">
              At Kavish, we take immense pride in crafting the finest Kerala Kasavu weaves and handlooms. If you are not completely satisfied with your order, you are welcome to initiate a return or size exchange within <strong>{POLICY_CONFIG.RETURN_WINDOW_DAYS} calendar days</strong> of receiving your package.
            </p>
            <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#E8DDC7] space-y-2">
              <strong className="text-[#12372A] block font-bold">Conditions for Valid Return:</strong>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-[#6B5846]">
                <li>Product must be unworn, unwashed, unaltered, and completely free of perfume, stains, or damage.</li>
                <li>Original brand tags, folding layout, and Kuthampully GI Tag seal must remain attached and intact.</li>
                <li>Must be returned in the original luxury Kavish gift box packaging along with the cotton preservation bag.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Damaged, Defective or Incorrect Items */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <AlertTriangle className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">2. Damaged, Defective or Wrong Item Received</h2>
            </div>
            <p className="text-[#6B5846]">
              Every parcel undergoes a multi-point quality check by our Kuthampully master weavers craft team prior to dispatch. In the unlikely event that you receive a damaged, defective, or incorrect piece:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-[#6B5846]">
              <li>Please notify our concierge within <strong>48 hours</strong> of delivery with clear photos or an unboxing video.</li>
              <li>We will arrange a priority express doorstep replacement with zero shipping charges, or initiate a 100% full refund including all taxes.</li>
            </ul>
          </section>

          {/* Section 3: Non-Returnable Items */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">3. Non-Returnable &amp; Customized Products</h2>
            </div>
            <p className="text-[#6B5846]">
              The following categories cannot be returned for customer preference:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-[#6B5846]">
              <li>Bespoke custom-stitched sarees (where blouse piece has been tailored to custom sizing).</li>
              <li>Customized bridal heritage sets woven with bespoke monograms or custom gold zari inscriptions.</li>
              <li>Items purchased during clearance/sample sales explicitly marked as "Final Sale".</li>
            </ul>
          </section>

          {/* Section 4: Return & Pickup Process */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">4. How to Initiate a Return or Exchange</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl text-center space-y-1.5">
                <span className="w-7 h-7 rounded-full bg-[#12372A] text-[#D4AF37] inline-flex items-center justify-center font-bold text-xs">1</span>
                <strong className="block text-[#12372A] text-xs">Contact Concierge</strong>
                <p className="text-[11px] text-[#6B5846]">Email <a href={`mailto:${POLICY_CONFIG.SUPPORT_EMAIL}`} className="underline font-semibold">{POLICY_CONFIG.SUPPORT_EMAIL}</a> or WhatsApp {POLICY_CONFIG.SUPPORT_PHONE} with your Order ID.</p>
              </div>

              <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl text-center space-y-1.5">
                <span className="w-7 h-7 rounded-full bg-[#12372A] text-[#D4AF37] inline-flex items-center justify-center font-bold text-xs">2</span>
                <strong className="block text-[#12372A] text-xs">Doorstep Pickup</strong>
                <p className="text-[11px] text-[#6B5846]">Our express logistics partner will collect the securely packed parcel from your address within 24–48 hours.</p>
              </div>

              <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl text-center space-y-1.5">
                <span className="w-7 h-7 rounded-full bg-[#12372A] text-[#D4AF37] inline-flex items-center justify-center font-bold text-xs">3</span>
                <strong className="block text-[#12372A] text-xs">Refund / Exchange</strong>
                <p className="text-[11px] text-[#6B5846]">Upon inspection at our atelier, replacement is dispatched or refund is credited within {POLICY_CONFIG.REFUND_PROCESSING_DAYS}.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Refund Timeline & Methods */}
          <section className="space-y-3 pt-4 border-t border-[#E8DDC7]">
            <div className="flex items-center gap-2 text-[#12372A]">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">5. Refund Processing Timelines</h2>
            </div>
            <p className="text-[#6B5846]">
              All approved refunds are credited back to the <strong>original source payment method</strong> used during Razorpay checkout:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-[#6B5846]">
              <li><strong>UPI (Google Pay, PhonePe, Paytm, BHIM):</strong> 24–48 hours from approval.</li>
              <li><strong>Credit / Debit Cards &amp; Net Banking:</strong> 5–7 business days depending on your issuing bank's settlement cycle.</li>
            </ul>
          </section>

          {/* Support CTA */}
          <div className="p-5 bg-[#12372A] text-[#FAF8F1] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif font-bold text-base text-[#D4AF37] flex items-center gap-2 justify-center sm:justify-start">
                <HelpCircle className="w-5 h-5" /> Need Assistance with a Return?
              </h4>
              <p className="text-xs text-[#E8DDC7]">Our dedicated atelier concierge team is available 6 days a week.</p>
            </div>
            <a
              href={`https://wa.me/${POLICY_CONFIG.WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#D4AF37] text-[#12372A] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors shadow-md whitespace-nowrap"
            >
              WhatsApp Concierge
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
