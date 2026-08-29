'use client';

import { Suspense } from 'react';
import { OrderSuccess } from '../../views/OrderSuccess';

export default function OrderSuccessRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F1]" />}>
      <OrderSuccess />
    </Suspense>
  );
}
