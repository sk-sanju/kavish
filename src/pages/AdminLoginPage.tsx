import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Phone, User, ArrowRight, AlertCircle, ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, registerAdmin, adminProfile } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Sign In form fields
  const [emailOrPhone, setEmailOrPhone] = useState(adminProfile.email || 'admin@kavishhandlooms.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Create Admin form fields
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Super Admin');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(emailOrPhone, password);
    if (success) {
      navigate('/admin');
    } else {
      setErrorMsg('Invalid email/phone or password credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim() || !newPassword.trim()) {
      setErrorMsg('All fields are required to create an admin account.');
      return;
    }
    const success = registerAdmin(newName, newEmail, newPhone, newPassword, newRole);
    if (success) {
      setSuccessMsg('Admin account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/admin');
      }, 800);
    } else {
      setErrorMsg('Failed to create admin account.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F1] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 border border-[#D4AF37] rounded-3xl shadow-2xl relative">
        
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-xs text-[#6B5846] hover:text-[#12372A] flex items-center gap-1 font-semibold cursor-pointer"
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
              {authMode === 'login' ? 'Admin Login' : 'Create Admin Account'}
            </h1>
            <p className="text-xs text-[#6B5846] mt-1 font-light">
              {authMode === 'login'
                ? 'Authorized staff access for inventory, orders & store management.'
                : 'Register a new administrative profile with Name, Email & Phone (PK).'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#FAF8F1] p-1 rounded-2xl border border-[#E8DDC7]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-[#12372A] text-[#FAF8F1] shadow-xs'
                : 'text-[#6B5846] hover:text-[#12372A]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              authMode === 'register'
                ? 'bg-[#12372A] text-[#FAF8F1] shadow-xs'
                : 'text-[#6B5846] hover:text-[#12372A]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Admin</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-100 border border-red-300 text-red-800 text-xs rounded-2xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {authMode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#6B5846] font-semibold mb-1.5">Admin Email / Phone (PK) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="admin@kavishhandlooms.com or phone"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full border border-[#E8DDC7] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-[#FAF8F1] text-xs text-[#12372A] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#6B5846] font-semibold mb-1.5">Admin Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#E8DDC7] pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-[#FAF8F1] text-xs font-mono text-[#12372A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-[#12372A] p-0.5 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-[#12372A]/5 p-3 rounded-2xl text-[11px] text-[#12372A] flex flex-col gap-1 border border-[#D4AF37]/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#6B5846]">Admin Email:</span>
                <code className="text-[#12372A] font-bold font-mono">{adminProfile.email}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#6B5846]">Primary Phone (PK):</span>
                <code className="text-[#12372A] font-mono">{adminProfile.phone}</code>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-lg cursor-pointer"
            >
              <span>Authenticate &amp; Open Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* CREATE ADMIN FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#6B5846] font-semibold mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Weaver Sanjay"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F1] text-xs font-bold text-[#12372A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#6B5846] font-semibold mb-1">Official Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="sanjay@kavishhandlooms.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F1] text-xs text-[#12372A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#6B5846] font-semibold mb-1">Primary Mobile Phone (PK - Primary Key) *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="+91 98470 12345"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F1] text-xs font-mono font-bold text-[#12372A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#6B5846] font-semibold mb-1">Admin Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="Create strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#E8DDC7] pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF8F1] text-xs font-mono text-[#12372A]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#12372A] p-0.5 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#6B5846] font-semibold mb-1">Role / Permissions Scope</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Order Manager">Order Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-lg cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register &amp; Open Admin Console</span>
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#E8DDC7]/60">
          <p className="text-[10px] text-[#6B5846]">
            Kavish Kuthampully GI Handloom Unit • Reg No. 2011
          </p>
        </div>

      </div>
    </div>
  );
};
