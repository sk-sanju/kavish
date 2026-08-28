import React, { useState } from 'react';
import {
  Search, Plus, Edit, Trash2, Copy, CheckCircle2, XCircle
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Store Product Inventory ({products.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowEditorModal(true);
          }}
          className="bg-[#12372A] text-[#FAF8F1] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-2 border border-[#D4AF37] shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product title, SKU, or subcategory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#D4AF37] rounded-xl bg-[#FAF8F1]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-[#E8DDC7] px-3 py-2 bg-[#FAF8F1] rounded-xl font-semibold text-[#12372A]"
          >
            <option value="all">All Departments</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-[#E8DDC7] px-3 py-2 bg-[#FAF8F1] rounded-xl font-semibold text-[#12372A]"
          >
            <option value="all">All Stock Statuses</option>
            <option value="instock">In Stock Only</option>
            <option value="out">Out of Stock</option>
          </select>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-3 py-2 rounded-xl font-bold uppercase text-[11px] flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}
        </div>

      </div>

      {/* Product Table */}
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12372A] text-[#FAF8F1] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="accent-[#D4AF37]"
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
            <tbody className="divide-y divide-[#E8DDC7]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#6B5846]">
                    No garments matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF8F1] transition-colors">
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleToggleSelect(p.id)}
                        className="accent-[#12372A]"
                      />
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <OptimizedImage
                          src={p.images[0]}
                          alt={p.name}
                          preset="thumbnail"
                          aspectRatio="3/4"
                          containerClassName="w-10 h-12 rounded-lg bg-[#FAF8F1] border border-[#E8DDC7] shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-[#12372A] text-xs line-clamp-1">{p.name}</h4>
                          <span className="text-[10px] text-[#6B5846]">{p.subcategory} • {p.fabric}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-[#12372A] font-semibold">{p.sku}</td>

                    <td className="p-3.5 capitalize font-semibold text-[#6B5846]">{p.category}</td>

                    <td className="p-3.5 font-bold font-serif text-[#12372A]">
                      {formatPrice(p.price)}
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through block font-sans font-normal">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span className={`font-mono font-bold ${ (p.stockCount ?? 10) <= 5 ? 'text-red-600' : 'text-[#12372A]' }`}>
                        {p.stockCount ?? 10} Units
                      </span>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => toggleStockStatus(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border transition-all ${
                          p.inStock
                            ? 'bg-green-50 text-green-800 border-green-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {p.inStock ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-red-600" />}
                        <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setShowEditorModal(true);
                        }}
                        className="p-1.5 text-[#12372A] hover:bg-[#FAF8F1] rounded-lg"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 text-[#D4AF37] hover:bg-[#FAF8F1] rounded-lg"
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
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
