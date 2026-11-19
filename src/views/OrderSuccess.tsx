'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Truck, FileText, ArrowRight, Printer, ShoppingBag, MapPin } from 'lucide-react';
const logoImg = '/assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { POLICY_CONFIG } from '../config/policyConfig';
import { OptimizedImage } from '../components/common/OptimizedImage';
import type { Order } from '../types';

export const OrderSuccess: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setSelectedTrackingOrder } = useAuth();
  const { formatPrice } = useCurrency();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // 1. Check query param orderId or load from user orders
    const queryOrderId = searchParams.get('orderId');
    if (queryOrderId && user.orders.length > 0) {
      const match = user.orders.find((o) => o.id === queryOrderId);
      if (match) {
        setOrder(match);
        return;
      }
    }

    // 2. Fallback to latest order in user profile if recent
    if (user.orders.length > 0) {
      setOrder(user.orders[0]);
    }
  }, [searchParams, user.orders]);

  const handlePrint = () => {
    window.print();
  };

  const handleTrack = () => {
    if (order) {
      setSelectedTrackingOrder(order);
      router.push(`/track-order?orderId=${order.id}`);
    } else {
      router.push('/track-order');
    }
  };

  if (!order) {
    return (
      <div className="py-16 bg-[#FFFFFF] min-h-screen animate-fadeIn flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-12 border border-[#E5E7EB] rounded-3xl shadow-xl max-w-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#111111] text-[#C5A15A] flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
            No Active Order Found
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            If you recently completed a payment, you can track your parcel using your Order ID, or browse our latest handloom arrivals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => router.push('/track-order')}
              className="flex-1 bg-[#111111] text-[#FFFFFF] hover:bg-[#C5A15A] hover:text-[#111111] py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Track by Order ID
            </button>
            <button
              onClick={() => router.push('/shop')}
              className="flex-1 bg-white text-[#111111] border border-[#111111] hover:bg-[#FFFFFF] py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Shop Handlooms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FFFFFF] min-h-screen animate-fadeIn pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img
            src={logoImg}
            alt="KAVISH - Kerala Ethnic Wear"
            className="h-12 sm:h-14 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => router.push('/')}
          />
          <p className="text-[10px] sm:text-xs text-[#C5A15A] font-semibold uppercase tracking-widest mt-1">
            Order Confirmation &amp; Tax Receipt
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white p-6 sm:p-10 border border-[#C5A15A] shadow-2xl rounded-3xl space-y-6">
          
          {/* Confirmed Banner */}
          <div className="text-center space-y-2 border-b border-[#E5E7EB] pb-6">
            <div className="w-16 h-16 rounded-full bg-[#111111] text-[#C5A15A] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#111111]">
              Order Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Thank you, <strong className="text-[#111111]">{order.shippingAddress.name}</strong>. Your order <strong className="text-[#111111]">#{order.id}</strong> has been received and assigned to our Kuthampully master weaving atelier.
            </p>
          </div>

          {/* Key Reference Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E5E7EB] text-xs">
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block">Order ID</span>
              <strong className="font-mono text-[#111111] text-xs sm:text-sm">{order.id}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block">Tax Invoice</span>
              <strong className="font-mono text-[#C5A15A] text-xs sm:text-sm">{order.invoiceId || `KV-INV-2026-${order.id.replace('KV-ORD-', '')}`}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block">Order Date</span>
              <strong className="text-[#111111]">{order.date}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block">Est. Delivery</span>
              <strong className="text-green-800">{order.estimatedDelivery || POLICY_CONFIG.STANDARD_DELIVERY_TIME}</strong>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="space-y-3">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#111111]">
              Ordered Items
            </h3>
            <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    {item.product.images?.[0] && (
                      <OptimizedImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        preset="thumbnail"
                        aspectRatio="3/4"
                        containerClassName="w-12 h-16 rounded-lg border border-[#E5E7EB] shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-[#111111]">{item.product.name}</h4>
                      <p className="text-[10px] text-[#6B7280]">
                        Size: {item.size} • Color: {item.color.name} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <strong className="text-xs font-bold text-[#111111]">
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown & Shipping Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] text-xs space-y-2 self-start">
              <div className="flex items-center gap-1.5 font-bold text-[#111111] border-b border-[#E5E7EB] pb-2">
                <MapPin className="w-4 h-4 text-[#C5A15A]" />
                <span>Shipping Address</span>
              </div>
              <p className="text-[#6B7280] leading-relaxed">
                <strong className="text-[#111111]">{order.shippingAddress.name}</strong><br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] text-xs space-y-2">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#1A1A1A]">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount Applied:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B7280]">
                <span>Express Courier Delivery:</span>
                <span className="font-semibold text-green-700">
                  {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B7280] pt-1 border-t border-[#E5E7EB]/60">
                <span>Payment Reference:</span>
                <span className="font-mono text-[11px] text-[#111111] truncate max-w-[180px]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-serif font-bold text-[#111111] pt-2 border-t border-[#E5E7EB]">
                <span>Total Amount Paid:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

          </div>

          {/* Email Notification Alert */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              A digital tax receipt and dispatch notification has been dispatched to <strong>{order.shippingAddress.phone || user.email}</strong> &amp; <strong>{POLICY_CONFIG.ADMIN_NOTIFICATION_EMAIL}</strong>.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              onClick={handleTrack}
              className="flex-1 bg-[#111111] text-[#FFFFFF] hover:bg-[#C5A15A] hover:text-[#111111] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#C5A15A] shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#C5A15A]" />
              <span>Track Live Package</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-3.5 bg-white text-[#111111] border border-[#111111] hover:bg-[#FFFFFF] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={() => router.push('/shop')}
              className="flex-1 bg-white text-[#111111] border border-[#111111] hover:bg-[#FFFFFF] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
