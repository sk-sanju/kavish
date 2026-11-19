'use client';

import { Suspense } from 'react';
import { OrderSuccess } from '../../views/OrderSuccess';

export default function OrderSuccessRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F5EF]" />}>
      <OrderSuccess />
    </Suspense>
  );
}
