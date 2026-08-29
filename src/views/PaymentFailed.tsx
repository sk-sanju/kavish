'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, ShoppingCart, MessageSquare, Phone, ShieldAlert } from 'lucide-react';
const logoImg = '/assets/logo.png';
import { POLICY_CONFIG } from '../config/policyConfig';

export const PaymentFailed: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId') || searchParams.get('order_id');
  const errorReason =
    searchParams.get('reason') ||
    searchParams.get('error') ||
    'The transaction was declined by the bank or gateway, or the payment window was closed.';

  return (
    <div className="py-12 sm:py-16 bg-[#FAF8F1] min-h-screen animate-fadeIn flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-10 border border-red-200 shadow-2xl rounded-3xl max-w-lg w-full text-center space-y-6">
        
        {/* Brand Logo */}
        <img
          src={logoImg}
          alt="KAVISH - Kerala Ethnic Wear"
          className="h-10 sm:h-12 w-auto object-contain mx-auto cursor-pointer"
          onClick={() => router.push('/')}
        />

        {/* Failure Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        {/* Title */}
        <div>
          <span className="text-[10px] uppercase font-bold text-red-600 tracking-widest block mb-1">
            Transaction Incomplete
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A]">
            Payment Not Completed
          </h1>
        </div>

        {/* Details Box */}
        <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 text-left text-xs space-y-2 text-red-950">
          {orderId && (
            <div className="flex justify-between border-b border-red-200 pb-1.5 font-mono">
              <span className="font-semibold text-red-800">Order Reference:</span>
              <strong className="text-[#12372A]">{orderId}</strong>
            </div>
          )}
          <div>
            <strong className="block text-red-800 font-semibold mb-0.5">Reason for Failure:</strong>
            <p className="text-red-900 leading-relaxed text-[11px]">{errorReason}</p>
          </div>
          <div className="pt-1.5 border-t border-red-200 text-[11px] text-red-800 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-700" />
            <span>If any amount was debited, it will be automatically refunded by your bank within 3–5 days.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#D4AF37] shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
            <span>Retry Payment at Checkout</span>
          </button>

          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-white text-[#12372A] border border-[#12372A] hover:bg-[#FAF8F1] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Review Cart Items</span>
          </button>
        </div>

        {/* Need Help */}
        <div className="pt-4 border-t border-[#E8DDC7] text-xs text-[#6B5846] space-y-2">
          <p className="font-semibold text-[#12372A]">Need help completing your order?</p>
          <div className="flex justify-center gap-4">
            <a
              href={`https://wa.me/${POLICY_CONFIG.WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#12372A] hover:text-[#D4AF37] font-bold flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>
            <span className="text-[#E8DDC7]">•</span>
            <a
              href={`tel:${POLICY_CONFIG.SUPPORT_PHONE}`}
              className="text-[#12372A] hover:text-[#D4AF37] font-bold flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{POLICY_CONFIG.SUPPORT_PHONE}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
