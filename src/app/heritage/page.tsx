'use client';

import { useRouter } from 'next/navigation';
import { Heritage } from '../../views/Heritage';

export default function HeritageRoute() {
  const router = useRouter();

  const handleNavigate = (view: string, category?: string, collection?: string) => {
    if (view === 'shop' && category) router.push(`/shop/category/${category}`);
    else if (view === 'shop' && collection) router.push(`/shop/collection/${collection}`);
    else if (view === 'shop') router.push('/shop');
    else router.push(`/${view}`);
  };

  return <Heritage onNavigate={handleNavigate} />;
}
