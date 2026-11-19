'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, ShoppingBag, Search, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { setIsSearchOpen } = useModal();
  const { isCustomerLoggedIn, openCustomerAuthModal } = useAuth();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] shadow-2xl py-2 px-3 flex items-center justify-around text-[10px] uppercase tracking-wider font-semibold text-[#1A1A1A] glass-header border-t border-[#E5E7EB]">
      
      <button
        onClick={() => router.push('/')}
        className={`flex flex-col items-center gap-1 transition-colors py-1 ${
          pathname === '/' ? 'text-[#111111] font-bold' : 'hover:text-[#C5A15A]'
        }`}
      >
        <Home className="w-5 h-5 text-[#C5A15A]" />
        <span>Home</span>
      </button>

      <button
        onClick={() => router.push('/shop')}
        className={`flex flex-col items-center gap-1 transition-colors py-1 ${
          pathname.startsWith('/shop') ? 'text-[#111111] font-bold' : 'hover:text-[#C5A15A]'
        }`}
      >
        <ShoppingBag className="w-5 h-5 text-[#C5A15A]" />
        <span>Shop</span>
      </button>

      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center gap-1 hover:text-[#C5A15A] transition-colors py-1"
      >
        <Search className="w-5 h-5 text-[#C5A15A]" />
        <span>Search</span>
      </button>

      <button
        onClick={() => router.push('/wishlist')}
        className={`flex flex-col items-center gap-1 transition-colors relative py-1 ${
          pathname === '/wishlist' ? 'text-[#111111] font-bold' : 'hover:text-[#C5A15A]'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5 text-[#C5A15A]" />
          {mounted && wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#C5A15A] text-[#111111] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
        <span>Saved</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 hover:text-[#C5A15A] transition-colors relative py-1"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#111111]" />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#111111] text-[#FFFFFF] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#C5A15A]">
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
          pathname === '/account' ? 'text-[#111111] font-bold' : 'hover:text-[#C5A15A]'
        }`}
      >
        <User className="w-5 h-5 text-[#C5A15A]" />
        <span>Account</span>
      </button>

    </div>
  );
};
