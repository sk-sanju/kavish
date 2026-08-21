import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useProducts } from '../../context/ProductContext';

export const ContentManagement: React.FC = () => {
  const { storeContent, updateStoreContent } = useAdmin();
  const { announcementText, setAnnouncementText } = useProducts();

  const [form, setForm] = useState(storeContent);
  const [announcementInput, setAnnouncementInput] = useState(announcementText);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreContent(form);
    setAnnouncementText(announcementInput);
    alert('Storefront content updated successfully live!');
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
            Store Content Management
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
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
          className="bg-[#12372A] text-[#FAF8F1] px-6 py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A]"
        >
          Publish Live Content Updates
        </button>

      </form>

    </div>
  );
};
