'use client';

import React from 'react';
import { X, CheckCircle2, Clock, Truck, MapPin, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { OrderStatus } from '../../types';

const STAGES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'New Order', label: 'Order Received', desc: 'Payment verified & order created' },
  { status: 'Confirmed', label: 'Confirmed', desc: 'Atelier verified & assigned to loom master' },
  { status: 'Processing', label: 'Artisan Weaving', desc: 'Quality inspection & weave verification' },
  { status: 'Packed', label: 'Luxury Packed', desc: 'GI hallmark tag attached & gift boxed' },
  { status: 'Ready to Dispatch', label: 'Ready for Pickup', desc: 'Manifested for courier partner handoff' },
  { status: 'Shipped', label: 'In Transit', desc: 'Dispatched from Kuthampully loom house' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier agent en route to recipient destination' },
  { status: 'Delivered', label: 'Delivered', desc: 'Handed over in tamper-evident sealed luxury box' }
];

const STAGE_ORDER: Record<string, number> = {
  'Pending': 0,
  'New Order': 0,
  'Confirmed': 1,
  'Processing': 2,
  'Packed': 3,
  'Ready to Dispatch': 4,
  'Dispatched': 5,
  'Shipped': 5,
  'Out for Delivery': 6,
  'Delivered': 7
};

export const OrderTrackerModal: React.FC = () => {
  const { selectedTrackingOrder, setSelectedTrackingOrder } = useAuth();

  if (!selectedTrackingOrder) return null;

  const currentStageIndex = STAGE_ORDER[selectedTrackingOrder.status] ?? 0;
  const isCancelled = selectedTrackingOrder.status === 'Cancelled';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#F8F5EF] w-full max-w-xl border border-[#B99A61] shadow-2xl rounded-3xl p-6 sm:p-8 relative my-auto">
        
        <button
          onClick={() => setSelectedTrackingOrder(null)}
          className="absolute top-4 right-4 p-1 text-[#641E2B] hover:text-[#B99A61] w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#B99A61] text-xs font-bold uppercase tracking-wider mb-1">
          <Truck className="w-4 h-4" /> Live Courier Tracker
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#641E2B]">
          Order #{selectedTrackingOrder.id}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E685D] mt-1 font-mono">
          <span>Courier: <strong className="text-[#641E2B]">{selectedTrackingOrder.courierProvider || 'Express Logistics'}</strong></span>
          {selectedTrackingOrder.trackingNumber && (
            <>
              <span>•</span>
              <span>AWB: <strong className="text-[#B99A61]">{selectedTrackingOrder.trackingNumber}</strong></span>
            </>
          )}
        </div>

        <div className="mt-4 bg-[#641E2B] text-[#F8F5EF] p-4 flex items-center justify-between border-l-4 border-[#B99A61] rounded-2xl shadow-sm">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#B99A61] block">Estimated Delivery</span>
            <span className="font-serif text-base font-bold text-white">{selectedTrackingOrder.estimatedDelivery || '4–10 Days'}</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedTrackingOrder.trackingUrl && (
              <a
                href={selectedTrackingOrder.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#B99A61] text-[#641E2B] rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#D9BA78] transition-colors"
              >
                <span>Courier Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <span className="bg-[#4A1520] text-[#B99A61] border border-[#B99A61]/40 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
              {selectedTrackingOrder.status}
            </span>
          </div>
        </div>

        {/* 8-Stage Pipeline Progress */}
        <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 relative pl-6 border-l-2 border-[#B99A61]/30 text-xs">
          {STAGES.map((step, idx) => {
            const isDone = !isCancelled && currentStageIndex >= idx;
            const isCurrent = !isCancelled && currentStageIndex === idx;

            return (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent
                      ? 'bg-[#B99A61] border-[#641E2B] text-[#641E2B] ring-2 ring-[#B99A61]/40'
                      : isDone
                      ? 'bg-[#641E2B] border-[#B99A61] text-[#B99A61]'
                      : 'bg-white border-gray-300 text-gray-300'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-serif text-sm font-bold ${isCurrent ? 'text-[#641E2B] font-black' : isDone ? 'text-[#641E2B]' : 'text-gray-400'}`}>
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[9px] bg-[#641E2B] text-[#B99A61] px-1.5 py-0.5 rounded font-sans font-bold uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[#6E685D] text-[11px] mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shipping Destination */}
        <div className="mt-6 pt-4 border-t border-[#E8DFD0] text-xs text-[#6E685D] flex items-start gap-2 bg-white p-3.5 rounded-xl border border-[#E8DFD0]">
          <MapPin className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#641E2B] font-semibold">Shipping Destination:</strong>
            <p className="mt-0.5 leading-relaxed">
              {selectedTrackingOrder.shippingAddress.name}, {selectedTrackingOrder.shippingAddress.street}, {selectedTrackingOrder.shippingAddress.city}, {selectedTrackingOrder.shippingAddress.state} - {selectedTrackingOrder.shippingAddress.pincode}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedTrackingOrder(null)}
          className="mt-6 w-full bg-[#641E2B] text-[#F8F5EF] py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#B99A61] hover:text-[#641E2B] transition-colors rounded-xl shadow-md border border-[#B99A61] cursor-pointer"
        >
          Close Order Tracker
        </button>

      </div>
    </div>
  );
};
