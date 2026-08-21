import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Truck, ShieldCheck, Globe, ChevronDown, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useProducts } from '../../context/ProductContext';

export const AnnouncementBar: React.FC = () => {
  const { amountNeededForFreeShipping } = useCart();
  const { currency, setCurrencyByCode, formatPrice, currencies } = useCurrency();
  const { announcementText } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#12372A] text-[#FAF8F1] text-xs font-medium py-2 px-4 text-center tracking-wide transition-all duration-300 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-[#D4AF37]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[11px] uppercase tracking-wider text-[#E8DDC7]">100% Authentic Handloom GI Certified</span>
        </div>

        <div className="flex items-center justify-center space-x-2 mx-auto md:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span>
            {announcementText || (amountNeededForFreeShipping > 0 ? (
              <>
                Complimentary Express Shipping on orders above <span className="text-[#D4AF37] font-semibold">{formatPrice(2000)}</span>
              </>
            ) : (
              <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 inline" /> You have unlocked Complimentary Shipping!
              </span>
            ))}
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[11px] text-[#E8DDC7]">
          {/* Interactive Currency Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors py-0.5 px-2 rounded-full hover:bg-white/10"
              title="Change Currency"
            >
              <Globe className="w-3 h-3 text-[#D4AF37]" />
              <span>{currency.flag} {currency.code} ({currency.symbol.trim()})</span>
              <ChevronDown className={`w-3 h-3 text-[#D4AF37] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#FAF8F1] border border-[#D4AF37]/40 shadow-2xl rounded-2xl py-2 z-50 text-[#171717]">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold border-b border-[#E8DDC7]">
                  Select Currency
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrencyByCode(curr.code);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-[#E8DDC7]/40 transition-colors ${
                        currency.code === curr.code ? 'bg-[#E8DDC7]/30 text-[#12372A] font-bold' : 'text-[#6B5846]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{curr.flag}</span>
                        <span>{curr.name}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-[11px] text-[#12372A]">{curr.code} ({curr.symbol.trim()})</span>
                        {currency.code === curr.code && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span>•</span>
          <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">Concierge Support</span>
        </div>
      </div>
    </div>
  );
};

