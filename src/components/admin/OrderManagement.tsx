import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, FileText, Printer, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { Order, OrderStatus } from '../../types';

export const OrderManagement: React.FC = () => {
  const { user } = useAuth();
  const { addAuditLog, addNotification } = useAdmin();
  const { formatPrice } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStatus, setEditingStatus] = useState<OrderStatus>('Processing');
  const [courierInput, setCourierInput] = useState('BlueDart Air Express');
  const [awbInput, setAwbInput] = useState('');

  const allOrdersList: Order[] = user.orders;

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
    selectedOrder.status = editingStatus;
    if (awbInput.trim()) selectedOrder.trackingNumber = awbInput.trim();
    if (courierInput.trim()) selectedOrder.courierProvider = courierInput.trim();

    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Updated Order #${selectedOrder.id} status to ${editingStatus}`,
      entity: 'Order',
      entityId: selectedOrder.id,
      previousValue: previousStatus,
      newValue: editingStatus
    });

    addNotification({
      title: `Order Status Updated: ${selectedOrder.id}`,
      message: `Status changed to ${editingStatus} for ${selectedOrder.shippingAddress.name}`,
      type: 'order'
    });

    setSelectedOrder(null);
    alert(`Order #${selectedOrder.id} status updated successfully to "${editingStatus}"!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Fulfillment &amp; Dispatch
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Order Fulfillment Center ({allOrdersList.length})
          </h1>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID (KV-ORD-...), Invoice ID, or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F1]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#E8DDC7] px-3 py-2 bg-[#FAF8F1] rounded-xl font-semibold text-[#12372A]"
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
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12372A] text-[#FAF8F1] uppercase text-[10px] tracking-wider">
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
            <tbody className="divide-y divide-[#E8DDC7]">
              {filteredOrders.map(order => {
                const invId = order.invoiceId || `KV-INV-2026-${order.id.replace('KV-ORD-', '')}`;
                return (
                  <tr key={order.id} className="hover:bg-[#FAF8F1] transition-colors">
                    <td className="p-3.5">
                      <strong className="font-bold font-serif text-[#12372A] text-sm block">{order.id}</strong>
                      <span className="font-mono text-[10px] text-[#D4AF37] font-semibold">{invId}</span>
                    </td>

                    <td className="p-3.5">
                      <strong className="text-[#12372A] block">{order.shippingAddress.name}</strong>
                      <span className="text-[10px] text-[#6B5846]">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </td>

                    <td className="p-3.5 text-[#6B5846]">{order.date}</td>

                    <td className="p-3.5 font-bold">{order.items.length} Item(s)</td>

                    <td className="p-3.5 font-serif font-bold text-[#12372A] text-sm">{formatPrice(order.total)}</td>

                    <td className="p-3.5 font-mono text-[10px] text-[#12372A]">{order.paymentMethod}</td>

                    <td className="p-3.5">
                      <span className="bg-[#12372A] text-[#D4AF37] text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-[#D4AF37]">
                        {order.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setEditingStatus(order.status);
                          setAwbInput(order.trackingNumber || '');
                          setCourierInput(order.courierProvider || 'BlueDart Air Express');
                        }}
                        className="bg-[#12372A] text-[#FAF8F1] px-3.5 py-1.5 rounded-xl font-bold uppercase text-[10px] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all border border-[#D4AF37] cursor-pointer"
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
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex justify-between items-start shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">Order Specification &amp; Dispatch</span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="font-serif font-bold text-xl text-[#FAF8F1]">{selectedOrder.id}</h3>
                  <span className="bg-[#D4AF37] text-[#12372A] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    {selectedOrder.invoiceId || `KV-INV-2026-${selectedOrder.id.replace('KV-ORD-', '')}`}
                  </span>
                </div>
                <span className="text-xs text-[#E8DDC7]/80 block mt-0.5">Placed on {selectedOrder.date}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-[#E8DDC7] hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Address & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F1] p-4 rounded-2xl border border-[#E8DDC7] text-xs">
                <div>
                  <h4 className="font-bold text-[#12372A] mb-1">Shipping &amp; Delivery Address</h4>
                  <p className="text-[#6B5846] leading-relaxed">
                    <strong>{selectedOrder.shippingAddress.name}</strong><br />
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}<br />
                    Mobile: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#12372A] mb-1">Payment &amp; Invoice Reference</h4>
                  <p className="text-[#6B5846] leading-relaxed">
                    Invoice: <strong className="font-mono text-[#D4AF37] font-bold">{selectedOrder.invoiceId || `KV-INV-2026-${selectedOrder.id.replace('KV-ORD-', '')}`}</strong><br />
                    Method: <strong className="text-[#12372A]">{selectedOrder.paymentMethod}</strong><br />
                    Carrier: <strong>{selectedOrder.courierProvider || 'BlueDart Air Express'}</strong><br />
                    AWB Tracking: <strong className="font-mono text-[#12372A]">{selectedOrder.trackingNumber}</strong>
                  </p>
                </div>
              </div>

              {/* Ordered Garments */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-[#12372A]">Ordered Items</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 border border-[#E8DDC7] rounded-xl flex items-center justify-between bg-[#FAF8F1]">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-12 object-cover rounded-lg bg-white border border-[#E8DDC7]" />
                      <div>
                        <strong className="text-[#12372A] block font-bold">{item.product.name}</strong>
                        <span className="text-[10px] text-[#6B5846]">Size: {item.size} • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <strong className="font-serif font-bold text-[#12372A] text-sm">{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              {/* GST Tax & Total Invoice */}
              <div className="bg-[#FAF8F1] p-4 rounded-2xl border border-[#E8DDC7] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B5846]">
                  <span>Items Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount Deducted:</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B5846]">
                  <span>Shipping Fee:</span>
                  <span>{selectedOrder.shippingFee === 0 ? 'Complimentary Free' : formatPrice(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-[#6B5846]">
                  <span>GST Tax (5% Apparel CGST+SGST):</span>
                  <span>{formatPrice(Math.round(selectedOrder.subtotal * 0.05))}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#12372A] pt-2 border-t border-[#E8DDC7]">
                  <span>Grand Total Paid:</span>
                  <span className="font-serif text-[#12372A]">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Status Update Form */}
              <form id="order-fulfillment-form" onSubmit={handleUpdateOrderStatus} className="space-y-3 pt-2 border-t border-[#E8DDC7] text-xs">
                <h4 className="font-serif font-bold text-[#12372A] text-sm">Update Fulfillment Workflow Status</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#6B5846] mb-1">New Order Status</label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                      className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                    >
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

                  <div>
                    <label className="block font-semibold text-[#6B5846] mb-1">Courier Carrier</label>
                    <input
                      type="text"
                      value={courierInput}
                      onChange={(e) => setCourierInput(e.target.value)}
                      className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">AWB Tracking Number</label>
                  <input
                    type="text"
                    value={awbInput}
                    onChange={(e) => setAwbInput(e.target.value)}
                    placeholder="e.g. BLUEDART-8849102"
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-xs"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="order-fulfillment-form"
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 font-bold uppercase text-xs rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all border border-[#D4AF37] cursor-pointer"
              >
                Update Status &amp; Save Tracking Info
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-3 border border-[#E8DDC7] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all cursor-pointer"
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

