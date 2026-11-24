'use client';

import { useRouter } from 'next/navigation';
import { AboutPage } from '../../views/AboutPage';

export default function AboutRoute() {
  const router = useRouter();

  const handleNavigate = (view: string, category?: string, collection?: string) => {
    if (view === 'shop' && category) router.push(`/shop/category/${category}`);
    else if (view === 'shop' && collection) router.push(`/shop/collection/${collection}`);
    else if (view === 'shop') router.push('/shop');
    else router.push(`/${view}`);
  };

  return <AboutPage onNavigate={handleNavigate} />;
}
