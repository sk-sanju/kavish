import React from 'react';
import { X, CheckCircle, Truck, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OrderTrackerModal: React.FC = () => {
  const { selectedTrackingOrder, setSelectedTrackingOrder } = useAuth();

  if (!selectedTrackingOrder) return null;

  const STEPS = [
    { title: 'Order Confirmed', description: 'Payment verified & order assigned to atelier', done: true },
    { title: 'Handloom Quality Check', description: 'Inspected by Chendamangalam craft team', done: true },
    { title: 'Dispatched via Express', description: 'Package handed over to BlueDart Courier', done: true },
    { title: 'Out for Delivery', description: 'Courier agent en-route to delivery location', done: false },
    { title: 'Delivered', description: 'Package signed & delivered', done: false }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F1] w-full max-w-xl border border-[#D4AF37] shadow-2xl rounded-3xl p-6 sm:p-8 relative">
        
        <button
          onClick={() => setSelectedTrackingOrder(null)}
          className="absolute top-4 right-4 p-1 text-[#12372A] hover:text-[#D4AF37] w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">
          <Truck className="w-4 h-4" /> Live Courier Tracker
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#12372A]">
          Order #{selectedTrackingOrder.id}
        </h3>
        <p className="text-xs text-[#6B5846] mt-0.5">
          Tracking AWB: <strong className="text-[#12372A] font-mono">{selectedTrackingOrder.trackingNumber}</strong>
        </p>

        <div className="mt-4 bg-[#12372A] text-[#FAF8F1] p-4 flex items-center justify-between border-l-4 border-[#D4AF37] rounded-xl shadow-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block">Estimated Delivery</span>
            <span className="font-serif text-lg font-bold">{selectedTrackingOrder.estimatedDelivery}</span>
          </div>
          <span className="bg-[#D4AF37] text-[#12372A] text-[10px] font-bold uppercase px-3 py-1 rounded-full">
            {selectedTrackingOrder.status}
          </span>
        </div>

        <div className="mt-8 space-y-6 relative pl-6 border-l-2 border-[#D4AF37]/30 text-xs">
          {STEPS.map((step, idx) => (
            <div key={idx} className="relative">
              <div
                className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  step.done
                    ? 'bg-[#12372A] border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {step.done ? <CheckCircle className="w-3.5 h-3.5 fill-[#12372A]" /> : <Clock className="w-3 h-3" />}
              </div>

              <div>
                <h4 className={`font-serif text-base font-bold ${step.done ? 'text-[#12372A]' : 'text-gray-400'}`}>
                  {step.title}
                </h4>
                <p className="text-[#6B5846] text-[11px] mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-[#E8DDC7] text-xs text-[#6B5846] flex items-start gap-2 bg-white p-3 rounded-xl">
          <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#12372A] font-semibold">Shipping Destination:</strong>
            <p>{selectedTrackingOrder.shippingAddress.name}, {selectedTrackingOrder.shippingAddress.street}, {selectedTrackingOrder.shippingAddress.city}, {selectedTrackingOrder.shippingAddress.pincode}</p>
          </div>
        </div>

        <button
          onClick={() => setSelectedTrackingOrder(null)}
          className="mt-6 w-full bg-[#12372A] text-[#FAF8F1] py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors rounded-xl shadow-md"
        >
          Close Order Tracker
        </button>

      </div>
    </div>
  );
};
