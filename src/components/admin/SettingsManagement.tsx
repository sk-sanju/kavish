'use client';

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getRazorpayKey, 
  getRazorpaySecret, 
  getRazorpayPayLink, 
  setRazorpayConfig 
} from '../../utils/razorpay';

export const SettingsManagement: React.FC = () => {
  const { adminProfile, updateAdminProfile } = useAuth();

  const [adminName, setAdminName] = useState(adminProfile.name || 'Kavish Master Admin');
  const [adminEmail, setAdminEmail] = useState(adminProfile.email || 'admin@kavishhandlooms.com');
  const [adminPhone, setAdminPhone] = useState(adminProfile.phone || '+91 98470 12345');
  const [adminPassword, setAdminPassword] = useState(adminProfile.password || 'admin');
  const [adminSaveSuccess, setAdminSaveSuccess] = useState(false);

  const [razorpayKeyId, setRazorpayKeyId] = useState(getRazorpayKey());
  const [razorpaySecret, setRazorpaySecret] = useState(getRazorpaySecret());
  const [razorpayLinkInput, setRazorpayLinkInput] = useState(getRazorpayPayLink());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [storeNameInput, setStoreNameInput] = useState('Kavish Luxury Handlooms');
  const [gstinInput, setGstinInput] = useState('32AAACK1234F1Z8');
  const [contactPhoneInput, setContactPhoneInput] = useState('+91 98470 12345');

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPhone.trim()) {
      alert('Admin Email and Primary Phone (PK) cannot be empty.');
      return;
    }
    updateAdminProfile({
      name: adminName.trim(),
      email: adminEmail.trim(),
      phone: adminPhone.trim(),
      password: adminPassword.trim(),
      role: 'Super Admin'
    });
    setAdminSaveSuccess(true);
    setTimeout(() => setAdminSaveSuccess(false), 3000);
  };

  const handleSaveRazorpay = (e: React.FormEvent) => {
    e.preventDefault();
    setRazorpayConfig(razorpayKeyId, razorpaySecret, razorpayLinkInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B99A61] block">
            System &amp; Store Configuration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641E2B] mt-0.5">
            Store Settings &amp; Gateway Credentials
          </h1>
        </div>
      </div>

      {/* Razorpay Payment Gateway & Security Token Configuration */}
      <div className="bg-white p-6 border-2 border-[#B99A61]/30 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DFD0] pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#641E2B]" />
            <h3 className="font-serif font-bold text-lg text-[#641E2B]">Razorpay API &amp; Security Token Configuration</h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Active Gateway Engine
          </span>
        </div>

        <p className="text-xs text-[#6E685D]">
          Configure your Razorpay API Key ID and Key Secret (Security Token) generated from your Razorpay Dashboard. You can also specify them in your project's <code className="bg-[#F8F5EF] px-1 py-0.5 rounded text-[#641E2B] font-mono">.env</code> file (<code className="text-[#641E2B] font-mono">VITE_RAZORPAY_KEY_ID</code> and <code className="text-[#641E2B] font-mono">VITE_RAZORPAY_KEY_SECRET</code>).
        </p>

        <form onSubmit={handleSaveRazorpay} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#6E685D] mb-1">
                Razorpay Key ID (<span className="text-gray-400 font-normal">e.g. rzp_test_... or rzp_live_...</span>)
              </label>
              <input
                type="text"
                placeholder="rzp_live_xxxxxxxxxxxx or rzp_test_xxxxxxxxxxxx"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono text-xs font-bold text-[#641E2B] focus:border-[#B99A61] outline-hidden"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Used by client-side checkout popup to initialize UPI / Cards modal.</span>
            </div>

            <div>
              <label className="block font-semibold text-[#6E685D] mb-1">
                Razorpay Key Secret / Security Token
              </label>
              <input
                type="password"
                placeholder="Paste your Razorpay Key Secret here"
                value={razorpaySecret}
                onChange={(e) => setRazorpaySecret(e.target.value)}
                className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono text-xs text-[#641E2B] focus:border-[#B99A61] outline-hidden"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Private secret for backend transaction signature validation.</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#6E685D] mb-1">
              Personalized Payment Portal Link (Fallback)
            </label>
            <input
              type="text"
              placeholder="https://razorpay.me/@kavishbysanjaysuresh"
              value={razorpayLinkInput}
              onChange={(e) => setRazorpayLinkInput(e.target.value)}
              className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono text-xs font-bold text-[#641E2B] focus:border-[#B99A61] outline-hidden"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">Direct UPI link opened when patrons prefer paying via external Razorpay handle.</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#641E2B] text-[#F8F5EF] px-5 py-2.5 rounded-xl font-bold uppercase text-xs border border-[#B99A61] hover:bg-[#B99A61] hover:text-[#641E2B] transition-all shadow-xs cursor-pointer"
            >
              Save Razorpay Gateway Credentials
            </button>
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" /> Razorpay credentials updated!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Admin Profile & Security Credentials Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 border-2 border-[#B99A61]/30">
        <div className="flex items-center justify-between border-b border-[#E8DFD0] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#641E2B]" />
            <h3 className="font-serif font-bold text-lg text-[#641E2B]">👑 Admin Profile &amp; Login Credentials</h3>
          </div>
          <span className="text-[10px] font-bold text-[#B99A61] uppercase bg-[#641E2B] px-2.5 py-1 rounded-full font-mono">
            Super Admin Account
          </span>
        </div>

        <p className="text-xs text-[#6E685D]">
          Configure the Master Admin profile details (Full Name, Official Email, Primary Phone as Unique Identifier, and Security Password) used to authenticate at <code className="bg-[#F8F5EF] px-1 py-0.5 rounded text-[#641E2B] font-mono">/admin/login</code>.
        </p>

        <form onSubmit={handleSaveAdminProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#B99A61]" />
                <span>Admin Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Kavish Master Admin"
                className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-bold text-[#641E2B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#B99A61]" />
                <span>Official Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@kavishhandlooms.com"
                className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-bold text-[#641E2B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#B99A61]" />
                <span>Primary Mobile Phone (PK - Primary Key) *</span>
              </label>
              <input
                type="text"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="+91 98470 12345"
                className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono font-bold text-[#641E2B]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Primary key identifier for administrative database records &amp; OTP recovery.</span>
            </div>

            <div>
              <label className="block font-semibold text-[#6E685D] mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#B99A61]" />
                <span>Security Login Password *</span>
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono text-sm font-bold text-[#641E2B]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Staff passcode used to unlock the internal console.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#641E2B] text-[#F8F5EF] px-5 py-3 rounded-xl font-bold uppercase text-xs border border-[#B99A61] hover:bg-[#B99A61] hover:text-[#641E2B] transition-all shadow-xs cursor-pointer"
            >
              Save Admin Profile &amp; Credentials
            </button>

            {adminSaveSuccess && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Admin profile &amp; login credentials updated!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Store Identity & Business Settings */}
      <div className="bg-white p-6 border border-[#E8DFD0] rounded-2xl shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#641E2B] border-b border-[#E8DFD0] pb-3">
          Store Information &amp; Legal Entity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#6E685D] mb-1">Store Name</label>
            <input
              type="text"
              value={storeNameInput}
              onChange={(e) => setStoreNameInput(e.target.value)}
              className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#6E685D] mb-1">Official GSTIN Number</label>
            <input
              type="text"
              value={gstinInput}
              onChange={(e) => setGstinInput(e.target.value)}
              className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF] font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#6E685D] mb-1">Concierge Helpline</label>
            <input
              type="text"
              value={contactPhoneInput}
              onChange={(e) => setContactPhoneInput(e.target.value)}
              className="w-full border border-[#E8DFD0] p-2.5 rounded-xl bg-[#F8F5EF]"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
