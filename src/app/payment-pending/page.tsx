'use client';

import { Suspense } from 'react';
import { PaymentPending } from '../../views/PaymentPending';

export default function PaymentPendingRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F1]" />}>
      <PaymentPending />
    </Suspense>
  );
}
