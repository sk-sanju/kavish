'use client';

import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ShippingManagement: React.FC = () => {
  const { shippingConfig, updateShippingConfig } = useCart();

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(shippingConfig.freeShippingThreshold ?? 0);
  const [standardFlatRate, setStandardFlatRate] = useState(shippingConfig.standardFlatRate ?? 0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFreeShippingThreshold(shippingConfig.freeShippingThreshold ?? 0);
    setStandardFlatRate(shippingConfig.standardFlatRate ?? 0);
  }, [shippingConfig]);

  const handleSave = () => {
    updateShippingConfig({
      freeShippingThreshold: Number(freeShippingThreshold) || 0,
      standardFlatRate: Number(standardFlatRate) || 0
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const zones = [
    { id: 'z1', name: 'Domestic Kerala & South India', deliveryTime: '4 - 7 Days', carrier: 'Standard Express Delivery', status: 'Active' },
    { id: 'z2', name: 'Rest of India (Metro & North)', deliveryTime: '4 - 10 Days', carrier: 'Express Handloom Delivery', status: 'Active' },
    { id: 'z3', name: 'Special Priority Air Delivery', deliveryTime: '3 - 5 Days', carrier: 'Priority Handloom Air', status: 'Active' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Logistics &amp; Delivery Rules
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Shipping &amp; Logistics Management
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Logistics &amp; shipping configuration saved! Changes are active immediately across the store and checkout.</span>
        </div>
      )}

      {/* Free Shipping Rules Config */}
      <div className="bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8DDC7] pb-3">
          <Truck className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif font-bold text-lg text-[#12372A]">
            Complimentary Free Shipping Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#6B5846] mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              min="0"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-serif text-sm font-bold text-[#12372A]"
            />
            <span className="text-[10px] text-[#6B5846] mt-1 block">
              Set to <strong>0</strong> for 100% Free Shipping on all orders. Otherwise, orders at or above this amount get free shipping.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-[#6B5846] mb-1">Standard Flat Shipping Rate (₹)</label>
            <input
              type="number"
              min="0"
              value={standardFlatRate}
              onChange={(e) => setStandardFlatRate(Number(e.target.value))}
              className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-serif text-sm font-bold text-[#12372A]"
            />
            <span className="text-[10px] text-[#6B5846] mt-1 block">
              Set to <strong>0</strong> for no delivery charge. Applied to orders below the free shipping threshold.
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] px-5 py-2.5 rounded-xl font-bold uppercase text-xs border border-[#D4AF37] transition-all cursor-pointer shadow-sm flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Save Logistics Configuration</span>
        </button>
      </div>

      {/* Delivery Zones List */}
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs p-6 space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#12372A] border-b border-[#E8DDC7] pb-3">
          Active Courier Delivery Zones &amp; SLA
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {zones.map(z => (
            <div key={z.id} className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-2xl space-y-2">
              <div className="flex justify-between items-start font-bold text-[#12372A]">
                <span>{z.name}</span>
                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-300">
                  {z.status}
                </span>
              </div>
              <p className="text-[11px] text-[#6B5846]">Carrier: <strong className="text-[#12372A]">{z.carrier}</strong></p>
              <p className="text-[11px] text-[#6B5846]">Estimated SLA: <strong className="text-[#12372A]">{z.deliveryTime}</strong></p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
