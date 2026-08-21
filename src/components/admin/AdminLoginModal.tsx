import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginModalProps {
  onAdminLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onAdminLoginSuccess }) => {
  const { isAdminLoginModalOpen, setIsAdminLoginModalOpen, loginAdmin } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(passcode);
    if (success) {
      setPasscode('');
      onAdminLoginSuccess();
    } else {
      setErrorMsg('Invalid Admin Passcode. Use "admin123" or "admin".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F1] w-full max-w-md border border-[#D4AF37] shadow-2xl rounded-3xl p-6 sm:p-8 relative">
        
        <button
          onClick={() => {
            setIsAdminLoginModalOpen(false);
            setErrorMsg('');
            setPasscode('');
          }}
          className="absolute top-4 right-4 text-[#12372A] hover:text-[#D4AF37] w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#12372A] text-[#D4AF37] flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
          Kuthampully Atelier Portal
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#12372A]">
          Admin Console Access
        </h3>
        <p className="text-xs text-[#6B5846] mt-1 mb-6 font-light">
          Enter authorized credentials to access the store management console.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#6B5846] font-semibold mb-1">Admin Passcode *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Enter passcode (e.g. admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full border border-[#E8DDC7] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="bg-[#12372A]/5 p-3 rounded-xl text-[11px] text-[#12372A] flex items-center justify-between border border-[#D4AF37]/30">
            <span>Demo Passcode:</span>
            <code className="bg-[#12372A] text-[#D4AF37] px-2 py-0.5 rounded font-mono font-bold">admin123</code>
          </div>

          <button
            type="submit"
            className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-md"
          >
            <span>Authenticate as Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
