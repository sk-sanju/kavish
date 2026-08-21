import type { Review } from '../types';

export const REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'kav-w-01',
    productName: 'Kuthampully Royal 24k Gold Kasavu Saree',
    author: 'Sunitha Menon',
    location: 'Kochi, Kerala',
    rating: 5,
    title: 'Pure Royal Elegance',
    comment: 'The weave quality of this Kasavu saree is unmatched! Soft organic cotton with an exquisite gold zari that feels truly royal. Carrying the authentic GI Tag certificate gave complete confidence.',
    date: 'August 14, 2026',
    verifiedPurchase: true,
    verified: true,
    helpfulCount: 14,
    status: 'Approved'
  },
  {
    id: 'rev-02',
    productId: 'kav-m-01',
    productName: 'Devanga Signature Double Kasavu Mundu',
    author: 'Ramesh Nambiar',
    location: 'Bengaluru, India',
    rating: 5,
    title: 'Authentic Devanga Craftsmanship',
    comment: 'Subtle cream tone with crisp golden borders. Wore this for our family Vishu puja and received compliments from everyone.',
    date: 'August 18, 2026',
    verifiedPurchase: true,
    verified: true,
    helpfulCount: 9,
    status: 'Approved'
  }
];
