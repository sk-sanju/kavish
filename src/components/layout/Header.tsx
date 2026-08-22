import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, ShieldCheck, LogOut, Globe } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { setIsSearchOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useModal();
  const {
    isAdminLoggedIn,
    setIsAdminLoginModalOpen,
    logoutAdmin,
    isCustomerLoggedIn,
    openCustomerAuthModal,
    user
  } = useAuth();
  const { currency, setCurrencyByCode, currencies } = useCurrency();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string, categoryFilter?: string, collectionFilter?: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);

    if (view === 'home') navigate('/');
    else if (view === 'shop' && categoryFilter) navigate(`/shop/category/${categoryFilter}`);
    else if (view === 'shop' && collectionFilter) navigate(`/shop/collection/${collectionFilter}`);
    else if (view === 'shop') navigate('/shop');
    else if (view === 'cart') navigate('/cart');
    else if (view === 'checkout') navigate('/checkout');
    else if (view === 'wishlist') navigate('/wishlist');
    else if (view === 'account') navigate('/account');
    else if (view === 'heritage') navigate('/heritage');
    else if (view === 'contact') navigate('/contact');
    else if (view === 'admin') navigate('/admin');
    else navigate(`/${view}`);
  };

  const pathname = location.pathname;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-header shadow-sm py-2.5 sm:py-3'
          : 'bg-[#FAF8F1] py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-[#12372A] hover:text-[#D4AF37] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Kavish Luxury Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center"
          >
            <img
              src={logoImg}
              alt="KAVISH - Kerala Ethnic Wear"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 font-sans text-xs uppercase tracking-widest font-medium text-[#171717]">
            <button
              onClick={() => handleNavClick('shop', 'women')}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${
                pathname.includes('/shop/category/women') ? 'text-[#12372A] font-semibold underline underline-offset-4 decoration-[#D4AF37]' : ''
              }`}
            >
              Women
            </button>

            <button
              onClick={() => handleNavClick('shop', 'men')}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${
                pathname.includes('/shop/category/men') ? 'text-[#12372A] font-semibold underline underline-offset-4 decoration-[#D4AF37]' : ''
              }`}
            >
              Men
            </button>

            <button
              onClick={() => handleNavClick('shop', 'kids')}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${
                pathname.includes('/shop/category/kids') ? 'text-[#12372A] font-semibold underline underline-offset-4 decoration-[#D4AF37]' : ''
              }`}
            >
              Kids
            </button>

            {/* Dropdown: Collections */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('collections')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('shop')}
                className="flex items-center space-x-1 hover:text-[#D4AF37] transition-colors py-2"
              >
                <span>Collections</span>
                <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
              </button>

              {activeDropdown === 'collections' && (
                <div className="absolute top-full left-0 w-64 bg-[#FAF8F1] border border-[#D4AF37]/30 shadow-xl py-3 rounded-2xl animate-fadeIn z-50">
                  <div className="px-4 py-1 text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest border-b border-[#E8DDC7]/60 pb-2 mb-2">
                    Kerala Curated Edits
                  </div>
                  <button
                    onClick={() => handleNavClick('shop', undefined, 'kasavu-masterpieces')}
                    className="w-full text-left px-4 py-2 hover:bg-[#E8DDC7]/30 hover:text-[#12372A] text-xs capitalize tracking-normal flex justify-between items-center"
                  >
                    <span>Kasavu Masterpieces</span>
                    <span className="text-[10px] text-[#D4AF37]">Gold Zari</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', undefined, 'festive-edit')}
                    className="w-full text-left px-4 py-2 hover:bg-[#E8DDC7]/30 hover:text-[#12372A] text-xs capitalize tracking-normal flex justify-between items-center"
                  >
                    <span>The Festive Edit</span>
                    <span className="text-[10px] text-[#12372A]">Onam &amp; Vishu</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', undefined, 'kerala-classics')}
                    className="w-full text-left px-4 py-2 hover:bg-[#E8DDC7]/30 hover:text-[#12372A] text-xs capitalize tracking-normal"
                  >
                    Kerala Classics
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', undefined, 'everyday-kerala')}
                    className="w-full text-left px-4 py-2 hover:bg-[#E8DDC7]/30 hover:text-[#12372A] text-xs capitalize tracking-normal"
                  >
                    Everyday Organic Linen
                  </button>
                  <button
                    onClick={() => handleNavClick('shop', undefined, 'kids-heritage')}
                    className="w-full text-left px-4 py-2 hover:bg-[#E8DDC7]/30 hover:text-[#12372A] text-xs capitalize tracking-normal"
                  >
                    Kids Heritage Legacy
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('heritage')}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${
                pathname === '/heritage' ? 'text-[#12372A] font-semibold' : ''
              }`}
            >
              Our Story
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-[#D4AF37] transition-colors py-2 ${
                pathname === '/contact' ? 'text-[#12372A] font-semibold' : ''
              }`}
            >
              Atelier
            </button>

            {/* Admin Console Trigger Button - ONLY VISIBLE WHEN ADMIN LOGGED IN */}
            {isAdminLoggedIn && (
              <div className="flex items-center gap-1 bg-[#12372A] text-[#FAF8F1] px-3 py-1 rounded-full border border-[#D4AF37] shadow-xs">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 text-[#D4AF37] hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
                <button
                  onClick={() => {
                    logoutAdmin();
                    handleNavClick('home');
                  }}
                  className="p-1 hover:text-red-400 text-gray-300 ml-1 border-l border-white/20 pl-2"
                  title="Logout Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </nav>

          {/* Quick Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#171717] hover:text-[#D4AF37] transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Search Kavish"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (isCustomerLoggedIn) {
                  handleNavClick('account');
                } else {
                  openCustomerAuthModal('register');
                }
              }}
              className="hidden sm:flex p-2 text-[#171717] hover:text-[#D4AF37] transition-colors focus:outline-none min-h-[44px] min-w-[44px] items-center justify-center relative group"
              title={isCustomerLoggedIn ? `Account (${user.name})` : 'Create Account / Sign In'}
              aria-label="Account"
            >
              <User className="w-5 h-5" />
              {!isCustomerLoggedIn && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('wishlist')}
              className="p-2 text-[#171717] hover:text-[#D4AF37] transition-colors relative focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1 bg-[#D4AF37] text-[#12372A] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#12372A] hover:text-[#D4AF37] transition-colors relative focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Shopping Bag"
              aria-label="Cart Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#12372A] text-[#FAF8F1] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#D4AF37]">
                    {itemCount}
                  </span>
                )}
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Full Screen Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[100px] sm:top-[110px] z-50 bg-[#FAF8F1] px-6 py-6 overflow-y-auto animate-fadeIn pb-24 shadow-2xl">
          <div className="flex flex-col space-y-4 font-sans text-sm tracking-wider uppercase font-semibold">
            
            {isAdminLoggedIn ? (
              <div className="p-3 bg-[#12372A] text-[#D4AF37] rounded-xl flex items-center justify-between border border-[#D4AF37]">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-2 font-bold"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Console
                </button>
                <button
                  onClick={() => {
                    logoutAdmin();
                    handleNavClick('home');
                  }}
                  className="text-xs bg-red-800 text-white px-3 py-1 rounded-full uppercase"
                >
                  Logout
                </button>
              </div>
            ) : !isCustomerLoggedIn ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAdminLoginModalOpen(true);
                }}
                className="text-left py-2.5 border-b border-[#E8DDC7] text-[#6B5846] flex justify-between items-center text-xs"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Admin Atelier Login
                </span>
                <span className="text-[10px] bg-[#E8DDC7]/50 text-[#12372A] px-2 py-0.5 rounded-full font-bold">Staff Only</span>
              </button>
            ) : null}

            <button
              onClick={() => handleNavClick('shop', 'women')}
              className="text-left py-2.5 border-b border-[#E8DDC7] text-[#12372A] flex justify-between items-center"
            >
              <span>Women Collection</span>
              <span className="text-xs text-[#D4AF37] font-normal">Kasavu &amp; Sarees</span>
            </button>

            <button
              onClick={() => handleNavClick('shop', 'men')}
              className="text-left py-2.5 border-b border-[#E8DDC7] text-[#12372A] flex justify-between items-center"
            >
              <span>Men Collection</span>
              <span className="text-xs text-[#D4AF37] font-normal">Mundu &amp; Shirts</span>
            </button>

            <button
              onClick={() => handleNavClick('shop', 'kids')}
              className="text-left py-2.5 border-b border-[#E8DDC7] text-[#12372A] flex justify-between items-center"
            >
              <span>Kids Heritage</span>
              <span className="text-xs text-[#D4AF37] font-normal">Pattu Pavada</span>
            </button>

            <button
              onClick={() => handleNavClick('heritage')}
              className="text-left py-2.5 border-b border-[#E8DDC7] text-[#171717]"
            >
              Our Story &amp; Kuthampully Heritage
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2.5 border-b border-[#E8DDC7] text-[#171717]"
            >
              Kuthampully Atelier Concierge
            </button>

            <button
              onClick={() => handleNavClick('account')}
              className="text-left py-2.5 border-b border-[#E8DDC7] text-[#171717] flex justify-between items-center"
            >
              <span>My Account</span>
              <span className="text-xs text-[#6B5846] font-normal">Orders &amp; Profile</span>
            </button>

            {/* Mobile Currency Switcher */}
            <div className="pt-2">
              <div className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Select Currency
              </div>
              <div className="grid grid-cols-2 gap-2">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrencyByCode(curr.code)}
                    className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                      currency.code === curr.code
                        ? 'border-[#12372A] bg-[#12372A] text-[#FAF8F1] font-bold shadow-xs'
                        : 'border-[#E8DDC7] bg-white text-[#6B5846] hover:border-[#D4AF37]'
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
  );
};
