import React from 'react';
import { FileText, Award, Truck, RefreshCw, AlertCircle, Scale, Mail } from 'lucide-react';
import { POLICY_CONFIG } from '../config/policyConfig';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-[#12372A] text-[#FAF8F1] p-8 sm:p-12 rounded-3xl shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              Legal Agreement &amp; Store Terms
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DDC7] font-light leading-relaxed">
              Applicable to all purchases and interactions on <strong className="text-[#FAF8F1]">kavish.xenotrix.in</strong>
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white p-6 sm:p-10 border border-[#E8DDC7] rounded-3xl shadow-xs space-y-8 text-xs sm:text-sm text-[#171717] leading-relaxed">
          
          <div className="p-4 sm:p-6 bg-[#FAF8F1] border-l-4 border-[#D4AF37] rounded-xl text-[#12372A]">
            <p>
              These Terms and Conditions ("Terms") govern your use of the website operated by <strong>{POLICY_CONFIG.COMPANY_LEGAL_NAME}</strong> (<strong>"{POLICY_CONFIG.BRAND_NAME}"</strong>, "we", "us", or "our") and the purchase of our certified handloom sarees, set mundus, shirts, and bespoke heritage garments. By accessing our platform or placing an order, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Section 1: Website Usage & Eligibility */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <FileText className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">1. Website Usage &amp; Eligibility</h2>
            </div>
            <p className="text-[#6B5846]">
              By using this website, you confirm that you are at least 18 years of age or accessing under the supervision of a parent or legal guardian. You agree to provide accurate, complete, and truthful information during checkout and account registration.
            </p>
          </section>

          {/* Section 2: Authentic Handloom Nature & Product Variations */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">2. Authentic Handloom Craftsmanship &amp; GI Tag Characteristics</h2>
            </div>
            <p className="text-[#6B5846]">
              All Kavish creations are authentic handloom pieces, certified under the <strong>{POLICY_CONFIG.GI_TAG_REG_NO}</strong>. Due to the traditional pit-loom and frame-loom weaving techniques:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-[#6B5846]">
              <li>Subtle variations in zari texture, weave density, and natural yarn slubs are natural hallmarks of authentic handcrafting and are not considered manufacturing defects.</li>
              <li>Product imagery is captured under controlled studio lighting; minor color variations may occur depending on individual screen calibration and display panels.</li>
            </ul>
          </section>

          {/* Section 3: Pricing, Taxes & Orders */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <Scale className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">3. Pricing, Taxes (GST) &amp; Order Acceptance</h2>
            </div>
            <p className="text-[#6B5846]">
              {POLICY_CONFIG.TAX_DISCLOSURE} All prices are denominated in Indian Rupees (INR) and foreign currency equivalents are dynamically estimated for patron convenience. An order is deemed accepted once the payment is verified by our server and a unique Order Reference ID (e.g., <code>KV-ORD-XXXXX</code>) and Tax Invoice are generated.
            </p>
            <p className="text-[#6B5846]">
              We reserve the right to decline or cancel an order in rare instances of technical pricing errors, unauthorized coupon manipulation, or severe stock unavailability. In such instances, 100% of the paid amount will be refunded immediately.
            </p>
          </section>

          {/* Section 4: Payment Terms */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <AlertCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">4. Payment Processing &amp; Verification</h2>
            </div>
            <p className="text-[#6B5846]">
              We accept online payments through Razorpay (UPI, Credit/Debit Cards, Net Banking). You agree not to perform fraudulent transactions, use stolen payment instruments, or attempt duplicate checkouts. All payments undergo cryptographic server-side signature verification before order finalization.
            </p>
          </section>

          {/* Section 5: Shipping, Delivery & Tracking */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">5. Shipping &amp; Delivery Terms</h2>
            </div>
            <p className="text-[#6B5846]">
              Orders are dispatched within <strong>{POLICY_CONFIG.PROCESSING_TIME}</strong> via our express air courier partners ({POLICY_CONFIG.EXPRESS_COURIER_PARTNERS.join(', ')}). Complimentary delivery applies to orders above <strong>₹{POLICY_CONFIG.FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}</strong>. Risk of loss passes to the patron upon verified doorstep handover by the courier agent.
            </p>
          </section>

          {/* Section 6: Returns, Exchanges & Refunds */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <RefreshCw className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">6. Returns, Exchanges &amp; Refunds</h2>
            </div>
            <p className="text-[#6B5846]">
              We offer a dedicated <strong>{POLICY_CONFIG.RETURN_WINDOW_DAYS}-day return &amp; size exchange window</strong> from the date of package delivery. Returned products must be unused, unwashed, in original condition with all tags and GI seals intact. Full terms are detailed on our <a href="/return-refund-policy" className="text-[#12372A] underline font-semibold">Return &amp; Refund Policy</a> page.
            </p>
          </section>

          {/* Section 7: Intellectual Property */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <FileText className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">7. Intellectual Property &amp; Brand Rights</h2>
            </div>
            <p className="text-[#6B5846]">
              The name "KAVISH", our bespoke logo, product photography, editorial stories, motifs, and website design are exclusive intellectual property of {POLICY_CONFIG.COMPANY_LEGAL_NAME}. Any unauthorized reproduction, scraping, or commercial exploitation is strictly prohibited under Indian copyright and trademark statutes.
            </p>
          </section>

          {/* Section 8: Governing Law & Jurisdiction */}
          <section className="space-y-3 pt-4 border-t border-[#E8DDC7]">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#12372A]">8. Governing Law &amp; Dispute Resolution</h2>
            <p className="text-[#6B5846]">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal disputes arising in relation to these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Thrissur, Kerala, India</strong>.
            </p>
            <div className="bg-[#FAF8F1] p-4 rounded-xl border border-[#E8DDC7] text-xs flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>For legal inquiries, contact: <a href={`mailto:${POLICY_CONFIG.SUPPORT_EMAIL}`} className="underline font-bold text-[#12372A]">{POLICY_CONFIG.SUPPORT_EMAIL}</a></span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
