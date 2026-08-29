'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Shop } from '../../../../views/Shop';

export default function CategoryShopPage() {
  const params = useParams() as { category?: string };
  return <Shop initialCategory={params.category} />;
}
