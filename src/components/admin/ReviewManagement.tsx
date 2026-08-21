import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAdmin } from '../../context/AdminContext';
import type { Review } from '../../types';

export const ReviewManagement: React.FC = () => {
  const { reviews, updateReview, deleteReview } = useProducts();
  const { addAuditLog } = useAdmin();

  const [responseInput, setResponseInput] = useState<{ [id: string]: string }>({});

  const handleUpdateStatus = (r: Review, status: 'Approved' | 'Pending' | 'Rejected' | 'Hidden') => {
    updateReview({ ...r, status });
    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Moderated Review by ${r.author} (${status})`,
      entity: 'Review',
      entityId: r.id,
      newValue: status
    });
  };

  const handleSendResponse = (r: Review) => {
    const text = responseInput[r.id];
    if (text?.trim()) {
      updateReview({ ...r, adminResponse: text.trim(), status: 'Approved' });
      setResponseInput({ ...responseInput, [r.id]: '' });
      alert('Staff response attached to review!');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Patron Feedback &amp; Ratings
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Review Moderation Console ({reviews.length})
          </h1>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white p-5 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <strong className="text-[#12372A] font-bold text-sm">{r.title}</strong>
                </div>
                <span className="text-xs text-[#6B5846]">By {r.author} • {r.location} • {r.date}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                (r.status || 'Approved') === 'Approved' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-amber-100 text-amber-800'
              }`}>
                {r.status || 'Approved'}
              </span>
            </div>

            <p className="text-xs text-[#171717] font-light italic bg-[#FAF8F1] p-3 rounded-xl border border-[#E8DDC7]">
              "{r.comment}"
            </p>

            {r.adminResponse && (
              <div className="p-3 bg-[#12372A] text-[#FAF8F1] rounded-xl text-xs space-y-1">
                <strong className="text-[#D4AF37] font-serif block">Kavish Atelier Official Response:</strong>
                <p>{r.adminResponse}</p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8DDC7] text-xs">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(r, 'Approved')}
                  className="bg-green-700 text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(r, 'Hidden')}
                  className="bg-amber-700 text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase"
                >
                  Hide
                </button>
                <button
                  onClick={() => deleteReview(r.id)}
                  className="bg-red-700 text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase"
                >
                  Delete
                </button>
              </div>

              {/* Staff Response Input */}
              <div className="flex gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Write official atelier staff response..."
                  value={responseInput[r.id] || ''}
                  onChange={(e) => setResponseInput({ ...responseInput, [r.id]: e.target.value })}
                  className="flex-1 border border-[#E8DDC7] p-1.5 rounded-xl bg-[#FAF8F1] text-xs"
                />
                <button
                  onClick={() => handleSendResponse(r)}
                  className="bg-[#12372A] text-[#FAF8F1] px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] border border-[#D4AF37]"
                >
                  Respond
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
