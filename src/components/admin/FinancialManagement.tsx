'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAdmin } from '../../context/AdminContext';

import { useAuth } from '../../context/AuthContext';

export const FinancialManagement: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { gstConfig, updateGSTConfig } = useAdmin();
  const { user } = useAuth();

  // Financial Calculations for Indian Clothing Business
  const grossSales = user.orders.reduce((acc, o) => acc + o.subtotal, 0);
  const totalDiscounts = user.orders.reduce((acc, o) => acc + o.discount, 0);
  const totalRefunds = user.orders.filter(o => o.status === 'Refunded').reduce((acc, o) => acc + o.total, 0);

  const netSales = Math.max(0, grossSales - totalDiscounts - totalRefunds);
  const taxableAmount = Math.round(netSales / (1 + (gstConfig.gstRate / 100)));
  const totalGstCollected = netSales - taxableAmount;
  const cgstAmount = Math.round(totalGstCollected / 2);
  const sgstAmount = Math.round(totalGstCollected / 2);
  const gatewayFees = Math.round(netSales * 0.02); // 2% Razorpay fee
  const netRevenue = netSales - gatewayFees;

  const handleExportGstReport = () => {
    const csvContent = [
      ['Kavish Luxury Handlooms - Official GST & Financial Report (HSN: 5208)'],
      ['Generated On', new Date().toLocaleString()],
      ['Gross Sales', grossSales],
      ['Total Discounts Offered', totalDiscounts],
      ['Refunds Processed', totalRefunds],
      ['Net Sales Value', netSales],
      ['Taxable Turnover Value', taxableAmount],
      ['Total GST Collected (5%)', totalGstCollected],
      ['CGST (2.5%)', cgstAmount],
      ['SGST (2.5%)', sgstAmount],
      ['Razorpay Gateway Fees (2%)', gatewayFees],
      ['Net Revenue Realized', netRevenue]
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kavish_GST_Financial_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A15A] block">
            Indian Clothing Tax &amp; Revenue Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-0.5">
            GST &amp; Financial Management (HSN: {gstConfig.hsnCode})
          </h1>
        </div>

        <button
          onClick={handleExportGstReport}
          className="bg-[#111111] text-[#FFFFFF] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#C5A15A] hover:text-[#111111] transition-all flex items-center gap-2 border border-[#C5A15A] shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#C5A15A]" />
          <span>Export GST Report (CSV)</span>
        </button>
      </div>

      {/* 8 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B7280]">Gross Sales</span>
          <div className="font-serif text-xl font-bold text-[#111111]">{formatPrice(grossSales)}</div>
          <span className="text-[10px] text-gray-500">Before discounts &amp; refunds</span>
        </div>

        <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B7280]">Net Sales Realized</span>
          <div className="font-serif text-xl font-bold text-green-700">{formatPrice(netSales)}</div>
          <span className="text-[10px] text-green-700 font-bold">After discounts &amp; returns</span>
        </div>

        <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B7280]">Total GST Collected (5%)</span>
          <div className="font-serif text-xl font-bold text-[#C5A15A]">{formatPrice(totalGstCollected)}</div>
          <span className="text-[10px] text-gray-500">CGST + SGST Combined</span>
        </div>

        <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B7280]">Net Revenue Realized</span>
          <div className="font-serif text-xl font-bold text-[#111111]">{formatPrice(netRevenue)}</div>
          <span className="text-[10px] text-gray-500">After 2% Razorpay fees</span>
        </div>
      </div>

      {/* GST Breakdown Detail Card */}
      <div className="bg-white p-6 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#111111] border-b border-[#E5E7EB] pb-3">
          Apparel Handloom GST Tax Split (HSN 5208)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="text-[#6B7280]">Taxable Turnover Value:</span>
            <div className="font-serif text-lg font-bold text-[#111111]">{formatPrice(taxableAmount)}</div>
            <span className="text-[10px] text-gray-500">Net sales minus tax</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="text-[#6B7280]">CGST (2.5% Intra-State):</span>
            <div className="font-serif text-lg font-bold text-[#111111]">{formatPrice(cgstAmount)}</div>
            <span className="text-[10px] text-gray-500">Central Goods &amp; Services Tax</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl space-y-1">
            <span className="text-[#6B7280]">SGST (2.5% Kerala State):</span>
            <div className="font-serif text-lg font-bold text-[#111111]">{formatPrice(sgstAmount)}</div>
            <span className="text-[10px] text-gray-500">State Goods &amp; Services Tax</span>
          </div>
        </div>

        {/* GST Configuration Editor */}
        <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
          <h4 className="font-serif font-bold text-[#111111]">Store GST Settings &amp; Rules</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-[#6B7280] mb-1">Standard Apparel GST Rate (%)</label>
              <input
                type="number"
                value={gstConfig.gstRate}
                onChange={(e) => updateGSTConfig({ gstRate: Number(e.target.value) })}
                className="w-full border border-[#E5E7EB] p-2 rounded-xl bg-[#FFFFFF] font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#6B7280] mb-1">HSN Commodity Code</label>
              <input
                type="text"
                value={gstConfig.hsnCode}
                onChange={(e) => updateGSTConfig({ hsnCode: e.target.value })}
                className="w-full border border-[#E5E7EB] p-2 rounded-xl bg-[#FFFFFF] font-mono"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={gstConfig.includeTaxInPrice}
                  onChange={(e) => updateGSTConfig({ includeTaxInPrice: e.target.checked })}
                  className="accent-[#111111] w-4 h-4"
                />
                <span>Prices Displayed Include GST</span>
              </label>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
