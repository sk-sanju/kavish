'use client';

import React, { useState } from 'react';
import { User, Package, MapPin, Truck, Plus, ShieldCheck, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { OptimizedImage } from '../components/common/OptimizedImage';
import type { Address } from '../types';

export const AccountPage: React.FC = () => {
  const {
    user,
    isCustomerLoggedIn,
    openCustomerAuthModal,
    logoutCustomer,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    setSelectedTrackingOrder
  } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  const [showNewAddrModal, setShowNewAddrModal] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    name: user.name,
    phone: user.phone,
    street: '',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682001',
    isDefault: false
  });

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddr);
    setShowNewAddrModal(false);
    setNewAddr({ name: user.name, phone: user.phone, street: '', city: 'Kochi', state: 'Kerala', pincode: '682001', isDefault: false });
  };

  if (!isCustomerLoggedIn) {
    return (
      <div className="py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn flex items-center justify-center p-4">
        <div className="bg-white border border-[#D4AF37]/50 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#12372A] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A]">
            Create a Customer Account
          </h2>
          <p className="text-xs text-[#6B5846] leading-relaxed">
            Join the Kavish Royal Patron Circle to track orders, save delivery addresses, unlock exclusive GI certified handloom previews, and enjoy 1-click Razorpay checkout.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => openCustomerAuthModal('register')}
              className="flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl border border-[#D4AF37] shadow-md"
            >
              Create Account
            </button>
            <button
              onClick={() => openCustomerAuthModal('login')}
              className="flex-1 bg-white text-[#12372A] border border-[#12372A] hover:bg-[#FAF8F1] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="bg-[#12372A] text-[#FAF8F1] p-6 sm:p-8 rounded-3xl shadow-xl mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#D4AF37] text-[#12372A] flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shrink-0 shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-3xl font-bold">{user.name}</h1>
              <p className="text-xs text-[#E8DDC7]">{user.email} • {user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 text-xs bg-[#0B241B] px-3.5 py-2 border border-[#D4AF37]/40 rounded-full shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Royal Patron</span>
            </div>

            <button
              onClick={logoutCustomer}
              className="flex items-center gap-1.5 text-xs bg-red-900/80 hover:bg-red-800 text-white px-3.5 py-2 rounded-full transition-colors border border-red-700 shadow-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          <div className="lg:col-span-3 bg-white p-2.5 sm:p-4 border border-[#E8DDC7] rounded-2xl shadow-xs self-start flex flex-row overflow-x-auto lg:flex-col gap-1.5 text-xs uppercase font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 sm:py-3 flex items-center gap-2.5 whitespace-nowrap transition-all rounded-xl ${
                activeTab === 'orders' ? 'bg-[#12372A] text-[#FAF8F1] shadow-xs' : 'hover:bg-[#FAF8F1] text-[#171717]'
              }`}
            >
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>Orders ({user.orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-4 py-2.5 sm:py-3 flex items-center gap-2.5 whitespace-nowrap transition-all rounded-xl ${
                activeTab === 'addresses' ? 'bg-[#12372A] text-[#FAF8F1] shadow-xs' : 'hover:bg-[#FAF8F1] text-[#171717]'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Addresses ({user.addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 sm:py-3 flex items-center gap-2.5 whitespace-nowrap transition-all rounded-xl ${
                activeTab === 'profile' ? 'bg-[#12372A] text-[#FAF8F1] shadow-xs' : 'hover:bg-[#FAF8F1] text-[#171717]'
              }`}
            >
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span>Profile</span>
            </button>
          </div>

          <div className="lg:col-span-9 bg-white p-5 sm:p-8 border border-[#E8DDC7] rounded-2xl shadow-xs">
            
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A] border-b border-[#E8DDC7] pb-3">Order History</h3>
                
                {user.orders.length === 0 ? (
                  <p className="text-xs text-[#6B5846]">No order history found.</p>
                ) : (
                  user.orders.map(order => (
                    <div key={order.id} className="border border-[#E8DDC7] p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-b border-[#FAF8F1] pb-3 gap-2">
                        <div>
                          <strong className="text-[#12372A] font-serif text-base">{order.id}</strong>
                          <span className="text-[#6B5846] block text-[11px]">{order.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-[#12372A] text-[#D4AF37] px-3 py-1 font-bold uppercase text-[10px] rounded-full">
                            {order.status}
                          </span>
                          <button
                            onClick={() => setSelectedTrackingOrder(order)}
                            className="bg-[#D4AF37] text-[#12372A] px-3 py-1.5 text-[11px] font-bold uppercase flex items-center gap-1 hover:bg-[#12372A] hover:text-[#FAF8F1] transition-all rounded-xl shadow-xs"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Package</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <OptimizedImage
                                src={item.product.images[0]}
                                alt={item.product.name}
                                preset="thumbnail"
                                aspectRatio="3/4"
                                containerClassName="w-10 sm:w-12 aspect-[3/4] rounded-lg shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-[#12372A] line-clamp-1">{item.product.name}</h4>
                                <span className="text-[10px] text-[#6B5846]">Size: {item.size} • Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-bold text-[#12372A]">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#E8DDC7] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#6B5846]">
                          <span className="font-semibold text-[#12372A]">Payment:</span>
                          <span className="bg-[#FAF8F1] px-2 py-0.5 rounded border border-[#E8DDC7] font-mono text-[10px] text-[#12372A] font-bold">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-2 font-bold text-[#12372A]">
                          <span>Total Paid:</span>
                          <span className="text-sm font-serif text-[#12372A]">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DDC7] pb-3 gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A]">Saved Shipping Addresses</h3>
                  <button
                    onClick={() => setShowNewAddrModal(true)}
                    className="bg-[#12372A] text-[#FAF8F1] px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#D4AF37] hover:text-[#12372A] rounded-xl self-start sm:self-auto shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map(addr => (
                    <div key={addr.id} className={`p-4 border text-xs space-y-2 relative rounded-2xl ${addr.isDefault ? 'border-[#12372A] bg-[#FAF8F1]' : 'border-[#E8DDC7]'}`}>
                      {addr.isDefault && (
                        <span className="bg-[#D4AF37] text-[#12372A] text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full">Default Address</span>
                      )}
                      <h4 className="font-bold text-[#12372A] text-sm">{addr.name}</h4>
                      <p className="text-[#6B5846]">{addr.street}, {addr.locality}</p>
                      <p className="text-[#6B5846]">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-[#6B5846]">Phone: {addr.phone}</p>

                      <div className="pt-2 flex gap-3">
                        {!addr.isDefault && (
                          <button onClick={() => setDefaultAddress(addr.id)} className="text-[#D4AF37] font-bold hover:underline">Set Default</button>
                        )}
                        <button onClick={() => deleteAddress(addr.id)} className="text-red-700 font-bold hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {showNewAddrModal && (
                  <form onSubmit={handleCreateAddress} className="bg-[#FAF8F1] p-5 sm:p-6 border border-[#D4AF37] rounded-2xl space-y-4 text-xs">
                    <h4 className="font-serif font-bold text-base text-[#12372A]">Add Delivery Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Full Name" value={newAddr.name} onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })} required className="border p-2.5 rounded-xl" />
                      <input type="text" placeholder="Phone" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} required className="border p-2.5 rounded-xl" />
                      <input type="text" placeholder="Street / Villa" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} required className="sm:col-span-2 border p-2.5 rounded-xl" />
                      <input type="text" placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} required className="border p-2.5 rounded-xl" />
                      <input type="text" placeholder="Pincode" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} required className="border p-2.5 rounded-xl" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#12372A] text-white px-4 py-2 uppercase font-bold rounded-xl">Save Address</button>
                      <button type="button" onClick={() => setShowNewAddrModal(false)} className="border px-4 py-2 uppercase font-bold rounded-xl">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12372A] border-b border-[#E8DDC7] pb-3">Personal Profile</h3>
                <div className="space-y-3 max-w-md">
                  <div><label className="block text-[#6B5846] font-semibold mb-1">Full Name</label><input type="text" value={user.name} readOnly className="w-full border p-2.5 bg-[#FAF8F1] rounded-xl" /></div>
                  <div><label className="block text-[#6B5846] font-semibold mb-1">Email Address</label><input type="email" value={user.email} readOnly className="w-full border p-2.5 bg-[#FAF8F1] rounded-xl" /></div>
                  <div><label className="block text-[#6B5846] font-semibold mb-1">Phone Number</label><input type="text" value={user.phone} readOnly className="w-full border p-2.5 bg-[#FAF8F1] rounded-xl" /></div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
