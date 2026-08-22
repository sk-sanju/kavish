import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';

interface FooterProps {
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { isAdminLoggedIn } = useAuth();
  const { formatPrice } = useCurrency();

  return (
    <footer className="bg-[#12372A] text-[#FAF8F1] pt-16 pb-24 lg:pb-12">
      
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#FAF8F1]">Kuthampully GI Certified</h4>
              <p className="text-xs text-[#E8DDC7]/80 mt-0.5">100% Authentic Handloom with Govt GI Tag (Reg 2011).</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#FAF8F1]">Complimentary Express Delivery</h4>
              <p className="text-xs text-[#E8DDC7]/80 mt-0.5">Free BlueDart Air shipping across India over {formatPrice(2000)}.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#FAF8F1]">7-Day Size Exchange</h4>
              <p className="text-xs text-[#E8DDC7]/80 mt-0.5">Doorstep exchange concierge for perfect fits.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#FAF8F1]">Razorpay Safe Payments</h4>
              <p className="text-xs text-[#E8DDC7]/80 mt-0.5">Instant UPI, Cards, Netbanking &amp; Cash on Delivery.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block bg-[#FAF8F1] p-2.5 rounded-2xl shadow-md">
              <img
                src={logoImg}
                alt="KAVISH - Kerala Ethnic Wear"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#E8DDC7]/90 leading-relaxed font-light">
              Crafted in Kuthampully, Thrissur. We preserve 500 years of royal Devanga weaving traditions, crafting premium Kasavu sarees, set mundus, and European linen for modern generations.
            </p>
            
            <div className="pt-2 flex items-center space-x-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#0B241B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">Store Departments</h4>
            <ul className="space-y-2 text-[#E8DDC7]/80">
              <li><button onClick={() => onNavigate('shop', 'women')} className="hover:text-[#D4AF37]">Women’s Kasavu Sarees</button></li>
              <li><button onClick={() => onNavigate('shop', 'men')} className="hover:text-[#D4AF37]">Men’s Double Mundu</button></li>
              <li><button onClick={() => onNavigate('shop', 'kids')} className="hover:text-[#D4AF37]">Kids Pattu Pavada</button></li>
              <li><button onClick={() => onNavigate('shop', undefined, 'kasavu-masterpieces')} className="hover:text-[#D4AF37]">24k Gold Zari Edit</button></li>
              <li><button onClick={() => onNavigate('shop', undefined, 'everyday-kerala')} className="hover:text-[#D4AF37]">Organic Flax Linen</button></li>
            </ul>
          </div>

          {/* Heritage & Help */}
          <div className="lg:col-span-3 space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">Atelier &amp; Support</h4>
            <ul className="space-y-2 text-[#E8DDC7]/80">
              <li><button onClick={() => onNavigate('heritage')} className="hover:text-[#D4AF37]">The 500-Year Kuthampully Story</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#D4AF37]">Atelier Concierge &amp; Loom Visit</button></li>
              <li><button onClick={() => onNavigate('account')} className="hover:text-[#D4AF37]">My Account &amp; Orders</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#D4AF37]">Bespoke Bridal Consultations</button></li>
              
              {/* Admin Control Center - Only displayed when logged in as admin */}
              {isAdminLoggedIn && (
                <li className="pt-2">
                  <button
                    onClick={() => onNavigate('admin')}
                    className="text-[#D4AF37] font-bold hover:underline flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Control Center
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">The Royal Newsletter</h4>
            <p className="text-[#E8DDC7]/80 font-light">
              Subscribe for exclusive previews of Onam &amp; Vishu festive releases and private atelier sales.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-[#0B241B] border border-[#D4AF37]/40 px-3.5 py-2.5 text-xs text-[#FAF8F1] focus:outline-none focus:border-[#D4AF37] rounded-xl"
              />
              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-[#12372A] font-bold text-xs uppercase py-2.5 rounded-xl hover:bg-[#FAF8F1] transition-colors"
              >
                Join Patron List
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Location */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E8DDC7]/70 gap-3">
        <p>© 2026 Kavish Handlooms Pvt. Ltd. Kuthampully Village, Thrissur, Kerala. All rights reserved.</p>
        <p className="flex items-center gap-2 font-mono text-[10px]">
          <span>Kuthampully GI Reg No. 2011</span> • <span>Made in India</span>
        </p>
      </div>

    </footer>
  );
};
