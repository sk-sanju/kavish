import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Ruler, UploadCloud, ImagePlus, Link as LinkIcon, Loader2, Star } from 'lucide-react';
import type { Product, ProductCategory, ProductSubcategory } from '../../types';
import { uploadImageFile } from '../../utils/fileUpload';
import { OptimizedImage } from '../common/OptimizedImage';

interface ProductEditorModalProps {
  product: Partial<Product> | null;
  onSave: (productForm: Partial<Product>) => void;
  onClose: () => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({ product, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'variants' | 'media' | 'sizechart'>('basic');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<Product>>({
    id: product?.id,
    name: product?.name || '',
    subtitle: product?.subtitle || '',
    category: product?.category || 'women',
    subcategory: product?.subcategory || 'Kasavu Sarees',
    collection: product?.collection || 'kasavu-masterpieces',
    price: product?.price ?? 4999,
    originalPrice: product?.originalPrice ?? 6499,
    costPrice: product?.costPrice ?? 2500,
    inStock: product?.inStock ?? true,
    stockCount: product?.stockCount ?? 15,
    lowStockThreshold: product?.lowStockThreshold ?? 5,
    allowBackorders: product?.allowBackorders ?? false,
    brand: product?.brand || 'Kavish Kuthampully Atelier',
    isNew: product?.isNew ?? true,
    isBestSeller: product?.isBestSeller ?? false,
    isFeatured: product?.isFeatured ?? true,
    images: product?.images?.length ? product?.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    sizes: product?.sizes?.length ? product?.sizes : ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: product?.colors?.length ? product?.colors : [{ name: 'Kasavu Gold', hex: '#D4AF37' }, { name: 'Royal Cream', hex: '#FAF8F1' }],
    fabric: product?.fabric || '100% Organic Cotton & 24k Zari',
    details: product?.details?.length ? product?.details : ['100% Authentic Handloom with Kerala Govt GI Tag (Reg 2011)'],
    careInstructions: product?.careInstructions?.length ? product?.careInstructions : ['Dry Clean Only', 'Iron on Reverse Zari'],
    fitInformation: product?.fitInformation || 'Standard Traditional Fit',
    sku: product?.sku || `KV-KUT-${Math.floor(1000 + Math.random() * 9000)}`,
    tags: product?.tags?.length ? product?.tags : ['Kuthampully', 'GI Tag', 'Handloom'],
    sizeChart: product?.sizeChart
  });

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name || '',
        subtitle: product.subtitle || '',
        category: product.category || 'women',
        subcategory: product.subcategory || 'Kasavu Sarees',
        collection: product.collection || 'kasavu-masterpieces',
        price: product.price ?? 4999,
        originalPrice: product.originalPrice ?? 6499,
        costPrice: product.costPrice ?? 2500,
        inStock: product.inStock ?? true,
        stockCount: product.stockCount ?? 15,
        lowStockThreshold: product.lowStockThreshold ?? 5,
        allowBackorders: product.allowBackorders ?? false,
        brand: product.brand || 'Kavish Kuthampully Atelier',
        isNew: product.isNew ?? true,
        isBestSeller: product.isBestSeller ?? false,
        isFeatured: product.isFeatured ?? true,
        images: product.images?.length ? product.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        sizes: product.sizes?.length ? product.sizes : ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
        colors: product.colors?.length ? product.colors : [{ name: 'Kasavu Gold', hex: '#D4AF37' }, { name: 'Royal Cream', hex: '#FAF8F1' }],
        fabric: product.fabric || '100% Organic Cotton & 24k Zari',
        details: product.details?.length ? product.details : ['100% Authentic Handloom with Kerala Govt GI Tag (Reg 2011)'],
        careInstructions: product.careInstructions?.length ? product.careInstructions : ['Dry Clean Only', 'Iron on Reverse Zari'],
        fitInformation: product.fitInformation || 'Standard Traditional Fit',
        sku: product.sku || `KV-KUT-${Math.floor(1000 + Math.random() * 9000)}`,
        tags: product.tags?.length ? product.tags : ['Kuthampully', 'GI Tag', 'Handloom'],
        sizeChart: product.sizeChart
      });
    }
  }, [product]);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#D4AF37');
  const [newSizeTag, setNewSizeTag] = useState('');

  const handleDeviceFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const fileArray = Array.from(files);
      const readPromises = fileArray.map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error(`"${file.name}" is not a supported image file.`);
        }
        return uploadImageFile(file, 'products');
      });

      const newUrls = await Promise.all(readPromises);
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process selected image(s).');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setForm({ ...form, images: [...(form.images || []), newImageUrl.trim()] });
      setNewImageUrl('');
      setUploadError(null);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setForm({ ...form, images: (form.images || []).filter((_, i) => i !== idx) });
  };

  const handleSetCoverImage = (idx: number) => {
    if (idx === 0) return;
    const currentImages = [...(form.images || [])];
    const [selected] = currentImages.splice(idx, 1);
    setForm({ ...form, images: [selected, ...currentImages] });
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setForm({
        ...form,
        colors: [...(form.colors || []), { name: newColorName.trim(), hex: newColorHex }]
      });
      setNewColorName('');
    }
  };

  const handleRemoveColor = (idx: number) => {
    setForm({ ...form, colors: (form.colors || []).filter((_, i) => i !== idx) });
  };

  const handleAddSize = () => {
    if (newSizeTag.trim()) {
      setForm({ ...form, sizes: [...(form.sizes || []), newSizeTag.trim()] });
      setNewSizeTag('');
    }
  };

  const handleRemoveSize = (idx: number) => {
    setForm({ ...form, sizes: (form.sizes || []).filter((_, i) => i !== idx) });
  };

  const handleSizeRowChange = (idx: number, field: string, val: string) => {
    const currentRows = [...(form.sizeChart?.rows || [])];
    if (currentRows[idx]) {
      currentRows[idx] = { ...currentRows[idx], [field]: val };
      setForm({
        ...form,
        sizeChart: { ...form.sizeChart, rows: currentRows }
      });
    }
  };

  const handleAddSizeRow = () => {
    const currentRows = form.sizeChart?.rows || [];
    setForm({
      ...form,
      sizeChart: {
        title: form.sizeChart?.title || 'Custom Size Guide',
        description: form.sizeChart?.description || 'Tailoring dimensions',
        rows: [...currentRows, { size: '38 (S)', chest: '38-40"', shoulder: '17.5"', length: '29.5"' }]
      }
    });
  };

  const handleRemoveSizeRow = (idx: number) => {
    const currentRows = (form.sizeChart?.rows || []).filter((_, i) => i !== idx);
    setForm({
      ...form,
      sizeChart: { ...form.sizeChart, rows: currentRows }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      id: product?.id || form.id,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      stockCount: form.stockCount !== undefined ? Number(form.stockCount) : 10,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#FAF8F1]">
              {product?.id ? 'Edit Atelier Product' : 'Add New Handloom Product'}
            </h2>
            <p className="text-xs text-[#E8DDC7]/80">Configure catalog details, pricing, inventory &amp; custom variants</p>
          </div>
          <button onClick={onClose} className="p-1 text-[#E8DDC7] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="bg-[#FAF8F1] border-b border-[#E8DDC7] px-5 py-2 flex flex-row overflow-x-auto gap-2 text-xs font-bold uppercase tracking-wider shrink-0">
          {[
            { id: 'basic', label: '1. Basic Info' },
            { id: 'pricing', label: '2. Pricing & GST' },
            { id: 'inventory', label: '3. Inventory Stock' },
            { id: 'variants', label: '4. Variants & Colors' },
            { id: 'media', label: '5. Media Gallery' },
            { id: 'sizechart', label: '6. Size Chart' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#12372A] text-[#FAF8F1] shadow-xs font-bold'
                  : 'text-[#6B5846] hover:bg-[#E8DDC7]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Kuthampully Tissue Kasavu Saree"
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs font-bold text-[#12372A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g. KV-KUT-8491"
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Subtitle / Weave Summary</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Handcrafted with 24k Pure Gold Kasavu Borders"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs font-bold"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value as ProductSubcategory })}
                    placeholder="e.g. Kasavu Sarees, Double Mundu"
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Collection</label>
                  <select
                    value={form.collection}
                    onChange={(e) => setForm({ ...form, collection: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs font-bold"
                  >
                    <option value="kasavu-masterpieces">Kasavu Masterpieces</option>
                    <option value="festive-edit">The Festive Edit</option>
                    <option value="kerala-classics">Kerala Classics</option>
                    <option value="everyday-kerala">Everyday Organic Linen</option>
                    <option value="kids-heritage">Kids Heritage Legacy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Fabric &amp; Composition</label>
                  <input
                    type="text"
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    placeholder="e.g. 100% Organic Flax Linen"
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="e.g. Kavish Kuthampully Atelier"
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs"
                  />
                </div>
              </div>

              {/* Status Badges Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-[#E8DDC7]">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="accent-[#12372A] w-4 h-4"
                  />
                  <span>In Stock Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                    className="accent-[#12372A] w-4 h-4"
                  />
                  <span>New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    className="accent-[#12372A] w-4 h-4"
                  />
                  <span>Bestseller Badge</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & GST */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-sm font-bold text-[#12372A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">MRP / Original Price (₹)</label>
                  <input
                    type="number"
                    value={form.originalPrice || ''}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Cost Price (COGS ₹)</label>
                  <input
                    type="number"
                    value={form.costPrice || ''}
                    onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-sm font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-2xl space-y-2">
                <h4 className="font-serif font-bold text-[#12372A]">Indian Clothing GST Calculation</h4>
                <p className="text-xs text-[#6B5846]">Applies 5% Handloom Apparel GST (2.5% CGST + 2.5% SGST)</p>
                <div className="flex gap-4 text-xs font-semibold pt-1">
                  <span>Taxable Value: ₹{Math.round(form.price! / 1.05)}</span>
                  <span>GST Amount (5%): ₹{Math.round(form.price! - (form.price! / 1.05))}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={form.stockCount}
                    onChange={(e) => setForm({ ...form, stockCount: Number(e.target.value) })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-sm font-bold text-[#12372A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-sm font-mono"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={form.allowBackorders}
                      onChange={(e) => setForm({ ...form, allowBackorders: e.target.checked })}
                      className="accent-[#12372A] w-4 h-4"
                    />
                    <span>Allow Pre-Order Backorders</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VARIANTS & COLORS */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              {/* Sizes Manager */}
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1.5">Available Size Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(form.sizes || []).map((sz, idx) => (
                    <span key={idx} className="bg-[#FAF8F1] border border-[#E8DDC7] px-3 py-1 rounded-xl font-bold text-[#12372A] flex items-center gap-1.5">
                      <span>{sz}</span>
                      <button type="button" onClick={() => handleRemoveSize(idx)} className="text-red-600 font-bold hover:text-red-800">✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add Size (e.g. 42 (L), Double Mundu)"
                    value={newSizeTag}
                    onChange={(e) => setNewSizeTag(e.target.value)}
                    className="flex-1 border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
                  />
                  <button type="button" onClick={handleAddSize} className="bg-[#12372A] text-[#FAF8F1] px-4 py-2 font-bold uppercase rounded-xl">+ Add Size</button>
                </div>
              </div>

              {/* Colors Manager */}
              <div className="pt-3 border-t border-[#E8DDC7]">
                <label className="block font-semibold text-[#6B5846] mb-1.5">Color Palette Variants</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(form.colors || []).map((c, idx) => (
                    <span key={idx} className="bg-[#FAF8F1] border border-[#E8DDC7] px-3 py-1 rounded-xl font-bold text-[#12372A] flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                      <button type="button" onClick={() => handleRemoveColor(idx)} className="text-red-600 font-bold hover:text-red-800">✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Color Name (e.g. Kasavu Gold)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1 border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 border border-[#E8DDC7] p-1 rounded-xl cursor-pointer"
                  />
                  <button type="button" onClick={handleAddColor} className="bg-[#12372A] text-[#FAF8F1] px-4 py-2 font-bold uppercase rounded-xl">+ Add Color</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block font-semibold text-[#12372A] text-sm">Product High-Res Media Gallery</label>
                  <p className="text-xs text-[#6B5846]">
                    Upload photos directly from your device (phone/PC) or paste web URLs. The first image will be used as the primary catalog cover.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#FAF8F1] px-2.5 py-1 rounded-lg border border-[#E8DDC7] text-[#12372A] self-start sm:self-auto">
                  {(form.images || []).length} Photo{(form.images || []).length === 1 ? '' : 's'} Added
                </span>
              </div>

              {/* Device Upload Zone */}
              <label
                htmlFor="product-device-file-input"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleDeviceFiles(e.dataTransfer.files);
                  }
                }}
                className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer select-none transition-all ${
                  isDragging
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 scale-[0.99] ring-2 ring-[#D4AF37]/50'
                    : 'border-[#D4AF37]/50 bg-[#FAF8F1]/70 hover:bg-[#FAF8F1] hover:border-[#D4AF37]'
                }`}
              >
                <input
                  id="product-device-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.bmp,.avif,.jfif,.heic"
                  multiple
                  onClick={(e) => {
                    (e.currentTarget as HTMLInputElement).value = '';
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleDeviceFiles(e.target.files);
                    }
                  }}
                  className="sr-only"
                />

                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-[#12372A]/5 border border-[#D4AF37]/30 flex items-center justify-center text-[#12372A]">
                    {isUploadingImage ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-[#12372A]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#12372A]">
                      {isUploadingImage ? 'Processing & Optimizing Images...' : 'Click to Upload from Device or Drag & Drop'}
                    </p>
                    <p className="text-[11px] text-[#6B5846] mt-0.5">
                      JPG, PNG, WebP, SVG • Select multiple photos at once
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#12372A] text-[#FAF8F1] text-[11px] font-bold uppercase rounded-xl tracking-wider shadow-xs">
                    <ImagePlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Browse Device Files</span>
                  </span>
                </div>
              </label>

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
                  <span>{uploadError}</span>
                  <button type="button" onClick={() => setUploadError(null)} className="font-bold hover:text-red-900">✕</button>
                </div>
              )}

              {/* Or Paste URL */}
              <div className="pt-2 border-t border-[#E8DDC7]">
                <label className="block text-[11px] font-semibold text-[#6B5846] mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-3 h-3 text-[#D4AF37]" />
                  <span>Or Add via Direct Web Image URL:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or cloud image link"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImage();
                      }
                    }}
                    className="flex-1 border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-[#12372A] text-[#FAF8F1] px-5 py-2.5 font-bold uppercase text-xs rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all whitespace-nowrap"
                  >
                    + Add URL
                  </button>
                </div>
              </div>

              {/* Attached Photos Grid */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5846] mb-2">
                  Attached Product Media ({(form.images || []).length})
                </label>

                {(form.images || []).length === 0 ? (
                  <div className="p-8 border border-dashed border-[#E8DDC7] rounded-2xl text-center text-xs text-[#6B5846] bg-[#FAF8F1]">
                    No images added yet. Upload from device above or paste an image URL.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {(form.images || []).map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-[3/4] border-2 rounded-2xl overflow-hidden group shadow-xs transition-all ${
                          idx === 0 ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : 'border-[#E8DDC7]'
                        }`}
                      >
                        <OptimizedImage
                          src={img}
                          alt={`Product view ${idx + 1}`}
                          preset="thumbnail"
                          aspectRatio="3/4"
                          containerClassName="w-full h-full"
                        />
                        
                        {/* Cover Badge */}
                        {idx === 0 ? (
                          <span className="absolute top-2 left-2 bg-[#12372A] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#D4AF37] shadow-sm flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-[#D4AF37]" />
                            Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(idx)}
                            className="absolute top-2 left-2 bg-black/60 hover:bg-[#12372A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            title="Set as main product cover"
                          >
                            Set Cover
                          </button>
                        )}

                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Position indicator */}
                        <span className="absolute bottom-1.5 right-2 text-[10px] font-mono font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SIZE CHART */}
          {activeTab === 'sizechart' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8DDC7] pb-2">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-[#12372A]">Custom Garment Measurement Table</h4>
                </div>
                <button type="button" onClick={handleAddSizeRow} className="bg-[#12372A] text-[#FAF8F1] px-3 py-1 rounded-lg text-[11px] font-bold uppercase">+ Add Row</button>
              </div>

              <div className="space-y-2">
                {(form.sizeChart?.rows || []).map((row, idx) => (
                  <div key={idx} className="p-2 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Size Tag"
                      value={row.size}
                      onChange={(e) => handleSizeRowChange(idx, 'size', e.target.value)}
                      className="w-24 border border-[#E8DDC7] p-1.5 rounded-lg bg-white font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Chest"
                      value={row.chest || ''}
                      onChange={(e) => handleSizeRowChange(idx, 'chest', e.target.value)}
                      className="flex-1 border border-[#E8DDC7] p-1.5 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Shoulder"
                      value={row.shoulder || ''}
                      onChange={(e) => handleSizeRowChange(idx, 'shoulder', e.target.value)}
                      className="flex-1 border border-[#E8DDC7] p-1.5 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Length"
                      value={row.length || ''}
                      onChange={(e) => handleSizeRowChange(idx, 'length', e.target.value)}
                      className="flex-1 border border-[#E8DDC7] p-1.5 rounded-lg bg-white"
                    />
                    <button type="button" onClick={() => handleRemoveSizeRow(idx)} className="text-red-600 font-bold p-1">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs tracking-wider rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
          >
            Save Product to Store
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-[#E8DDC7] text-[#171717] font-bold text-xs uppercase rounded-xl hover:bg-white"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

