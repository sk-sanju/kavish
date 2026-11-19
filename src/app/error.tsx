'use client';

import React, { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-12 border border-[#E5E7EB] rounded-3xl shadow-xl max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-xs">
          <RefreshCw className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-red-600 tracking-widest block">
            Unexpected Atelier Notice
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
            Something Needs Weaving
          </h1>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            An unexpected error occurred while loading this page. Please refresh or return to the main showcase.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 bg-[#111111] text-[#FFFFFF] hover:bg-[#C5A15A] hover:text-[#111111] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#C5A15A] shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#C5A15A]" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 bg-white text-[#111111] border border-[#111111] hover:bg-[#FFFFFF] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
