'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, 
  ShieldCheck, LogOut, Globe, Sparkles, BookOpen, ArrowRight, Check, Package, MapPin
} from 'lucide-react';
const logoImg = '/assets/logo.png';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useProducts } from '../../context/ProductContext';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { setIsSearchOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useModal();
  const { collections, categories } = useProducts();
  const {
    isAdminLoggedIn,
    logoutAdmin,
    isCustomerLoggedIn,
    logoutCustomer,
    openCustomerAuthModal,
    user
  } = useAuth();
  const { currency, setCurrencyByCode, currencies } = useCurrency();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string, categoryFilter?: string, collectionFilter?: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsAccountMenuOpen(false);

    if (view === 'home') router.push('/');
    else if (view === 'shop' && categoryFilter) router.push(`/shop/category/${categoryFilter}`);
    else if (view === 'shop' && collectionFilter) router.push(`/shop/collection/${collectionFilter}`);
    else if (view === 'women') router.push('/women');
    else if (view === 'men') router.push('/men');
    else if (view === 'kids') router.push('/kids');
    else if (view === 'bridal-festive') router.push('/bridal-festive');
    else if (view === 'blog') router.push('/blog');
    else if (view === 'shop') router.push('/shop');
    else if (view === 'cart') router.push('/cart');
    else if (view === 'checkout') router.push('/checkout');
    else if (view === 'wishlist') router.push('/wishlist');
    else if (view === 'account') router.push('/account');
    else if (view === 'heritage') router.push('/heritage');
    else if (view === 'contact') router.push('/contact');
    else if (view === 'admin') router.push('/admin');
    else router.push(`/${view}`);
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Patron';
    return fullName.trim().split(' ')[0];
  };

  return (
    <>
      {/* 1. DISCREET ADMIN TOP RIBBON - ONLY SHOWN WHEN AN ADMIN IS LOGGED IN */}
      {mounted && isAdminLoggedIn && (
        <div className="bg-[#1A0B10] text-[#B99A61] border-b border-[#B99A61]/30 px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B99A61]" />
              <span className="font-medium text-[#F8F5EF]/90 tracking-wide text-[11px]">
                Administrator Session Active
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider">
              <button
                onClick={() => router.push('/admin')}
                className="text-[#B99A61] hover:text-[#F8F5EF] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Open Admin ERP</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-[#B99A61]/40">•</span>
              <button
                onClick={() => {
                  logoutAdmin();
                  router.push('/');
                }}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN LUXURY HEADER NAVBAR */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-header shadow-md py-2.5 sm:py-3 border-b border-[#B99A61]/25'
            : 'bg-[#F8F5EF] py-3.5 sm:py-4 border-b border-[#E8DFD0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-[#641E2B] hover:text-[#B99A61] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Left: Kavish Luxury Monogram & Logotype */}
            <div
              onClick={() => handleNavClick('home')}
              className="cursor-pointer group flex items-center gap-3"
            >
              <img
                src={logoImg}
                alt="KAVISH - Authentic Kerala Luxury Handlooms"
                width="160"
                height="56"
                decoding="async"
                className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Center: Curated 6-Item High-Conversion Primary Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-sans text-xs uppercase tracking-widest font-semibold text-[#292522]">
              
              {/* 1. NEW ARRIVALS */}
              <button
                onClick={() => handleNavClick('shop')}
                className={`hover:text-[#641E2B] transition-all py-2 cursor-pointer relative ${
                  pathname === '/shop' ? 'text-[#641E2B] font-bold' : ''
                }`}
              >
                <span>New Arrivals</span>
                {pathname === '/shop' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#641E2B] rounded-full animate-fadeIn" />
                )}
              </button>

              {/* 2. SAREES (Mega Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('sarees')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNavClick('women')}
                  className={`flex items-center gap-1 hover:text-[#641E2B] transition-all py-2 cursor-pointer ${
                    pathname === '/women' || pathname.includes('/shop/category/women')
                      ? 'text-[#641E2B] font-bold'
                      : ''
                  }`}
                >
                  <span>Sarees</span>
                  <ChevronDown className="w-3 h-3 text-[#B99A61] transition-transform duration-200 group-hover:rotate-180" />
                  {(pathname === '/women' || pathname.includes('/shop/category/women')) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#641E2B] rounded-full" />
                  )}
                </button>

                {activeDropdown === 'sarees' && (
                  <div className="absolute top-full -left-12 w-96 bg-[#F8F5EF] border border-[#B99A61]/35 shadow-2xl p-5 rounded-2xl animate-fadeIn z-50">
                    <div className="text-[10px] uppercase font-bold text-[#641E2B] tracking-widest border-b border-[#E8DFD0] pb-2 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#B99A61]" />
                        <span>Kuthampully Handloom Sarees</span>
                      </span>
                      <span
                        onClick={() => handleNavClick('women')}
                        className="text-[#B99A61] hover:underline cursor-pointer normal-case text-[11px]"
                      >
                        View All &rarr;
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-xs tracking-normal">
                      <button
                        onClick={() => handleNavClick('women')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-[#292522]">Traditional Kasavu Sarees</div>
                          <div className="text-[11px] text-[#6E685D]">24k Gold Electroplated Zari Borders</div>
                        </div>
                        <span className="text-[10px] text-[#B99A61] font-bold uppercase bg-[#641E2B]/5 px-2 py-0.5 rounded-full">GI Tag</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('women')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-[#292522]">Tissue Kasavu Sarees</div>
                          <div className="text-[11px] text-[#6E685D]">Luminous Metallic Golden Weaves</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('women')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-[#292522]">Kerala Set Mundu (Mundum Neriyathum)</div>
                          <div className="text-[11px] text-[#6E685D]">Two-Piece Royal Traditional Attire</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('women')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-[#292522]">Handloom Cotton Sarees</div>
                          <div className="text-[11px] text-[#6E685D]">Lightweight Breathable Kasavu</div>
                        </div>
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#E8DFD0] flex items-center justify-between bg-white p-3 rounded-xl border">
                      <div className="text-[11px]">
                        <span className="font-bold text-[#641E2B]">Authentic GI Tag Certified</span>
                        <p className="text-[10px] text-[#6E685D]">Direct from weaver societies in Thrissur</p>
                      </div>
                      <button
                        onClick={() => handleNavClick('heritage')}
                        className="text-[10px] uppercase font-bold text-[#B99A61] hover:underline"
                      >
                        Our Craft &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. MEN (Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('men')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNavClick('men')}
                  className={`flex items-center gap-1 hover:text-[#641E2B] transition-all py-2 cursor-pointer ${
                    pathname === '/men' || pathname.includes('/shop/category/men')
                      ? 'text-[#641E2B] font-bold'
                      : ''
                  }`}
                >
                  <span>Men</span>
                  <ChevronDown className="w-3 h-3 text-[#B99A61]" />
                  {(pathname === '/men' || pathname.includes('/shop/category/men')) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#641E2B] rounded-full" />
                  )}
                </button>

                {activeDropdown === 'men' && (
                  <div className="absolute top-full left-0 w-80 bg-[#F8F5EF] border border-[#B99A61]/35 shadow-2xl p-4 rounded-2xl animate-fadeIn z-50">
                    <div className="text-[10px] uppercase font-bold text-[#641E2B] tracking-widest border-b border-[#E8DFD0] pb-2 mb-2 flex justify-between items-center">
                      <span>Men's Royal Collection</span>
                      <span onClick={() => handleNavClick('men')} className="text-[#B99A61] hover:underline cursor-pointer normal-case text-[11px]">
                        All Men &rarr;
                      </span>
                    </div>

                    <div className="space-y-1 text-xs tracking-normal">
                      <button
                        onClick={() => handleNavClick('men')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-[#292522]">Classic Double Mundu</div>
                        <div className="text-[11px] text-[#6E685D]">Pure Cotton with 1-inch &amp; 2-inch Gold Border</div>
                      </button>

                      <button
                        onClick={() => handleNavClick('men')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-[#292522]">Pure European Linen Shirts</div>
                        <div className="text-[11px] text-[#6E685D]">Tailored Relaxed Fit Breathable Shirts</div>
                      </button>

                      <button
                        onClick={() => handleNavClick('men')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-[#292522]">Wedding &amp; Festival Combo Sets</div>
                        <div className="text-[11px] text-[#6E685D]">Matching Shirt &amp; Kasavu Mundu Set</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. KIDS */}
              <button
                onClick={() => handleNavClick('kids')}
                className={`hover:text-[#641E2B] transition-all py-2 cursor-pointer relative ${
                  pathname === '/kids' || pathname.includes('/shop/category/kids')
                    ? 'text-[#641E2B] font-bold'
                    : ''
                }`}
              >
                <span>Kids</span>
                {(pathname === '/kids' || pathname.includes('/shop/category/kids')) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#641E2B] rounded-full" />
                )}
              </button>

              {/* 5. BRIDAL & FESTIVE */}
              <button
                onClick={() => handleNavClick('bridal-festive')}
                className={`hover:text-[#641E2B] transition-all py-2 cursor-pointer flex items-center gap-1.5 relative ${
                  pathname === '/bridal-festive' ? 'text-[#641E2B] font-bold' : ''
                }`}
              >
                <span>Bridal &amp; Festive</span>
                {pathname === '/bridal-festive' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#641E2B] rounded-full" />
                )}
              </button>

              {/* 6. OUR STORY (Consolidated Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('our-story')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNavClick('heritage')}
                  className={`flex items-center gap-1 hover:text-[#641E2B] transition-all py-2 cursor-pointer ${
                    pathname === '/heritage' || pathname === '/blog' || pathname === '/contact'
                      ? 'text-[#641E2B] font-bold'
                      : ''
                  }`}
                >
                  <span>Our Story</span>
                  <ChevronDown className="w-3 h-3 text-[#B99A61]" />
                  {(pathname === '/heritage' || pathname === '/blog' || pathname === '/contact') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#641E2B] rounded-full" />
                  )}
                </button>

                {activeDropdown === 'our-story' && (
                  <div className="absolute top-full -left-12 w-80 bg-[#F8F5EF] border border-[#B99A61]/35 shadow-2xl p-4 rounded-2xl animate-fadeIn z-50">
                    <div className="text-[10px] uppercase font-bold text-[#641E2B] tracking-widest border-b border-[#E8DFD0] pb-2 mb-2">
                      Kavish Legacy &amp; Atelier
                    </div>

                    <div className="space-y-1 text-xs tracking-normal">
                      <button
                        onClick={() => handleNavClick('heritage')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-[#292522]">500-Year Handloom Heritage</div>
                        <div className="text-[11px] text-[#6E685D]">The Royal Devanga Weavers of Kochi Court</div>
                      </button>

                      <button
                        onClick={() => handleNavClick('heritage')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-[#292522]">GI Tag Authenticity</div>
                        <div className="text-[11px] text-[#6E685D]">Government Certified Geographical Indication</div>
                      </button>

                      <button
                        onClick={() => handleNavClick('blog')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-[#292522]">Handloom Journal &amp; Guides</div>
                        <div className="text-[11px] text-[#6E685D]">Kasavu Saree Care, Draping &amp; Styling</div>
                      </button>

                      <button
                        onClick={() => handleNavClick('contact')}
                        className="w-full text-left px-3 py-2 hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-[#292522]">Flagship Atelier Concierge</div>
                        <div className="text-[11px] text-[#6E685D]">Kuthampully Village, Thrissur, Kerala</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </nav>

            {/* Right: Clean Luxury Utility Section (Currency + Search + Account + Wishlist | Cart) */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Interactive Currency Switcher (Flag + Code) */}
              <div className="relative hidden md:block" ref={currencyRef}>
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#292522] hover:text-[#641E2B] py-1.5 px-2.5 rounded-full border border-[#E8DFD0] hover:border-[#B99A61] transition-all cursor-pointer bg-white/60"
                  title="Switch Currency"
                >
                  <span>{currency.flag}</span>
                  <span>{currency.code}</span>
                  <ChevronDown className={`w-3 h-3 text-[#B99A61] transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCurrencyOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#F8F5EF] border border-[#B99A61]/40 shadow-2xl rounded-2xl py-2 z-50 text-[#292522]">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#641E2B] tracking-wider border-b border-[#E8DFD0]">
                      Select Currency
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            setCurrencyByCode(curr.code);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-[#E8DFD0]/40 transition-colors cursor-pointer ${
                            currency.code === curr.code ? 'bg-[#E8DFD0]/60 text-[#641E2B] font-bold' : 'text-[#6E685D]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{curr.flag}</span>
                            <span>{curr.name}</span>
                          </span>
                          <span className="font-semibold text-[11px] text-[#641E2B]">{curr.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#292522] hover:text-[#641E2B] transition-colors focus:outline-none flex items-center justify-center cursor-pointer rounded-full hover:bg-black/5"
                title="Search Handlooms"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Account / Login with Text Label (Reference Header Pattern) */}
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => {
                    if (isCustomerLoggedIn) {
                      setIsAccountMenuOpen(!isAccountMenuOpen);
                    } else {
                      openCustomerAuthModal('login');
                    }
                  }}
                  className="hidden sm:flex items-center gap-1.5 p-1.5 px-2.5 text-[#292522] hover:text-[#641E2B] transition-colors focus:outline-none cursor-pointer rounded-full hover:bg-black/5"
                  title={mounted && isCustomerLoggedIn ? `Account (${user.name})` : 'Sign In'}
                  aria-label="Account"
                >
                  <User className="w-4.5 h-4.5" />
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    {mounted && isCustomerLoggedIn ? getFirstName(user.name) : 'Login'}
                  </span>
                  {mounted && isCustomerLoggedIn && (
                    <ChevronDown className="w-3 h-3 text-[#B99A61]" />
                  )}
                </button>

                {/* Logged-In Customer Dropdown Menu */}
                {isAccountMenuOpen && isCustomerLoggedIn && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#F8F5EF] border border-[#B99A61]/40 shadow-2xl rounded-2xl p-3 z-50 text-[#292522] animate-fadeIn">
                    <div className="px-3 py-2 border-b border-[#E8DFD0] mb-2">
                      <p className="font-serif font-bold text-sm text-[#641E2B]">{user.name}</p>
                      <p className="text-[11px] text-[#6E685D] truncate">{user.email || user.phone}</p>
                      <span className="inline-block mt-1 bg-[#641E2B]/10 text-[#641E2B] text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-[#B99A61]/30">
                        Royal Patron
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => handleNavClick('account')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-[#B99A61]" />
                        <span>My Orders &amp; Tracking</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('account')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#B99A61]" />
                        <span>Saved Addresses</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('wishlist')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#E8DFD0]/50 hover:text-[#641E2B] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#B99A61]" />
                        <span>Saved Wishlist ({wishlistCount})</span>
                      </button>

                      {isAdminLoggedIn && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-3 py-2 rounded-xl bg-[#641E2B]/10 text-[#641E2B] font-bold flex items-center gap-2 cursor-pointer transition-colors border border-[#B99A61]/40"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#641E2B]" />
                          <span>Admin Console</span>
                        </button>
                      )}

                      <div className="pt-2 border-t border-[#E8DFD0]">
                        <button
                          onClick={() => {
                            logoutCustomer();
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-red-700 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist with Circle Counter Badge */}
              <button
                onClick={() => handleNavClick('wishlist')}
                className="p-2 text-[#292522] hover:text-[#641E2B] transition-colors relative focus:outline-none flex items-center justify-center cursor-pointer rounded-full hover:bg-black/5"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <div className="relative">
                  <Heart className="w-4.5 h-4.5" />
                  {mounted && (
                    <span className={`absolute -top-2 -right-2.5 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      wishlistCount > 0 
                        ? 'bg-[#641E2B] text-[#F8F5EF] border border-[#B99A61]' 
                        : 'bg-[#E8DFD0] text-[#6E685D]'
                    }`}>
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </button>

              {/* Thin Vertical Divider (Kalyan Silks Style) */}
              <div className="hidden sm:block h-5 w-px bg-[#E8DFD0]" />

              {/* Shopping Bag with Solid Luxury Circular Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-[#641E2B] hover:text-[#B99A61] transition-colors relative focus:outline-none flex items-center justify-center cursor-pointer rounded-full hover:bg-[#641E2B]/5"
                title="Shopping Bag"
                aria-label="Cart Bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-[#641E2B]" />
                  {mounted && (
                    <span className="absolute -top-2 -right-2.5 bg-[#641E2B] text-[#F8F5EF] font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#B99A61] shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </div>
              </button>

            </div>

          </div>
        </div>

        {/* 3. MOBILE FULL-SCREEN LUXURY DRAWER MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[60px] sm:top-[70px] z-50 bg-[#F8F5EF] px-6 py-6 overflow-y-auto animate-fadeIn pb-28 shadow-2xl">
            <div className="flex flex-col space-y-3 font-sans text-sm tracking-wider uppercase font-semibold">
              
              <button
                onClick={() => handleNavClick('shop')}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#641E2B] font-bold flex justify-between items-center cursor-pointer"
              >
                <span>New Arrivals</span>
                <span className="text-xs text-[#B99A61] font-normal normal-case">Latest Weaves &rarr;</span>
              </button>

              <button
                onClick={() => handleNavClick('women')}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#292522] flex justify-between items-center cursor-pointer"
              >
                <span>Sarees &amp; Kasavu</span>
                <span className="text-xs text-[#B99A61] font-normal normal-case">Tissue, Set Mundu</span>
              </button>

              <button
                onClick={() => handleNavClick('men')}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#292522] flex justify-between items-center cursor-pointer"
              >
                <span>Men Collection</span>
                <span className="text-xs text-[#B99A61] font-normal normal-case">Mundu &amp; Linen</span>
              </button>

              <button
                onClick={() => handleNavClick('kids')}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#292522] flex justify-between items-center cursor-pointer"
              >
                <span>Kids Collection</span>
                <span className="text-xs text-[#B99A61] font-normal normal-case">Pattu Pavada</span>
              </button>

              <button
                onClick={() => handleNavClick('bridal-festive')}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#292522] flex justify-between items-center cursor-pointer"
              >
                <span>Bridal &amp; Festive</span>
                <span className="text-xs text-[#B99A61] font-normal normal-case">Wedding Lookbook</span>
              </button>

              <button
                onClick={() => handleNavClick('heritage')}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#292522] flex justify-between items-center cursor-pointer"
              >
                <span>500-Year Heritage</span>
                <span className="text-xs text-[#B99A61] font-normal normal-case">Devanga Weavers</span>
              </button>

              <button
                onClick={() => handleNavClick('blog')}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#292522] cursor-pointer"
              >
                Craft Journal &amp; Guides
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#292522] cursor-pointer"
              >
                Kuthampully Atelier Concierge
              </button>

              {/* Mobile Account Action */}
              <button
                onClick={() => {
                  if (isCustomerLoggedIn) {
                    handleNavClick('account');
                  } else {
                    setIsMobileMenuOpen(false);
                    openCustomerAuthModal('login');
                  }
                }}
                className="text-left py-3 border-b border-[#E8DFD0] text-[#641E2B] flex justify-between items-center cursor-pointer font-bold"
              >
                <span>{isCustomerLoggedIn ? `Account (${user.name})` : 'Sign In / Register'}</span>
                <User className="w-4 h-4 text-[#B99A61]" />
              </button>

              {/* Mobile Currency Switcher */}
              <div className="pt-3">
                <div className="text-[10px] uppercase font-bold text-[#641E2B] tracking-widest mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#B99A61]" /> Select Currency
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setCurrencyByCode(curr.code)}
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                        currency.code === curr.code
                          ? 'border-[#641E2B] bg-[#641E2B] text-[#F8F5EF] font-bold shadow-xs'
                          : 'border-[#E8DFD0] bg-white text-[#6E685D] hover:border-[#B99A61]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{curr.flag}</span>
                        <span>{curr.code}</span>
                      </span>
                      <span className="text-[11px] opacity-80">{curr.symbol.trim()}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </header>
    </>
  );
};
