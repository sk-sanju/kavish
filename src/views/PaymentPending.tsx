'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Clock, RefreshCw, AlertTriangle, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
const logoImg = '/assets/logo.png';
import { POLICY_CONFIG } from '../config/policyConfig';

export const PaymentPending: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const orderId = searchParams.get('orderId') || searchParams.get('order_id') || 'KV-ORD-PENDING';

  const handleCheckStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // Navigate to order tracker or success if verified
      router.push(`/track-order?orderId=${orderId}`);
    }, 1500);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF8F1] min-h-screen animate-fadeIn flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-10 border border-amber-300 shadow-2xl rounded-3xl max-w-lg w-full text-center space-y-6">
        
        {/* Brand Logo */}
        <img
          src={logoImg}
          alt="KAVISH - Kerala Ethnic Wear"
          className="h-10 sm:h-12 w-auto object-contain mx-auto cursor-pointer"
          onClick={() => router.push('/')}
        />

        {/* Pending Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        {/* Title */}
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-widest block mb-1">
            Bank Awaiting Confirmation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A]">
            Payment Verification in Progress
          </h1>
        </div>

        {/* Details Box */}
        <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-left text-xs space-y-2.5 text-amber-950">
          <div className="flex justify-between border-b border-amber-200 pb-1.5 font-mono">
            <span className="font-semibold text-amber-900">Order Reference:</span>
            <strong className="text-[#12372A]">{orderId}</strong>
          </div>
          <div className="flex items-start gap-2 text-amber-900 leading-relaxed text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Please do NOT attempt a duplicate payment.</strong> Your bank or UPI app is currently confirming the transaction with Razorpay.
            </span>
          </div>
          <div className="flex items-start gap-2 text-amber-900 leading-relaxed text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Once confirmed, your order will be automatically booked and you will receive an instant confirmation email and WhatsApp alert.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#D4AF37] shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Re-Checking Gateway Status...' : 'Re-Check Payment Status'}</span>
          </button>

          <button
            onClick={() => router.push('/track-order')}
            className="w-full bg-white text-[#12372A] border border-[#12372A] hover:bg-[#FAF8F1] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Go to Order Tracker
          </button>
        </div>

        {/* Support Options */}
        <div className="pt-4 border-t border-[#E8DDC7] text-xs text-[#6B5846] space-y-2">
          <p className="font-semibold text-[#12372A]">Need help verifying this transaction?</p>
          <div className="flex justify-center gap-4">
            <a
              href={`https://wa.me/${POLICY_CONFIG.WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#12372A] hover:text-[#D4AF37] font-bold flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge</span>
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
