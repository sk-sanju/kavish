import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, adminUsername } = useAuth();

  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(passcode);
    if (success) {
      navigate('/admin');
    } else {
      setErrorMsg(`Invalid passcode for account "${adminUsername}".`);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F1] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 border border-[#D4AF37] rounded-3xl shadow-2xl relative">
        
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-xs text-[#6B5846] hover:text-[#12372A] flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </button>

        <div className="text-center space-y-3 pt-4">
          <div className="w-16 h-16 rounded-full bg-[#12372A] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
              Kuthampully Atelier Portal
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#12372A] mt-1">
              Admin Login
            </h1>
            <p className="text-xs text-[#6B5846] mt-1 font-light">
              Authorized staff access for inventory, orders &amp; discount management.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-100 border border-red-300 text-red-800 text-xs rounded-2xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-xs">
          <div>
            <label className="block text-[#6B5846] font-semibold mb-1.5">Admin Passcode *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full border border-[#E8DDC7] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-[#FAF8F1] text-xs font-mono text-[#12372A]"
              />
            </div>
          </div>

          <div className="bg-[#12372A]/5 p-3.5 rounded-2xl text-[11px] text-[#12372A] flex items-center justify-between border border-[#D4AF37]/30">
            <span className="font-medium">Staff Account ID:</span>
            <code className="bg-[#12372A] text-[#D4AF37] px-2.5 py-1 rounded-lg font-mono font-bold">{adminUsername}</code>
          </div>

          <button
            type="submit"
            className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-lg"
          >
            <span>Authenticate &amp; Open Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E8DDC7]/60">
          <p className="text-[10px] text-[#6B5846]">
            Kavish Kuthampully GI Handloom Unit • Reg No. 2011
          </p>
        </div>

      </div>
    </div>
  );
};
