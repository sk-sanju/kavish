import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Lock, Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useCurrency } from '../../context/CurrencyContext';
import { POLICY_CONFIG } from '../../config/policyConfig';

interface FooterProps {
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { formatPrice } = useCurrency();

  return (
    <footer className="bg-[#12372A] text-[#FAF8F1] pt-16 pb-24 lg:pb-12 border-t-2 border-[#D4AF37]/30">
      
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#FAF8F1]">Kuthampully GI Certified</h4>
              <p className="text-xs text-[#E8DDC7]/80 mt-0.5">{POLICY_CONFIG.GI_TAG_REG_NO}.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#FAF8F1]">Complimentary Express Delivery</h4>
              <p className="text-xs text-[#E8DDC7]/80 mt-0.5">Free BlueDart Air shipping across India over {formatPrice(POLICY_CONFIG.FREE_SHIPPING_THRESHOLD)}.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#FAF8F1]">{POLICY_CONFIG.RETURN_WINDOW_DAYS}-Day Size Exchange</h4>
              <p className="text-xs text-[#E8DDC7]/80 mt-0.5">Complimentary doorstep exchange concierge for perfect fits.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#FAF8F1]">Razorpay Safe Payments</h4>
              <p className="text-xs text-[#E8DDC7]/80 mt-0.5">Instant UPI, Cards, and Net Banking with 256-bit SSL encryption.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block bg-[#FAF8F1] p-2.5 rounded-2xl shadow-md cursor-pointer" onClick={() => onNavigate('home')}>
              <img
                src={logoImg}
                alt="KAVISH - Kerala Ethnic Wear"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#E8DDC7]/90 leading-relaxed font-light">
              Crafted in Kuthampully, Thrissur. We preserve 500 years of royal Devanga weaving traditions, crafting premium Kasavu sarees, set mundus, and European linen for modern generations.
            </p>
            
            <div className="space-y-1.5 text-xs text-[#E8DDC7]/80 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{POLICY_CONFIG.ATELIER_ADDRESS.FULL}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{POLICY_CONFIG.SUPPORT_PHONE} ({POLICY_CONFIG.WORKING_HOURS})</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${POLICY_CONFIG.SUPPORT_EMAIL}`} className="hover:text-[#D4AF37] underline">
                  {POLICY_CONFIG.SUPPORT_EMAIL}
                </a>
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Section 1: Store Departments */}
          <div className="lg:col-span-2 space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Handloom Collections
            </h4>
            <ul className="space-y-2 text-[#E8DDC7]/80">
              <li>
                <button onClick={() => onNavigate('shop', 'women')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Women’s Kasavu Sarees
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'men')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Men’s Double Mundu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'kids')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Kids Pattu Pavada
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', undefined, 'kasavu-masterpieces')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  24k Gold Zari Edit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', undefined, 'everyday-kerala')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Organic Flax Linen
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  All Products
                </button>
              </li>
            </ul>
          </div>

          {/* Section 2: Customer Support */}
          <div className="lg:col-span-3 space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-[#E8DDC7]/80">
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Contact Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Track Delivery Package
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shipping-policy')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Shipping &amp; Delivery Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('return-refund-policy')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Return &amp; Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  My Account &amp; Order History
                </button>
              </li>
            </ul>
          </div>

          {/* Section 3: Legal & Security */}
          <div className="lg:col-span-3 space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Legal &amp; Security
            </h4>
            <ul className="space-y-2 text-[#E8DDC7]/80">
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms-and-conditions')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('payment-information')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  Payment Security &amp; Gateways
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('heritage')} className="hover:text-[#D4AF37] cursor-pointer text-left">
                  The 500-Year Kuthampully Heritage
                </button>
              </li>
            </ul>

            {/* Razorpay Verified Badge */}
            <div className="pt-2">
              <a
                href={POLICY_CONFIG.RAZORPAY_PORTAL_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#0B241B] border border-[#D4AF37]/50 px-3.5 py-2 rounded-xl text-[11px] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Verified Razorpay Merchant</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Location */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E8DDC7]/70 gap-3">
        <p>© 2026 {POLICY_CONFIG.COMPANY_LEGAL_NAME} All rights reserved.</p>
        <p className="flex items-center gap-2 font-mono text-[10px]">
          <span>{POLICY_CONFIG.GI_TAG_REG_NO}</span> • <span>Made in India</span>
        </p>
      </div>

    </footer>
  );
};
