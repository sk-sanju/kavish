'use client';

import { Suspense } from 'react';
import { PaymentFailed } from '../../views/PaymentFailed';

export default function PaymentFailedRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F5EF]" />}>
      <PaymentFailed />
    </Suspense>
  );
}
