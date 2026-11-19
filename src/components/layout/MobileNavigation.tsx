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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F5EF] shadow-2xl py-2 px-3 flex items-center justify-around text-[10px] uppercase tracking-wider font-semibold text-[#292522] glass-header border-t border-[#E8DFD0]">
      
      <button
        onClick={() => router.push('/')}
        className={`flex flex-col items-center gap-1 transition-colors py-1 ${
          pathname === '/' ? 'text-[#641E2B] font-bold' : 'hover:text-[#B99A61]'
        }`}
      >
        <Home className="w-5 h-5 text-[#B99A61]" />
        <span>Home</span>
      </button>

      <button
        onClick={() => router.push('/shop')}
        className={`flex flex-col items-center gap-1 transition-colors py-1 ${
          pathname.startsWith('/shop') ? 'text-[#641E2B] font-bold' : 'hover:text-[#B99A61]'
        }`}
      >
        <ShoppingBag className="w-5 h-5 text-[#B99A61]" />
        <span>Shop</span>
      </button>

      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center gap-1 hover:text-[#B99A61] transition-colors py-1"
      >
        <Search className="w-5 h-5 text-[#B99A61]" />
        <span>Search</span>
      </button>

      <button
        onClick={() => router.push('/wishlist')}
        className={`flex flex-col items-center gap-1 transition-colors relative py-1 ${
          pathname === '/wishlist' ? 'text-[#641E2B] font-bold' : 'hover:text-[#B99A61]'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5 text-[#B99A61]" />
          {mounted && wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#B99A61] text-[#641E2B] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
        <span>Saved</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 hover:text-[#B99A61] transition-colors relative py-1"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#641E2B]" />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#641E2B] text-[#F8F5EF] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#B99A61]">
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
          pathname === '/account' ? 'text-[#641E2B] font-bold' : 'hover:text-[#B99A61]'
        }`}
      >
        <User className="w-5 h-5 text-[#B99A61]" />
        <span>Account</span>
      </button>

    </div>
  );
};
