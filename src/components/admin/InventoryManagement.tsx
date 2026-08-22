import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { Product } from '../../types';

export const InventoryManagement: React.FC = () => {
  const { products, updateProduct } = useProducts();
  const { addAuditLog } = useAdmin();
  const { formatPrice } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState(5);
  const [adjustType, setAdjustType] = useState<'add' | 'remove' | 'set'>('add');
  const [adjustReason, setAdjustReason] = useState('New Kuthampully loom stock arrival');
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Computed Stock Metrics
  const totalUnits = products.reduce((acc, p) => acc + (p.stockCount ?? 10), 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * (p.stockCount ?? 10)), 0);
  const lowStockCount = products.filter(p => (p.stockCount ?? 10) > 0 && (p.stockCount ?? 10) <= (p.lowStockThreshold || 5)).length;
  const outOfStockCount = products.filter(p => !p.inStock || (p.stockCount ?? 10) === 0).length;
  const overstockedCount = products.filter(p => (p.stockCount ?? 10) >= 30).length;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const qty = p.stockCount ?? 10;
    const threshold = p.lowStockThreshold || 5;
    
    if (stockStatusFilter === 'low') return matchesSearch && qty > 0 && qty <= threshold;
    if (stockStatusFilter === 'out') return matchesSearch && (qty === 0 || !p.inStock);
    if (stockStatusFilter === 'overstocked') return matchesSearch && qty >= 30;
    return matchesSearch;
  });

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const currentQty = selectedProduct.stockCount ?? 10;
    let newQty = currentQty;

    if (adjustType === 'add') newQty += adjustQty;
    else if (adjustType === 'remove') newQty = Math.max(0, currentQty - adjustQty);
    else newQty = adjustQty;

    const updatedProd: Product = {
      ...selectedProduct,
      stockCount: newQty,
      inStock: newQty > 0
    };

    updateProduct(updatedProd);

    // Audit Record
    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Adjusted Stock for ${selectedProduct.name} (${adjustType.toUpperCase()} ${adjustQty} units)`,
      entity: 'ProductInventory',
      entityId: selectedProduct.id,
      previousValue: `${currentQty} units`,
      newValue: `${newQty} units (${adjustReason})`
    });

    setShowAdjustModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Warehouse &amp; Stock Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Inventory Management
          </h1>
        </div>
      </div>

      {/* 5 INVENTORY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Total Inventory Value</span>
          <div className="font-serif text-xl font-bold text-[#12372A]">{formatPrice(totalValue)}</div>
          <span className="text-[10px] text-gray-500 font-mono">Retail stock valuation</span>
        </div>

        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Total Stock Units</span>
          <div className="font-serif text-xl font-bold text-[#12372A]">{totalUnits} Garments</div>
          <span className="text-[10px] text-gray-500">Across all SKUs</span>
        </div>

        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Low Stock Items</span>
          <div className="font-serif text-xl font-bold text-amber-600">{lowStockCount} SKUs</div>
          <span className="text-[10px] text-amber-700 font-semibold">Units &lt;= Threshold</span>
        </div>

        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Out-of-Stock</span>
          <div className="font-serif text-xl font-bold text-red-600">{outOfStockCount} SKUs</div>
          <span className="text-[10px] text-red-700 font-semibold">Action Required</span>
        </div>

        <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-1">
          <span className="text-[#6B5846]">Overstocked</span>
          <div className="font-serif text-xl font-bold text-blue-600">{overstockedCount} SKUs</div>
          <span className="text-[10px] text-blue-700">Units &gt;= 30</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F1]"
          />
        </div>

        <select
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          className="border border-[#E8DDC7] px-3 py-2 bg-[#FAF8F1] rounded-xl font-semibold text-[#12372A]"
        >
          <option value="all">All Stock Statuses</option>
          <option value="low">Low Stock Only</option>
          <option value="out">Out of Stock</option>
          <option value="overstocked">Overstocked</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12372A] text-[#FAF8F1] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Garment SKU</th>
                <th className="p-3.5">SKU Code</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Reserved (Pending Orders)</th>
                <th className="p-3.5">Available Stock</th>
                <th className="p-3.5">Stock Status</th>
                <th className="p-3.5 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDC7]">
              {filteredProducts.map(p => {
                const qty = p.stockCount ?? 10;
                const reserved = Math.min(2, qty);
                const available = Math.max(0, qty - reserved);
                const threshold = p.lowStockThreshold || 5;

                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F1] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-9 h-11 object-cover rounded-lg bg-white border border-[#E8DDC7]" />
                        <div>
                          <strong className="text-[#12372A] block font-bold">{p.name}</strong>
                          <span className="text-[10px] text-[#6B5846]">{p.subcategory}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-[#12372A] font-semibold">{p.sku}</td>

                    <td className="p-3.5 font-bold font-mono text-sm">{qty}</td>

                    <td className="p-3.5 font-mono text-gray-500">{reserved} units</td>

                    <td className="p-3.5 font-mono font-bold text-green-700">{available} units</td>

                    <td className="p-3.5">
                      {qty === 0 ? (
                        <span className="bg-red-100 text-red-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border border-red-300">Out of Stock</span>
                      ) : qty <= threshold ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border border-amber-300">Low Stock ({qty})</span>
                      ) : qty >= 30 ? (
                        <span className="bg-blue-100 text-blue-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border border-blue-300">Overstocked</span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border border-green-300">Optimal Stock</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowAdjustModal(true);
                        }}
                        className="bg-[#12372A] text-[#FAF8F1] px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all border border-[#D4AF37]"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && selectedProduct && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FAF8F1]">
                  Adjust Stock Level: {selectedProduct.name}
                </h3>
                <p className="text-xs text-[#E8DDC7]/80">Current Stock Level: <strong className="font-mono text-[#D4AF37]">{selectedProduct.stockCount ?? 10} units</strong></p>
              </div>
              <button onClick={() => setShowAdjustModal(false)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="adjust-stock-form" onSubmit={handleApplyAdjustment} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 rounded-xl font-bold border text-xs uppercase ${adjustType === 'add' ? 'bg-[#12372A] text-[#FAF8F1] border-[#D4AF37]' : 'bg-[#FAF8F1] border-[#E8DDC7]'}`}
                  >
                    + Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('remove')}
                    className={`py-2 rounded-xl font-bold border text-xs uppercase ${adjustType === 'remove' ? 'bg-red-800 text-white border-red-900' : 'bg-[#FAF8F1] border-[#E8DDC7]'}`}
                  >
                    - Remove Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('set')}
                    className={`py-2 rounded-xl font-bold border text-xs uppercase ${adjustType === 'set' ? 'bg-[#D4AF37] text-[#12372A] border-[#12372A]' : 'bg-[#FAF8F1] border-[#E8DDC7]'}`}
                  >
                    Set Level
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-sm font-bold text-[#12372A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Mandatory Audit Reason *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Loom weaving arrival, damaged item removal"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="adjust-stock-form"
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
              >
                Confirm Adjustment &amp; Audit Log
              </button>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="px-5 py-3 border border-[#E8DDC7] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all"
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
