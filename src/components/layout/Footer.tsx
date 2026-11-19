'use client';

import React, { useState } from 'react';
import { ShieldCheck, Truck, RefreshCw, Lock, Mail, Phone, MapPin, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
const logoImg = '/assets/logo.png';
import { POLICY_CONFIG } from '../../config/policyConfig';
import { useAdmin } from '../../context/AdminContext';

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
  const { storeContent } = useAdmin();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const contact = storeContent?.contactInfo;
  const atelierAddress = contact?.addressLine1 
    ? `${contact.addressLine1}${contact.addressLine2 ? ', ' + contact.addressLine2 : ''}` 
    : POLICY_CONFIG.ATELIER_ADDRESS.FULL;
  const supportPhone = contact?.phone || POLICY_CONFIG.SUPPORT_PHONE;
  const supportEmail = contact?.email || POLICY_CONFIG.SUPPORT_EMAIL;
  const visitingHours = contact?.visitingHoursLine1 || POLICY_CONFIG.WORKING_HOURS;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#46141D] text-[#F8F5EF] pt-16 pb-24 lg:pb-12 border-t-2 border-[#B99A61]/35">
      
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#B99A61]/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#641E2B] border border-[#B99A61]/50 flex items-center justify-center text-[#B99A61] shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#F8F5EF]">Kuthampully GI Certified</h4>
              <p className="text-xs text-[#F8F5EF]/80 mt-0.5">{POLICY_CONFIG.GI_TAG_REG_NO}.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#641E2B] border border-[#B99A61]/50 flex items-center justify-center text-[#B99A61] shrink-0 shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#F8F5EF]">Express Pan-India Delivery</h4>
              <p className="text-xs text-[#F8F5EF]/80 mt-0.5">Secure doorstep dispatch across India within 4–10 business days.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#641E2B] border border-[#B99A61]/50 flex items-center justify-center text-[#B99A61] shrink-0 shadow-sm">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#F8F5EF]">{POLICY_CONFIG.RETURN_WINDOW_DAYS}-Day Size Exchange</h4>
              <p className="text-xs text-[#F8F5EF]/80 mt-0.5">Complimentary doorstep exchange concierge for perfect fits.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#641E2B] border border-[#B99A61]/50 flex items-center justify-center text-[#B99A61] shrink-0 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#F8F5EF]">Razorpay Safe Payments</h4>
              <p className="text-xs text-[#F8F5EF]/80 mt-0.5">Instant UPI, Cards, and Net Banking with 256-bit SSL encryption.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block bg-[#F8F5EF] p-2.5 rounded-2xl shadow-md cursor-pointer" onClick={() => onNavigate('home')}>
              <img
                src={logoImg}
                alt="KAVISH - Authentic Kerala Handlooms"
                width="150"
                height="48"
                loading="lazy"
                decoding="async"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#F8F5EF]/85 leading-relaxed font-light">
              Crafted in Kuthampully, Thrissur. We preserve 500 years of royal Devanga weaving traditions, crafting premium Kasavu sarees, ceremonial mundus, and European linen for modern generations.
            </p>
            
            <div className="space-y-1.5 text-xs text-[#F8F5EF]/80 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                <span>{atelierAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                <span>{supportPhone} ({visitingHours})</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B99A61] shrink-0" />
                <a href={`mailto:${supportEmail}`} className="hover:text-[#B99A61] underline">
                  {supportEmail}
                </a>
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#641E2B] border border-[#B99A61]/40 flex items-center justify-center text-[#B99A61] hover:bg-[#B99A61] hover:text-[#641E2B] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#641E2B] border border-[#B99A61]/40 flex items-center justify-center text-[#B99A61] hover:bg-[#B99A61] hover:text-[#641E2B] transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-serif font-bold text-sm text-[#B99A61] tracking-wider uppercase">
              Handloom Collections
            </h5>
            <ul className="space-y-2 text-xs text-[#F8F5EF]/85">
              <li>
                <button onClick={() => onNavigate('women')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Kasavu Sarees
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('women')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Tissue Sarees &amp; Set Mundu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('men')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Men's Double Mundu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('men')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  European Linen Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kids')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Kids Festive Wear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bridal-festive')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Bridal &amp; Festive Edits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  All Garments
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-serif font-bold text-sm text-[#B99A61] tracking-wider uppercase">
              Concierge &amp; Story
            </h5>
            <ul className="space-y-2 text-xs text-[#F8F5EF]/85">
              <li>
                <button onClick={() => onNavigate('heritage')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  500-Year Kuthampully Legacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  About Kavish Atelier
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Handloom Craft Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Track Your Shipment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  My Orders &amp; Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Contact Atelier
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-serif font-bold text-sm text-[#B99A61] tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Atelier Newsletter</span>
            </h5>
            <p className="text-xs text-[#F8F5EF]/80 leading-relaxed font-light">
              Receive private invitations to limited pit-loom runs, seasonal Onam/Vishu collections, and textile care guides.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3 bg-[#641E2B] border border-[#B99A61]/50 rounded-xl flex items-center gap-2 text-xs text-[#F8F5EF]">
                <CheckCircle2 className="w-4 h-4 text-[#B99A61] shrink-0" />
                <span>Thank you. You are enrolled in the Kavish Atelier Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/10 border border-[#B99A61]/30 text-xs text-[#F8F5EF] placeholder-[#F8F5EF]/50 focus:outline-none focus:border-[#B99A61]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#B99A61] text-[#46141D] hover:bg-[#D1B784] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-[#F8F5EF]/60 block">
                  Complimentary express shipping benefit on your first order. Unsubscribe anytime.
                </span>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Legal & Policy Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#B99A61]/20 text-xs text-[#F8F5EF]/70 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} {POLICY_CONFIG.COMPANY_LEGAL_NAME}. All rights reserved. Handcrafted with reverence in Kuthampully, Kerala.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('shipping-policy')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
            Shipping Policy
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('return-refund-policy')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
            Return &amp; Refund Policy
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('terms-and-conditions')} className="hover:text-[#B99A61] transition-colors cursor-pointer">
            Terms &amp; Conditions
          </button>
        </div>
      </div>
    </footer>
  );
};
