'use client';

import { useRouter } from 'next/navigation';
import { CartPage } from '../../views/CartPage';

export default function CartRoute() {
  const router = useRouter();
  return <CartPage onProceedToCheckout={() => router.push('/checkout')} />;
}
