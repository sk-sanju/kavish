'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Building2, 
  Award, 
  CheckCircle2,
  UploadCloud
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useProducts } from '../../context/ProductContext';
import type { StoreContactConfig } from '../../types';
import { uploadImageFile } from '../../utils/fileUpload';
import { OptimizedImage } from '../common/OptimizedImage';

export const ContentManagement: React.FC = () => {
  const { storeContent, updateStoreContent, addAuditLog } = useAdmin();
  const { announcementText, setAnnouncementText } = useProducts();

  const [form, setForm] = useState(storeContent);
  const [announcementInput, setAnnouncementInput] = useState(announcementText);
  const [contactForm, setContactForm] = useState<StoreContactConfig>(
    storeContent.contactInfo || {
      atelierTitle: 'Kavish Kuthampully Atelier',
      atelierSubtitle: 'Headquarters & Loom House',
      addressLine1: 'Kuthampully Handloom Village, Near Thiruvilwamala',
      addressLine2: 'Thrissur District, Kerala - 680594, India.',
      visitingHoursLine1: 'Monday – Saturday: 9:30 AM – 7:00 PM IST',
      visitingHoursLine2: 'Sunday: 10:00 AM – 5:00 PM (By Appointment)',
      phone: '+91 9539251789',
      email: 'kavishlooms@gmail.com',
      whatsappNumber: '919539251789',
      badgeText: 'Authentic Kuthampully GI Tag Unit'
    }
  );

  useEffect(() => {
    setForm(storeContent);
    if (storeContent.contactInfo) {
      setContactForm(storeContent.contactInfo);
    }
  }, [storeContent]);

  useEffect(() => {
    setAnnouncementInput(announcementText);
  }, [announcementText]);

  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    const updatedContent = {
      ...storeContent,
      ...form,
      contactInfo: contactForm
    };
    updateStoreContent(updatedContent);
    setAnnouncementText(announcementInput);

    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: 'Updated Storefront Content & Atelier Contact Details',
      entity: 'StoreContent',
      entityId: 'main_content',
      newValue: `${contactForm.atelierTitle}, ${contactForm.email}`
    });

    setSaveSuccess(true);
    alert('Storefront content and atelier updates published live successfully!');
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleAddFaq = () => {
    if (newFaqQ.trim() && newFaqA.trim()) {
      setForm({
        ...form,
        faqItems: [...(form.faqItems || []), { question: newFaqQ.trim(), answer: newFaqA.trim() }]
      });
      setNewFaqQ('');
      setNewFaqA('');
    }
  };

  const handleRemoveFaq = (idx: number) => {
    setForm({
      ...form,
      faqItems: form.faqItems.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B99A61] block">
            Storefront CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641E2B] mt-0.5">
            Store Content &amp; Atelier Management
          </h1>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-300 text-green-800 text-xs font-bold rounded-xl animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Changes Published Live!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} noValidate className="space-y-6 text-xs">

        {/* Headquarters & Loom House Atelier Info Editor */}
        <div className="bg-white p-6 sm:p-8 border-2 border-[#B99A61]/30 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD0] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#641E2B] text-[#B99A61] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#641E2B]">
                  Headquarters &amp; Loom House Atelier Details
                </h3>
                <p className="text-xs text-[#6E685D]">
                  Manage address, visiting hours, concierge phone, email &amp; WhatsApp displayed on Contact Page
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Inputs (7 cols on large) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6E685D] mb-1">
                    Atelier Main Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.atelierTitle}
                    onChange={(e) => setContactForm({ ...contactForm, atelierTitle: e.target.value })}
                    className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-bold text-[#641E2B]"
                    placeholder="e.g. Kavish Kuthampully Atelier"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6E685D] mb-1">
                    Subtitle / Badge Label
                  </label>
                  <input
                    type="text"
                    value={contactForm.atelierSubtitle}
                    onChange={(e) => setContactForm({ ...contactForm, atelierSubtitle: e.target.value })}
                    className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-bold text-[#B99A61]"
                    placeholder="e.g. HEADQUARTERS & LOOM HOUSE"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B99A61]" />
                  <span>Physical Address (Line 1) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.addressLine1}
                  onChange={(e) => setContactForm({ ...contactForm, addressLine1: e.target.value })}
                  className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF]"
                  placeholder="e.g. Kuthampully Handloom Village, Near Thiruvilwamala"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6E685D] mb-1">
                  District, State &amp; Pincode (Line 2)
                </label>
                <input
                  type="text"
                  value={contactForm.addressLine2}
                  onChange={(e) => setContactForm({ ...contactForm, addressLine2: e.target.value })}
                  className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF]"
                  placeholder="e.g. Thrissur District, Kerala - 679121, India"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B99A61]" />
                    <span>Visiting Hours (Mon – Sat)</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.visitingHoursLine1}
                    onChange={(e) => setContactForm({ ...contactForm, visitingHoursLine1: e.target.value })}
                    className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF]"
                    placeholder="e.g. Monday – Saturday: 9:30 AM – 7:00 PM IST"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B99A61]" />
                    <span>Visiting Hours (Sunday)</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.visitingHoursLine2}
                    onChange={(e) => setContactForm({ ...contactForm, visitingHoursLine2: e.target.value })}
                    className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF]"
                    placeholder="e.g. Sunday: 10:00 AM – 5:00 PM (By Appointment)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B99A61]" />
                    <span>Direct Concierge Phone *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono font-bold"
                    placeholder="e.g. +91 4884 282 100 / +91 98470 55111"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#B99A61]" />
                    <span>Email Concierge *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono font-bold"
                    placeholder="e.g. kavishlooms@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#B99A61]" />
                    <span>WhatsApp Concierge Number</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.whatsappNumber}
                    onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                    className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono font-bold"
                    placeholder="e.g. 919539251789 (Country code + number)"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Used to generate one-click WhatsApp chat link.</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#B99A61]" />
                    <span>GI Tag / Accreditation Badge</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.badgeText}
                    onChange={(e) => setContactForm({ ...contactForm, badgeText: e.target.value })}
                    className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-bold"
                    placeholder="e.g. Authentic Kuthampully GI Tag Unit"
                  />
                </div>
              </div>

            </div>

            {/* Live Preview Card (5 cols on large) */}
            <div className="lg:col-span-5 space-y-2">
              <span className="block font-serif font-bold text-xs uppercase tracking-wider text-[#6E685D]">
                Live Storefront Card Preview
              </span>

              <div className="bg-white p-6 border-2 border-[#E8DFD0] rounded-2xl shadow-xs space-y-5">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B99A61] font-bold block mb-1">
                    {contactForm.atelierSubtitle || 'HEADQUARTERS & LOOM HOUSE'}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#641E2B]">
                    {contactForm.atelierTitle || 'Kavish Kuthampully Atelier'}
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  
                  <div className="flex items-start gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#E8DFD0]">
                    <MapPin className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#641E2B] font-bold block text-[11px]">Address:</strong>
                      <p className="text-[#6E685D] text-[11px]">{contactForm.addressLine1 || 'Kuthampully Handloom Village, Near Thiruvilwamala'}</p>
                      {contactForm.addressLine2 && <p className="text-[#6E685D] text-[11px]">{contactForm.addressLine2}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#E8DFD0]">
                    <Clock className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#641E2B] font-bold block text-[11px]">Atelier Visiting Hours:</strong>
                      <p className="text-[#6E685D] text-[11px]">{contactForm.visitingHoursLine1 || 'Monday – Saturday: 9:30 AM – 7:00 PM IST'}</p>
                      {contactForm.visitingHoursLine2 && <p className="text-[#6E685D] text-[11px]">{contactForm.visitingHoursLine2}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#E8DFD0]">
                    <Phone className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#641E2B] font-bold block text-[11px]">Direct Concierge Phone:</strong>
                      <p className="text-[#6E685D] text-[11px]">{contactForm.phone || '+91 9539251789'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#E8DFD0]">
                    <Mail className="w-4 h-4 text-[#B99A61] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#641E2B] font-bold block text-[11px]">Email Concierge:</strong>
                      <p className="text-[#6E685D] text-[11px]">{contactForm.email || 'kavishlooms@gmail.com'}</p>
                    </div>
                  </div>

                </div>

                <div className="pt-2 border-t border-[#E8DFD0]">
                  <div className="w-full bg-[#641E2B] text-[#F8F5EF] py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 border border-[#B99A61]">
                    <MessageSquare className="w-3.5 h-3.5 text-[#B99A61]" />
                    <span>Chat via WhatsApp Concierge</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Header Announcement Bar Editor */}
        <div className="bg-white p-6 border border-[#E8DFD0] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B99A61]" />
            <h3 className="font-serif font-bold text-base text-[#641E2B]">Header Announcement Bar Text</h3>
          </div>
          <input
            type="text"
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] text-xs font-semibold text-[#641E2B]"
          />
        </div>

        {/* Hero Section Banner Content */}
        <div className="bg-white p-6 border-2 border-[#B99A61]/30 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD0] pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#641E2B]">
                Homepage Hero Banner Content &amp; Imagery
              </h3>
              <p className="text-[11px] text-[#6E685D]">
                Configure main headline, story subtitle, and luxury background image for the live storefront
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B99A61] bg-[#641E2B] px-2.5 py-1 rounded-lg">
              Live Homepage Hero
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#6E685D] mb-1">Hero Main Title *</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                placeholder="500 Years of Kuthampully Handloom Mastery"
                className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-bold text-[#641E2B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6E685D] mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                placeholder="Royal Kasavu Sarees & Unbleached European Linen Woven for Modern Royalty"
                className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] text-[#641E2B]"
              />
            </div>
          </div>

          {/* Banner Image URL and Live Preview */}
          <div className="pt-2 border-t border-[#E8DFD0] space-y-2">
            <label className="block font-semibold text-[#6E685D]">Banner Background Image</label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-2">
                <input
                  type="text"
                  value={form.bannerImage || ''}
                  onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                  placeholder="/assets/banners/hero_kavish.jpg"
                  className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] text-xs font-mono"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F5EF] border border-[#E8DFD0] hover:border-[#B99A61] rounded-xl text-xs font-semibold text-[#641E2B] cursor-pointer transition-all">
                  <UploadCloud className="w-3.5 h-3.5 text-[#B99A61]" />
                  <span>Upload Image from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        try {
                          const uploadedUrl = await uploadImageFile(e.target.files[0], 'banners');
                          setForm({ ...form, bannerImage: uploadedUrl });
                        } catch (err: any) {
                          alert(err.message || 'Failed to upload image.');
                        }
                      }
                    }}
                  />
                </label>
              </div>

              {form.bannerImage && (
                <div className="md:col-span-4 relative h-20 rounded-xl overflow-hidden border border-[#B99A61]/50 shadow-xs">
                  <OptimizedImage
                    src={form.bannerImage}
                    alt="Banner preview"
                    preset="card"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5 z-10">
                    <span className="text-[10px] text-[#F8F5EF] font-semibold truncate">Current Live Image</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Items Manager */}
        <div className="bg-white p-6 border border-[#E8DFD0] rounded-2xl shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#641E2B] border-b border-[#E8DFD0] pb-2">
            Store FAQs Manager
          </h3>

          <div className="space-y-2">
            {(form.faqItems || []).map((faq, idx) => (
              <div key={idx} className="p-3 bg-[#F8F5EF] border border-[#E8DFD0] rounded-xl flex items-start justify-between gap-3">
                <div>
                  <strong className="text-[#641E2B] block">{faq.question}</strong>
                  <p className="text-[11px] text-[#6E685D] mt-0.5">{faq.answer}</p>
                </div>
                <button type="button" onClick={() => handleRemoveFaq(idx)} className="text-red-600 font-bold p-1">✕</button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <input
              type="text"
              placeholder="Question"
              value={newFaqQ}
              onChange={(e) => setNewFaqQ(e.target.value)}
              className="border border-[#E8DFD0] p-2 rounded-xl bg-[#F8F5EF]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Answer"
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                className="flex-1 border border-[#E8DFD0] p-2 rounded-xl bg-[#F8F5EF]"
              />
              <button type="button" onClick={handleAddFaq} className="bg-[#641E2B] text-[#F8F5EF] px-4 py-2 font-bold uppercase rounded-xl">+ Add FAQ</button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="bg-[#641E2B] text-[#F8F5EF] px-8 py-3.5 uppercase font-bold text-xs rounded-xl border border-[#B99A61] hover:bg-[#B99A61] hover:text-[#641E2B] transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#B99A61]" />
          <span>Publish Live Content &amp; Atelier Updates</span>
        </button>

      </form>

    </div>
  );
};
