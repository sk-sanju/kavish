'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { ReturnRequest, ReturnStatus } from '../../types';

export const ReturnsManagement: React.FC = () => {
  const { returnRequests, updateReturnStatus } = useAdmin();
  const { formatPrice } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [newStatus, setNewStatus] = useState<ReturnStatus>('Requested');
  const [notesInput, setNotesInput] = useState('');

  const filteredReturns = returnRequests.filter(r =>
    r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturn) return;
    updateReturnStatus(selectedReturn.id, newStatus, notesInput);
    setSelectedReturn(null);
    alert(`Return request #${selectedReturn.id} updated to status "${newStatus}"!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Customer Support &amp; Concierge
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Returns, Refunds &amp; Size Exchanges ({returnRequests.length})
          </h1>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, or garment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F1]"
          />
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12372A] text-[#FAF8F1] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Return Ref</th>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Patron</th>
                <th className="p-3.5">Garment Item</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Refund Value</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDC7]">
              {filteredReturns.map(r => (
                <tr key={r.id} className="hover:bg-[#FAF8F1] transition-colors">
                  <td className="p-3.5 font-mono text-[11px] font-bold text-[#12372A]">{r.id}</td>

                  <td className="p-3.5 font-serif font-bold text-[#12372A]">{r.orderId}</td>

                  <td className="p-3.5">
                    <strong className="text-[#12372A] block">{r.customerName}</strong>
                    <span className="text-[10px] text-[#6B5846]">{r.customerEmail}</span>
                  </td>

                  <td className="p-3.5 font-semibold text-[#12372A]">{r.productName}</td>

                  <td className="p-3.5 text-[#6B5846] max-w-xs truncate">{r.reason}</td>

                  <td className="p-3.5 font-serif font-bold text-[#12372A]">{formatPrice(r.refundAmount)}</td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      r.status === 'Refunded' || r.status === 'Approved'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : r.status === 'Rejected'
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedReturn(r);
                        setNewStatus(r.status);
                        setNotesInput(r.adminNotes || '');
                      }}
                      className="bg-[#12372A] text-[#FAF8F1] px-3.5 py-1.5 rounded-xl font-bold uppercase text-[10px] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all border border-[#D4AF37]"
                    >
                      Process Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Request Process Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FAF8F1]">Process Return #{selectedReturn.id}</h3>
                <p className="text-xs text-[#E8DDC7]/80">Manage return status, refund &amp; logistics</p>
              </div>
              <button onClick={() => setSelectedReturn(null)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="bg-[#FAF8F1] p-3 rounded-xl border border-[#E8DDC7] space-y-1 text-xs">
                <p>Order: <strong className="text-[#12372A]">{selectedReturn.orderId}</strong></p>
                <p>Garment: <strong>{selectedReturn.productName}</strong></p>
                <p>Reason: <span className="italic text-[#6B5846]">{selectedReturn.reason}</span></p>
                <p>Refund Amount: <strong className="text-[#12372A]">{formatPrice(selectedReturn.refundAmount)}</strong></p>
              </div>

              <form id="return-process-form" onSubmit={handleUpdate} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Update Return Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ReturnStatus)}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                  >
                    <option value="Requested">Requested</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pickup Scheduled">Pickup Scheduled</option>
                    <option value="Returned">Returned</option>
                    <option value="Refund Processing">Refund Processing</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Admin Notes / Logistics Memo</label>
                  <textarea
                    rows={3}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Enter notes regarding courier pickup or refund confirmation..."
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="return-process-form"
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
              >
                Save Status &amp; Notify Patron
              </button>
              <button
                type="button"
                onClick={() => setSelectedReturn(null)}
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
