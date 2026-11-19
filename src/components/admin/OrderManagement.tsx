'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useProducts } from '../../context/ProductContext';
import { useCurrency } from '../../context/CurrencyContext';
import { OptimizedImage } from '../common/OptimizedImage';
import type { Order, OrderStatus, PaymentStatus, OrderTimelineEntry } from '../../types';

export const OrderManagement: React.FC = () => {
  const { adminOrders, user, updateOrder, adminProfile } = useAuth();
  const { restoreInventoryForOrder } = useProducts();
  const { addAuditLog, addNotification } = useAdmin();
  const { formatPrice } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStatus, setEditingStatus] = useState<OrderStatus>('Processing');
  const [editingPaymentStatus, setEditingPaymentStatus] = useState<PaymentStatus>('Pending');
  const [courierInput, setCourierInput] = useState('Standard Express Delivery');
  const [awbInput, setAwbInput] = useState('');

  const allOrdersList: Order[] = adminOrders.length > 0 ? adminOrders : user.orders;

  const filteredOrders = allOrdersList.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.invoiceId && o.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const previousStatus = selectedOrder.status;
    const previousPaymentStatus = selectedOrder.paymentStatus || 'Pending';

    // Restore inventory if transitioned to Cancelled or Refunded
    if (
      (editingStatus === 'Cancelled' || editingPaymentStatus === 'Refunded') &&
      previousStatus !== 'Cancelled' &&
      previousPaymentStatus !== 'Refunded'
    ) {
      restoreInventoryForOrder(selectedOrder.items);
    }

    const staffName = adminProfile?.name || 'Super Admin';
    const newTimelineEntry: OrderTimelineEntry = {
      id: `tl-${Date.now()}`,
      previousStatus: previousStatus,
      newStatus: editingStatus,
      timestamp: new Date().toISOString(),
      staffName: staffName,
      remarks: `Order status set to ${editingStatus} (Payment: ${editingPaymentStatus}) via Order Management`
    };

    const updatedOrder: Order = {
      ...selectedOrder,
      status: editingStatus,
      paymentStatus: editingPaymentStatus,
      trackingNumber: awbInput.trim() || selectedOrder.trackingNumber,
      courierProvider: courierInput.trim() || selectedOrder.courierProvider,
      timeline: [...(selectedOrder.timeline || []), newTimelineEntry]
    };

    updateOrder(updatedOrder);

    addAuditLog({
      adminName: staffName,
      adminRole: adminProfile?.role || 'Super Admin',
      action: `Updated Order #${selectedOrder.id} [Fulfillment: ${editingStatus}, Payment: ${editingPaymentStatus}]`,
      entity: 'Order',
      entityId: selectedOrder.id,
      previousValue: `${previousStatus} (${previousPaymentStatus})`,
      newValue: `${editingStatus} (${editingPaymentStatus})`
    });

    addNotification({
      title: `Order Updated: ${selectedOrder.id}`,
      message: `Status: ${editingStatus} | Payment: ${editingPaymentStatus} for ${selectedOrder.shippingAddress.name}`,
      type: 'order'
    });

    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A15A] block">
            Fulfillment &amp; Dispatch
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-0.5">
            Order Fulfillment Center ({allOrdersList.length})
          </h1>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID (KV-ORD-...), Invoice ID, or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E5E7EB] pl-10 pr-4 py-2 rounded-xl bg-[#FFFFFF]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#E5E7EB] px-3 py-2 bg-[#FFFFFF] rounded-xl font-semibold text-[#111111]"
        >
          <option value="all">All Order Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Packed">Packed</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Returned">Returned</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] text-[#FFFFFF] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Order &amp; Invoice ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Total Paid</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredOrders.map(order => {
                const invId = order.invoiceId || `KV-INV-2026-${order.id.replace('KV-ORD-', '')}`;
                return (
                  <tr key={order.id} className="hover:bg-[#FFFFFF] transition-colors">
                    <td className="p-3.5">
                      <strong className="font-bold font-serif text-[#111111] text-sm block">{order.id}</strong>
                      <span className="font-mono text-[10px] text-[#C5A15A] font-semibold">{invId}</span>
                    </td>

                    <td className="p-3.5">
                      <strong className="text-[#111111] block">{order.shippingAddress.name}</strong>
                      <span className="text-[10px] text-[#6B7280]">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </td>

                    <td className="p-3.5 text-[#6B7280]">{order.date}</td>

                    <td className="p-3.5 font-bold">{order.items.length} Item(s)</td>

                    <td className="p-3.5 font-serif font-bold text-[#111111] text-sm">{formatPrice(order.total)}</td>

                    <td className="p-3.5 font-mono text-[10px] text-[#111111]">{order.paymentMethod}</td>

                    <td className="p-3.5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="bg-[#111111] text-[#C5A15A] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#C5A15A]">
                          {order.status}
                        </span>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : order.paymentStatus === 'Refunded'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          Pay: {order.paymentStatus || 'Pending'}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setEditingStatus(order.status);
                          setEditingPaymentStatus(order.paymentStatus || 'Pending');
                          setAwbInput(order.trackingNumber || '');
                          setCourierInput(order.courierProvider || 'Standard Express Delivery');
                        }}
                        className="bg-[#111111] text-[#FFFFFF] px-3.5 py-1.5 rounded-xl font-bold uppercase text-[10px] hover:bg-[#C5A15A] hover:text-[#111111] transition-all border border-[#C5A15A] cursor-pointer"
                      >
                        Manage Order
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Fulfillment Drawer / Modal */}
      {selectedOrder && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[88vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#111111] text-[#FFFFFF] flex justify-between items-start shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A15A] tracking-widest block">Order Specification &amp; Dispatch</span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="font-serif font-bold text-xl text-[#FFFFFF]">{selectedOrder.id}</h3>
                  <span className="bg-[#C5A15A] text-[#111111] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    {selectedOrder.invoiceId || `KV-INV-2026-${selectedOrder.id.replace('KV-ORD-', '')}`}
                  </span>
                </div>
                <span className="text-xs text-[#E5E7EB]/80 block mt-0.5">Placed on {selectedOrder.date}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-[#E5E7EB] hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Address & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E5E7EB] text-xs">
                <div>
                  <h4 className="font-bold text-[#111111] mb-1">Shipping &amp; Delivery Address</h4>
                  <p className="text-[#6B7280] leading-relaxed">
                    <strong>{selectedOrder.shippingAddress.name}</strong><br />
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}<br />
                    Mobile: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#111111] mb-1">Payment &amp; Invoice Reference</h4>
                  <p className="text-[#6B7280] leading-relaxed">
                    Invoice: <strong className="font-mono text-[#C5A15A] font-bold">{selectedOrder.invoiceId || `KV-INV-2026-${selectedOrder.id.replace('KV-ORD-', '')}`}</strong><br />
                    Method: <strong className="text-[#111111]">{selectedOrder.paymentMethod}</strong><br />
                    Carrier: <strong>{selectedOrder.courierProvider || 'Standard Express Delivery'}</strong><br />
                    Tracking: <strong className="font-mono text-[#111111]">{selectedOrder.trackingNumber}</strong>
                  </p>
                </div>
              </div>

              {/* Ordered Garments */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-[#111111]">Ordered Items</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 border border-[#E5E7EB] rounded-xl flex items-center justify-between bg-[#FFFFFF]">
                    <div className="flex items-center gap-3">
                      <OptimizedImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        preset="thumbnail"
                        aspectRatio="3/4"
                        containerClassName="w-12 h-16 rounded-lg border border-[#E5E7EB] shrink-0"
                      />
                      <div>
                        <strong className="text-[#111111] block">{item.product.name}</strong>
                        <span className="text-[#6B7280] text-[11px]">Size: {item.size} • Color: {item.color.name} • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <strong className="text-[#111111] font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>

              {/* Status Update Form */}
              <form id="order-fulfillment-form" onSubmit={handleUpdateOrderStatus} className="space-y-4 pt-4 border-t border-[#E5E7EB]">
                <h4 className="font-bold text-[#111111]">Update Fulfillment Status</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#6B7280] mb-1">Order Status</label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                      className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF] font-bold text-[#111111]"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#6B7280] mb-1">Payment Status</label>
                    <select
                      value={editingPaymentStatus}
                      onChange={(e) => setEditingPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF] font-bold text-[#111111]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid (Verified)</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#6B7280] mb-1">Logistics Provider</label>
                    <input
                      type="text"
                      value={courierInput}
                      onChange={(e) => setCourierInput(e.target.value)}
                      placeholder="e.g. Standard Express Delivery"
                      className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#6B7280] mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={awbInput}
                    onChange={(e) => setAwbInput(e.target.value)}
                    placeholder="e.g. KV-TRK-8849102"
                    className="w-full border border-[#E5E7EB] p-2.5 rounded-xl bg-[#FFFFFF] font-mono text-xs"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FFFFFF] border-t border-[#E5E7EB] flex gap-3 shrink-0">
              <button
                type="submit"
                form="order-fulfillment-form"
                className="flex-1 bg-[#111111] text-[#FFFFFF] py-3 font-bold uppercase text-xs rounded-xl hover:bg-[#C5A15A] hover:text-[#111111] transition-all border border-[#C5A15A] cursor-pointer"
              >
                Update Status &amp; Save Tracking Info
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-3 border border-[#E5E7EB] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

