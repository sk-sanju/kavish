import React, { useState } from 'react';

export const ShippingManagement: React.FC = () => {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2000);
  const [standardFlatRate, setStandardFlatRate] = useState(150);

  const zones = [
    { id: 'z1', name: 'Domestic South India (Kerala, TN, KA)', deliveryTime: '2 - 3 Days', carrier: 'BlueDart Express Air', status: 'Active' },
    { id: 'z2', name: 'Rest of India (Metro & North)', deliveryTime: '3 - 5 Days', carrier: 'BlueDart / Delhivery', status: 'Active' },
    { id: 'z3', name: 'International (US, Europe, UAE, Aus)', deliveryTime: '5 - 7 Days', carrier: 'DHL Express Worldwide', status: 'Active' }
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

      {/* Free Shipping Rules Config */}
      <div className="bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#12372A] border-b border-[#E8DDC7] pb-3">
          Complimentary Free Shipping Rules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#6B5846] mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-serif text-sm font-bold text-[#12372A]"
            />
            <span className="text-[10px] text-[#6B5846] mt-1 block">Orders equal to or above this amount get free BlueDart Air shipping.</span>
          </div>

          <div>
            <label className="block font-semibold text-[#6B5846] mb-1">Standard Flat Shipping Rate (₹)</label>
            <input
              type="number"
              value={standardFlatRate}
              onChange={(e) => setStandardFlatRate(Number(e.target.value))}
              className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-serif text-sm font-bold text-[#12372A]"
            />
            <span className="text-[10px] text-[#6B5846] mt-1 block">Applied to orders below the free shipping threshold.</span>
          </div>
        </div>

        <button
          onClick={() => alert('Shipping rules saved successfully!')}
          className="bg-[#12372A] text-[#FAF8F1] px-5 py-2.5 rounded-xl font-bold uppercase text-xs border border-[#D4AF37]"
        >
          Save Logistics Configuration
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
