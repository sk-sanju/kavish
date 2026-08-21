import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { PromoOffer } from '../../types';

export const DiscountManagement: React.FC = () => {
  const { offers, addOffer, toggleOfferStatus, deleteOffer } = useProducts();
  const { addAuditLog } = useAdmin();
  const { formatPrice } = useCurrency();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<PromoOffer>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 2000,
    maxDiscountAmount: 1000,
    expiryDate: '2026-12-31',
    isActive: true,
    description: ''
  });

  const activeCount = offers.filter(o => o.isActive).length;
  const totalUsage = offers.reduce((acc, o) => acc + (o.usageCount || 0), 0);
  const totalDiscountGiven = totalUsage * 350;

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addOffer(form);
    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Created Promo Coupon Code: ${created.code}`,
      entity: 'PromoOffer',
      entityId: created.id,
      newValue: `${created.discountValue}${created.discountType === 'percentage' ? '%' : '₹'} off`
    });
    setShowModal(false);
    setForm({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 2000, expiryDate: '2026-12-31', isActive: true, description: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Promotional Engine
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Discounts &amp; Coupon Codes ({offers.length})
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#12372A] text-[#FAF8F1] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-2 border border-[#D4AF37] shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Active Coupons</span>
          <div className="font-serif text-xl font-bold text-[#12372A]">{activeCount} Codes</div>
          <span className="text-[10px] text-green-700 font-bold">Usable at checkout</span>
        </div>

        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Total Usage Count</span>
          <div className="font-serif text-xl font-bold text-[#12372A]">{totalUsage} Times</div>
          <span className="text-[10px] text-gray-500">Applied by patrons</span>
        </div>

        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Estimated Discounts Given</span>
          <div className="font-serif text-xl font-bold text-[#12372A]">{formatPrice(totalDiscountGiven)}</div>
          <span className="text-[10px] text-gray-500">Savings provided</span>
        </div>

        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Top Code</span>
          <div className="font-mono text-lg font-bold text-[#D4AF37] uppercase">KAVISH10</div>
          <span className="text-[10px] text-gray-500">10% Off Welcome</span>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12372A] text-[#FAF8F1] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Coupon Code</th>
                <th className="p-3.5">Discount Rule</th>
                <th className="p-3.5">Min Order Spend</th>
                <th className="p-3.5">Usage Count</th>
                <th className="p-3.5">Expiry Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDC7]">
              {offers.map(o => (
                <tr key={o.id} className="hover:bg-[#FAF8F1] transition-colors">
                  <td className="p-3.5 font-mono text-sm font-bold text-[#12372A] uppercase">{o.code}</td>

                  <td className="p-3.5 font-bold">
                    {o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`}
                  </td>

                  <td className="p-3.5 font-mono">{formatPrice(o.minOrderAmount)}</td>

                  <td className="p-3.5 font-mono font-bold text-[#12372A]">{o.usageCount || 0} Uses</td>

                  <td className="p-3.5 font-mono text-[#6B5846]">{o.expiryDate}</td>

                  <td className="p-3.5">
                    <button
                      onClick={() => toggleOfferStatus(o.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        o.isActive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {o.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete coupon code ${o.code}?`)) {
                          deleteOffer(o.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[85vh]">
            
            {/* Modal Fixed Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FAF8F1]">Create New Promo Code</h3>
                <p className="text-xs text-[#E8DDC7]/80">Configure discount rules &amp; eligibility spend</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="coupon-modal-form" onSubmit={handleCreateCoupon} className="p-6 overflow-y-auto space-y-3 text-xs flex-1">
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ONAM2026"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-sm font-bold uppercase text-[#12372A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Festive discount on Kasavu sarees"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>
            </form>

            {/* Modal Fixed Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="coupon-modal-form"
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
              >
                Publish Coupon Code
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-3 border border-[#E8DDC7] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
