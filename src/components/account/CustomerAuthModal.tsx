import React, { useState } from 'react';
import { X, UserPlus, LogIn, Sparkles, Truck, Award } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerAuthModalOpen,
    customerAuthMode,
    closeCustomerAuthModal,
    registerCustomer,
    loginCustomer,
    openCustomerAuthModal
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isCustomerAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (customerAuthMode === 'register') {
      if (!name || !email || !phone) {
        setError('Please fill in all required fields (Name, Email, and Phone).');
        return;
      }
      registerCustomer(name, email, phone, password);
    } else {
      if (!email) {
        setError('Please enter your email address to sign in.');
        return;
      }
      loginCustomer(email, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F1] w-full max-w-xl border border-[#D4AF37]/50 shadow-2xl rounded-3xl overflow-hidden relative text-[#171717]">
        
        {/* Close Button */}
        <button
          onClick={closeCustomerAuthModal}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-[#12372A] hover:bg-[#12372A] hover:text-[#D4AF37] flex items-center justify-center transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-[#12372A] text-[#FAF8F1] p-6 sm:p-8 text-center relative">
          <div className="inline-block bg-[#FAF8F1] px-4 py-2 rounded-2xl shadow-md mx-auto mb-2">
            <img
              src={logoImg}
              alt="KAVISH"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#E8DDC7] mt-1 font-medium">
            Royal Kuthampully Patron Circle
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex justify-center gap-2 mt-6 bg-[#0B241B] p-1.5 rounded-full border border-[#D4AF37]/40 max-w-xs mx-auto text-xs font-semibold uppercase">
            <button
              onClick={() => openCustomerAuthModal('register')}
              className={`flex-1 py-2 px-3 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                customerAuthMode === 'register'
                  ? 'bg-[#D4AF37] text-[#12372A] font-bold shadow-xs'
                  : 'text-[#E8DDC7] hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>

            <button
              onClick={() => openCustomerAuthModal('login')}
              className={`flex-1 py-2 px-3 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                customerAuthMode === 'login'
                  ? 'bg-[#D4AF37] text-[#12372A] font-bold shadow-xs'
                  : 'text-[#E8DDC7] hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {customerAuthMode === 'register' ? (
              <>
                <div>
                  <label className="block text-[#6B5846] font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lakshmi Menon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B5846] font-semibold mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98470 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#6B5846] font-semibold mb-1">Account Password (Optional)</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl border border-[#D4AF37] shadow-md flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Create My Royal Customer Account</span>
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[#6B5846] font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#6B5846] font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#E8DDC7] p-3 focus:outline-none focus:border-[#D4AF37] rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl border border-[#D4AF37] shadow-md flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-[#D4AF37]" />
                  <span>Sign In to My Account</span>
                </button>
              </>
            )}
          </form>

          {/* Value Perks Banner */}
          <div className="bg-[#FAF8F1] border border-[#E8DDC7] p-4 rounded-2xl grid grid-cols-3 gap-2 text-center text-[10px] text-[#6B5846]">
            <div className="flex flex-col items-center space-y-1">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-semibold">Exclusive Offers</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-semibold">Live Courier Tracking</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-semibold">GI Certified Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
