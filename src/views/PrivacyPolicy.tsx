'use client';

import React from 'react';
import { ShieldCheck, Lock, Eye, Server, RefreshCw, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { POLICY_CONFIG } from '../config/policyConfig';
import { useAdmin } from '../context/AdminContext';

export const PrivacyPolicy: React.FC = () => {
  const { storeContent } = useAdmin();
  const contact = storeContent?.contactInfo;
  const atelierAddress = contact?.addressLine1
    ? `${contact.addressLine1}${contact.addressLine2 ? ', ' + contact.addressLine2 : ''}`
    : POLICY_CONFIG.ATELIER_ADDRESS.FULL;
  const conciergeEmail = contact?.email || POLICY_CONFIG.SUPPORT_EMAIL;
  const conciergePhone = contact?.phone || POLICY_CONFIG.SUPPORT_PHONE;
  const workingHours = contact?.visitingHoursLine1 || POLICY_CONFIG.WORKING_HOURS;

  return (
    <div className="py-8 sm:py-12 bg-[#F8F5EF] min-h-screen animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header Banner */}
        <div className="bg-[#641E2B] text-[#F8F5EF] p-8 sm:p-12 rounded-3xl shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#B99A61]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B99A61] font-bold block">
              Legal &amp; Data Protection
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DFD0] font-light leading-relaxed">
              Last Updated: August 2026 • Effective Date: Immediate
            </p>
          </div>
        </div>

        {/* Introduction Card */}
        <div className="bg-white p-6 sm:p-10 border border-[#E8DFD0] rounded-3xl shadow-xs space-y-8 text-xs sm:text-sm text-[#292522] leading-relaxed">
          
          <div className="p-4 sm:p-6 bg-[#F8F5EF] border-l-4 border-[#B99A61] rounded-xl text-[#641E2B] text-xs sm:text-sm leading-relaxed">
            <p>
              Welcome to <strong>{POLICY_CONFIG.COMPANY_LEGAL_NAME}</strong> (operating as <strong>"{POLICY_CONFIG.BRAND_NAME}"</strong>). We are committed to safeguarding the personal privacy of our patrons, clients, and website visitors. This Privacy Policy details how we collect, process, manage, and protect your information when you visit or make a purchase from our atelier at <a href="https://kavish.xenotrix.in" className="text-[#641E2B] underline font-semibold">kavish.xenotrix.in</a>.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#641E2B]">
              <Eye className="w-5 h-5 text-[#B99A61] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">1. Information We Collect</h2>
            </div>
            <p className="text-[#6E685D]">
              To fulfill your bespoke handloom orders and deliver a seamless luxury shopping experience, we collect the following categories of information:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-[#6E685D]">
              <li><strong className="text-[#641E2B]">Personal &amp; Contact Identifiers:</strong> Your full name, email address, contact telephone/mobile number.</li>
              <li><strong className="text-[#641E2B]">Shipping &amp; Billing Coordinates:</strong> Full delivery address, city, state, postal PIN code, and landmark instructions.</li>
              <li><strong className="text-[#641E2B]">Transactional Details:</strong> Products selected, chosen sizes/measurements, order numbers, invoice identifiers, and order history.</li>
              <li><strong className="text-[#641E2B]">Device &amp; Usage Information:</strong> IP address, browser type, operating system, pages viewed, and session timestamps (collected via privacy-respecting cookies to maintain your shopping cart state).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#641E2B]">
              <Lock className="w-5 h-5 text-[#B99A61] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">2. Payment Gateway &amp; Card Information Disclosures</h2>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950">
              <strong className="block font-bold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Zero Sensitive Payment Storage by Kavish
              </strong>
              <p className="text-xs text-emerald-900 leading-relaxed">
                <strong>Kavish does NOT store, capture, or have access to your Credit/Debit Card numbers, CVV codes, Net Banking passwords, or UPI PINs.</strong> All online payments are securely processed through our PCI-DSS Level 1 certified payment gateway partner, <strong>Razorpay</strong>, utilizing 256-bit bank-grade SSL encryption.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#641E2B]">
              <Server className="w-5 h-5 text-[#B99A61] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">3. How We Use Your Information</h2>
            </div>
            <p className="text-[#6E685D]">We use your personal information exclusively for legitimate business purposes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#F8F5EF] border border-[#E8DFD0] rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#641E2B] block">Order Fulfillment &amp; Dispatch</strong>
                  <span className="text-xs text-[#6E685D]">Weaving, hand-packing, tax invoicing, and logistics hand-off.</span>
                </div>
              </div>
              <div className="p-3.5 bg-[#F8F5EF] border border-[#E8DFD0] rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#641E2B] block">Transactional Communications</strong>
                  <span className="text-xs text-[#6E685D]">Sending order confirmations, invoice copies, and real-time courier AWB tracking.</span>
                </div>
              </div>
              <div className="p-3.5 bg-[#F8F5EF] border border-[#E8DFD0] rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#641E2B] block">Atelier Concierge &amp; Support</strong>
                  <span className="text-xs text-[#6E685D]">Resolving size consultations, bespoke bridal queries, and exchange requests.</span>
                </div>
              </div>
              <div className="p-3.5 bg-[#F8F5EF] border border-[#E8DFD0] rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#641E2B] block">Fraud Prevention &amp; Security</strong>
                  <span className="text-xs text-[#6E685D]">Guarding against duplicate transactions, fraudulent chargebacks, and system misuse.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#641E2B]">
              <ShieldCheck className="w-5 h-5 text-[#B99A61] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">4. Data Sharing &amp; Trusted Service Partners</h2>
            </div>
            <p className="text-[#6E685D]">
              We do not sell, rent, or trade your personal information. We share relevant data solely with essential service partners strictly for order execution:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-[#6E685D]">
              <li><strong className="text-[#641E2B]">Payment Gateway Providers:</strong> Razorpay Software Private Limited for secure payment authentication.</li>
              <li><strong className="text-[#641E2B]">Logistics Partners:</strong> Express pan-India delivery partners strictly for safe doorstep dispatch of your parcel.</li>
              <li><strong className="text-[#641E2B]">Database &amp; Cloud Infrastructure:</strong> Supabase (PostgreSQL) and Vercel for encrypted data hosting and serverless computing.</li>
              <li><strong className="text-[#641E2B]">Legal Compliance:</strong> Government authorities or taxation bodies only when mandated under applicable Indian laws.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#641E2B]">
              <RefreshCw className="w-5 h-5 text-[#B99A61] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">5. Data Retention &amp; Customer Rights</h2>
            </div>
            <p className="text-[#6E685D]">
              We retain transaction and invoice data for the statutory period required under Indian taxation and GST regulations. You have the right to request access to, correction of, or deletion of your saved customer profile information at any time by reaching out to our concierge team.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-[#E8DFD0]">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#641E2B]">6. Grievance Officer &amp; Contact Information</h2>
            <p className="text-[#6E685D]">
              In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, please contact our designated Grievance Concierge for any privacy-related questions:
            </p>
            <div className="bg-[#F8F5EF] p-5 rounded-2xl border border-[#E8DFD0] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B99A61]" />
                <span><strong>Atelier Address:</strong> {atelierAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B99A61]" />
                <span><strong>Concierge Email:</strong> <a href={`mailto:${conciergeEmail}`} className="underline text-[#641E2B] font-semibold">{conciergeEmail}</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B99A61]" />
                <span><strong>Direct Phone / WhatsApp:</strong> {conciergePhone} ({workingHours})</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
