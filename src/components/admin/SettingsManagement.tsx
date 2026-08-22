import React, { useState } from 'react';
import { Key, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getRazorpayKey, 
  getRazorpaySecret, 
  getRazorpayPayLink, 
  setRazorpayConfig 
} from '../../utils/razorpay';

export const SettingsManagement: React.FC = () => {
  const { adminUsername, adminPasscode, updateAdminCredentials } = useAuth();

  const [newUsernameInput, setNewUsernameInput] = useState(adminUsername);
  const [newPasscodeInput, setNewPasscodeInput] = useState(adminPasscode);
  const [razorpayKeyId, setRazorpayKeyId] = useState(getRazorpayKey());
  const [razorpaySecret, setRazorpaySecret] = useState(getRazorpaySecret());
  const [razorpayLinkInput, setRazorpayLinkInput] = useState(getRazorpayPayLink());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [storeNameInput, setStoreNameInput] = useState('Kavish Luxury Handlooms');
  const [gstinInput, setGstinInput] = useState('32AAACK1234F1Z8');
  const [contactPhoneInput, setContactPhoneInput] = useState('+91 98470 12345');

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsernameInput.trim() || !newPasscodeInput.trim()) {
      alert('Username and Passcode cannot be empty.');
      return;
    }
    updateAdminCredentials(newUsernameInput.trim(), newPasscodeInput.trim());
    alert('Admin Credentials & Security Passcode updated successfully!');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            System &amp; Store Configuration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Store Settings &amp; Gateway Credentials
          </h1>
        </div>
      </div>

      {/* Razorpay Payment Gateway & Security Token Configuration */}
      <div className="bg-white p-6 border-2 border-[#D4AF37]/30 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DDC7] pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#12372A]" />
            <h3 className="font-serif font-bold text-lg text-[#12372A]">Razorpay API &amp; Security Token Configuration</h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Active Gateway Engine
          </span>
        </div>

        <p className="text-xs text-[#6B5846]">
          Configure your Razorpay API Key ID and Key Secret (Security Token) generated from your Razorpay Dashboard. You can also specify them in your project's <code className="bg-[#FAF8F1] px-1 py-0.5 rounded text-[#12372A] font-mono">.env</code> file (<code className="text-[#12372A] font-mono">VITE_RAZORPAY_KEY_ID</code> and <code className="text-[#12372A] font-mono">VITE_RAZORPAY_KEY_SECRET</code>).
        </p>

        <form onSubmit={handleSaveRazorpay} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#6B5846] mb-1">
                Razorpay Key ID (<span className="text-gray-400 font-normal">e.g. rzp_test_... or rzp_live_...</span>)
              </label>
              <input
                type="text"
                placeholder="rzp_live_xxxxxxxxxxxx or rzp_test_xxxxxxxxxxxx"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-xs font-bold text-[#12372A] focus:border-[#D4AF37] outline-hidden"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Used by client-side checkout popup to initialize UPI / Cards modal.</span>
            </div>

            <div>
              <label className="block font-semibold text-[#6B5846] mb-1">
                Razorpay Key Secret / Security Token
              </label>
              <input
                type="password"
                placeholder="Paste your Razorpay Key Secret here"
                value={razorpaySecret}
                onChange={(e) => setRazorpaySecret(e.target.value)}
                className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-xs text-[#12372A] focus:border-[#D4AF37] outline-hidden"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Private secret for backend transaction signature validation.</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#6B5846] mb-1">
              Personalized Payment Portal Link (Fallback)
            </label>
            <input
              type="text"
              placeholder="https://razorpay.me/@kavishbysanjaysuresh"
              value={razorpayLinkInput}
              onChange={(e) => setRazorpayLinkInput(e.target.value)}
              className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-xs font-bold text-[#12372A] focus:border-[#D4AF37] outline-hidden"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">Direct UPI link opened when patrons prefer paying via external Razorpay handle.</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#12372A] text-[#FAF8F1] px-5 py-2.5 rounded-xl font-bold uppercase text-xs border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all shadow-xs cursor-pointer"
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

      {/* Admin Passcode & Login Details Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif font-bold text-lg text-[#12372A]">🔐 Admin Login Details &amp; Security Passcode</h3>
        </div>

        <p className="text-xs text-[#6B5846]">
          Update the Staff Account ID and Passcode used to sign into the internal Admin Console (`/admin/login`).
        </p>

        <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#6B5846] mb-1">Admin Staff Username ID</label>
              <input
                type="text"
                required
                value={newUsernameInput}
                onChange={(e) => setNewUsernameInput(e.target.value)}
                className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6B5846] mb-1">Security Login Passcode</label>
              <input
                type="text"
                required
                value={newPasscodeInput}
                onChange={(e) => setNewPasscodeInput(e.target.value)}
                className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-sm font-bold text-[#12372A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#12372A] text-[#FAF8F1] px-5 py-2.5 rounded-xl font-bold uppercase text-xs border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all shadow-xs cursor-pointer"
          >
            Save New Admin Credentials
          </button>
        </form>
      </div>

      {/* Store Identity & Business Settings */}
      <div className="bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#12372A] border-b border-[#E8DDC7] pb-3">
          Store Information &amp; Legal Entity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#6B5846] mb-1">Store Name</label>
            <input
              type="text"
              value={storeNameInput}
              onChange={(e) => setStoreNameInput(e.target.value)}
              className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#6B5846] mb-1">Official GSTIN Number</label>
            <input
              type="text"
              value={gstinInput}
              onChange={(e) => setGstinInput(e.target.value)}
              className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#6B5846] mb-1">Concierge Helpline</label>
            <input
              type="text"
              value={contactPhoneInput}
              onChange={(e) => setContactPhoneInput(e.target.value)}
              className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
