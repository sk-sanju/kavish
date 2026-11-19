'use client';

import { Suspense } from 'react';
import { PaymentPending } from '../../views/PaymentPending';

export default function PaymentPendingRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFFFF]" />}>
      <PaymentPending />
    </Suspense>
  );
}
