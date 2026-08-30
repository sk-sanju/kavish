'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, sizeGuideProduct } = useModal();

  if (!isSizeGuideOpen) return null;

  const customChart = sizeGuideProduct?.sizeChart;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F1] w-full max-w-2xl border border-[#D4AF37] shadow-2xl rounded-3xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 p-1 text-[#12372A] hover:text-[#D4AF37] w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-2xl font-bold text-[#12372A] mb-1">
          {customChart?.title || (sizeGuideProduct ? `${sizeGuideProduct.name} — Size Guide` : 'Kavish Size & Measurement Guide')}
        </h3>
        <p className="text-xs text-[#6B5846] mb-6">
          {customChart?.description || 'Handcrafted garments woven to traditional dimensions with standard tropical relaxed tailoring.'}
        </p>

        {customChart && customChart.rows.length > 0 ? (
          <div className="space-y-6 text-xs text-[#171717]">
            <div className="overflow-x-auto border border-[#E8DDC7] rounded-xl">
              <table className="w-full text-left bg-white rounded-xl">
                <thead className="bg-[#12372A] text-[#FAF8F1]">
                  <tr>
                    <th className="p-2.5">Size Tag</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Shoulder</th>
                    <th className="p-2.5">Length / Height</th>
                    <th className="p-2.5">Waist / Dimensions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDC7]">
                  {customChart.rows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-[#FAF8F1]/50' : ''}>
                      <td className="p-2.5 font-bold text-[#12372A]">{row.size}</td>
                      <td className="p-2.5">{row.chest || '—'}</td>
                      <td className="p-2.5">{row.shoulder || '—'}</td>
                      <td className="p-2.5">{row.length || '—'}</td>
                      <td className="p-2.5">{row.waist || row.dimensions || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-xs text-[#171717]">
            <div>
              <h4 className="font-serif font-bold text-base text-[#12372A] mb-2 uppercase tracking-wider">
                Men’s Linen &amp; Cotton Shirts
              </h4>
              <div className="overflow-x-auto border border-[#E8DDC7] rounded-xl">
                <table className="w-full text-left bg-white rounded-xl">
                  <thead className="bg-[#12372A] text-[#FAF8F1]">
                    <tr>
                      <th className="p-2.5">Size Tag</th>
                      <th className="p-2.5">Chest (Inches)</th>
                      <th className="p-2.5">Shoulder</th>
                      <th className="p-2.5">Shirt Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDC7]">
                    <tr>
                      <td className="p-2.5 font-bold">38 (S)</td>
                      <td className="p-2.5">38 - 40"</td>
                      <td className="p-2.5">17.5"</td>
                      <td className="p-2.5">29.5"</td>
                    </tr>
                    <tr className="bg-[#FAF8F1]/50">
                      <td className="p-2.5 font-bold">40 (M)</td>
                      <td className="p-2.5">40 - 42"</td>
                      <td className="p-2.5">18.0"</td>
                      <td className="p-2.5">30.0"</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">42 (L)</td>
                      <td className="p-2.5">42 - 44"</td>
                      <td className="p-2.5">18.5"</td>
                      <td className="p-2.5">30.5"</td>
                    </tr>
                    <tr className="bg-[#FAF8F1]/50">
                      <td className="p-2.5 font-bold">44 (XL)</td>
                      <td className="p-2.5">44 - 46"</td>
                      <td className="p-2.5">19.0"</td>
                      <td className="p-2.5">31.0"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-[#12372A] mb-2 uppercase tracking-wider">
                Traditional Mundu &amp; Set Dimensions
              </h4>
              <div className="border border-[#E8DDC7] bg-white p-4 space-y-2 rounded-xl">
                <p>
                  <strong className="text-[#12372A]">Double Kasavu Mundu:</strong> 4.0 Meters (155 Inches) total length x 50 Inches width. Fits waist sizes 28" to 44".
                </p>
                <p>
                  <strong className="text-[#12372A]">Single Mundu:</strong> 2.0 Meters (78 Inches) length x 50 Inches width.
                </p>
                <p>
                  <strong className="text-[#12372A]">Women’s Set Mundu:</strong> Lower Mundu 2.8 Meters x Upper Neriyathu 2.5 Meters. Fits XS to XXL drapes.
                </p>
                <p>
                  <strong className="text-[#12372A]">Kerala Kasavu Saree:</strong> 5.5 Meters saree length + 0.8 Meter unstitched blouse piece.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="mt-6 w-full bg-[#12372A] text-[#FAF8F1] py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors rounded-xl shadow-md"
        >
          Got It, Close Guide
        </button>
      </div>
    </div>
  );
};
