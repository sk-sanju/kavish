import React, { useState } from 'react';
import { Key, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RAZORPAY_CUSTOM_PAY_LINK } from '../../utils/razorpay';

export const SettingsManagement: React.FC = () => {
  const { adminUsername, adminPasscode, updateAdminCredentials } = useAuth();

  const [newUsernameInput, setNewUsernameInput] = useState(adminUsername);
  const [newPasscodeInput, setNewPasscodeInput] = useState(adminPasscode);
  const [razorpayLinkInput, setRazorpayLinkInput] = useState(RAZORPAY_CUSTOM_PAY_LINK);
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

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            System &amp; Store Configuration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Store Settings &amp; Security Passcode
          </h1>
        </div>
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
            className="bg-[#12372A] text-[#FAF8F1] px-5 py-2.5 rounded-xl font-bold uppercase text-xs border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all shadow-xs"
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

      {/* Razorpay Payment Gateway Link Config */}
      <div className="bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif font-bold text-lg text-[#12372A]">Razorpay Payment Gateway Portal Link</h3>
        </div>

        <div className="text-xs space-y-2">
          <label className="block font-semibold text-[#6B5846]">Personalised Payment Portal Link</label>
          <input
            type="text"
            value={razorpayLinkInput}
            onChange={(e) => setRazorpayLinkInput(e.target.value)}
            className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-mono text-xs font-bold text-[#12372A]"
          />
          <span className="text-[11px] text-[#6B5846] block">Direct link presented to patrons during Razorpay checkout.</span>
        </div>
      </div>

    </div>
  );
};
