'use client';

import React, { useState } from 'react';
import {
  Search, Plus, Edit, Trash2, Copy, CheckCircle2, XCircle, Sparkles
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAdmin } from '../../context/AdminContext';
import { ProductEditorModal } from './ProductEditorModal';
import { OptimizedImage } from '../common/OptimizedImage';
import type { Product } from '../../types';

export const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, toggleStockStatus } = useProducts();
  const { formatPrice } = useCurrency();
  const { addAuditLog } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showEditorModal, setShowEditorModal] = useState(false);

  // Filtered Products List
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'instock' && p.inStock) ||
      (stockFilter === 'out' && !p.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      selectedIds.forEach(id => deleteProduct(id));
      setSelectedIds([]);
      addAuditLog({
        adminName: 'Sanjay Suresh (Super Admin)',
        adminRole: 'Super Admin',
        action: `Bulk deleted ${selectedIds.length} products`,
        entity: 'Product',
        entityId: 'bulk'
      });
    }
  };

  const handleDuplicate = (p: Product) => {
    const duplicatedForm: Partial<Product> = {
      ...p,
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-COPY`,
      id: undefined
    };
    addProduct(duplicatedForm);
    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Duplicated product ${p.name}`,
      entity: 'Product',
      entityId: p.id
    });
  };

  const handleSaveProduct = (form: Partial<Product>) => {
    if (form.id) {
      updateProduct(form as Product);
      addAuditLog({
        adminName: 'Sanjay Suresh (Super Admin)',
        adminRole: 'Super Admin',
        action: `Updated product details for ${form.name}`,
        entity: 'Product',
        entityId: form.id
      });
    } else {
      addProduct(form);
      addAuditLog({
        adminName: 'Sanjay Suresh (Super Admin)',
        adminRole: 'Super Admin',
        action: `Added new product to catalog: ${form.name}`,
        entity: 'Product',
        entityId: 'new'
      });
    }
    setShowEditorModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A15A] block">
            Catalog Management &amp; Stock Control
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-0.5">
            Store Product Catalog ({products.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowEditorModal(true);
          }}
          className="bg-[#111111] text-[#FFFFFF] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#C5A15A] hover:text-[#111111] transition-all flex items-center gap-2 border border-[#C5A15A] shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C5A15A]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product title, SKU, or subcategory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E5E7EB] pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#C5A15A] rounded-xl bg-[#FFFFFF] text-[#111111]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-[#E5E7EB] px-3 py-2 bg-[#FFFFFF] rounded-xl font-semibold text-[#111111]"
          >
            <option value="all">All Departments</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-[#E5E7EB] px-3 py-2 bg-[#FFFFFF] rounded-xl font-semibold text-[#111111]"
          >
            <option value="all">All Stock Statuses</option>
            <option value="instock">In Stock Only</option>
            <option value="out">Out of Stock</option>
          </select>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-3 py-2 rounded-xl font-bold uppercase text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}
        </div>

      </div>

      {/* Product Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#111111] text-[#FFFFFF] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="accent-[#C5A15A]"
                  />
                </th>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price (INR)</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#6B7280]">
                    No garments matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-[#FFFFFF]/60 transition-colors">
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleToggleSelect(p.id)}
                        className="accent-[#111111]"
                      />
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <OptimizedImage
                          src={p.images[0]}
                          alt={p.name}
                          preset="thumbnail"
                          aspectRatio="3/4"
                          containerClassName="w-10 h-12 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-[#111111] text-xs line-clamp-1">{p.name}</h4>
                            {p.isFeatured && (
                              <span className="text-[9px] bg-[#C5A15A]/20 text-[#111111] border border-[#C5A15A]/40 px-1 rounded font-bold uppercase shrink-0">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#6B7280]">{p.subcategory} • {p.fabric}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-[#111111] font-semibold">{p.sku}</td>

                    <td className="p-3.5 capitalize font-semibold text-[#6B7280]">{p.category}</td>

                    <td className="p-3.5 font-bold font-serif text-[#111111]">
                      {formatPrice(p.price)}
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through block font-sans font-normal">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span className={`font-mono font-bold ${ (p.stockCount ?? 10) <= 5 ? 'text-red-600' : 'text-[#111111]' }`}>
                        {p.stockCount ?? 10} Units
                      </span>
                      {p.variants && p.variants.length > 0 && (
                        <span className="block text-[9px] text-[#C5A15A] font-sans font-medium">
                          {p.variants.length} Variants
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => toggleStockStatus(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border transition-all cursor-pointer ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {p.inStock ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-red-600" />}
                        <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setShowEditorModal(true);
                        }}
                        className="p-1.5 text-[#111111] hover:bg-[#FFFFFF] rounded-lg cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 text-[#C5A15A] hover:bg-[#FFFFFF] rounded-lg cursor-pointer"
                        title="Duplicate Product"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${p.name} from catalog?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showEditorModal && (
        <ProductEditorModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowEditorModal(false);
            setEditingProduct(null);
          }}
        />
      )}

    </div>
  );
};
