import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, ShieldCheck, Award } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const ContactPage: React.FC = () => {
  const { storeContent } = useAdmin();
  const contact = storeContent.contactInfo || {
    atelierTitle: 'Kavish Kuthampully Atelier',
    atelierSubtitle: 'Headquarters & Loom House',
    addressLine1: 'Kuthampully Handloom Village, Near Thiruvilwamala',
    addressLine2: 'Thrissur District, Kerala - 679121, India',
    visitingHoursLine1: 'Monday – Saturday: 9:30 AM – 7:00 PM IST',
    visitingHoursLine2: 'Sunday: 10:00 AM – 5:00 PM (By Appointment)',
    phone: '+91 4884 282 100 / +91 98470 55111',
    email: 'concierge@kavishhandlooms.com',
    whatsappNumber: '919847055111',
    badgeText: 'Authentic Kuthampully GI Tag Unit'
  };

  const cleanWhatsappNumber = (contact.whatsappNumber || '919847055111').replace(/[^0-9]/g, '');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Custom Saree / Bespoke Order', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="bg-[#12372A] text-[#FAF8F1] p-8 sm:p-12 rounded-3xl shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              Flagship Atelier &amp; Weaving House
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Visit Us in Kuthampully, Kerala
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DDC7] font-light leading-relaxed">
              Step into our master weaving house in Kuthampully village, Thrissur — home to over 500 years of royal Kochi court weaving traditions and authentic GI-tagged Kasavu handlooms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Atelier Details */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-6 self-start">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                {contact.atelierSubtitle || 'Headquarters & Loom House'}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#12372A]">
                {contact.atelierTitle || 'Kavish Kuthampully Atelier'}
              </h2>
            </div>

            <div className="space-y-4 text-xs text-[#171717]">
              
              <div className="flex items-start gap-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7]">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#12372A] font-bold block">Address:</strong>
                  <p className="text-[#6B5846]">{contact.addressLine1}</p>
                  {contact.addressLine2 && <p className="text-[#6B5846]">{contact.addressLine2}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7]">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#12372A] font-bold block">Atelier Visiting Hours:</strong>
                  <p className="text-[#6B5846]">{contact.visitingHoursLine1}</p>
                  {contact.visitingHoursLine2 && <p className="text-[#6B5846]">{contact.visitingHoursLine2}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7]">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#12372A] font-bold block">Direct Concierge Phone:</strong>
                  <p className="text-[#6B5846]">{contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7]">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#12372A] font-bold block">Email Concierge:</strong>
                  <p className="text-[#6B5846]">{contact.email}</p>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#E8DDC7] flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span>Chat via WhatsApp Concierge</span>
              </a>
            </div>

            <div className="bg-[#12372A]/5 p-4 rounded-xl border border-[#D4AF37]/30 text-xs text-[#12372A] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>{contact.badgeText || 'Authentic Kuthampully GI Tag Unit'}</span>
              </div>
              <p className="text-[11px] text-[#6B5846]">
                Certified by the Geographical Indications Registry, Government of India (Reg No. 2011).
              </p>
            </div>

          </div>

          {/* Concierge Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#E8DDC7] rounded-2xl shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-[#12372A] mb-1">
              Bespoke Bridal &amp; Custom Orders
            </h2>
            <p className="text-xs text-[#6B5846] mb-6">
              Connect with our master Devanga weaving consultants in Kuthampully for customized saree weaves, bulk wedding attire, or international shipping assistance.
            </p>

            {formSubmitted ? (
              <div className="bg-[#FAF8F1] p-8 border border-[#D4AF37] rounded-2xl text-center space-y-3">
                <ShieldCheck className="w-12 h-12 text-[#D4AF37] mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-[#12372A]">Message Received</h3>
                <p className="text-xs text-[#6B5846]">
                  Thank you. A senior Kuthampully weave specialist will contact you within 4 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="bg-[#12372A] text-white px-6 py-2.5 text-xs font-bold uppercase rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Nair"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-[#E8DDC7] p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-[#E8DDC7] p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-[#E8DDC7] p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">Inquiry Type</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full border border-[#E8DDC7] p-3 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white cursor-pointer"
                    >
                      <option value="Custom Saree / Bespoke Order">Custom Saree / Bespoke Weave</option>
                      <option value="Bridal Wedding Trousseau">Bridal Wedding Trousseau</option>
                      <option value="Kuthampully Loom Visit">Kuthampully Loom Visit Booking</option>
                      <option value="International Shipping Assistance">International Shipping</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#6B5846] font-semibold mb-1">Your Message or Customization Details *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us your garment preferences, custom zari requirements, or wedding date..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-md"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Send Message to Kuthampully Atelier</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
