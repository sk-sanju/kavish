'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import { safeStorage } from '../../utils/storage';
import type { UserProfile, Order } from '../../types';

const CRM_STORAGE_KEY = 'kavish_crm_customers_v1';

export const CustomerManagement: React.FC = () => {
  const { adminOrders, user } = useAuth();
  const { addAuditLog } = useAdmin();
  const { formatPrice } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);
  const [internalNotesInput, setInternalNotesInput] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  const [customPatrons, setCustomPatrons] = useState<UserProfile[]>(() => {
    try {
      const stored = safeStorage.getItem(CRM_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Dynamically aggregate patrons from orders + registered profile + custom CRM additions
  const customersList: UserProfile[] = React.useMemo(() => {
    const patronMap = new Map<string, UserProfile>();

    // 1. Add current registered user if available
    if (user && user.name && user.name !== 'Valued Customer') {
      patronMap.set(user.email.toLowerCase(), {
        ...user,
        status: user.status || 'Active',
        totalSpent: (user.orders || []).reduce((acc, o) => (o.status !== 'Cancelled' ? acc + (o.total || 0) : acc), 0),
        createdAt: 'Current Member',
        internalNotes: user.internalNotes || 'Registered online customer'
      });
    }

    // 2. Aggregate patrons from orders (adminOrders or user.orders)
    const sourceOrders: Order[] = adminOrders.length > 0 ? adminOrders : user.orders || [];
    sourceOrders.forEach(o => {
      const key = (o.shippingAddress.phone || o.shippingAddress.name || o.id).toLowerCase();
      const existing = patronMap.get(key);
      const orderTotal = o.status !== 'Cancelled' && o.status !== 'Refunded' ? (o.total || 0) : 0;

      if (existing) {
        existing.totalSpent = (existing.totalSpent || 0) + orderTotal;
        if (!existing.orders.some(ex => ex.id === o.id)) {
          existing.orders.push(o);
        }
      } else {
        patronMap.set(key, {
          id: `crm-${o.id}`,
          name: o.shippingAddress.name || 'Valued Patron',
          email: `${o.shippingAddress.name.toLowerCase().replace(/\s+/g, '.')}@patron.kavish`,
          phone: o.shippingAddress.phone || 'N/A',
          status: 'Active',
          totalSpent: orderTotal,
          createdAt: o.date,
          internalNotes: `Customer from Order #${o.id}`,
          addresses: [o.shippingAddress],
          orders: [o]
        });
      }
    });

    // 3. Merge manually added CRM patrons
    customPatrons.forEach(cp => {
      patronMap.set(cp.id || cp.email.toLowerCase(), cp);
    });

    return Array.from(patronMap.values());
  }, [adminOrders, user, customPatrons]);

  const filteredCustomers = customersList.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleToggleCustomerStatus = (id: string) => {
    const updated = customPatrons.map(c => {
      if (c.id === id) {
        const newStatus: 'Active' | 'Disabled' = c.status === 'Active' ? 'Disabled' : 'Active';
        addAuditLog({
          adminName: 'Sanjay Suresh (Super Admin)',
          adminRole: 'Super Admin',
          action: `Changed Customer status to ${newStatus} for ${c.name}`,
          entity: 'CustomerCRM',
          entityId: c.id,
          newValue: newStatus
        });
        return { ...c, status: newStatus };
      }
      return c;
    });
    setCustomPatrons(updated);
    safeStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: UserProfile = {
      id: `cust-${Date.now()}`,
      name: newCustName.trim(),
      email: newCustEmail.trim().toLowerCase(),
      phone: newCustPhone.trim(),
      status: 'Active',
      totalSpent: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      internalNotes: 'Added via Admin CRM',
      addresses: [],
      orders: []
    };

    const updated = [newCust, ...customPatrons];
    setCustomPatrons(updated);
    safeStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));

    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Created Customer Profile: ${newCust.name}`,
      entity: 'CustomerCRM',
      entityId: newCust.id || ''
    });

    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
  };

  const handleSaveNotes = () => {
    if (!selectedCustomer) return;
    const updated = customPatrons.map(c => c.id === selectedCustomer.id ? { ...c, internalNotes: internalNotesInput } : c);
    setCustomPatrons(updated);
    safeStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Customer Relationship Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Patron Accounts CRM ({customersList.length})
          </h1>
        </div>

        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="bg-[#12372A] text-[#FAF8F1] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-2 border border-[#D4AF37] shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, email address, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F1]"
          />
        </div>
      </div>

      {/* Customer CRM Table */}
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12372A] text-[#FAF8F1] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Patron Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Mobile Number</th>
                <th className="p-3.5">Total Spent</th>
                <th className="p-3.5">Orders Count</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDC7]">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-[#FAF8F1] transition-colors">
                  <td className="p-3.5">
                    <strong className="text-[#12372A] block font-serif text-sm">{c.name}</strong>
                    <span className="text-[10px] text-[#6B5846]">Joined: {c.createdAt}</span>
                  </td>

                  <td className="p-3.5 font-mono text-[11px] text-[#12372A]">{c.email}</td>

                  <td className="p-3.5 font-mono text-[11px]">{c.phone}</td>

                  <td className="p-3.5 font-serif font-bold text-[#12372A] text-sm">{formatPrice(c.totalSpent || 0)}</td>

                  <td className="p-3.5 font-bold">{c.orders.length} Order(s)</td>

                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleCustomerStatus(c.id || '')}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        c.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      {c.status}
                    </button>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedCustomer(c);
                        setInternalNotesInput(c.internalNotes || '');
                      }}
                      className="bg-[#12372A] text-[#FAF8F1] px-3.5 py-1.5 rounded-xl font-bold uppercase text-[10px] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all border border-[#D4AF37]"
                    >
                      View CRM Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Drawer / Modal */}
      {selectedCustomer && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex justify-between items-start shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">Patron CRM Profile</span>
                <h3 className="font-serif font-bold text-xl text-[#FAF8F1]">{selectedCustomer.name}</h3>
                <span className="text-xs text-[#E8DDC7]/80 font-mono">{selectedCustomer.email} • {selectedCustomer.phone}</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl">
                  <span className="text-[#6B5846]">Lifetime Value:</span>
                  <div className="font-serif text-lg font-bold text-[#12372A]">{formatPrice(selectedCustomer.totalSpent || 0)}</div>
                </div>
                <div className="p-3 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl">
                  <span className="text-[#6B5846]">Total Orders Count:</span>
                  <div className="font-serif text-lg font-bold text-[#12372A]">{selectedCustomer.orders.length}</div>
                </div>
              </div>

              {/* Saved Delivery Addresses */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-[#12372A]">Saved Delivery Addresses</h4>
                {selectedCustomer.addresses.length === 0 ? (
                  <p className="text-gray-500 italic">No saved address on profile.</p>
                ) : (
                  selectedCustomer.addresses.map(a => (
                    <div key={a.id} className="p-3 border border-[#E8DDC7] rounded-xl bg-[#FAF8F1]">
                      <strong>{a.name}</strong> - {a.street}, {a.city}, {a.state} - {a.pincode} (Ph: {a.phone})
                    </div>
                  ))
                )}
              </div>

              {/* Internal Staff CRM Notes */}
              <div className="space-y-2 text-xs pt-2 border-t border-[#E8DDC7]">
                <h4 className="font-bold text-[#12372A]">Internal Atelier Staff Notes</h4>
                <textarea
                  rows={3}
                  value={internalNotesInput}
                  onChange={(e) => setInternalNotesInput(e.target.value)}
                  placeholder="Enter private notes about preferences, sizing requirements, or VIP history..."
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 font-bold uppercase text-xs rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all border border-[#D4AF37]"
              >
                Save CRM Notes
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-3 border border-[#E8DDC7] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FAF8F1]">Add New Patron Profile</h3>
                <p className="text-xs text-[#E8DDC7]/80">Register customer account manually in CRM</p>
              </div>
              <button onClick={() => setShowAddCustomerModal(false)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="add-customer-form" onSubmit={handleAddCustomer} className="p-6 overflow-y-auto space-y-3 text-xs flex-1">
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Lakshmi Menon"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="lakshmi@example.com"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+91 98470 12345"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="add-customer-form"
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
              >
                Create Patron Account
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                className="px-5 py-3 border border-[#E8DDC7] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

