'use client';

import React from 'react';
import { X, Ruler } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, sizeGuideProduct } = useModal();

  if (!isSizeGuideOpen) return null;

  const customChart = sizeGuideProduct?.sizeChart;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#F8F5EF] w-full max-w-2xl border border-[#B99A61] shadow-2xl rounded-3xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto my-auto">
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 p-1 text-[#641E2B] hover:text-[#B99A61] w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#B99A61] text-xs font-bold uppercase tracking-wider mb-1">
          <Ruler className="w-4 h-4" /> Size &amp; Fitment Guide
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#641E2B] mb-1">
          {customChart?.title || (sizeGuideProduct ? `${sizeGuideProduct.name} — Size Guide` : 'Kavish Size & Measurement Guide')}
        </h3>
        <p className="text-xs text-[#6E685D] mb-6">
          {customChart?.description || 'Handcrafted garments woven to traditional Kerala dimensions with standard relaxed royal tailoring.'}
        </p>

        {customChart && customChart.rows.length > 0 ? (
          <div className="space-y-6 text-xs text-[#292522]">
            <div className="overflow-x-auto border border-[#E8DFD0] rounded-2xl shadow-xs">
              <table className="w-full text-left bg-white rounded-2xl">
                <thead className="bg-[#641E2B] text-[#F8F5EF]">
                  <tr>
                    <th className="p-3 font-semibold">Size Tag</th>
                    <th className="p-3 font-semibold">Chest</th>
                    <th className="p-3 font-semibold">Shoulder</th>
                    <th className="p-3 font-semibold">Length / Height</th>
                    <th className="p-3 font-semibold">Waist / Dimensions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD0]">
                  {customChart.rows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-[#F8F5EF]/50' : ''}>
                      <td className="p-3 font-bold text-[#641E2B]">{row.size}</td>
                      <td className="p-3">{row.chest || '—'}</td>
                      <td className="p-3">{row.shoulder || '—'}</td>
                      <td className="p-3">{row.length || '—'}</td>
                      <td className="p-3">{row.waist || row.dimensions || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-xs text-[#292522]">
            <div>
              <h4 className="font-serif font-bold text-base text-[#641E2B] mb-2 uppercase tracking-wider">
                Men’s Linen &amp; Cotton Shirts
              </h4>
              <div className="overflow-x-auto border border-[#E8DFD0] rounded-2xl shadow-xs">
                <table className="w-full text-left bg-white rounded-2xl">
                  <thead className="bg-[#641E2B] text-[#F8F5EF]">
                    <tr>
                      <th className="p-3 font-semibold">Size Tag</th>
                      <th className="p-3 font-semibold">Chest (Inches)</th>
                      <th className="p-3 font-semibold">Shoulder</th>
                      <th className="p-3 font-semibold">Shirt Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD0]">
                    <tr>
                      <td className="p-3 font-bold text-[#641E2B]">38 (S)</td>
                      <td className="p-3">38 - 40"</td>
                      <td className="p-3">17.5"</td>
                      <td className="p-3">29.5"</td>
                    </tr>
                    <tr className="bg-[#F8F5EF]/50">
                      <td className="p-3 font-bold text-[#641E2B]">40 (M)</td>
                      <td className="p-3">40 - 42"</td>
                      <td className="p-3">18.0"</td>
                      <td className="p-3">30.0"</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#641E2B]">42 (L)</td>
                      <td className="p-3">42 - 44"</td>
                      <td className="p-3">18.5"</td>
                      <td className="p-3">30.5"</td>
                    </tr>
                    <tr className="bg-[#F8F5EF]/50">
                      <td className="p-3 font-bold text-[#641E2B]">44 (XL)</td>
                      <td className="p-3">44 - 46"</td>
                      <td className="p-3">19.0"</td>
                      <td className="p-3">31.0"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-[#641E2B] mb-2 uppercase tracking-wider">
                Traditional Mundu &amp; Set Dimensions
              </h4>
              <div className="border border-[#E8DFD0] bg-white p-4 space-y-2 rounded-2xl">
                <p>
                  <strong className="text-[#641E2B]">Double Kasavu Mundu:</strong> 4.0 Meters (155 Inches) total length x 50 Inches width. Fits waist sizes 28" to 44".
                </p>
                <p>
                  <strong className="text-[#641E2B]">Single Mundu:</strong> 2.0 Meters (78 Inches) length x 50 Inches width.
                </p>
                <p>
                  <strong className="text-[#641E2B]">Women’s Set Mundu:</strong> Lower Mundu 2.8 Meters x Upper Neriyathu 2.5 Meters. Fits XS to XXL drapes.
                </p>
                <p>
                  <strong className="text-[#641E2B]">Kerala Kasavu Saree:</strong> 5.5 Meters saree length + 0.8 Meter unstitched blouse piece.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="mt-6 w-full bg-[#641E2B] text-[#F8F5EF] py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#B99A61] hover:text-[#641E2B] transition-colors rounded-xl shadow-md border border-[#B99A61] cursor-pointer"
        >
          Got It, Close Guide
        </button>
      </div>
    </div>
  );
};
