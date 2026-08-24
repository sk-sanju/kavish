import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, X, UploadCloud, ImagePlus, Link as LinkIcon, Loader2 } from 'lucide-react';
import type { CategoryItem, ProductCategory } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { INITIAL_CATEGORIES } from '../../data/categories';
import { readImageFileAsDataUrl } from '../../utils/fileUpload';

export const DEFAULT_CATEGORIES = INITIAL_CATEGORIES;

export const CategoryManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isUploadingCategoryImg, setIsUploadingCategoryImg] = useState(false);
  const [isCategoryDragging, setIsCategoryDragging] = useState(false);
  const [uploadCategoryError, setUploadCategoryError] = useState<string | null>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<CategoryItem>>({
    name: '',
    parentCategory: 'women',
    slug: '',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: '',
    seoTitle: '',
    seoDescription: '',
    status: 'Active'
  });

  const handleCategoryDeviceUpload = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setUploadCategoryError(null);
    setIsUploadingCategoryImg(true);

    try {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        throw new Error(`"${file.name}" is not a supported image file.`);
      }
      const dataUrl = await readImageFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err: any) {
      setUploadCategoryError(err.message || 'Failed to process category image.');
    } finally {
      setIsUploadingCategoryImg(false);
      if (categoryFileInputRef.current) {
        categoryFileInputRef.current.value = '';
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory({ ...editingCategory, ...form } as CategoryItem);
    } else {
      addCategory(form);
    }
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleToggleStatus = (id: string) => {
    toggleCategoryStatus(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Taxonomy &amp; Navigation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Category Management ({categories.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setForm({
              name: '', parentCategory: 'women', slug: '', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
              description: '', seoTitle: '', seoDescription: '', status: 'Active'
            });
            setShowModal(true);
          }}
          className="bg-[#12372A] text-[#FAF8F1] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-2 border border-[#D4AF37] shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white border border-[#E8DDC7] hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="h-44 relative overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute top-3 right-3 bg-[#12372A] text-[#D4AF37] text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]">
                  {cat.parentCategory}
                </span>
                <h3 className="absolute bottom-3 left-4 font-serif text-xl font-bold text-[#FAF8F1]">
                  {cat.name}
                </h3>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <p className="text-[#6B5846] font-light line-clamp-2 leading-relaxed">{cat.description}</p>
                <div className="pt-2 border-t border-[#FAF8F1] flex justify-between items-center text-[11px] font-mono text-[#12372A]">
                  <span className="bg-[#FAF8F1] px-2 py-0.5 rounded border border-[#E8DDC7]">/{cat.slug}</span>
                  <span className="font-bold text-[#12372A]">{cat.productCount} Garments</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(cat.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border ${
                  cat.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {cat.status === 'Active' ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3" />}
                <span>{cat.status}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setForm(cat);
                    setShowModal(true);
                  }}
                  className="p-1.5 text-[#12372A] hover:bg-white rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-red-600 hover:bg-white rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Editor Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[85vh]">
            
            {/* Modal Fixed Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FAF8F1]">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-[#E8DDC7]/80">Configure taxonomy, department &amp; SEO metadata</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="category-modal-form" onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kasavu Sarees"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Parent Department</label>
                <select
                  value={form.parentCategory}
                  onChange={(e) => setForm({ ...form, parentCategory: e.target.value as ProductCategory })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              {/* Category Image Section with Device Upload */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-[#6B5846]">Category Banner Image</label>
                  {form.image && (
                    <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Image Selected
                    </span>
                  )}
                </div>

                {/* Live Preview If Image Exists */}
                {form.image ? (
                  <div className="relative h-36 rounded-2xl overflow-hidden border border-[#E8DDC7] group shadow-xs">
                    <img src={form.image} alt="Category Banner Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                      <p className="text-white text-xs font-bold font-serif">{form.name || 'Category Name Preview'}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => categoryFileInputRef.current?.click()}
                        className="bg-[#12372A] text-[#FAF8F1] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-1 shadow-sm"
                      >
                        <ImagePlus className="w-3 h-3" />
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        className="bg-red-600 text-white p-1 rounded-lg hover:bg-red-700 transition-all shadow-sm"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Device Upload Zone */}
                <label
                  htmlFor="category-device-file-input"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCategoryDragging(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCategoryDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCategoryDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCategoryDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleCategoryDeviceUpload(e.dataTransfer.files);
                    }
                  }}
                  className={`block border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer select-none transition-all ${
                    isCategoryDragging
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/50'
                      : 'border-[#D4AF37]/50 bg-[#FAF8F1]/70 hover:bg-[#FAF8F1] hover:border-[#D4AF37]'
                  }`}
                >
                  <input
                    id="category-device-file-input"
                    ref={categoryFileInputRef}
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.bmp,.avif,.jfif,.heic"
                    onClick={(e) => {
                      (e.currentTarget as HTMLInputElement).value = '';
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleCategoryDeviceUpload(e.target.files);
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-[#12372A]/5 border border-[#D4AF37]/30 flex items-center justify-center text-[#12372A]">
                      {isUploadingCategoryImg ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
                      ) : (
                        <UploadCloud className="w-5 h-5 text-[#12372A]" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#12372A]">
                      {isUploadingCategoryImg ? 'Uploading & Processing...' : 'Click to Upload Banner from Device'}
                    </p>
                    <p className="text-[10px] text-[#6B5846]">
                      Drag & drop image here or click to browse (JPG, PNG, WebP, SVG)
                    </p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#12372A] text-[#FAF8F1] text-[10px] font-bold uppercase rounded-lg tracking-wider mt-0.5 shadow-xs">
                      <ImagePlus className="w-3 h-3 text-[#D4AF37]" />
                      <span>Browse File</span>
                    </span>
                  </div>
                </label>

                {uploadCategoryError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
                    <span>{uploadCategoryError}</span>
                    <button type="button" onClick={() => setUploadCategoryError(null)} className="font-bold hover:text-red-900">✕</button>
                  </div>
                )}

                {/* Or Web Image URL Input */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#6B5846] mb-1 flex items-center gap-1">
                    <LinkIcon className="w-2.5 h-2.5 text-[#D4AF37]" />
                    <span>Or Paste Image Web URL:</span>
                  </label>
                  <input
                    type="url"
                    value={form.image || ''}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1] text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Category Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8DDC7]">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">SEO Description</label>
                  <input
                    type="text"
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
              </div>
            </form>

            {/* Modal Fixed Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="category-modal-form"
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
              >
                Save Category
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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
