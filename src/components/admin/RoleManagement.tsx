import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import type { AdminUser, AdminRole } from '../../types';

export const RoleManagement: React.FC = () => {
  const { adminUsers, addAdminUser, deleteAdminUser } = useAdmin();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    role: 'Store Manager',
    status: 'Active',
    permissions: ['products.view', 'products.edit', 'orders.view']
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addAdminUser({
      name: form.name || 'Staff User',
      email: form.email || 'staff@kavishhandlooms.com',
      role: (form.role as AdminRole) || 'Store Manager',
      status: form.status || 'Active',
      permissions: form.permissions || ['all']
    });
    setShowModal(false);
    setForm({ name: '', email: '', role: 'Store Manager', status: 'Active', permissions: [] });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Access Control &amp; Security
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Admin Users &amp; RBAC Roles ({adminUsers.length})
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#12372A] text-[#FAF8F1] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-2 border border-[#D4AF37] shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12372A] text-[#FAF8F1] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Admin Staff Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Last Login</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDC7]">
              {adminUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#FAF8F1] transition-colors">
                  <td className="p-3.5">
                    <strong className="text-[#12372A] block font-serif text-sm">{user.name}</strong>
                  </td>

                  <td className="p-3.5 font-mono text-[11px] text-[#12372A]">{user.email}</td>

                  <td className="p-3.5 font-bold">
                    <span className="bg-[#12372A] text-[#D4AF37] px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono border border-[#D4AF37]">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-gray-500">{user.lastLogin || 'Recent'}</td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    {user.role !== 'Super Admin' && (
                      <button
                        onClick={() => deleteAdminUser(user.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Revoke Admin User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FAF8F1]">Provision New Admin User</h3>
                <p className="text-xs text-[#E8DDC7]/80">Configure staff account &amp; RBAC scope</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="add-admin-user-form" onSubmit={handleCreateUser} className="p-6 overflow-y-auto space-y-3 text-xs flex-1">
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Master Weaver Ramesh"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="weaver@kavishhandlooms.com"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Role &amp; Permissions Scope</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                >
                  <option value="Store Manager">Store Manager</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Order Manager">Order Manager</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Support Staff">Support Staff</option>
                </select>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="add-admin-user-form"
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
              >
                Create Admin User
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-3 border border-[#E8DDC7] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
