'use client';

import React, { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Edit, Trash2, CheckCircle2, XCircle, X, UploadCloud, ImagePlus,
  Link as LinkIcon, Loader2, Search, Filter, Layers, Sparkles
} from 'lucide-react';
import type { CategoryItem, ProductCategory } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { INITIAL_CATEGORIES } from '../../data/categories';
import { uploadImageFile } from '../../utils/fileUpload';
import { OptimizedImage } from '../common/OptimizedImage';

export const DEFAULT_CATEGORIES = INITIAL_CATEGORIES;

export const CategoryManagement: React.FC = () => {
  const { products, categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | ProductCategory>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isUploadingCategoryImg, setIsUploadingCategoryImg] = useState(false);
  const [isCategoryDragging, setIsCategoryDragging] = useState(false);
  const [uploadCategoryError, setUploadCategoryError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<CategoryItem>>({
    name: '',
    parentCategory: 'women',
    slug: '',
    image: '/assets/categories/women_kasavu.jpg',
    description: '',
    seoTitle: '',
    seoDescription: '',
    status: 'Active'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDepartment === 'all' || cat.parentCategory === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [categories, searchTerm, selectedDepartment]);

  // Compute live products count for each category
  const getCategoryProductCount = (cat: CategoryItem) => {
    const catName = cat.name.toLowerCase();
    const catSlug = cat.slug.toLowerCase();
    return products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pSub = (p.subcategory || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return pCat === cat.parentCategory.toLowerCase() && (
        pSub.includes(catName) || catName.includes(pSub) ||
        pName.includes(catName) || pName.includes(catSlug)
      );
    }).length;
  };

  const handleNameChange = (name: string) => {
    const autoSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    setForm(prev => ({
      ...prev,
      name,
      slug: prev.slug && prev.slug !== autoSlug.slice(0, -1) && !editingCategory ? prev.slug : autoSlug,
      seoTitle: prev.seoTitle && prev.seoTitle !== name.slice(0, -1) && !editingCategory ? prev.seoTitle : `${name} | Kavish Luxury Handlooms`
    }));
  };

  const handleCategoryDeviceUpload = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setUploadCategoryError(null);
    setIsUploadingCategoryImg(true);

    try {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        throw new Error(`"${file.name}" is not a supported image file.`);
      }
      const uploadedUrl = await uploadImageFile(file, 'categories');
      setForm((prev) => ({ ...prev, image: uploadedUrl }));
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
    if (!form.name || !form.name.trim()) {
      alert('Please enter a valid category name.');
      return;
    }

    if (editingCategory) {
      updateCategory({ ...editingCategory, ...form } as CategoryItem);
      showToast(`Category "${form.name}" updated successfully.`);
    } else {
      addCategory(form);
      showToast(`Category "${form.name}" created successfully.`);
    }
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleToggleStatus = (id: string) => {
    toggleCategoryStatus(id);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategory(id);
      showToast(`Category "${name}" deleted.`);
    }
  };

  const handleSeedDefaults = () => {
    INITIAL_CATEGORIES.forEach(c => addCategory(c));
    showToast('Loaded standard authentic Kuthampully handloom categories.');
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#12372A] text-[#FAF8F1] px-4 py-3 rounded-2xl border border-[#D4AF37] shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Taxonomy &amp; Navigation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Category Management ({categories.length})
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {categories.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              className="bg-[#FAF8F1] text-[#12372A] px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#E8DDC7] transition-all flex items-center gap-1.5 border border-[#D4AF37]"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Load Default Categories</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingCategory(null);
              setForm({
                name: '',
                parentCategory: 'women',
                slug: '',
                image: '/assets/categories/women_kasavu.jpg',
                description: '',
                seoTitle: '',
                seoDescription: '',
                status: 'Active'
              });
              setShowModal(true);
            }}
            className="bg-[#12372A] text-[#FAF8F1] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-2 border border-[#D4AF37] shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* Department Filter Tabs & Search Bar */}
      <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search categories by name, slug, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F1] text-xs text-[#12372A]"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F1] p-1 rounded-xl border border-[#E8DDC7] overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#D4AF37] ml-2 shrink-0" />
          <button
            onClick={() => setSelectedDepartment('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${selectedDepartment === 'all' ? 'bg-[#12372A] text-[#FAF8F1] font-bold shadow-xs' : 'text-[#6B5846] hover:bg-white'}`}
          >
            All ({categories.length})
          </button>
          <button
            onClick={() => setSelectedDepartment('women')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${selectedDepartment === 'women' ? 'bg-[#12372A] text-[#FAF8F1] font-bold shadow-xs' : 'text-[#6B5846] hover:bg-white'}`}
          >
            Women ({categories.filter(c => c.parentCategory === 'women').length})
          </button>
          <button
            onClick={() => setSelectedDepartment('men')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${selectedDepartment === 'men' ? 'bg-[#12372A] text-[#FAF8F1] font-bold shadow-xs' : 'text-[#6B5846] hover:bg-white'}`}
          >
            Men ({categories.filter(c => c.parentCategory === 'men').length})
          </button>
          <button
            onClick={() => setSelectedDepartment('kids')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${selectedDepartment === 'kids' ? 'bg-[#12372A] text-[#FAF8F1] font-bold shadow-xs' : 'text-[#6B5846] hover:bg-white'}`}
          >
            Kids ({categories.filter(c => c.parentCategory === 'kids').length})
          </button>
        </div>
      </div>

      {/* Empty State When No Categories Found */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#E8DDC7] rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F1] border border-[#D4AF37] flex items-center justify-center mx-auto text-[#12372A]">
            <Layers className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#12372A]">
              {categories.length === 0 ? 'No Categories Configured Yet' : 'No Matching Categories Found'}
            </h3>
            <p className="text-xs text-[#6B5846]">
              {categories.length === 0
                ? 'Organize your store taxonomy by adding your first handloom department or loading default heritage categories.'
                : 'Try adjusting your search query or department filter.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            {categories.length === 0 && (
              <button
                onClick={handleSeedDefaults}
                className="bg-[#FAF8F1] text-[#12372A] px-4 py-2.5 rounded-xl text-xs font-bold uppercase border border-[#D4AF37] hover:bg-[#E8DDC7] transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Load Default Categories</span>
              </button>
            )}
            <button
              onClick={() => {
                setEditingCategory(null);
                setForm({
                  name: '',
                  parentCategory: 'women',
                  slug: '',
                  image: '/assets/categories/women_kasavu.jpg',
                  description: '',
                  seoTitle: '',
                  seoDescription: '',
                  status: 'Active'
                });
                setShowModal(true);
              }}
              className="bg-[#12372A] text-[#FAF8F1] px-5 py-2.5 rounded-xl text-xs font-bold uppercase border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Create Category</span>
            </button>
          </div>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(cat => {
            const liveGarmentCount = getCategoryProductCount(cat);
            return (
              <div
                key={cat.id}
                className="bg-white border border-[#E8DDC7] hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 relative overflow-hidden bg-[#FAF8F1]">
                    <OptimizedImage
                      src={cat.image}
                      alt={cat.name}
                      preset="card"
                      containerClassName="w-full h-full"
                      imageClassName="transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10" />
                    
                    <span className="absolute top-3 right-3 bg-[#12372A] text-[#D4AF37] text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-[#D4AF37] shadow-sm">
                      {cat.parentCategory}
                    </span>
                    
                    <h3 className="absolute bottom-3 left-4 right-4 font-serif text-xl font-bold text-[#FAF8F1] line-clamp-1">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="p-4 space-y-2.5 text-xs">
                    <p className="text-[#6B5846] font-light line-clamp-2 leading-relaxed min-h-[32px]">
                      {cat.description || 'Traditional Kuthampully handloom certified collection.'}
                    </p>
                    <div className="pt-2 border-t border-[#FAF8F1] flex justify-between items-center text-[11px] font-mono text-[#12372A]">
                      <span className="bg-[#FAF8F1] px-2 py-0.5 rounded border border-[#E8DDC7] text-[10px]">
                        /{cat.slug}
                      </span>
                      <span className="font-bold text-[#12372A] bg-[#FAF8F1] px-2 py-0.5 rounded-full border border-[#E8DDC7]">
                        {liveGarmentCount} Garments
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(cat.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border transition-all ${
                      cat.status === 'Active'
                        ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {cat.status === 'Active' ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-gray-500" />}
                    <span>{cat.status}</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setForm(cat);
                        setShowModal(true);
                      }}
                      className="p-1.5 text-[#12372A] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E8DDC7]"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 text-red-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-200"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            <form id="category-modal-form" noValidate onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Kasavu Sarees"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                    placeholder="e.g. kasavu-sarees"
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-xs text-[#12372A]"
                  />
                </div>
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
                    <OptimizedImage
                      src={form.image}
                      alt="Category Banner Preview"
                      preset="card"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 z-10">
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

                {/* Web Image URL Input */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#6B5846] mb-1 flex items-center gap-1">
                    <LinkIcon className="w-2.5 h-2.5 text-[#D4AF37]" />
                    <span>Or Paste Image Web URL:</span>
                  </label>
                  <input
                    type="text"
                    value={form.image || ''}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/assets/categories/... or image data URL"
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
                  placeholder="Short description of this handloom category..."
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
                    placeholder="e.g. Authentic Kasavu Sarees | Kavish"
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">SEO Description</label>
                  <input
                    type="text"
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    placeholder="Meta description for search engines..."
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
              </div>
            </form>

            {/* Modal Fixed Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all shadow-sm cursor-pointer"
              >
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-3 border border-[#E8DDC7] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all cursor-pointer"
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
