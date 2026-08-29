import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, RefreshCw, CreditCard, Award, MessageSquare } from 'lucide-react';
import { POLICY_CONFIG } from '../config/policyConfig';

interface FAQItem {
  question: string;
  answer: string;
  category: 'authenticity' | 'shipping' | 'returns' | 'payments' | 'sizing';
}

const FAQS: FAQItem[] = [
  // Authenticity & GI Tag
  {
    category: 'authenticity',
    question: 'Are all Kavish sarees and garments authentic Kuthampully handlooms?',
    answer: `Yes, 100%. Every piece crafted by Kavish is woven by master artisans in Kuthampully village, Thrissur, Kerala, and is certified under the Government of India Geographical Indication (${POLICY_CONFIG.GI_TAG_REG_NO}). Each item arrives with our official GI verification tag and hallmark seal.`
  },
  {
    category: 'authenticity',
    question: 'What makes Kuthampully Kasavu weaves unique compared to regular sarees?',
    answer: 'Kuthampully weaves feature high-twist, unbleached organic cotton warp combined with fine Kerala zari border motifs (temple designs, peacocks, traditional kasavu borders) woven on authentic manual pit-looms and frame-looms, preserving 500 years of royal Devanga weaving traditions.'
  },
  // Sizing & Customization
  {
    category: 'sizing',
    question: 'Do your sarees come with unstitched blouse fabric?',
    answer: 'Yes! All Kavish luxury Kasavu sarees include a matching running 0.8m to 1m unstitched blouse piece with matching gold/silver zari border trims, ready for custom tailoring.'
  },
  {
    category: 'sizing',
    question: 'How do I choose the correct size for men’s shirts and kids pattu pavadas?',
    answer: 'We provide an exact size guide table on every product page displaying chest, shoulder, waist, and length measurements in inches and centimeters. You can also contact our atelier concierge via WhatsApp for personalized fit recommendations.'
  },
  // Shipping & Tracking
  {
    category: 'shipping',
    question: 'How much does delivery cost and how long will it take?',
    answer: `Standard Express Delivery across India is flat ₹${POLICY_CONFIG.SHIPPING_CHARGE}. Orders are dispatched directly from our Kuthampully handloom atelier and delivered within 4–10 days (Inside India).`
  },
  {
    category: 'shipping',
    question: 'How do I track my order once it is shipped?',
    answer: 'Once your order is dispatched, an automated email and SMS notification containing your tracking number is sent. You can also enter your Order ID anytime on our Track Order page to view live parcel updates.'
  },
  // Returns & Exchanges
  {
    category: 'returns',
    question: 'What is your return and size exchange policy?',
    answer: `We offer a hassle-free ${POLICY_CONFIG.RETURN_WINDOW_DAYS}-day doorstep exchange and return window. If an item does not fit or meets any quality concerns, simply contact our concierge team for complimentary doorstep reverse pickup.`
  },
  {
    category: 'returns',
    question: 'How long does a refund take to reach my account?',
    answer: `Upon receiving and verifying the returned parcel at our atelier, refunds are processed within ${POLICY_CONFIG.REFUND_PROCESSING_DAYS} back to your original payment method (UPI: 24–48 hours; Cards/Net Banking: 5–7 business days).`
  },
  // Payments
  {
    category: 'payments',
    question: 'What online payment methods are accepted?',
    answer: 'We accept all major payment methods via Razorpay: Instant 1-click UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Credit/Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking across 50+ Indian banks, and digital wallets.'
  },
  {
    category: 'payments',
    question: 'Is it safe to pay online on Kavish?',
    answer: 'Absolutely. All transactions are protected by 256-bit bank-grade SSL encryption and PCI-DSS Level 1 certification. Kavish never stores or accesses your private payment credentials, card numbers, or UPI PINs.'
  }
];

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs =
    activeCategory === 'all' ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-[#12372A] text-[#FAF8F1] p-8 sm:p-12 rounded-3xl shadow-xl mb-10 relative overflow-hidden text-center sm:text-left">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              Atelier Knowledge Base
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DDC7] font-light leading-relaxed">
              Everything you need to know about our Kuthampully handlooms, ordering, express shipping, and seamless returns.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Questions', icon: HelpCircle },
            { id: 'authenticity', label: 'Authenticity & GI Tag', icon: Award },
            { id: 'sizing', label: 'Sizing & Customization', icon: ShieldCheck },
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
            { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
            { id: 'payments', label: 'Payments & Security', icon: CreditCard },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#12372A] text-[#D4AF37] border border-[#D4AF37] shadow-xs'
                    : 'bg-white text-[#6B5846] border border-[#E8DDC7] hover:border-[#D4AF37]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white p-6 sm:p-10 border border-[#E8DDC7] rounded-3xl shadow-xs space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all ${
                  isOpen ? 'border-[#12372A] bg-[#FAF8F1]' : 'border-[#E8DDC7] bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-bold text-[#12372A] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#6B5846] leading-relaxed border-t border-[#E8DDC7]/60 pt-3 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-10 p-6 sm:p-8 bg-[#12372A] text-[#FAF8F1] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37]">
              Still Have Questions?
            </h3>
            <p className="text-xs sm:text-sm text-[#E8DDC7]">
              Our Kerala handloom concierge is here to assist with custom draping, wedding sets, or delivery questions.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${POLICY_CONFIG.WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#D4AF37] text-[#12372A] px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2 shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat WhatsApp</span>
            </a>
            <a
              href="/contact"
              className="bg-transparent border border-white text-[#FAF8F1] px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-[#12372A] transition-colors"
            >
              Contact Atelier
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
