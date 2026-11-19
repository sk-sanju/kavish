'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, X, Users } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { PromoOffer } from '../../types';

export const DiscountManagement: React.FC = () => {
  const { offers, addOffer, updateOffer, toggleOfferStatus, deleteOffer } = useProducts();
  const { addAuditLog } = useAdmin();
  const { formatPrice } = useCurrency();

  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<PromoOffer | null>(null);
  const [form, setForm] = useState<Partial<PromoOffer>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 2000,
    maxDiscountAmount: 1000,
    usageLimit: undefined,
    usageCount: 0,
    expiryDate: '2026-12-31',
    isActive: true,
    description: ''
  });

  const activeCount = offers.filter(o => o.isActive).length;
  const totalUsage = offers.reduce((acc, o) => acc + (o.usageCount || 0), 0);
  const totalDiscountGiven = totalUsage * 350;

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setForm({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 2000,
      maxDiscountAmount: 1000,
      usageLimit: undefined,
      usageCount: 0,
      expiryDate: '2026-12-31',
      isActive: true,
      description: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (offer: PromoOffer) => {
    setEditingOffer(offer);
    setForm({
      id: offer.id,
      code: offer.code,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      minOrderAmount: offer.minOrderAmount,
      maxDiscountAmount: offer.maxDiscountAmount,
      usageLimit: offer.usageLimit,
      usageCount: offer.usageCount || 0,
      expiryDate: offer.expiryDate,
      isActive: offer.isActive,
      description: offer.description || ''
    });
    setShowModal(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = (form.code || '').trim().toUpperCase();

    if (editingOffer) {
      const updatedOffer: PromoOffer = {
        ...editingOffer,
        ...form,
        id: editingOffer.id,
        code: cleanCode,
        discountValue: Number(form.discountValue || 0),
        minOrderAmount: Number(form.minOrderAmount || 0),
        usageCount: Number(form.usageCount ?? editingOffer.usageCount ?? 0),
        usageLimit: form.usageLimit !== undefined && form.usageLimit !== ('' as any) && Number(form.usageLimit) > 0 ? Number(form.usageLimit) : undefined,
        isActive: form.isActive ?? true,
      } as PromoOffer;

      updateOffer(updatedOffer);
      addAuditLog({
        adminName: 'Sanjay Suresh (Super Admin)',
        adminRole: 'Super Admin',
        action: `Updated Promo Coupon Code: ${updatedOffer.code}`,
        entity: 'PromoOffer',
        entityId: updatedOffer.id,
        newValue: `${updatedOffer.discountValue}${updatedOffer.discountType === 'percentage' ? '%' : '₹'} off, Max Users: ${updatedOffer.usageLimit ?? 'Unlimited'}`
      });
    } else {
      const created = addOffer({
        ...form,
        code: cleanCode,
        discountValue: Number(form.discountValue || 0),
        minOrderAmount: Number(form.minOrderAmount || 0),
        usageLimit: form.usageLimit !== undefined && form.usageLimit !== ('' as any) && Number(form.usageLimit) > 0 ? Number(form.usageLimit) : undefined,
        usageCount: form.usageCount ? Number(form.usageCount) : 0,
        isActive: form.isActive ?? true,
      });

      addAuditLog({
        adminName: 'Sanjay Suresh (Super Admin)',
        adminRole: 'Super Admin',
        action: `Created Promo Coupon Code: ${created.code}`,
        entity: 'PromoOffer',
        entityId: created.id,
        newValue: `${created.discountValue}${created.discountType === 'percentage' ? '%' : '₹'} off, Max Users: ${created.usageLimit ?? 'Unlimited'}`
      });
    }

    setShowModal(false);
    setEditingOffer(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A15A] block">
            Promotional Engine
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-0.5">
            Discounts &amp; Coupon Codes ({offers.length})
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#111111] text-[#FFFFFF] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#C5A15A] hover:text-[#111111] transition-all flex items-center gap-2 border border-[#C5A15A] shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C5A15A]" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B7280]">Active Coupons</span>
          <div className="font-serif text-xl font-bold text-[#111111]">{activeCount} Codes</div>
          <span className="text-[10px] text-green-700 font-bold">Usable at checkout</span>
        </div>

        <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B7280]">Total Usage Count</span>
          <div className="font-serif text-xl font-bold text-[#111111]">{totalUsage} Users</div>
          <span className="text-[10px] text-gray-500">Applied by patrons</span>
        </div>

        <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B7280]">Estimated Discounts Given</span>
          <div className="font-serif text-xl font-bold text-[#111111]">{formatPrice(totalDiscountGiven)}</div>
          <span className="text-[10px] text-gray-500">Savings provided</span>
        </div>

        <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B7280]">Top Code</span>
          <div className="font-mono text-lg font-bold text-[#C5A15A] uppercase">
            {offers[0]?.code || 'KAVISH10'}
          </div>
          <span className="text-[10px] text-gray-500">{offers[0]?.description || 'Welcome Discount'}</span>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#111111] text-[#FFFFFF] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Coupon Code</th>
                <th className="p-3.5">Discount Rule</th>
                <th className="p-3.5">Min Order Spend</th>
                <th className="p-3.5">User Count / Limit</th>
                <th className="p-3.5">Expiry Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {offers.map(o => {
                const isLimitReached = o.usageLimit != null && o.usageLimit > 0 && (o.usageCount || 0) >= o.usageLimit;

                return (
                  <tr key={o.id} className="hover:bg-[#FFFFFF] transition-colors">
                    <td className="p-3.5 font-mono text-sm font-bold text-[#111111] uppercase">
                      <div className="flex items-center gap-2">
                        <span>{o.code}</span>
                        {o.description && (
                          <span className="text-[10px] font-sans font-normal text-[#6B7280] hidden sm:inline">
                            ({o.description})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 font-bold">
                      <span className="bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#E5E7EB] text-[#111111]">
                        {o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono">{formatPrice(o.minOrderAmount)}</td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Users className="w-3.5 h-3.5 text-[#6B7280]" />
                        <span className="font-bold text-[#111111]">{o.usageCount || 0}</span>
                        <span className="text-[#6B7280]">
                          {o.usageLimit ? `/ ${o.usageLimit} users` : 'users (Unlimited)'}
                        </span>
                        {isLimitReached && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                            Limit Reached
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[#6B7280]">{o.expiryDate}</td>

                    <td className="p-3.5">
                      <button
                        onClick={() => toggleOfferStatus(o.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border transition-colors ${
                          o.isActive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-200 text-gray-700 border-gray-300'
                        }`}
                      >
                        {o.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(o)}
                          className="p-1.5 text-[#111111] hover:bg-[#111111]/10 rounded-lg transition-colors"
                          title="Edit Coupon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete coupon code ${o.code}?`)) {
                              deleteOffer(o.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Coupon Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto">
            
            {/* Modal Fixed Header */}
            <div className="p-5 bg-[#111111] text-[#FFFFFF] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FFFFFF]">
                  {editingOffer ? `Edit Promo Code: ${editingOffer.code}` : 'Create New Promo Code'}
                </h3>
                <p className="text-xs text-[#E5E7EB]/80">
                  {editingOffer ? 'Modify discount value, user usage limits & rules' : 'Configure discount rules, user eligibility & limits'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-[#E5E7EB] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="coupon-modal-form" onSubmit={handleSaveCoupon} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-semibold text-[#6B7280] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KAVISH2026"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF] font-mono text-sm font-bold uppercase text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#6B7280] mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF] font-bold text-[#111111]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#6B7280] mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF] font-bold text-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#6B7280] mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                    className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF] font-bold text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6B7280] mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF] font-bold text-[#111111]"
                  />
                </div>
              </div>

              {/* User Count & Usage Limit Section */}
              <div className="p-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C5A15A]" />
                  <span className="font-serif font-bold text-[#111111]">User Count &amp; Redemption Limits</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#6B7280] mb-1">
                      Max User Limit (Total Uses)
                    </label>
                    <input
                      type="number"
                      min={1}
                      placeholder="e.g. 100 (Blank = Unlimited)"
                      value={form.usageLimit ?? ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          usageLimit: e.target.value ? Number(e.target.value) : undefined
                        })
                      }
                      className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-white text-[#111111] font-bold"
                    />
                    <p className="text-[10px] text-[#6B7280] mt-0.5">
                      Leave empty for unlimited customer redemptions.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#6B7280] mb-1">
                      Current Used Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.usageCount ?? 0}
                      onChange={(e) => setForm({ ...form, usageCount: Number(e.target.value) })}
                      className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-white text-[#111111] font-mono font-bold"
                    />
                    <p className="text-[10px] text-[#6B7280] mt-0.5">
                      Times this coupon has been applied so far.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#6B7280] mb-1">Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Festive discount on Kerala Kasavu handlooms"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF]"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="font-semibold text-[#6B7280]">Coupon Status</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="accent-[#111111] w-4 h-4 rounded"
                  />
                  <span className="font-bold text-[#111111]">
                    {form.isActive ? 'Active (Live on checkout)' : 'Disabled'}
                  </span>
                </label>
              </div>
            </form>

            {/* Modal Fixed Footer */}
            <div className="p-4 bg-[#FFFFFF] border-t border-[#E5E7EB] flex gap-3 shrink-0">
              <button
                type="submit"
                form="coupon-modal-form"
                className="flex-1 bg-[#111111] text-[#FFFFFF] py-3 uppercase font-bold text-xs rounded-xl border border-[#C5A15A] hover:bg-[#C5A15A] hover:text-[#111111] transition-all"
              >
                {editingOffer ? 'Update Coupon Code' : 'Publish Coupon Code'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-3 border border-[#E5E7EB] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
