'use client';

import React, { useState, useMemo } from 'react';
import {
  Package, Search, AlertTriangle, XCircle, CheckCircle2,
  TrendingDown, TrendingUp, History, Edit, Plus, Minus,
  Download, Filter, Layers, DollarSign, X, Check
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { OptimizedImage } from '../common/OptimizedImage';
import type { Product, StockAdjustment } from '../../types';

export const InventoryManagement: React.FC = () => {
  const { products, stockAdjustments, adjustStock } = useProducts();
  const { formatPrice } = useCurrency();
  const { adminProfile } = useAuth();
  const { addAuditLog } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'out' | 'healthy'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  // Adjustment Modal State
  const [selectedProductForAdj, setSelectedProductForAdj] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'deduct' | 'set'>('add');
  const [adjustmentQty, setAdjustmentQty] = useState<number>(5);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('New Handloom Batch Received from Kuthampully Loom');

  // Compute key stock metrics
  const inventoryMetrics = useMemo(() => {
    let totalUnits = 0;
    let totalRetailValuation = 0;
    let totalCostValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let healthyCount = 0;

    products.forEach(p => {
      const stock = p.stockCount != null ? p.stockCount : 10;
      const threshold = p.lowStockThreshold || 5;

      totalUnits += stock;
      totalRetailValuation += stock * (p.price || 0);
      totalCostValuation += stock * (p.costPrice || p.price * 0.55);

      if (stock === 0) {
        outOfStockCount++;
      } else if (stock <= threshold) {
        lowStockCount++;
      } else {
        healthyCount++;
      }
    });

    return {
      totalProducts: products.length,
      totalUnits,
      totalRetailValuation,
      totalCostValuation,
      lowStockCount,
      outOfStockCount,
      healthyCount
    };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q));

      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

      const stock = p.stockCount != null ? p.stockCount : 10;
      const threshold = p.lowStockThreshold || 5;

      let matchesStock = true;
      if (stockStatusFilter === 'out') matchesStock = stock === 0;
      else if (stockStatusFilter === 'low') matchesStock = stock > 0 && stock <= threshold;
      else if (stockStatusFilter === 'healthy') matchesStock = stock > threshold;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockStatusFilter]);

  // Filtered Adjustments History
  const filteredAdjustments = useMemo(() => {
    if (!searchQuery.trim()) return stockAdjustments;
    const q = searchQuery.toLowerCase().trim();
    return stockAdjustments.filter(a =>
      a.productName.toLowerCase().includes(q) ||
      a.sku.toLowerCase().includes(q) ||
      a.staffName.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q)
    );
  }, [stockAdjustments, searchQuery]);

  // Open modal
  const handleOpenAdjustment = (prod: Product) => {
    setSelectedProductForAdj(prod);
    setSelectedVariantId('');
    setAdjustmentType('add');
    setAdjustmentQty(5);
    setAdjustmentReason('New Handloom Batch Received from Kuthampully Loom');
  };

  // Submit stock adjustment
  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForAdj) return;

    const currentStock = selectedProductForAdj.stockCount != null ? selectedProductForAdj.stockCount : 10;
    let newStock = currentStock;

    if (adjustmentType === 'add') {
      newStock = currentStock + Math.max(1, adjustmentQty);
    } else if (adjustmentType === 'deduct') {
      newStock = Math.max(0, currentStock - Math.max(1, adjustmentQty));
    } else if (adjustmentType === 'set') {
      newStock = Math.max(0, adjustmentQty);
    }

    const staffName = adminProfile?.name || 'Super Admin';

    adjustStock(
      selectedProductForAdj.id,
      newStock,
      staffName,
      adjustmentReason.trim(),
      selectedVariantId || undefined
    );

    addAuditLog({
      adminName: staffName,
      adminRole: adminProfile?.role || 'Super Admin',
      action: `Inventory Adjustment: ${selectedProductForAdj.name} (${selectedProductForAdj.sku}) changed from ${currentStock} to ${newStock} units. Reason: ${adjustmentReason}`,
      entity: 'Inventory',
      entityId: selectedProductForAdj.id,
      previousValue: String(currentStock),
      newValue: String(newStock)
    });

    setSelectedProductForAdj(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#C5A15A]/15 border border-[#C5A15A]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#111111]">
            <Package className="w-3.5 h-3.5 text-[#C5A15A]" />
            <span>Kavish Stock ERP</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
            Inventory &amp; Stock Management
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 font-light mt-0.5">
            Monitor handloom inventory levels, manage variant-level stock, log physical reconciliations, and prevent out-of-stock orders.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white border border-[#E5E7EB] p-1 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#1A1A1A] hover:text-[#111111]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Live Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                : 'text-[#1A1A1A] hover:text-[#111111]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Movement History ({stockAdjustments.length})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Units */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280]">
              Total In-Stock Units
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#111111]/10 text-[#111111] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#111111]">
            {inventoryMetrics.totalUnits.toLocaleString()}
          </div>
          <p className="text-[10px] text-[#6B7280] mt-1">Across {inventoryMetrics.totalProducts} catalog products</p>
        </div>

        {/* Retail Valuation */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280]">
              Inventory Retail Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#C5A15A]/15 text-[#C5A15A] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#111111]">
            {formatPrice(inventoryMetrics.totalRetailValuation)}
          </div>
          <p className="text-[10px] text-[#6B7280] mt-1">Estimated selling price value</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs bg-amber-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
              Low Stock Alerts (&le;5)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-amber-900">
            {inventoryMetrics.lowStockCount}
          </div>
          <p className="text-[10px] text-amber-700 mt-1">Require handloom re-weaving</p>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-red-200 rounded-2xl p-4 shadow-xs bg-red-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-800">
              Out of Stock (0)
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-red-900">
            {inventoryMetrics.outOfStockCount}
          </div>
          <p className="text-[10px] text-red-700 mt-1">Hidden or backorder enabled</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by SKU (KV-...), Product Name, or Subcategory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[#E5E7EB] pl-10 pr-4 py-2 rounded-xl bg-[#FFFFFF] text-[#1A1A1A] focus:outline-none focus:border-[#C5A15A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={stockStatusFilter}
            onChange={(e: any) => setStockStatusFilter(e.target.value)}
            className="border border-[#E5E7EB] px-3 py-2 bg-[#FFFFFF] rounded-xl font-semibold text-[#111111] focus:outline-none focus:border-[#C5A15A]"
          >
            <option value="all">All Stock Statuses</option>
            <option value="low">Low Stock Alerts Only</option>
            <option value="out">Out of Stock Only</option>
            <option value="healthy">Healthy Stock (&gt;5)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-[#E5E7EB] px-3 py-2 bg-[#FFFFFF] rounded-xl font-semibold text-[#111111] focus:outline-none focus:border-[#C5A15A]"
          >
            <option value="all">All Departments</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: LIVE INVENTORY TABLE */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className="bg-[#FFFFFF] text-[#111111] font-serif font-bold uppercase tracking-wider text-[11px] border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-4">Garment &amp; SKU</th>
                  <th className="py-3 px-4">Department / Subcategory</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4 text-center">Current Stock</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Quick Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                      No garments matched the inventory filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const stock = p.stockCount != null ? p.stockCount : 10;
                    const threshold = p.lowStockThreshold || 5;
                    const isOut = stock === 0;
                    const isLow = stock > 0 && stock <= threshold;

                    return (
                      <tr key={p.id} className="hover:bg-[#FCFAF5] transition-colors">
                        {/* Image, Name, SKU */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 rounded-lg overflow-hidden bg-[#FFFFFF] shrink-0 border border-[#E5E7EB]">
                              {p.images?.[0] && (
                                <OptimizedImage
                                  src={p.images[0]}
                                  alt={p.name}
                                  preset="thumbnail"
                                  containerClassName="w-full h-full"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#111111] line-clamp-1">{p.name}</p>
                              <p className="font-mono text-[10px] text-[#C5A15A] font-semibold">{p.sku}</p>
                              {p.variants && p.variants.length > 0 && (
                                <span className="inline-block bg-[#E5E7EB]/60 text-[#1A1A1A] text-[9px] px-1.5 py-0.2 rounded mt-0.5">
                                  {p.variants.length} Variants
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 capitalize">
                          <span className="font-semibold text-[#111111]">{p.category}</span>
                          <span className="text-[#6B7280] block text-[11px]">{p.subcategory}</span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-bold text-[#111111]">
                          {formatPrice(p.price)}
                        </td>

                        {/* Current Stock Number */}
                        <td className="py-3 px-4 text-center">
                          <span className={`font-mono text-base font-bold ${
                            isOut ? 'text-red-700' : isLow ? 'text-amber-700' : 'text-[#111111]'
                          }`}>
                            {stock}
                          </span>
                          <span className="text-[10px] text-[#6B7280] block">units</span>
                        </td>

                        {/* Stock Status Pill */}
                        <td className="py-3 px-4">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" />
                              <span>Out of Stock</span>
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Low Stock (&le;{threshold})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Healthy Stock</span>
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenAdjustment(p)}
                            className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-[#C5A15A] hover:text-[#111111] text-[#FFFFFF] px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-xs"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Adjust Stock</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: STOCK MOVEMENT HISTORY LOG */}
      {activeTab === 'history' && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FFFFFF] border-b border-[#E5E7EB] flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-[#111111]">
              Physical Reconciliations &amp; Stock Movement Log ({filteredAdjustments.length})
            </span>
            <span className="text-[11px] text-[#6B7280]">
              All adjustments permanently audited with timestamp &amp; staff attribution
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className="bg-[#FCFAF5] text-[#111111] font-serif font-bold uppercase tracking-wider text-[11px] border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Garment Name &amp; SKU</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Change</th>
                  <th className="py-3 px-4 text-center">New Stock Level</th>
                  <th className="py-3 px-4">Responsible Staff</th>
                  <th className="py-3 px-4">Reason / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredAdjustments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#6B7280]">
                      No stock adjustments have been recorded yet. Click "Adjust Stock" on any garment to log a movement.
                    </td>
                  </tr>
                ) : (
                  filteredAdjustments.map((adj) => (
                    <tr key={adj.id} className="hover:bg-[#FCFAF5] transition-colors">
                      <td className="py-3 px-4 font-mono text-[10px] text-[#6B7280]">
                        {new Date(adj.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#111111]">{adj.productName}</p>
                        <p className="font-mono text-[10px] text-[#C5A15A]">{adj.sku}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          adj.type === 'add'
                            ? 'bg-emerald-100 text-emerald-800'
                            : adj.type === 'deduct'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {adj.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        {adj.type === 'add' && <span className="text-emerald-700">+{adj.quantity}</span>}
                        {adj.type === 'deduct' && <span className="text-red-700">-{adj.quantity}</span>}
                        {adj.type === 'set' && <span className="text-blue-700">Set</span>}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-[#111111]">
                        {adj.previousStock} &rarr; {adj.newStock}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1A1A1A]">
                        {adj.staffName}
                      </td>
                      <td className="py-3 px-4 text-[#6B7280] max-w-xs truncate">
                        {adj.reason}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADJUSTMENT MODAL */}
      {selectedProductForAdj && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white border border-[#C5A15A]/40 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col text-[#1A1A1A]">
            
            {/* Modal Header */}
            <div className="bg-[#111111] text-[#FFFFFF] px-6 py-4 rounded-t-3xl flex items-center justify-between border-b border-[#C5A15A]/30">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A15A] tracking-widest block">
                  Inventory Reconciliation
                </span>
                <h2 className="font-serif text-lg font-bold">
                  {selectedProductForAdj.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProductForAdj(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#C5A15A] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAdjustment} className="p-6 space-y-4 text-xs">
              
              <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B7280] block">Current Recorded Stock:</span>
                  <span className="font-mono text-base font-bold text-[#111111]">
                    {selectedProductForAdj.stockCount != null ? selectedProductForAdj.stockCount : 10} Units
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#6B7280] block">SKU Code:</span>
                  <span className="font-mono text-xs font-bold text-[#C5A15A]">
                    {selectedProductForAdj.sku}
                  </span>
                </div>
              </div>

              {/* Variant Selector (if product has variants) */}
              {selectedProductForAdj.variants && selectedProductForAdj.variants.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1">
                    Select Variant (Optional)
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full bg-[#FCFAF5] border border-[#E5E7EB] px-3 py-2 rounded-xl text-xs text-[#1A1A1A]"
                  >
                    <option value="">Master Product Stock</option>
                    {selectedProductForAdj.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.size} / {v.color.name} (Current: {v.stock} units)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Adjustment Type Selector */}
              <div>
                <label className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1.5">
                  Action Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      adjustmentType === 'add'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-[#FCFAF5] border border-[#E5E7EB] text-[#1A1A1A]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stock</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentType('deduct')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      adjustmentType === 'deduct'
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-[#FCFAF5] border border-[#E5E7EB] text-[#1A1A1A]'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Deduct Stock</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentType('set')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      adjustmentType === 'set'
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'bg-[#FCFAF5] border border-[#E5E7EB] text-[#1A1A1A]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Set Exact</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1">
                  Quantity ({adjustmentType === 'set' ? 'New Exact Total' : 'Units to ' + adjustmentType})
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FCFAF5] border border-[#E5E7EB] px-3 py-2 rounded-xl text-sm font-mono font-bold text-[#111111]"
                  required
                />
              </div>

              {/* Reason Selector & Notes */}
              <div>
                <label className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1">
                  Official Adjustment Reason
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-[#FCFAF5] border border-[#E5E7EB] px-3 py-2 rounded-xl text-xs mb-2 text-[#1A1A1A]"
                >
                  <option value="New Handloom Batch Received from Kuthampully Loom">New Handloom Batch Received from Kuthampully Loom</option>
                  <option value="Physical Loom Audit Reconciliation">Physical Loom Audit Reconciliation</option>
                  <option value="Customer Return Restocked">Customer Return Restocked</option>
                  <option value="Damaged / Fabric Defect Discarded">Damaged / Fabric Defect Discarded</option>
                  <option value="Atelier Display Sample Withdrawn">Atelier Display Sample Withdrawn</option>
                  <option value="Custom Order Allocation">Custom Order Allocation</option>
                </select>
                <input
                  type="text"
                  placeholder="Or enter custom reason / weaver batch ID..."
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-[#FCFAF5] border border-[#E5E7EB] px-3 py-1.5 rounded-xl text-xs text-[#1A1A1A]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductForAdj(null)}
                  className="flex-1 bg-white border border-[#E5E7EB] hover:bg-gray-50 py-2.5 rounded-xl font-bold uppercase text-[11px] text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#111111] hover:bg-[#C5A15A] hover:text-[#111111] text-[#FFFFFF] py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors shadow-md"
                >
                  Commit Adjustment
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};
