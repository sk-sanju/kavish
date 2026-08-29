'use client';

import { useRouter } from 'next/navigation';
import { CheckoutPage } from '../../views/CheckoutPage';

export default function CheckoutRoute() {
  const router = useRouter();
  return (
    <CheckoutPage
      onOrderSuccess={() => {}}
      onNavigateHome={() => router.push('/')}
    />
  );
}
