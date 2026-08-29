'use client';

import { useRouter } from 'next/navigation';
import { WishlistPage } from '../../views/WishlistPage';
import type { Product } from '../../types';

export default function WishlistRoute() {
  const router = useRouter();

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <WishlistPage
      onSelectProduct={handleSelectProduct}
      onNavigateHome={() => router.push('/')}
    />
  );
}
