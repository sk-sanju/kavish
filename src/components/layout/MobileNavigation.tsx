'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, ShoppingBag, Search, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { setIsSearchOpen } = useModal();
  const { isCustomerLoggedIn, openCustomerAuthModal } = useAuth();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F1] shadow-2xl py-2 px-3 flex items-center justify-around text-[10px] uppercase tracking-wider font-semibold text-[#171717] glass-header">
      
      <button
        onClick={() => router.push('/')}
        className={`flex flex-col items-center gap-1 transition-colors py-1 ${
          pathname === '/' ? 'text-[#12372A] font-bold' : 'hover:text-[#D4AF37]'
        }`}
      >
        <Home className="w-5 h-5 text-[#D4AF37]" />
        <span>Home</span>
      </button>

      <button
        onClick={() => router.push('/shop')}
        className={`flex flex-col items-center gap-1 transition-colors py-1 ${
          pathname.startsWith('/shop') ? 'text-[#12372A] font-bold' : 'hover:text-[#D4AF37]'
        }`}
      >
        <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
        <span>Shop</span>
      </button>

      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center gap-1 hover:text-[#D4AF37] transition-colors py-1"
      >
        <Search className="w-5 h-5 text-[#D4AF37]" />
        <span>Search</span>
      </button>

      <button
        onClick={() => router.push('/wishlist')}
        className={`flex flex-col items-center gap-1 transition-colors relative py-1 ${
          pathname === '/wishlist' ? 'text-[#12372A] font-bold' : 'hover:text-[#D4AF37]'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5 text-[#D4AF37]" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-[#12372A] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
        <span>Saved</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 hover:text-[#D4AF37] transition-colors relative py-1"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#12372A]" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#12372A] text-[#FAF8F1] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#D4AF37]">
              {itemCount}
            </span>
          )}
        </div>
        <span>Bag</span>
      </button>

      <button
        onClick={() => {
          if (isCustomerLoggedIn) {
            router.push('/account');
          } else {
            openCustomerAuthModal('register');
          }
        }}
        className={`flex flex-col items-center gap-1 transition-colors py-1 ${
          pathname === '/account' ? 'text-[#12372A] font-bold' : 'hover:text-[#D4AF37]'
        }`}
      >
        <User className="w-5 h-5 text-[#D4AF37]" />
        <span>Account</span>
      </button>

    </div>
  );
};
