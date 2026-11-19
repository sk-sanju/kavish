'use client';

import React, { useState, useMemo } from 'react';
import {
  RotateCcw, Search, CheckCircle2, XCircle, Clock, Truck,
  DollarSign, AlertCircle, User, Mail, ShieldCheck, ChevronRight, X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { ReturnRequest, ReturnStatus } from '../../types';

export const ReturnsRefundsManagement: React.FC = () => {
  const { returnRequests, updateReturnStatus, addAuditLog, addNotification } = useAdmin();
  const { adminOrders, updateOrder, adminProfile } = useAuth();
  const { restoreInventoryForOrder } = useProducts();
  const { formatPrice } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [restockOnApproval, setRestockOnApproval] = useState(true);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return returnRequests.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.orderId.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerEmail.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [returnRequests, searchQuery, statusFilter]);

  const metrics = useMemo(() => {
    const totalRequests = returnRequests.length;
    const pendingReview = returnRequests.filter(r => r.status === 'Requested' || r.status === 'Under Review').length;
    const approved = returnRequests.filter(r => r.status === 'Approved' || r.status === 'Pickup Scheduled' || r.status === 'Returned').length;
    const refunded = returnRequests.filter(r => r.status === 'Refunded').length;
    const totalRefundedAmount = returnRequests.filter(r => r.status === 'Refunded').reduce((acc, r) => acc + (r.refundAmount || 0), 0);

    return { totalRequests, pendingReview, approved, refunded, totalRefundedAmount };
  }, [returnRequests]);

  const handleOpenModal = (req: ReturnRequest) => {
    setSelectedReturn(req);
    setAdminNotesInput(req.adminNotes || '');
  };

  const handleUpdateStatus = (newStatus: ReturnStatus) => {
    if (!selectedReturn) return;

    updateReturnStatus(selectedReturn.id, newStatus, adminNotesInput.trim());

    // If approved or refunded, update linked order if available
    const linkedOrder = adminOrders.find(o => o.id === selectedReturn.orderId);
    if (linkedOrder) {
      if (newStatus === 'Refunded') {
        updateOrder({
          ...linkedOrder,
          status: 'Refunded',
          paymentStatus: 'Refunded'
        });
        if (restockOnApproval) {
          restoreInventoryForOrder(linkedOrder.items);
        }
      } else if (newStatus === 'Approved') {
        updateOrder({
          ...linkedOrder,
          status: 'Return Approved'
        });
      }
    }

    const staffName = adminProfile?.name || 'Super Admin';
    addAuditLog({
      adminName: staffName,
      adminRole: adminProfile?.role || 'Super Admin',
      action: `Return Request for Order #${selectedReturn.orderId} updated to [${newStatus}]`,
      entity: 'ReturnRequest',
      entityId: selectedReturn.id,
      previousValue: selectedReturn.status,
      newValue: newStatus
    });

    addNotification({
      title: `Return Request Updated: ${selectedReturn.orderId}`,
      message: `Status changed to ${newStatus} for customer ${selectedReturn.customerName}.`,
      type: 'return'
    });

    setSelectedReturn(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#B99A61]/15 border border-[#B99A61]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#641E2B]">
            <RotateCcw className="w-3.5 h-3.5 text-[#B99A61]" />
            <span>Customer Service &amp; Reverse Logistics</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641E2B] mt-1">
            Returns, Exchanges &amp; Refunds
          </h1>
          <p className="text-xs text-[#292722]/70 font-light mt-0.5">
            Manage customer return authorizations, inspect handloom conditions, schedule doorstep reverse pickups, and process refunds.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#6E685D] block mb-1">
            Total Requests
          </span>
          <div className="font-serif text-2xl font-bold text-[#641E2B]">
            {metrics.totalRequests}
          </div>
          <p className="text-[10px] text-[#6E685D] mt-1">All time return claims</p>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs bg-amber-50/30">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block mb-1">
            Pending Review
          </span>
          <div className="font-serif text-2xl font-bold text-amber-900">
            {metrics.pendingReview}
          </div>
          <p className="text-[10px] text-amber-700 mt-1">Requires artisan inspection</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-xs bg-blue-50/30">
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-800 block mb-1">
            Approved / In Transit
          </span>
          <div className="font-serif text-2xl font-bold text-blue-900">
            {metrics.approved}
          </div>
          <p className="text-[10px] text-blue-700 mt-1">Reverse pickup active</p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs bg-emerald-50/30">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mb-1">
            Refunds Settled
          </span>
          <div className="font-serif text-2xl font-bold text-emerald-900">
            {formatPrice(metrics.totalRefundedAmount)}
          </div>
          <p className="text-[10px] text-emerald-700 mt-1">{metrics.refunded} customer accounts settled</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E8DFD0] rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, Email, or Garment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[#E8DFD0] pl-10 pr-4 py-2 rounded-xl bg-[#F8F5EF] text-[#292722] focus:outline-none focus:border-[#B99A61]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#E8DFD0] px-3 py-2 bg-[#F8F5EF] rounded-xl font-semibold text-[#641E2B] focus:outline-none focus:border-[#B99A61]"
        >
          <option value="all">All Request Statuses</option>
          <option value="Requested">Requested (New)</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Pickup Scheduled">Pickup Scheduled</option>
          <option value="Returned">Returned to Loom</option>
          <option value="Refund Processing">Refund Processing</option>
          <option value="Refunded">Refunded (Completed)</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8DFD0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#292722]">
            <thead className="bg-[#F8F5EF] text-[#641E2B] font-serif font-bold uppercase tracking-wider text-[11px] border-b border-[#E8DFD0]">
              <tr>
                <th className="py-3 px-4">Request Date</th>
                <th className="py-3 px-4">Order ID &amp; Garment</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Return Reason</th>
                <th className="py-3 px-4">Refund Amount</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6E685D]">
                    No return or refund requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FCFAF5] transition-colors">
                    <td className="py-3 px-4 font-mono text-[10px] text-[#6E685D]">
                      {req.requestedDate}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-xs font-bold text-[#641E2B]">{req.orderId}</p>
                      <p className="text-[#6E685D] text-[11px]">{req.productName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#292722]">{req.customerName}</p>
                      <p className="text-[10px] text-[#6E685D] flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#B99A61]" />
                        {req.customerEmail}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-[#6E685D] max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      {formatPrice(req.refundAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Refunded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : req.status === 'Approved' || req.status === 'Pickup Scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenModal(req)}
                        className="bg-[#641E2B] hover:bg-[#B99A61] hover:text-[#641E2B] text-[#F8F5EF] px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTION MODAL */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white border border-[#B99A61]/40 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col text-[#292722]">
            
            <div className="bg-[#641E2B] text-[#F8F5EF] px-6 py-4 rounded-t-3xl flex items-center justify-between border-b border-[#B99A61]/30">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#B99A61] tracking-widest block">
                  Return Authorization
                </span>
                <h2 className="font-serif text-lg font-bold">
                  Order: {selectedReturn.orderId}
                </h2>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#B99A61] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#E8DFD0] space-y-1">
                <p><strong>Customer:</strong> {selectedReturn.customerName} ({selectedReturn.customerEmail})</p>
                <p><strong>Garment:</strong> {selectedReturn.productName}</p>
                <p><strong>Reason:</strong> <span className="italic">"{selectedReturn.reason}"</span></p>
                <p><strong>Refund Amount:</strong> <span className="font-bold text-emerald-800">{formatPrice(selectedReturn.refundAmount)}</span></p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#6E685D] block mb-1">
                  Admin Internal Inspection Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Notes on fabric condition, zari inspection, courier reverse AWB..."
                  className="w-full bg-[#FCFAF5] border border-[#E8DFD0] p-2.5 rounded-xl text-xs text-[#292722] focus:outline-none focus:border-[#B99A61]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="restockCheck"
                  checked={restockOnApproval}
                  onChange={(e) => setRestockOnApproval(e.target.checked)}
                  className="rounded text-[#641E2B] focus:ring-[#B99A61]"
                />
                <label htmlFor="restockCheck" className="text-xs text-[#292722] cursor-pointer">
                  Automatically restock garment unit into inventory upon refund completion
                </label>
              </div>

              {/* Status Action Buttons */}
              <div>
                <span className="text-[10px] font-bold uppercase text-[#6E685D] block mb-2">
                  Update Return State
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Approved')}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors"
                  >
                    Approve Return
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Pickup Scheduled')}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors"
                  >
                    Schedule Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Refunded')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors"
                  >
                    Process Refund
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('Rejected')}
                    className="bg-red-700 hover:bg-red-800 text-white py-2 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors"
                  >
                    Reject Claim
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
