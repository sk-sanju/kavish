'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Shop } from '../../../../views/Shop';

export default function CollectionShopPage() {
  const params = useParams() as { collection?: string };
  return <Shop initialCollection={params.collection} />;
}
