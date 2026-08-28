import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Image as ImageIcon, Plus, Edit, Trash2, CheckCircle2, XCircle, X,
  UploadCloud, ImagePlus, Link as LinkIcon, Loader2, ArrowUp, ArrowDown,
  Sparkles, Eye, Compass, ArrowRight, RefreshCw
} from 'lucide-react';
import { useAdmin, DEFAULT_HERO_BANNERS } from '../../context/AdminContext';
import type { HeroBanner } from '../../types';
import { uploadImageFile } from '../../utils/fileUpload';
import { OptimizedImage } from '../common/OptimizedImage';

const PRESET_BANNER_IMAGES = [
  {
    name: 'Royal Kasavu Saree Edit',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=90'
  },
  {
    name: 'Gold Zari Festive Legacy',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=90'
  },
  {
    name: 'Kerala Linen & Mundu',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1800&q=90'
  },
  {
    name: 'Bridal Heritage Weave',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=90'
  }
];

export const BannerManagement: React.FC = () => {
  const {
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    toggleHeroBannerStatus,
    reorderHeroBanners,
    resetHeroBannersToDefault
  } = useAdmin();

  const [previewBannerIndex, setPreviewBannerIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [isUploadingBannerImg, setIsUploadingBannerImg] = useState(false);
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  const [uploadBannerError, setUploadBannerError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<HeroBanner>>({
    tag: 'Atelier Signature Edit',
    title: '500 Years of\nKuthampully Handloom\nMastery',
    subtitle: 'Royal Kasavu Sarees & Unbleached European Linen Woven for Modern Royalty',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=90',
    primaryCtaText: 'Shop Collection',
    primaryCtaLink: 'shop',
    secondaryCtaText: 'Explore Our Story',
    secondaryCtaLink: 'heritage',
    collectionSlug: 'kasavu-masterpieces',
    isActive: true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeviceUpload = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setUploadBannerError(null);
    setModalError(null);
    setIsUploadingBannerImg(true);

    try {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        throw new Error(`"${file.name}" is not a supported image file.`);
      }
      const uploadedUrl = await uploadImageFile(file, 'banners');
      setForm((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err: any) {
      setUploadBannerError(err.message || 'Failed to process banner image.');
    } finally {
      setIsUploadingBannerImg(false);
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = '';
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingBanner(null);
    setModalError(null);
    setUploadBannerError(null);
    setForm({
      tag: 'New Collection Campaign',
      title: 'Heirloom Kasavu\nHandwoven with Pride',
      subtitle: 'Discover authentic Kuthampully handloom craft, certified GI tag quality, and regal gold zari borders.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=90',
      primaryCtaText: 'Shop Collection',
      primaryCtaLink: 'shop',
      secondaryCtaText: 'Explore Our Story',
      secondaryCtaLink: 'heritage',
      collectionSlug: 'kasavu-masterpieces',
      isActive: true
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setModalError(null);
    setUploadBannerError(null);
    setForm({
      tag: banner.tag || 'Atelier Signature Edit',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      primaryCtaText: banner.primaryCtaText || 'Shop Collection',
      primaryCtaLink: banner.primaryCtaLink || 'shop',
      secondaryCtaText: banner.secondaryCtaText || 'Explore Our Story',
      secondaryCtaLink: banner.secondaryCtaLink || 'heritage',
      collectionSlug: banner.collectionSlug || 'kasavu-masterpieces',
      isActive: banner.isActive !== false,
      order: banner.order
    });
    setShowModal(true);
  };

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setModalError(null);

    if (!form.title || !form.title.trim()) {
      setModalError('Please enter a hero headline title.');
      return;
    }

    if (!form.image || !form.image.trim()) {
      setModalError('Please upload or select a banner background image.');
      return;
    }

    setIsSaving(true);
    try {
      const bannerId = editingBanner ? editingBanner.id : `banner-${Date.now()}`;
      const payload: HeroBanner = {
        id: bannerId,
        tag: form.tag?.trim() || 'Atelier Signature Edit',
        title: form.title.trim(),
        subtitle: form.subtitle?.trim() || 'Royal Kasavu Sarees & Unbleached European Linen Woven for Modern Royalty',
        image: form.image.trim(),
        primaryCtaText: form.primaryCtaText?.trim() || 'Shop Collection',
        primaryCtaLink: form.primaryCtaLink?.trim() || 'shop',
        secondaryCtaText: form.secondaryCtaText?.trim() || 'Explore Our Story',
        secondaryCtaLink: form.secondaryCtaLink?.trim() || 'heritage',
        collectionSlug: form.collectionSlug || 'kasavu-masterpieces',
        isActive: form.isActive !== false,
        order: editingBanner?.order || heroBanners.length + 1
      };

      if (editingBanner) {
        updateHeroBanner(payload);
        showToast(`Banner "${payload.tag}" updated and published live!`);
        // Find index to set preview
        const editIdx = heroBanners.findIndex(b => b.id === payload.id);
        if (editIdx >= 0) setPreviewBannerIndex(editIdx);
      } else {
        addHeroBanner(payload);
        showToast(`New hero banner "${payload.tag}" created and published!`);
        setPreviewBannerIndex(heroBanners.length);
      }
      setShowModal(false);
      setEditingBanner(null);
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Failed to save banner. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string, tag: string) => {
    if (heroBanners.length <= 1) {
      alert('You must have at least one hero banner active.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete banner "${tag}"?`)) {
      deleteHeroBanner(id);
      showToast(`Banner "${tag}" deleted.`);
      if (previewBannerIndex >= heroBanners.length - 1) {
        setPreviewBannerIndex(Math.max(0, heroBanners.length - 2));
      }
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...heroBanners];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    reorderHeroBanners(copy);
    showToast('Banner order updated.');
  };

  const handleMoveDown = (index: number) => {
    if (index === heroBanners.length - 1) return;
    const copy = [...heroBanners];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    reorderHeroBanners(copy);
    showToast('Banner order updated.');
  };

  const activeBanners = heroBanners.filter(b => b.isActive !== false);
  const currentPreview = heroBanners[previewBannerIndex] || heroBanners[0] || DEFAULT_HERO_BANNERS[0];

  return (
    <div className="space-y-8 animate-fadeIn relative">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] bg-[#12372A] text-[#FAF8F1] px-5 py-3.5 rounded-2xl border-2 border-[#D4AF37] shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Storefront Merchandising CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Hero &amp; Promotional Banner Manager ({heroBanners.length})
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              if (window.confirm('Reset hero banners back to factory default campaigns?')) {
                resetHeroBannersToDefault();
                showToast('Reset to default heritage campaigns.');
              }
            }}
            className="bg-[#FAF8F1] text-[#6B5846] hover:text-[#12372A] hover:bg-[#E8DDC7] px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 border border-[#E8DDC7]"
            title="Reset to default banners"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-[#12372A] text-[#FAF8F1] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-2 border border-[#D4AF37] shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Create Hero Banner</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. INTERACTIVE LIVE STOREFRONT HERO BANNER SIMULATOR */}
      {/* ==================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-base text-[#12372A]">
              Live Storefront Hero Preview
            </h3>
          </div>
          <span className="text-[11px] text-[#6B5846] font-mono">
            Slide {previewBannerIndex + 1} of {heroBanners.length}
          </span>
        </div>

        {/* Live Simulated Hero Section */}
        <div className="relative bg-[#12372A] text-[#FAF8F1] rounded-3xl overflow-hidden shadow-md border-2 border-[#D4AF37]/40 min-h-[360px] sm:min-h-[420px] flex items-center">
          
          {/* Background Image with Authentic Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src={currentPreview.image}
              alt={currentPreview.tag}
              preset="banner"
              priority={true}
              containerClassName="w-full h-full"
              imageClassName="opacity-45 transform scale-105 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#12372A] via-[#12372A]/85 sm:via-[#12372A]/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12372A] via-transparent to-transparent z-10" />
          </div>

          {/* Content Container */}
          <div className="p-6 sm:p-12 relative z-10 max-w-2xl space-y-4">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/25 border border-[#D4AF37] px-3 py-1 text-[10px] sm:text-xs uppercase font-semibold text-[#D4AF37] tracking-[0.2em] rounded-md">
              <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
              <span>{currentPreview.tag}</span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-[1.15] text-[#FAF8F1] whitespace-pre-line tracking-tight">
              {currentPreview.title}
            </h2>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm text-[#E8DDC7]/90 leading-relaxed max-w-lg font-light line-clamp-3">
              {currentPreview.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              <span className="bg-[#D4AF37] text-[#12372A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 border border-[#D4AF37] rounded-md">
                <span>{currentPreview.primaryCtaText || 'Shop Collection'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>

              <span className="bg-transparent text-[#FAF8F1] border border-[#FAF8F1]/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-md">
                <Compass className="w-3.5 h-3.5" />
                <span>{currentPreview.secondaryCtaText || 'Explore Our Story'}</span>
              </span>
            </div>

            {/* Slide Switcher Simulator Dots */}
            <div className="pt-4 flex items-center gap-2 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Preview Slide:</span>
              <div className="flex gap-1.5">
                {heroBanners.map((b, idx) => (
                  <button
                    key={b.id}
                    onClick={() => setPreviewBannerIndex(idx)}
                    className={`px-2.5 py-0.5 text-[10px] rounded border transition-all ${
                      previewBannerIndex === idx
                        ? 'bg-[#D4AF37] text-[#12372A] font-bold border-[#D4AF37]'
                        : 'bg-black/40 text-[#E8DDC7] border-white/20 hover:border-[#D4AF37]'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Status Overlay Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border shadow-md ${
              currentPreview.isActive !== false
                ? 'bg-green-900/90 text-green-200 border-green-400'
                : 'bg-amber-900/90 text-amber-200 border-amber-400'
            }`}>
              {currentPreview.isActive !== false ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-amber-400" />}
              <span>{currentPreview.isActive !== false ? 'Live On Homepage' : 'Draft / Hidden'}</span>
            </span>
          </div>

        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. HERO BANNERS MANAGEMENT LIST */}
      {/* ==================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#12372A]">
              Configured Carousel Banners ({heroBanners.length})
            </h3>
            <p className="text-xs text-[#6B5846]">
              Add, reorder, or edit hero campaign slides. Active banners rotate on the storefront homepage.
            </p>
          </div>
          <span className="text-xs font-bold text-[#12372A] bg-[#FAF8F1] px-3 py-1.5 rounded-xl border border-[#E8DDC7]">
            {activeBanners.length} Active Slides
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroBanners.map((banner, index) => {
            const isSelectedForPreview = previewBannerIndex === index;
            return (
              <div
                key={banner.id}
                className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isSelectedForPreview ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/20' : 'border-[#E8DDC7]'
                }`}
              >
                <div>
                  {/* Thumbnail Card Banner Image */}
                  <div className="h-44 relative overflow-hidden bg-[#FAF8F1]">
                    <OptimizedImage
                      src={banner.image}
                      alt={banner.tag}
                      preset="card"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                    
                    <span className="absolute top-3 left-3 bg-[#12372A] text-[#D4AF37] text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-[#D4AF37]">
                      Slide 0{index + 1}
                    </span>

                    <span className="absolute top-3 right-3 bg-[#D4AF37] text-[#12372A] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                      {banner.tag}
                    </span>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h4 className="font-serif text-lg font-bold text-[#FAF8F1] line-clamp-1">
                        {banner.title.replace('\n', ' ')}
                      </h4>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-4 space-y-3 text-xs">
                    <p className="text-[#6B5846] font-light line-clamp-2 leading-relaxed min-h-[32px]">
                      {banner.subtitle}
                    </p>

                    <div className="p-2.5 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7] space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B5846]">Primary CTA:</span>
                        <strong className="text-[#12372A]">{banner.primaryCtaText || 'Shop Collection'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B5846]">Secondary CTA:</span>
                        <strong className="text-[#12372A]">{banner.secondaryCtaText || 'Explore Our Story'}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex items-center justify-between gap-2">
                  
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => toggleHeroBannerStatus(banner.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border transition-all ${
                      banner.isActive !== false
                        ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {banner.isActive !== false ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-gray-500" />}
                    <span>{banner.isActive !== false ? 'Active' : 'Disabled'}</span>
                  </button>

                  {/* Re-order & Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewBannerIndex(index)}
                      className={`p-1.5 rounded-lg text-xs transition-colors border ${
                        isSelectedForPreview ? 'bg-[#12372A] text-[#D4AF37] border-[#D4AF37]' : 'bg-white text-[#12372A] border-[#E8DDC7] hover:bg-[#FAF8F1]'
                      }`}
                      title="Preview in simulator"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 bg-white text-[#12372A] hover:bg-[#FAF8F1] disabled:opacity-30 rounded-lg transition-colors border border-[#E8DDC7]"
                      title="Move slide up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={index === heroBanners.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 bg-white text-[#12372A] hover:bg-[#FAF8F1] disabled:opacity-30 rounded-lg transition-colors border border-[#E8DDC7]"
                      title="Move slide down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(banner)}
                      className="p-1.5 bg-white text-[#12372A] hover:bg-[#FAF8F1] rounded-lg transition-colors border border-[#E8DDC7]"
                      title="Edit banner"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(banner.id, banner.tag)}
                      className="p-1.5 bg-white text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                      title="Delete banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. HERO BANNER CREATE / EDIT MODAL */}
      {/* ==================================================================== */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[90vh]">
            
            {/* Modal Fixed Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FAF8F1]">
                  {editingBanner ? 'Edit Hero Banner Slide' : 'Create New Hero Banner'}
                </h3>
                <p className="text-xs text-[#E8DDC7]/80">Configure imagery, headlines, badges &amp; action buttons</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="banner-modal-form" noValidate onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              
              {/* Modal Error Alert */}
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between animate-fadeIn">
                  <span>{modalError}</span>
                  <button type="button" onClick={() => setModalError(null)} className="font-bold hover:text-red-900 ml-2">✕</button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Campaign Badge Tag *</label>
                  <input
                    type="text"
                    required
                    value={form.tag || ''}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="e.g. Atelier Signature Edit"
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Associated Collection Filter</label>
                  <select
                    value={form.collectionSlug || 'kasavu-masterpieces'}
                    onChange={(e) => setForm({ ...form, collectionSlug: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                  >
                    <option value="kasavu-masterpieces">Kasavu Masterpieces</option>
                    <option value="festive-edit">Festive Edit</option>
                    <option value="col-everyday">Everyday Luxury</option>
                    <option value="col-bridal">Bridal Heritage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">
                  Hero Headline Title * (Use Enter for line breaks)
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 500 Years of&#10;Kuthampully Handloom&#10;Mastery"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-serif text-sm font-bold text-[#12372A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Hero Subtitle Story Text</label>
                <textarea
                  rows={2}
                  value={form.subtitle || ''}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Royal Kasavu Sarees & Unbleached European Linen Woven for Modern Royalty"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>

              {/* Banner Background Image Section */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-[#6B5846]">Banner Background Image *</label>
                  {form.image && (
                    <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Image Ready
                    </span>
                  )}
                </div>

                {/* Live Preview */}
                {form.image && (
                  <div className="relative h-36 rounded-2xl overflow-hidden border border-[#E8DDC7] group shadow-xs">
                    <OptimizedImage
                      src={form.image}
                      alt="Banner Preview"
                      preset="card"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 z-10">
                      <p className="text-white text-xs font-bold font-serif">{form.tag || 'Banner Preview'}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => bannerFileInputRef.current?.click()}
                        className="bg-[#12372A] text-[#FAF8F1] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-1 shadow-sm"
                      >
                        <ImagePlus className="w-3 h-3" />
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* Device Upload Zone */}
                <label
                  htmlFor="banner-device-file-input"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsBannerDragging(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsBannerDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsBannerDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsBannerDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleDeviceUpload(e.dataTransfer.files);
                    }
                  }}
                  className={`block border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer select-none transition-all ${
                    isBannerDragging
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/50'
                      : 'border-[#D4AF37]/50 bg-[#FAF8F1]/70 hover:bg-[#FAF8F1] hover:border-[#D4AF37]'
                  }`}
                >
                  <input
                    id="banner-device-file-input"
                    ref={bannerFileInputRef}
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.bmp,.avif,.jfif,.heic"
                    onClick={(e) => {
                      (e.currentTarget as HTMLInputElement).value = '';
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleDeviceUpload(e.target.files);
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-[#12372A]/5 border border-[#D4AF37]/30 flex items-center justify-center text-[#12372A]">
                      {isUploadingBannerImg ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      ) : (
                        <UploadCloud className="w-4 h-4 text-[#12372A]" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#12372A]">
                      {isUploadingBannerImg ? 'Processing High-Res Banner...' : 'Click or Drag Image from Device'}
                    </p>
                    <p className="text-[10px] text-[#6B5846]">
                      Recommended 1800x900 or higher resolution for crisp luxury banners
                    </p>
                  </div>
                </label>

                {uploadBannerError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
                    <span>{uploadBannerError}</span>
                    <button type="button" onClick={() => setUploadBannerError(null)} className="font-bold hover:text-red-900">✕</button>
                  </div>
                )}

                {/* Preset Banner Presets */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#6B5846] mb-1">
                    Or Select from Curated Heritage Presets:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESET_BANNER_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setForm({ ...form, image: preset.url })}
                        className={`p-2 rounded-xl text-left border text-[10px] font-semibold flex items-center gap-1.5 transition-all ${
                          form.image === preset.url
                            ? 'bg-[#12372A] text-[#FAF8F1] border-[#D4AF37]'
                            : 'bg-[#FAF8F1] text-[#12372A] border-[#E8DDC7] hover:border-[#D4AF37]'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Web Image URL Option */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#6B5846] mb-1 flex items-center gap-1">
                    <LinkIcon className="w-2.5 h-2.5 text-[#D4AF37]" />
                    <span>Or Custom Web Image URL:</span>
                  </label>
                  <input
                    type="text"
                    value={form.image || ''}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-... or image URL / base64"
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1] text-xs font-mono"
                  />
                </div>
              </div>

              {/* Primary & Secondary Call to Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8DDC7]">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={form.primaryCtaText || ''}
                    onChange={(e) => setForm({ ...form, primaryCtaText: e.target.value })}
                    placeholder="e.g. Shop Collection"
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Secondary CTA Button Text</label>
                  <input
                    type="text"
                    value={form.secondaryCtaText || ''}
                    onChange={(e) => setForm({ ...form, secondaryCtaText: e.target.value })}
                    placeholder="e.g. Explore Our Story"
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1] font-bold"
                  />
                </div>
              </div>

              {/* Status Switch */}
              <div className="pt-2 border-t border-[#E8DDC7] flex items-center justify-between">
                <div>
                  <strong className="block text-xs text-[#12372A]">Banner Active Status</strong>
                  <span className="text-[10px] text-[#6B5846]">Display this slide on the live homepage hero carousel</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                    form.isActive !== false
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-200 text-gray-700 border border-gray-300'
                  }`}
                >
                  {form.isActive !== false ? 'Active' : 'Disabled'}
                </button>
              </div>

            </form>

            {/* Modal Fixed Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="banner-modal-form"
                disabled={isSaving || isUploadingBannerImg}
                onClick={handleSave}
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] disabled:opacity-50 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    <span>Saving Banner...</span>
                  </>
                ) : (
                  <span>{editingBanner ? 'Update Hero Banner' : 'Save & Publish Banner'}</span>
                )}
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
