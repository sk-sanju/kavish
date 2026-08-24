import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Building2, 
  Award, 
  CheckCircle2 
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useProducts } from '../../context/ProductContext';
import type { StoreContactConfig } from '../../types';

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

  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedContent = {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Storefront CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
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

      <form onSubmit={handleSave} className="space-y-6 text-xs">

        {/* Headquarters & Loom House Atelier Info Editor */}
        <div className="bg-white p-6 sm:p-8 border-2 border-[#D4AF37]/30 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DDC7] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#12372A] text-[#D4AF37] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#12372A]">
                  Headquarters &amp; Loom House Atelier Details
                </h3>
                <p className="text-xs text-[#6B5846]">
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
                  <label className="block font-semibold text-[#6B5846] mb-1">
                    Atelier Main Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.atelierTitle}
                    onChange={(e) => setContactForm({ ...contactForm, atelierTitle: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                    placeholder="e.g. Kavish Kuthampully Atelier"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">
                    Subtitle / Badge Label
                  </label>
                  <input
                    type="text"
                    value={contactForm.atelierSubtitle}
                    onChange={(e) => setContactForm({ ...contactForm, atelierSubtitle: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#D4AF37]"
                    placeholder="e.g. HEADQUARTERS & LOOM HOUSE"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Physical Address (Line 1) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.addressLine1}
                  onChange={(e) => setContactForm({ ...contactForm, addressLine1: e.target.value })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                  placeholder="e.g. Kuthampully Handloom Village, Near Thiruvilwamala"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">
                  District, State &amp; Pincode (Line 2)
                </label>
                <input
                  type="text"
                  value={contactForm.addressLine2}
                  onChange={(e) => setContactForm({ ...contactForm, addressLine2: e.target.value })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                  placeholder="e.g. Thrissur District, Kerala - 679121, India"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Visiting Hours (Mon – Sat)</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.visitingHoursLine1}
                    onChange={(e) => setContactForm({ ...contactForm, visitingHoursLine1: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                    placeholder="e.g. Monday – Saturday: 9:30 AM – 7:00 PM IST"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Visiting Hours (Sunday)</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.visitingHoursLine2}
                    onChange={(e) => setContactForm({ ...contactForm, visitingHoursLine2: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                    placeholder="e.g. Sunday: 10:00 AM – 5:00 PM (By Appointment)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Direct Concierge Phone *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono font-bold"
                    placeholder="e.g. +91 4884 282 100 / +91 98470 55111"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Email Concierge *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono font-bold"
                    placeholder="e.g. kavishlooms@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>WhatsApp Concierge Number</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.whatsappNumber}
                    onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono font-bold"
                    placeholder="e.g. 919539251789 (Country code + number)"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Used to generate one-click WhatsApp chat link.</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>GI Tag / Accreditation Badge</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.badgeText}
                    onChange={(e) => setContactForm({ ...contactForm, badgeText: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold"
                    placeholder="e.g. Authentic Kuthampully GI Tag Unit"
                  />
                </div>
              </div>

            </div>

            {/* Live Preview Card (5 cols on large) */}
            <div className="lg:col-span-5 space-y-2">
              <span className="block font-serif font-bold text-xs uppercase tracking-wider text-[#6B5846]">
                Live Storefront Card Preview
              </span>

              <div className="bg-white p-6 border-2 border-[#E8DDC7] rounded-2xl shadow-xs space-y-5">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                    {contactForm.atelierSubtitle || 'HEADQUARTERS & LOOM HOUSE'}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#12372A]">
                    {contactForm.atelierTitle || 'Kavish Kuthampully Atelier'}
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  
                  <div className="flex items-start gap-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7]">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#12372A] font-bold block text-[11px]">Address:</strong>
                      <p className="text-[#6B5846] text-[11px]">{contactForm.addressLine1 || 'Kuthampully Handloom Village, Near Thiruvilwamala'}</p>
                      {contactForm.addressLine2 && <p className="text-[#6B5846] text-[11px]">{contactForm.addressLine2}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7]">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#12372A] font-bold block text-[11px]">Atelier Visiting Hours:</strong>
                      <p className="text-[#6B5846] text-[11px]">{contactForm.visitingHoursLine1 || 'Monday – Saturday: 9:30 AM – 7:00 PM IST'}</p>
                      {contactForm.visitingHoursLine2 && <p className="text-[#6B5846] text-[11px]">{contactForm.visitingHoursLine2}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7]">
                    <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#12372A] font-bold block text-[11px]">Direct Concierge Phone:</strong>
                      <p className="text-[#6B5846] text-[11px]">{contactForm.phone || '+91 9539251789'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7]">
                    <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#12372A] font-bold block text-[11px]">Email Concierge:</strong>
                      <p className="text-[#6B5846] text-[11px]">{contactForm.email || 'kavishlooms@gmail.com'}</p>
                    </div>
                  </div>

                </div>

                <div className="pt-2 border-t border-[#E8DDC7]">
                  <div className="w-full bg-[#12372A] text-[#FAF8F1] py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37]">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Chat via WhatsApp Concierge</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Header Announcement Bar Editor */}
        <div className="bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-base text-[#12372A]">Header Announcement Bar Text</h3>
          </div>
          <input
            type="text"
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] text-xs font-semibold text-[#12372A]"
          />
        </div>

        {/* Hero Section Banner Content */}
        <div className="bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#12372A] border-b border-[#E8DDC7] pb-2">
            Homepage Hero Banner Headline &amp; Subtitle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#6B5846] mb-1">Hero Main Title</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6B5846] mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
              />
            </div>
          </div>
        </div>

        {/* FAQ Items Manager */}
        <div className="bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#12372A] border-b border-[#E8DDC7] pb-2">
            Store FAQs Manager
          </h3>

          <div className="space-y-2">
            {(form.faqItems || []).map((faq, idx) => (
              <div key={idx} className="p-3 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl flex items-start justify-between gap-3">
                <div>
                  <strong className="text-[#12372A] block">{faq.question}</strong>
                  <p className="text-[11px] text-[#6B5846] mt-0.5">{faq.answer}</p>
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
              className="border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Answer"
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                className="flex-1 border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
              />
              <button type="button" onClick={handleAddFaq} className="bg-[#12372A] text-[#FAF8F1] px-4 py-2 font-bold uppercase rounded-xl">+ Add FAQ</button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#12372A] text-[#FAF8F1] px-8 py-3.5 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Publish Live Content &amp; Atelier Updates</span>
        </button>

      </form>

    </div>
  );
};
