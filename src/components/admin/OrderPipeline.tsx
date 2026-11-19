'use client';

import React, { useState, useMemo } from 'react';
import {
  Kanban, Search, Filter, Clock, CheckCircle2, Truck, Package,
  AlertCircle, ChevronRight, User, Phone, MapPin, ExternalLink,
  Printer, ArrowRight, ShieldCheck, History, Edit3, X, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useProducts } from '../../context/ProductContext';
import { useCurrency } from '../../context/CurrencyContext';
import { OptimizedImage } from '../common/OptimizedImage';
import type { Order, OrderStatus, PaymentStatus, OrderTimelineEntry } from '../../types';

interface OrderPipelineProps {
  onSelectOrder?: (order: Order) => void;
}

// 8 Core Kanban Stages in Order Fulfillment Pipeline
const PIPELINE_STAGES: { status: OrderStatus; label: string; icon: any; color: string; desc: string }[] = [
  { status: 'New Order', label: 'New Order', icon: Package, color: 'border-amber-400 bg-amber-50/70', desc: 'Awaiting confirmation' },
  { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'border-blue-400 bg-blue-50/70', desc: 'Order approved' },
  { status: 'Processing', label: 'Processing', icon: Clock, color: 'border-indigo-400 bg-indigo-50/70', desc: 'Handloom weaving/prep' },
  { status: 'Packed', label: 'Packed', icon: Package, color: 'border-purple-400 bg-purple-50/70', desc: 'Inspected & gift packed' },
  { status: 'Ready to Dispatch', label: 'Ready to Dispatch', icon: ShieldCheck, color: 'border-teal-400 bg-teal-50/70', desc: 'AWB labeled' },
  { status: 'Shipped', label: 'Shipped', icon: Truck, color: 'border-emerald-500 bg-emerald-50/70', desc: 'In courier transit' },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, color: 'border-cyan-500 bg-cyan-50/70', desc: 'Last-mile delivery' },
  { status: 'Delivered', label: 'Delivered', icon: CheckCircle2, color: 'border-emerald-700 bg-emerald-100/80', desc: 'Safely delivered' },
];

// Helper to normalize legacy status names
const normalizeStatus = (status: OrderStatus): OrderStatus => {
  if (status === 'Pending') return 'New Order';
  if (status === 'Dispatched') return 'Shipped';
  return status;
};

// Next allowed stage in the pipeline
const NEXT_STAGE_MAP: Record<string, OrderStatus> = {
  'New Order': 'Confirmed',
  'Confirmed': 'Processing',
  'Processing': 'Packed',
  'Packed': 'Ready to Dispatch',
  'Ready to Dispatch': 'Shipped',
  'Shipped': 'Out for Delivery',
  'Out for Delivery': 'Delivered',
};

export const OrderPipeline: React.FC<OrderPipelineProps> = () => {
  const { adminOrders, user, updateOrder, adminProfile } = useAuth();
  const { addAuditLog, addNotification, adminUsers } = useAdmin();
  const { restoreInventoryForOrder } = useProducts();
  const { formatPrice } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);

  // Form states inside order modal
  const [staffNoteInput, setStaffNoteInput] = useState('');
  const [courierInput, setCourierInput] = useState('');
  const [awbInput, setAwbInput] = useState('');
  const [trackingUrlInput, setTrackingUrlInput] = useState('');
  const [assignedStaffInput, setAssignedStaffInput] = useState('');
  const [customTransitionRemarks, setCustomTransitionRemarks] = useState('');

  const ordersList: Order[] = useMemo(() => {
    return adminOrders.length > 0 ? adminOrders : user.orders || [];
  }, [adminOrders, user.orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        (o.invoiceId && o.invoiceId.toLowerCase().includes(q)) ||
        o.shippingAddress.name.toLowerCase().includes(q) ||
        o.shippingAddress.phone.includes(q) ||
        o.shippingAddress.city.toLowerCase().includes(q);

      const matchesPayment = paymentFilter === 'all' || (o.paymentStatus || 'Pending') === paymentFilter;
      const matchesStaff = selectedStaffFilter === 'all' || o.assignedStaff === selectedStaffFilter;

      return matchesSearch && matchesPayment && matchesStaff;
    });
  }, [ordersList, searchQuery, paymentFilter, selectedStaffFilter]);

  // Group orders by pipeline stage
  const ordersByStage = useMemo(() => {
    const map: Record<string, Order[]> = {
      'New Order': [],
      'Confirmed': [],
      'Processing': [],
      'Packed': [],
      'Ready to Dispatch': [],
      'Shipped': [],
      'Out for Delivery': [],
      'Delivered': [],
      'Special': [] // Cancelled, Returned, Refunded
    };

    filteredOrders.forEach(o => {
      const norm = normalizeStatus(o.status);
      if (map[norm]) {
        map[norm].push(o);
      } else {
        map['Special'].push(o);
      }
    });

    return map;
  }, [filteredOrders]);

  // Helper to transition order status
  const handleTransitionStatus = (order: Order, newStatus: OrderStatus, customRemarks?: string) => {
    const prevStatus = order.status;
    if (prevStatus === newStatus) return;

    // Guard: Restock if moving to Cancelled or Refunded
    if (
      (newStatus === 'Cancelled' || newStatus === 'Refunded' || newStatus === 'Returned') &&
      prevStatus !== 'Cancelled' &&
      prevStatus !== 'Refunded' &&
      prevStatus !== 'Returned'
    ) {
      restoreInventoryForOrder(order.items);
    }

    const staffName = adminProfile?.name || 'Super Admin';
    const newEntry: OrderTimelineEntry = {
      id: `tl-${Date.now()}`,
      previousStatus: prevStatus,
      newStatus: newStatus,
      timestamp: new Date().toISOString(),
      staffName: staffName,
      remarks: customRemarks || `Order status advanced to ${newStatus}`
    };

    const updatedTimeline = [...(order.timeline || []), newEntry];

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      timeline: updatedTimeline,
      ...(newStatus === 'Shipped' && !order.dispatchDate ? { dispatchDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : {})
    };

    updateOrder(updatedOrder);

    addAuditLog({
      adminName: staffName,
      adminRole: adminProfile?.role || 'Super Admin',
      action: `Pipeline: Moved Order #${order.id} from [${prevStatus}] to [${newStatus}]`,
      entity: 'Order',
      entityId: order.id,
      previousValue: prevStatus,
      newValue: newStatus
    });

    addNotification({
      title: `Order Advanced: ${order.id}`,
      message: `Status is now ${newStatus}. Updated by ${staffName}.`,
      type: 'order'
    });

    if (activeModalOrder && activeModalOrder.id === order.id) {
      setActiveModalOrder(updatedOrder);
      setCustomTransitionRemarks('');
    }
  };

  // Open modal and pre-fill fields
  const handleOpenModal = (order: Order) => {
    setActiveModalOrder(order);
    setStaffNoteInput(order.internalNotes || '');
    setCourierInput(order.courierProvider || 'Standard Express Logistics');
    setAwbInput(order.trackingNumber || '');
    setTrackingUrlInput(order.trackingUrl || '');
    setAssignedStaffInput(order.assignedStaff || '');
    setCustomTransitionRemarks('');
  };

  // Save staff notes and courier details
  const handleSaveOrderDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrder) return;

    const updatedOrder: Order = {
      ...activeModalOrder,
      internalNotes: staffNoteInput.trim(),
      courierProvider: courierInput.trim(),
      trackingNumber: awbInput.trim() || activeModalOrder.trackingNumber,
      trackingUrl: trackingUrlInput.trim(),
      assignedStaff: assignedStaffInput.trim() || undefined
    };

    updateOrder(updatedOrder);
    setActiveModalOrder(updatedOrder);

    addAuditLog({
      adminName: adminProfile?.name || 'Super Admin',
      adminRole: adminProfile?.role || 'Super Admin',
      action: `Updated logistics & internal notes for Order #${activeModalOrder.id}`,
      entity: 'Order',
      entityId: activeModalOrder.id
    });

    alert('Order details, logistics, and staff assignment updated successfully.');
  };

  // Calculate elapsed time
  const getElapsedString = (dateStr: string) => {
    try {
      const placed = new Date(dateStr).getTime();
      if (isNaN(placed)) return 'Recently placed';
      const diffHrs = Math.floor((Date.now() - placed) / (1000 * 60 * 60));
      if (diffHrs < 1) return 'Just now';
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const days = Math.floor(diffHrs / 24);
      return `${days}d ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Stats Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#B99A61]/15 border border-[#B99A61]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#641E2B]">
            <Kanban className="w-3.5 h-3.5 text-[#B99A61]" />
            <span>Visual Fulfillment Pipeline</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641E2B] mt-1">
            Order Pipeline &amp; Logistics Kanban
          </h1>
          <p className="text-xs text-[#292722]/70 font-light mt-0.5">
            Real-time stage tracking from customer checkout through Kuthampully loom dispatch to doorstep delivery.
          </p>
        </div>

        {/* Global Pipeline Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-[#E8DFD0] rounded-xl px-3 py-2 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-[#6E685D] block">In Pipeline</span>
            <span className="font-serif text-lg font-bold text-[#641E2B]">
              {filteredOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Returned').length}
            </span>
          </div>
          <div className="bg-white border border-[#E8DFD0] rounded-xl px-3 py-2 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Delivered</span>
            <span className="font-serif text-lg font-bold text-emerald-800">
              {filteredOrders.filter(o => o.status === 'Delivered').length}
            </span>
          </div>
          <div className="bg-white border border-[#E8DFD0] rounded-xl px-3 py-2 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Total Active</span>
            <span className="font-serif text-lg font-bold text-[#B99A61]">
              {filteredOrders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline Filter & Search Control */}
      <div className="bg-white p-4 border border-[#E8DFD0] rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID (KV-ORD-...), Customer, Phone, or City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[#E8DFD0] pl-10 pr-4 py-2 rounded-xl bg-[#F8F5EF] text-[#292722] focus:outline-none focus:border-[#B99A61]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border border-[#E8DFD0] px-3 py-2 bg-[#F8F5EF] rounded-xl font-semibold text-[#641E2B] focus:outline-none focus:border-[#B99A61]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid Only</option>
            <option value="Pending">Payment Pending</option>
            <option value="Failed">Failed Payment</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="border border-[#E8DFD0] px-3 py-2 bg-[#F8F5EF] rounded-xl font-semibold text-[#641E2B] focus:outline-none focus:border-[#B99A61]"
          >
            <option value="all">All Staff Assignments</option>
            {adminUsers.map(u => (
              <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* KANBAN HORIZONTAL SCROLL PIPELINE BOARD */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start snap-x">
        {PIPELINE_STAGES.map((stage) => {
          const stageOrders = ordersByStage[stage.status] || [];
          const StageIcon = stage.icon;

          return (
            <div
              key={stage.status}
              className="w-80 shrink-0 bg-[#F8F5EF]/80 border border-[#E8DFD0] rounded-2xl p-3 shadow-xs flex flex-col max-h-[80vh]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8DFD0]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#641E2B] text-[#B99A61] flex items-center justify-center">
                    <StageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#641E2B] leading-tight">
                      {stage.label}
                    </h3>
                    <span className="text-[10px] text-[#6E685D] block">
                      {stage.desc}
                    </span>
                  </div>
                </div>
                <span className="bg-[#641E2B] text-[#F8F5EF] text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                  {stageOrders.length}
                </span>
              </div>

              {/* Order Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stageOrders.length === 0 ? (
                  <div className="border border-dashed border-[#E8DFD0] rounded-xl p-6 text-center text-[#6E685D]">
                    <Package className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-[#B99A61]" />
                    <p className="text-[11px] font-medium">No orders in {stage.label}</p>
                  </div>
                ) : (
                  stageOrders.map((order) => {
                    const nextStage = NEXT_STAGE_MAP[stage.status];
                    const isPaid = order.paymentStatus === 'Paid';

                    return (
                      <div
                        key={order.id}
                        onClick={() => handleOpenModal(order)}
                        className="bg-white border border-[#E8DFD0] hover:border-[#B99A61] p-3.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        {/* Top ID & Elapsed Time */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-[#641E2B] group-hover:text-[#B99A61] transition-colors">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-[#6E685D] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#B99A61]" />
                            {getElapsedString(order.date)}
                          </span>
                        </div>

                        {/* Customer & Location */}
                        <div className="mb-2 text-xs">
                          <div className="font-bold text-[#292722] truncate">
                            {order.shippingAddress.name}
                          </div>
                          <div className="text-[11px] text-[#6E685D] truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#B99A61] shrink-0" />
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        </div>

                        {/* Items Thumbnail & Count */}
                        <div className="flex items-center gap-2 mb-3 bg-[#F8F5EF] p-2 rounded-lg">
                          <div className="w-8 h-10 rounded overflow-hidden shrink-0 bg-[#E8DFD0]">
                            {order.items[0]?.product?.images?.[0] ? (
                              <OptimizedImage
                                src={order.items[0].product.images[0]}
                                alt={order.items[0].product.name}
                                preset="thumbnail"
                                containerClassName="w-full h-full"
                              />
                            ) : (
                              <Package className="w-4 h-4 m-2 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-[#292722] truncate">
                              {order.items[0]?.product?.name || 'Handloom Item'}
                            </p>
                            <p className="text-[10px] text-[#6E685D]">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Size: {order.items[0]?.size || 'Free'}
                            </p>
                          </div>
                        </div>

                        {/* Price & Payment Badge */}
                        <div className="flex items-center justify-between border-t border-[#E8DFD0] pt-2 mb-3">
                          <span className="font-bold text-xs text-[#641E2B]">
                            {formatPrice(order.total)}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </div>

                        {/* Next Action Button */}
                        {nextStage && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransitionStatus(order, nextStage);
                            }}
                            className="w-full bg-[#641E2B] hover:bg-[#B99A61] hover:text-[#641E2B] text-[#F8F5EF] py-1.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span>Move to {nextStage}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}

        {/* Special Statuses Column (Cancelled, Returned, etc.) */}
        <div className="w-80 shrink-0 bg-red-50/50 border border-red-200 rounded-2xl p-3 shadow-xs flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-red-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-700 text-white flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-red-900 leading-tight">
                  Exceptions &amp; Returns
                </h3>
                <span className="text-[10px] text-red-700 block">
                  Cancelled or Returned
                </span>
              </div>
            </div>
            <span className="bg-red-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
              {ordersByStage['Special'].length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {ordersByStage['Special'].length === 0 ? (
              <div className="border border-dashed border-red-200 rounded-xl p-6 text-center text-red-600">
                <p className="text-[11px]">No order exceptions</p>
              </div>
            ) : (
              ordersByStage['Special'].map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOpenModal(order)}
                  className="bg-white border border-red-200 p-3.5 rounded-xl shadow-xs cursor-pointer hover:border-red-400 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-red-900">{order.id}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#292722]">{order.shippingAddress.name}</p>
                  <p className="text-[11px] text-[#6E685D] mt-1">{formatPrice(order.total)} • {order.items.length} items</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* DETAILED ORDER INSPECTION & TIMELINE MODAL */}
      {activeModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white border border-[#B99A61]/40 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col text-[#292722]">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#641E2B] text-[#F8F5EF] px-6 py-4 rounded-t-3xl flex items-center justify-between border-b border-[#B99A61]/30 z-10">
              <div className="flex items-center gap-3">
                <span className="bg-[#B99A61] text-[#641E2B] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full font-mono">
                  {activeModalOrder.status}
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold">
                  Order Details: {activeModalOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#B99A61] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Quick Status Advancement Bar */}
              <div className="bg-[#F8F5EF] p-4 rounded-2xl border border-[#E8DFD0]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E685D] block mb-2">
                  Update Pipeline Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {PIPELINE_STAGES.map((s) => (
                    <button
                      key={s.status}
                      onClick={() => handleTransitionStatus(activeModalOrder, s.status, customTransitionRemarks)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        normalizeStatus(activeModalOrder.status) === s.status
                          ? 'bg-[#641E2B] text-[#F8F5EF] shadow-sm'
                          : 'bg-white text-[#292722] border border-[#E8DFD0] hover:border-[#B99A61]'
                      }`}
                    >
                      {normalizeStatus(activeModalOrder.status) === s.status && <Check className="w-3.5 h-3.5 text-[#B99A61]" />}
                      <span>{s.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleTransitionStatus(activeModalOrder, 'Cancelled', customTransitionRemarks || 'Cancelled by staff')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 text-red-800 hover:bg-red-200 transition-all"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => handleTransitionStatus(activeModalOrder, 'Returned', customTransitionRemarks || 'Returned by customer')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-all"
                  >
                    Mark Returned
                  </button>
                </div>

                {/* Optional Remarks for this transition */}
                <div className="mt-3">
                  <input
                    type="text"
                    value={customTransitionRemarks}
                    onChange={(e) => setCustomTransitionRemarks(e.target.value)}
                    placeholder="Optional remarks for this status transition (e.g. Dispatched via Blue Dart AWB 92831)..."
                    className="w-full bg-white border border-[#E8DFD0] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#B99A61]"
                  />
                </div>
              </div>

              {/* Grid: Order Items & Customer Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Customer & Address */}
                <div className="bg-[#FCFAF5] p-5 rounded-2xl border border-[#E8DFD0] space-y-3">
                  <h3 className="font-serif text-base font-bold text-[#641E2B] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#B99A61]" />
                    <span>Customer &amp; Shipping Details</span>
                  </h3>
                  <div className="text-xs space-y-1.5">
                    <p><strong className="text-[#641E2B]">Name:</strong> {activeModalOrder.shippingAddress.name}</p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#B99A61]" />
                      <strong>Phone:</strong> {activeModalOrder.shippingAddress.phone}
                    </p>
                    <p><strong>Address:</strong> {activeModalOrder.shippingAddress.street}</p>
                    <p><strong>City/State:</strong> {activeModalOrder.shippingAddress.city}, {activeModalOrder.shippingAddress.state} - {activeModalOrder.shippingAddress.pincode}</p>
                    <p><strong>Payment Method:</strong> {activeModalOrder.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> <span className="font-bold text-[#641E2B]">{activeModalOrder.paymentStatus || 'Pending'}</span></p>
                  </div>
                </div>

                {/* Right: Logistics & Courier Settings */}
                <form onSubmit={handleSaveOrderDetails} className="bg-[#FCFAF5] p-5 rounded-2xl border border-[#E8DFD0] space-y-3">
                  <h3 className="font-serif text-base font-bold text-[#641E2B] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B99A61]" />
                    <span>Logistics &amp; Staff Assignment</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#6E685D] block mb-1">Courier Partner</label>
                      <input
                        type="text"
                        value={courierInput}
                        onChange={(e) => setCourierInput(e.target.value)}
                        placeholder="Blue Dart, India Post..."
                        className="w-full bg-white border border-[#E8DFD0] px-2.5 py-1.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#6E685D] block mb-1">AWB / Tracking ID</label>
                      <input
                        type="text"
                        value={awbInput}
                        onChange={(e) => setAwbInput(e.target.value)}
                        placeholder="e.g. BD-8921029"
                        className="w-full bg-white border border-[#E8DFD0] px-2.5 py-1.5 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#6E685D] block mb-1">Tracking URL</label>
                    <input
                      type="url"
                      value={trackingUrlInput}
                      onChange={(e) => setTrackingUrlInput(e.target.value)}
                      placeholder="https://track.courier.com/..."
                      className="w-full bg-white border border-[#E8DFD0] px-2.5 py-1.5 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#6E685D] block mb-1">Assigned Staff Member</label>
                    <select
                      value={assignedStaffInput}
                      onChange={(e) => setAssignedStaffInput(e.target.value)}
                      className="w-full bg-white border border-[#E8DFD0] px-2.5 py-1.5 rounded-lg text-xs"
                    >
                      <option value="">Unassigned</option>
                      {adminUsers.map(u => (
                        <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#6E685D] block mb-1">Internal Staff Notes</label>
                    <textarea
                      rows={2}
                      value={staffNoteInput}
                      onChange={(e) => setStaffNoteInput(e.target.value)}
                      placeholder="Special gift packaging instructions, weaver batch notes..."
                      className="w-full bg-white border border-[#E8DFD0] px-2.5 py-1.5 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#641E2B] hover:bg-[#B99A61] hover:text-[#641E2B] text-[#F8F5EF] py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Save Logistics &amp; Notes
                  </button>
                </form>
              </div>

              {/* Order Items Table */}
              <div className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-xs">
                <div className="px-5 py-3 bg-[#F8F5EF] border-b border-[#E8DFD0] font-serif font-bold text-sm text-[#641E2B]">
                  Garments in Order ({activeModalOrder.items.length})
                </div>
                <div className="divide-y divide-[#E8DFD0]">
                  {activeModalOrder.items.map((it, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between text-xs gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#F8F5EF] shrink-0 border border-[#E8DFD0]">
                          {it.product?.images?.[0] && (
                            <OptimizedImage
                              src={it.product.images[0]}
                              alt={it.product.name}
                              preset="thumbnail"
                              containerClassName="w-full h-full"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#641E2B]">{it.product?.name}</p>
                          <p className="text-[#6E685D]">SKU: {it.product?.sku || 'N/A'}</p>
                          <p className="text-[#6E685D]">Size: <span className="font-semibold">{it.size}</span> • Qty: <span className="font-semibold">{it.quantity}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#641E2B]">{formatPrice(it.price * it.quantity)}</p>
                        <p className="text-[10px] text-[#6E685D]">{formatPrice(it.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Summary */}
                <div className="bg-[#FCFAF5] p-4 border-t border-[#E8DFD0] text-xs space-y-1">
                  <div className="flex justify-between text-[#6E685D]">
                    <span>Subtotal:</span>
                    <span>{formatPrice(activeModalOrder.subtotal)}</span>
                  </div>
                  {activeModalOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promo Discount:</span>
                      <span>-{formatPrice(activeModalOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6E685D]">
                    <span>Shipping Fee:</span>
                    <span>{activeModalOrder.shippingFee === 0 ? 'Complimentary' : formatPrice(activeModalOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#641E2B] pt-2 border-t border-[#E8DFD0]">
                    <span>Total Amount:</span>
                    <span>{formatPrice(activeModalOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Complete Activity Timeline */}
              <div className="bg-white border border-[#E8DFD0] rounded-2xl p-5 shadow-xs">
                <h3 className="font-serif text-base font-bold text-[#641E2B] flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-[#B99A61]" />
                  <span>Order Audit Timeline &amp; Processing History</span>
                </h3>

                {(!activeModalOrder.timeline || activeModalOrder.timeline.length === 0) ? (
                  <p className="text-xs text-[#6E685D] italic">
                    Order created on {activeModalOrder.date}. No subsequent transitions recorded yet.
                  </p>
                ) : (
                  <div className="relative pl-6 space-y-4 border-l-2 border-[#B99A61]/40">
                    {activeModalOrder.timeline.map((entry) => (
                      <div key={entry.id} className="relative group">
                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#641E2B] border-2 border-[#B99A61]" />
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#641E2B]">{entry.newStatus}</span>
                            {entry.previousStatus && entry.previousStatus !== 'None' && (
                              <span className="text-[10px] text-[#6E685D]">
                                (from {entry.previousStatus})
                              </span>
                            )}
                            <span className="text-[10px] text-[#6E685D] ml-auto font-mono">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6E685D] mt-0.5">
                            By: <strong className="text-[#292722]">{entry.staffName}</strong>
                          </p>
                          {entry.remarks && (
                            <p className="text-[11px] text-[#292722] bg-[#F8F5EF] p-2 rounded-lg mt-1 italic">
                              "{entry.remarks}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer with Printable Invoice */}
            <div className="sticky bottom-0 bg-[#F8F5EF] px-6 py-4 rounded-b-3xl border-t border-[#E8DFD0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-white border border-[#E8DFD0] hover:border-[#B99A61] text-[#641E2B] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#B99A61]" />
                <span>Print Official Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalOrder(null)}
                className="bg-[#641E2B] text-[#F8F5EF] hover:bg-[#B99A61] hover:text-[#641E2B] px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
