'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Truck, Plus, ShieldCheck, LogOut, UserPlus, Heart, RotateCcw, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { OptimizedImage } from '../components/common/OptimizedImage';
import type { Address, Order, OrderItem } from '../types';

export const AccountPage: React.FC = () => {
  const router = useRouter();
  const {
    user,
    isCustomerLoggedIn,
    openCustomerAuthModal,
    logoutCustomer,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    setSelectedTrackingOrder,
    registerCustomer
  } = useAuth();
  const { addReturnRequest, returnRequests } = useAdmin();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile' | 'wishlist'>('orders');

  // Address Modal State
  const [showNewAddrModal, setShowNewAddrModal] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    name: user.name,
    phone: user.phone,
    street: '',
    city: 'Thrissur',
    state: 'Kerala',
    pincode: '680594',
    isDefault: false
  });

  // Return Request Modal State
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [selectedReturnItem, setSelectedReturnItem] = useState<OrderItem | null>(null);
  const [returnReason, setReturnReason] = useState('Size / Fit adjustment needed');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnSuccessMsg, setReturnSuccessMsg] = useState<string | null>(null);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user.name);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddr);
    setShowNewAddrModal(false);
    setNewAddr({ name: user.name, phone: user.phone, street: '', city: 'Thrissur', state: 'Kerala', pincode: '680594', isDefault: false });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    registerCustomer(profileName, profileEmail, profilePhone);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleOpenReturnModal = (order: Order) => {
    setReturnModalOrder(order);
    setSelectedReturnItem(order.items[0] || null);
    setReturnReason('Size / Fit adjustment needed');
    setReturnNotes('');
    setReturnSuccessMsg(null);
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrder || !selectedReturnItem) return;

    addReturnRequest({
      orderId: returnModalOrder.id,
      customerName: user.name || returnModalOrder.shippingAddress.name,
      customerEmail: user.email || 'customer@kavish.in',
      productName: `${selectedReturnItem.product.name} (Size: ${selectedReturnItem.size})`,
      reason: `${returnReason}${returnNotes ? ': ' + returnNotes : ''}`,
      status: 'Requested',
      refundAmount: selectedReturnItem.price * selectedReturnItem.quantity,
      adminNotes: 'Submitted directly via patron customer portal'
    });

    setReturnSuccessMsg(`Return claim submitted for Order #${returnModalOrder.id}. Our concierge team will review and approve reverse pickup within 24 hours.`);
    setTimeout(() => {
      setReturnModalOrder(null);
      setReturnSuccessMsg(null);
    }, 3500);
  };

  if (!isCustomerLoggedIn) {
    return (
      <div className="py-12 bg-[#FFFFFF] min-h-screen animate-fadeIn flex items-center justify-center p-4">
        <div className="bg-white border border-[#C5A15A]/50 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#111111] text-[#C5A15A] flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
            Create a Customer Account
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Join the Kavish Royal Patron Circle to track live order dispatches, manage shipping addresses, initiate 1-click returns, and enjoy expedited Razorpay checkout.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => openCustomerAuthModal('register')}
              className="flex-1 bg-[#111111] text-[#FFFFFF] hover:bg-[#C5A15A] hover:text-[#111111] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl border border-[#C5A15A] shadow-md cursor-pointer"
            >
              Create Account
            </button>
            <button
              onClick={() => openCustomerAuthModal('login')}
              className="flex-1 bg-white text-[#111111] border border-[#111111] hover:bg-[#FFFFFF] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FFFFFF] min-h-screen animate-fadeIn pb-24 lg:pb-12 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Profile Card Banner */}
        <div className="bg-[#111111] text-[#FFFFFF] p-6 sm:p-8 rounded-3xl shadow-xl mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border border-[#C5A15A]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#C5A15A] text-[#111111] flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shrink-0 shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-3xl font-bold">{user.name}</h1>
              <p className="text-xs text-[#E5E7EB]">{user.email || 'Registered Patron'} • {user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 text-xs bg-[#000000] px-3.5 py-2 border border-[#C5A15A]/40 rounded-full shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#C5A15A]" />
              <span className="text-[#C5A15A] font-bold">Royal Patron</span>
            </div>

            <button
              onClick={logoutCustomer}
              className="flex items-center gap-1.5 text-xs bg-red-900/80 hover:bg-red-800 text-white px-3.5 py-2 rounded-full transition-colors border border-red-700 shadow-xs cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Tabs & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white p-2.5 sm:p-4 border border-[#E5E7EB] rounded-2xl shadow-xs self-start flex flex-row overflow-x-auto lg:flex-col gap-1.5 text-xs uppercase font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 sm:py-3 flex items-center gap-2.5 whitespace-nowrap transition-all rounded-xl cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#111111] text-[#FFFFFF] shadow-xs font-bold' : 'hover:bg-[#FFFFFF] text-[#1A1A1A]'
              }`}
            >
              <Package className="w-4 h-4 text-[#C5A15A]" />
              <span>Orders ({user.orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-4 py-2.5 sm:py-3 flex items-center gap-2.5 whitespace-nowrap transition-all rounded-xl cursor-pointer ${
                activeTab === 'addresses' ? 'bg-[#111111] text-[#FFFFFF] shadow-xs font-bold' : 'hover:bg-[#FFFFFF] text-[#1A1A1A]'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#C5A15A]" />
              <span>Addresses ({user.addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2.5 sm:py-3 flex items-center gap-2.5 whitespace-nowrap transition-all rounded-xl cursor-pointer ${
                activeTab === 'wishlist' ? 'bg-[#111111] text-[#FFFFFF] shadow-xs font-bold' : 'hover:bg-[#FFFFFF] text-[#1A1A1A]'
              }`}
            >
              <Heart className="w-4 h-4 text-[#C5A15A]" />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 sm:py-3 flex items-center gap-2.5 whitespace-nowrap transition-all rounded-xl cursor-pointer ${
                activeTab === 'profile' ? 'bg-[#111111] text-[#FFFFFF] shadow-xs font-bold' : 'hover:bg-[#FFFFFF] text-[#1A1A1A]'
              }`}
            >
              <User className="w-4 h-4 text-[#C5A15A]" />
              <span>Profile Settings</span>
            </button>
          </div>

          {/* Main Tab Area */}
          <div className="lg:col-span-9 bg-white p-5 sm:p-8 border border-[#E5E7EB] rounded-2xl shadow-xs">
            
            {/* 1. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111111]">Order History &amp; Tracking</h3>
                  <span className="text-xs text-[#6B7280]">{user.orders.length} orders recorded</span>
                </div>
                
                {user.orders.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <Package className="w-10 h-10 mx-auto text-[#C5A15A] opacity-60" />
                    <p className="text-sm font-serif font-bold text-[#111111]">No orders placed yet</p>
                    <p className="text-xs text-[#6B7280]">Explore our collection of handloom sarees and Kerala attire.</p>
                    <button
                      onClick={() => router.push('/shop')}
                      className="bg-[#111111] text-[#FFFFFF] hover:bg-[#C5A15A] hover:text-[#111111] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  user.orders.map(order => {
                    const existingReturn = returnRequests.find(r => r.orderId === order.id);

                    return (
                      <div key={order.id} className="border border-[#E5E7EB] p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-b border-[#FFFFFF] pb-3 gap-2">
                          <div>
                            <strong className="text-[#111111] font-serif text-base block">{order.id}</strong>
                            <span className="text-[#6B7280] text-[11px]">Placed on {order.date}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-[#111111] text-[#C5A15A] px-3 py-1 font-bold uppercase text-[10px] rounded-full border border-[#C5A15A]/40">
                              {order.status}
                            </span>

                            <button
                              onClick={() => {
                                setSelectedTrackingOrder(order);
                                router.push(`/track-order?orderId=${order.id}`);
                              }}
                              className="bg-[#C5A15A] text-[#111111] px-3 py-1.5 text-[11px] font-bold uppercase flex items-center gap-1 hover:bg-[#111111] hover:text-[#FFFFFF] transition-all rounded-xl shadow-xs cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Package</span>
                            </button>

                            {/* Returns Action Button */}
                            {existingReturn ? (
                              <span className="bg-amber-100 text-amber-800 px-3 py-1 text-[10px] font-bold uppercase rounded-xl">
                                Return: {existingReturn.status}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenReturnModal(order)}
                                className="bg-white border border-[#E5E7EB] text-[#111111] hover:border-[#C5A15A] px-3 py-1.5 text-[11px] font-bold uppercase flex items-center gap-1 rounded-xl transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-[#C5A15A]" />
                                <span>Return / Exchange</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                {item.product.images?.[0] && (
                                  <OptimizedImage
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    preset="thumbnail"
                                    aspectRatio="3/4"
                                    containerClassName="w-10 sm:w-12 aspect-[3/4] rounded-lg shrink-0 border border-[#E5E7EB]"
                                  />
                                )}
                                <div>
                                  <h4 className="font-bold text-[#111111] line-clamp-1">{item.product.name}</h4>
                                  <span className="text-[10px] text-[#6B7280]">Size: {item.size} • Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-bold text-[#111111]">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                            <span className="font-semibold text-[#111111]">Payment:</span>
                            <span className="bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E5E7EB] font-mono text-[10px] text-[#111111] font-bold">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <div className="flex justify-between sm:justify-end gap-2 font-bold text-[#111111]">
                            <span>Total Paid:</span>
                            <span className="text-sm font-serif text-[#111111]">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E7EB] pb-3 gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111111]">Saved Shipping Addresses</h3>
                  <button
                    onClick={() => setShowNewAddrModal(true)}
                    className="bg-[#111111] text-[#FFFFFF] px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#C5A15A] hover:text-[#111111] rounded-xl self-start sm:self-auto shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map(addr => (
                    <div key={addr.id} className={`p-4 border text-xs space-y-2 relative rounded-2xl ${addr.isDefault ? 'border-[#111111] bg-[#FFFFFF]' : 'border-[#E5E7EB]'}`}>
                      {addr.isDefault && (
                        <span className="bg-[#C5A15A] text-[#111111] text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full font-mono">Default Address</span>
                      )}
                      <h4 className="font-bold text-[#111111] text-sm">{addr.name}</h4>
                      <p className="text-[#6B7280]">{addr.street}, {addr.locality}</p>
                      <p className="text-[#6B7280]">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-[#6B7280]">Phone: {addr.phone}</p>

                      <div className="pt-2 flex gap-3">
                        {!addr.isDefault && (
                          <button onClick={() => setDefaultAddress(addr.id)} className="text-[#C5A15A] font-bold hover:underline cursor-pointer">Set Default</button>
                        )}
                        <button onClick={() => deleteAddress(addr.id)} className="text-red-700 font-bold hover:underline cursor-pointer">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {showNewAddrModal && (
                  <form onSubmit={handleCreateAddress} className="bg-[#FFFFFF] p-5 sm:p-6 border border-[#C5A15A] rounded-2xl space-y-4 text-xs">
                    <h4 className="font-serif font-bold text-base text-[#111111]">Add Delivery Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Full Name" value={newAddr.name} onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })} required className="border p-2.5 rounded-xl bg-white" />
                      <input type="text" placeholder="Phone (10 digits)" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} required className="border p-2.5 rounded-xl bg-white" />
                      <input type="text" placeholder="House Name / Street / Flat" value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} required className="sm:col-span-2 border p-2.5 rounded-xl bg-white" />
                      <input type="text" placeholder="City / Town" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} required className="border p-2.5 rounded-xl bg-white" />
                      <input type="text" placeholder="Postal PIN Code" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} required className="border p-2.5 rounded-xl bg-white" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#111111] text-white px-4 py-2 uppercase font-bold rounded-xl cursor-pointer">Save Address</button>
                      <button type="button" onClick={() => setShowNewAddrModal(false)} className="border px-4 py-2 uppercase font-bold rounded-xl bg-white cursor-pointer">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 3. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111111]">Saved Heirloom Favorites ({wishlist.length})</h3>
                  <button onClick={() => router.push('/wishlist')} className="text-xs text-[#C5A15A] hover:underline font-semibold cursor-pointer">
                    View Full Wishlist &rarr;
                  </button>
                </div>

                {wishlist.length === 0 ? (
                  <p className="text-xs text-[#6B7280] py-6 text-center">Your wishlist is currently empty. Tap the heart icon on any garment to save it here.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map(p => (
                      <div key={p.id} className="border border-[#E5E7EB] p-3 rounded-2xl flex flex-col justify-between">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-[#FFFFFF]">
                          {p.images?.[0] && (
                            <OptimizedImage
                              src={p.images[0]}
                              alt={p.name}
                              preset="card"
                              containerClassName="w-full h-full"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-sm text-[#111111] line-clamp-1">{p.name}</p>
                          <p className="font-bold text-xs text-[#111111] mt-0.5">{formatPrice(p.price)}</p>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => router.push(`/product/${p.id}`)}
                            className="flex-1 bg-[#111111] text-[#FFFFFF] py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => removeFromWishlist(p.id)}
                            className="text-red-700 px-2 py-1 text-xs hover:bg-red-50 rounded cursor-pointer"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-md">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111111] border-b border-[#E5E7EB] pb-3">
                  Patron Account Profile
                </h3>

                {profileSavedMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Profile details saved successfully.</span>
                  </div>
                )}

                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full border border-[#E5E7EB] p-2.5 bg-white rounded-xl text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    required
                    className="w-full border border-[#E5E7EB] p-2.5 bg-white rounded-xl text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    required
                    className="w-full border border-[#E5E7EB] p-2.5 bg-white rounded-xl text-[#1A1A1A] font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#111111] hover:bg-[#C5A15A] hover:text-[#111111] text-[#FFFFFF] py-3 px-6 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Save Profile Changes
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* CUSTOMER RETURN REQUEST MODAL */}
      {returnModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white border border-[#C5A15A]/40 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col text-[#1A1A1A]">
            
            <div className="bg-[#111111] text-[#FFFFFF] px-6 py-4 rounded-t-3xl flex items-center justify-between border-b border-[#C5A15A]/30">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A15A] tracking-widest block">
                  Return &amp; Exchange Request
                </span>
                <h2 className="font-serif text-lg font-bold">
                  Order #{returnModalOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setReturnModalOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#C5A15A] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="p-6 space-y-4 text-xs">
              
              {returnSuccessMsg ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                  <p>{returnSuccessMsg}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1">
                      Select Item to Return / Exchange
                    </label>
                    <select
                      value={selectedReturnItem?.product.id || ''}
                      onChange={(e) => {
                        const it = returnModalOrder.items.find(i => i.product.id === e.target.value);
                        if (it) setSelectedReturnItem(it);
                      }}
                      className="w-full bg-[#FFFFFF] border border-[#E5E7EB] p-2.5 rounded-xl text-xs text-[#1A1A1A]"
                    >
                      {returnModalOrder.items.map((it, idx) => (
                        <option key={idx} value={it.product.id}>
                          {it.product.name} (Size: {it.size}) - {formatPrice(it.price * it.quantity)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1">
                      Reason for Return or Exchange
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E5E7EB] p-2.5 rounded-xl text-xs text-[#1A1A1A]"
                    >
                      <option value="Size / Fit adjustment needed">Size / Fit adjustment needed</option>
                      <option value="Exchange for a different color / border">Exchange for a different color / border</option>
                      <option value="Defect or zari flaw on inspection">Defect or zari flaw on inspection</option>
                      <option value="Changed mind / Not suitable for celebration">Changed mind / Not suitable for celebration</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#6B7280] block mb-1">
                      Additional Details / Replacement Size
                    </label>
                    <textarea
                      rows={3}
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      placeholder="Please mention replacement size, desired delivery address, or reason details..."
                      className="w-full bg-[#FFFFFF] border border-[#E5E7EB] p-2.5 rounded-xl text-xs text-[#1A1A1A]"
                    />
                  </div>

                  <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E5E7EB] text-[11px] text-[#6B7280] space-y-1">
                    <p>• <strong>Complimentary Reverse Pickup:</strong> Our courier partner will collect the garment from your original address.</p>
                    <p>• <strong>Condition:</strong> Must have unremoved GI tag, unwashed and in original keepsake box.</p>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReturnModalOrder(null)}
                      className="flex-1 bg-white border border-[#E5E7EB] py-2.5 rounded-xl font-bold uppercase text-[11px] text-[#1A1A1A] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#111111] hover:bg-[#C5A15A] hover:text-[#111111] text-[#FFFFFF] py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors shadow-md cursor-pointer"
                    >
                      Submit Return Claim
                    </button>
                  </div>
                </>
              )}

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
