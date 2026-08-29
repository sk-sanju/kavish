'use client';

import { Suspense } from 'react';
import { PaymentFailed } from '../../views/PaymentFailed';

export default function PaymentFailedRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F1]" />}>
      <PaymentFailed />
    </Suspense>
  );
}
