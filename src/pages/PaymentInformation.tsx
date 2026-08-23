import React from 'react';
import { CreditCard, Smartphone, ShieldCheck, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { POLICY_CONFIG } from '../config/policyConfig';

export const PaymentInformation: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-[#12372A] text-[#FAF8F1] p-8 sm:p-12 rounded-3xl shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              Security &amp; Banking Gateway
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Payment Information
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DDC7] font-light leading-relaxed">
              256-Bit SSL Bank-Grade Encryption • Instant UPI • Cards • Net Banking via Razorpay
            </p>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">PCI-DSS Level 1</strong>
              <span className="text-[11px] text-[#6B5846]">Highest banking grade security</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">Instant 1-Click UPI</strong>
              <span className="text-[11px] text-[#6B5846]">GPay, PhonePe, Paytm, BHIM</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DDC7] flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#12372A]">Zero Extra Surcharges</strong>
              <span className="text-[11px] text-[#6B5846]">Transparent checkout pricing</span>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="bg-white p-6 sm:p-10 border border-[#E8DDC7] rounded-3xl shadow-xs space-y-8 text-xs sm:text-sm text-[#171717] leading-relaxed">
          
          {/* Section 1: Accepted Payment Methods */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <CreditCard className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">1. Accepted Payment Methods</h2>
            </div>
            <p className="text-[#6B5846]">
              Kavish partners with <strong>Razorpay</strong>, India's leading payment gateway, to offer a frictionless and ultra-secure checkout experience. We support all major online payment instruments:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#12372A] font-bold">
                  <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                  <span>Unified Payments Interface (UPI)</span>
                </div>
                <p className="text-xs text-[#6B5846]">
                  Pay seamlessly using Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay UPI, or any bank UPI application. Instant confirmation with zero processing fees.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#12372A] font-bold">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  <span>Credit &amp; Debit Cards</span>
                </div>
                <p className="text-xs text-[#6B5846]">
                  Visa, MasterCard, RuPay, American Express, and Diners Club issued by Indian and select international financial institutions. 3D-Secure OTP verification enabled.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#12372A] font-bold">
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Net Banking (50+ Banks)</span>
                </div>
                <p className="text-xs text-[#6B5846]">
                  Direct internet banking supported across SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra, Federal Bank, Canara Bank, and all scheduled Indian banks.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#12372A] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Digital Wallets</span>
                </div>
                <p className="text-xs text-[#6B5846]">
                  Mobikwik, Freecharge, Airtel Money, and other digital wallet balances supported through the Razorpay gateway popup.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Cash on Delivery Note */}
          <section className="space-y-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 space-y-1.5">
              <strong className="font-bold flex items-center gap-2 text-amber-900 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Note on Cash on Delivery (COD)
              </strong>
              <p className="text-xs text-amber-900 leading-relaxed">
                To protect the handcrafted authenticity of our GI-certified Kuthampully weaves and minimize fraudulent transit returns, Kavish currently operates on an <strong>online-first payment model</strong>. Cash on Delivery is not active at this time.
              </p>
            </div>
          </section>

          {/* Section 3: Payment Security & Non-Storage Policy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#12372A]">
              <Lock className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">2. Payment Security &amp; Tokenization</h2>
            </div>
            <p className="text-[#6B5846]">
              Your financial security is our highest priority. All transactions are routed through Razorpay's RBI-compliant and PCI-DSS Level 1 certified servers. Kavish never stores, reads, or transmits your card CVVs, pins, or passwords.
            </p>
          </section>

          {/* Section 4: Payment Troubleshooting & Failed Transactions */}
          <section className="space-y-3 pt-4 border-t border-[#E8DDC7]">
            <div className="flex items-center gap-2 text-[#12372A]">
              <RefreshCw className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <h2 className="font-serif text-lg sm:text-xl font-bold">3. Payment Troubleshooting &amp; Pending Payments</h2>
            </div>
            <p className="text-[#6B5846]">
              If your bank account was debited but the order confirmation screen did not appear:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-[#6B5846]">
              <li><strong>Pending Reconciliation:</strong> In rare cases of network timeout, banks take up to 15–30 minutes to confirm the transaction status to Razorpay.</li>
              <li><strong>Automatic Order Creation:</strong> Once Razorpay receives confirmation, our system automatically finalizes your order and dispatches your confirmation email.</li>
              <li><strong>Automatic Bank Reversal:</strong> If the transaction is declined by your bank after deduction, the entire amount is automatically reversed to your bank account within 3–5 business days as per RBI regulations.</li>
            </ul>
          </section>

          {/* Concierge Box */}
          <div className="p-5 bg-[#FAF8F1] border border-[#E8DDC7] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <strong className="text-[#12372A] font-bold block mb-0.5">Experienced a Payment Issue?</strong>
              <p className="text-xs text-[#6B5846]">Send your transaction reference ID to our payment concierge for immediate reconciliation.</p>
            </div>
            <a
              href={`mailto:${POLICY_CONFIG.SUPPORT_EMAIL}?subject=Payment%20Reconciliation%20Query`}
              className="bg-[#12372A] text-[#FAF8F1] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#12372A] transition-all shadow-xs whitespace-nowrap"
            >
              Email Payment Desk
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
