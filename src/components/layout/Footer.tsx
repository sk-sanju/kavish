'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  Banknote,
  Check
} from 'lucide-react';
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

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
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
  const whatsappNumber = contact?.whatsappNumber || POLICY_CONFIG.WHATSAPP_NUMBER;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-[#FFFFFF] pt-14 pb-20 lg:pb-10 border-t-2 border-[#C5A15A]/35">
      
      {/* 1. Value Props & Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-[#C5A15A]/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#111111]/70 border border-[#C5A15A]/20 hover:border-[#C5A15A]/45 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#000000] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A] shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FFFFFF] tracking-wide">100% Authentic Handloom</h4>
              <p className="text-[11px] text-[#E5E7EB]/70 mt-0.5 leading-relaxed font-light">
                Pure cotton &amp; zari masterfully woven on traditional pit looms in Kuthampully.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#111111]/70 border border-[#C5A15A]/20 hover:border-[#C5A15A]/45 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#000000] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A] shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FFFFFF] tracking-wide">Express Insured Delivery</h4>
              <p className="text-[11px] text-[#E5E7EB]/70 mt-0.5 leading-relaxed font-light">
                Free shipping across India on orders above ₹2,000 in luxury keepsake boxes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#111111]/70 border border-[#C5A15A]/20 hover:border-[#C5A15A]/45 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#000000] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A] shrink-0 shadow-sm">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FFFFFF] tracking-wide">{POLICY_CONFIG.RETURN_WINDOW_DAYS}-Day Easy Size Exchange</h4>
              <p className="text-[11px] text-[#E5E7EB]/70 mt-0.5 leading-relaxed font-light">
                Hassle-free doorstep pickup and size exchange concierge for perfect fitting.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#111111]/70 border border-[#C5A15A]/20 hover:border-[#C5A15A]/45 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#000000] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A] shrink-0 shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FFFFFF] tracking-wide">100% Secure Checkout</h4>
              <p className="text-[11px] text-[#E5E7EB]/70 mt-0.5 leading-relaxed font-light">
                UPI, Cards &amp; Net Banking via Razorpay with 256-bit SSL PCI-DSS encryption.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Structured 5-Column Navigation Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Column 1: Brand & Atelier Coordinates (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div 
              className="inline-flex items-center bg-[#FFFFFF] px-3.5 py-1.5 rounded-xl border border-[#C5A15A]/50 shadow-md cursor-pointer hover:opacity-95 transition-all" 
              onClick={() => onNavigate('home')}
            >
              <img
                src={logoImg}
                alt="KAVISH - Authentic Kerala Handlooms"
                width="130"
                height="40"
                loading="lazy"
                decoding="async"
                className="h-9 w-auto object-contain"
              />
            </div>
            
            <p className="text-xs text-[#E5E7EB]/80 leading-relaxed font-light">
              Preserving 500 years of royal Devanga weaving traditions. Heirloom Kasavu sarees, ceremonial mundus, and tailored European linen for modern generations.
            </p>
            
            <div className="space-y-2 text-xs text-[#E5E7EB]/80 pt-1">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A15A] shrink-0 mt-0.5" />
                <span className="leading-snug text-[11px]">{atelierAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A15A] shrink-0" />
                <span className="text-[11px]">{supportPhone} ({visitingHours})</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A15A] shrink-0" />
                <a href={`mailto:${supportEmail}`} className="hover:text-[#C5A15A] underline text-[11px] transition-colors">
                  {supportEmail}
                </a>
              </p>
            </div>

            {/* Social Channels */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#111111] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A] hover:bg-[#C5A15A] hover:text-[#111111] transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#111111] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A] hover:bg-[#C5A15A] hover:text-[#111111] transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#111111] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A] hover:bg-[#C5A15A] hover:text-[#111111] transition-all"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20Kavish%20Team%2C%20I%20would%20like%20assistance%20with%20an%20order`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] border border-[#C5A15A]/50 text-[#C5A15A] hover:bg-[#C5A15A] hover:text-[#111111] text-[11px] font-semibold transition-all"
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          {/* Column 2: Shop Collections (2 cols - Unique Filtered Destinations) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-serif font-bold text-xs sm:text-sm text-[#C5A15A] tracking-wider uppercase border-b border-[#C5A15A]/25 pb-2">
              Shop Collections
            </h5>
            <ul className="space-y-2 text-xs text-[#E5E7EB]/85 font-light">
              <li>
                <button onClick={() => onNavigate('women')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Women's Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('men')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Men's Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kids')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Kids' Festive Wear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bridal-festive')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Bridal &amp; Festive Edit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', undefined, 'kasavu-masterpieces')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Kasavu Masterpieces
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', undefined, 'flax-linen')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Pure Flax Linen Edit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left font-semibold text-[#FFFFFF]">
                  Explore All Garments &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support (2 cols - Pure, Non-Duplicated E-Commerce Support Links) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-serif font-bold text-xs sm:text-sm text-[#C5A15A] tracking-wider uppercase border-b border-[#C5A15A]/25 pb-2">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs text-[#E5E7EB]/85 font-light">
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  My Account &amp; Order History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('payment-information')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Payment Modes &amp; Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Shopping Bag &amp; Cart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Contact Customer Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Our Heritage & Atelier (2 cols - Unique Dedicated Destinations) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-serif font-bold text-xs sm:text-sm text-[#C5A15A] tracking-wider uppercase border-b border-[#C5A15A]/25 pb-2">
              Our Heritage
            </h5>
            <ul className="space-y-2 text-xs text-[#E5E7EB]/85 font-light">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  About Kavish Atelier
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('heritage')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  500-Year Weaving Heritage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Handloom Care &amp; Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', undefined, 'ceremonial-classics')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Ceremonial Classics Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#C5A15A] transition-colors cursor-pointer text-left">
                  Visit Kuthampully Loom House
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: VIP Newsletter & Circle (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-serif font-bold text-xs sm:text-sm text-[#C5A15A] tracking-wider uppercase border-b border-[#C5A15A]/25 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A15A]" />
              <span>Join The Kavish Circle</span>
            </h5>
            <p className="text-xs text-[#E5E7EB]/80 leading-relaxed font-light">
              Receive private invitations to limited pit-loom runs, festival collection drops, and fabric care guides.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3 bg-[#111111] border border-[#C5A15A]/50 rounded-xl flex items-center gap-2 text-xs text-[#FFFFFF]">
                <CheckCircle2 className="w-4 h-4 text-[#C5A15A] shrink-0" />
                <span>Thank you. You are enrolled for exclusive Kavish privileges.</span>
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
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-[#C5A15A]/30 text-xs text-[#FFFFFF] placeholder-[#FFFFFF]/50 focus:outline-none focus:border-[#C5A15A]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#C5A15A] text-[#000000] hover:bg-[#D1B784] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-[#E5E7EB]/60 block leading-tight">
                  Enjoy complimentary express shipping on your first order. Zero spam, unsubscribe anytime.
                </span>
              </form>
            )}

            {/* Styling & Order Help Card */}
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-[#111111] border border-[#C5A15A]/30 text-xs text-[#E5E7EB]/85 space-y-1">
                <p className="font-semibold text-[#FFFFFF] text-[11px] flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#C5A15A]" />
                  <span>Order Help &amp; Styling Support</span>
                </p>
                <p className="text-[10px] text-[#E5E7EB]/70">
                  Call or WhatsApp our loom specialists: <strong className="text-[#C5A15A] font-medium">+91 9539251789</strong>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Professional Payment Methods & Security Trust Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-[#C5A15A]/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5">
            <span className="text-[#E5E7EB]/70 text-[11px] uppercase tracking-wider font-medium mr-1 hidden sm:inline">
              100% Safe Payments:
            </span>
            
            {/* UPI */}
            <div className="h-6 sm:h-7 px-2.5 rounded bg-white flex items-center justify-center shadow-xs">
              <span className="font-sans font-black text-xs text-[#097939] tracking-tighter">
                U<span className="text-[#E76C24]">P</span>I
              </span>
            </div>

            {/* Google Pay */}
            <div className="h-6 sm:h-7 px-2 rounded bg-white flex items-center justify-center text-[10px] font-bold text-gray-800 shadow-xs">
              <span>GPay</span>
            </div>

            {/* PhonePe */}
            <div className="h-6 sm:h-7 px-2 rounded bg-[#5f259f] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              <span>PhonePe</span>
            </div>

            {/* VISA */}
            <div className="h-6 sm:h-7 px-2.5 rounded bg-white flex items-center justify-center shadow-xs">
              <span className="font-sans font-black italic text-xs text-[#1A1F71] tracking-wider">
                VISA
              </span>
            </div>

            {/* MasterCard */}
            <div className="h-6 sm:h-7 px-2.5 rounded bg-white flex items-center justify-center shadow-xs">
              <div className="flex items-center -space-x-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block opacity-90" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] inline-block opacity-90" />
              </div>
            </div>

            {/* RuPay */}
            <div className="h-6 sm:h-7 px-2 rounded bg-white flex items-center justify-center shadow-xs">
              <span className="font-sans font-extrabold text-[11px] text-[#097939]">
                Ru<span className="text-[#095797]">Pay</span>
              </span>
            </div>

            {/* Net Banking */}
            <div className="h-6 sm:h-7 px-2 rounded bg-[#161616] border border-white/20 flex items-center gap-1 text-[10px] text-[#E5E7EB]">
              <Building2 className="w-3 h-3 text-[#C5A15A]" />
              <span>NetBanking</span>
            </div>

            {/* Cash on Delivery */}
            <div className="h-6 sm:h-7 px-2 rounded bg-[#161616] border border-[#C5A15A]/40 flex items-center gap-1 text-[10px] text-[#C5A15A] font-semibold">
              <Banknote className="w-3 h-3 text-[#C5A15A]" />
              <span>Cash on Delivery</span>
            </div>
          </div>

          {/* Security & Encryption Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111111] border border-white/15 text-[11px] text-[#E5E7EB]/80">
            <Lock className="w-3.5 h-3.5 text-[#C5A15A]" />
            <span>256-Bit SSL Encrypted • PCI-DSS Razorpay Gateway</span>
          </div>

        </div>
      </div>

      {/* 4. Legal, Policies & Copyright Bar (Optimized layout, never cut off by dev indicators) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2 border-t border-[#C5A15A]/20 text-xs text-[#E5E7EB]/70">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-center lg:text-left">
          
          {/* Copyright text with left clearance for fixed UI badges */}
          <div className="text-[11px] leading-relaxed pl-12 sm:pl-0">
            © {new Date().getFullYear()} {POLICY_CONFIG.COMPANY_LEGAL_NAME} All rights reserved. Handcrafted with reverence in Kuthampully, Kerala.
          </div>

          {/* Legal Links & India Pride Tag */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-[11px]">
            <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#C5A15A] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span className="text-[#C5A15A]/40">•</span>
            <button onClick={() => onNavigate('shipping-policy')} className="hover:text-[#C5A15A] transition-colors cursor-pointer">
              Shipping Policy
            </button>
            <span className="text-[#C5A15A]/40">•</span>
            <button onClick={() => onNavigate('return-refund-policy')} className="hover:text-[#C5A15A] transition-colors cursor-pointer">
              Return &amp; Refund Policy
            </button>
            <span className="text-[#C5A15A]/40">•</span>
            <button onClick={() => onNavigate('terms-and-conditions')} className="hover:text-[#C5A15A] transition-colors cursor-pointer">
              Terms &amp; Conditions
            </button>
            
            {/* Cross-platform India Craftsmanship Badge (No broken emoji letters) */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111111] border border-[#C5A15A]/40 text-[10px] text-[#E5E7EB] ml-1">
              <span className="w-3.5 h-2.5 rounded-xs overflow-hidden inline-flex flex-col shadow-xs shrink-0">
                <span className="h-[3.3px] bg-[#FF9933] w-full" />
                <span className="h-[3.3px] bg-[#FFFFFF] w-full flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-[#000080]" />
                </span>
                <span className="h-[3.4px] bg-[#128807] w-full" />
              </span>
              <span>Made with pride in Kuthampully, India</span>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};
