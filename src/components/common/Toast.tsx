'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-50 bg-[#641E2B] text-[#F8F5EF] border border-[#B99A61] shadow-2xl px-6 py-3.5 rounded-full flex items-center gap-3 animate-slideUp">
      <CheckCircle2 className="w-5 h-5 text-[#B99A61] shrink-0" />
      <div className="text-xs font-sans font-medium">{toastMessage}</div>
    </div>
  );
};
