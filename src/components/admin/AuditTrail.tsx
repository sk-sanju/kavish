'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AuditTrail: React.FC = () => {
  const { auditLogs } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(l =>
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            System Security &amp; Audit Trail
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Internal Activity Logs ({auditLogs.length})
          </h1>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 border border-[#E8DDC7] rounded-2xl shadow-xs text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search audit logs by admin user, action, or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E8DDC7] pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F1]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#E8DDC7] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12372A] text-[#FAF8F1] font-serif uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Admin User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Previous State</th>
                <th className="p-3.5">New State</th>
                <th className="p-3.5 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDC7]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#FAF8F1] transition-colors">
                  <td className="p-3.5 font-mono text-[10px] text-gray-500">{log.timestamp}</td>

                  <td className="p-3.5 font-bold text-[#12372A]">{log.adminName}</td>

                  <td className="p-3.5 font-mono text-[10px] text-[#D4AF37] uppercase">{log.adminRole}</td>

                  <td className="p-3.5 font-semibold text-[#12372A]">{log.action}</td>

                  <td className="p-3.5 font-mono text-gray-500">{log.previousValue || 'N/A'}</td>

                  <td className="p-3.5 font-mono font-bold text-green-700">{log.newValue || 'Updated'}</td>

                  <td className="p-3.5 text-right font-mono text-[10px] text-gray-400">{log.ipAddress || '192.168.1.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
