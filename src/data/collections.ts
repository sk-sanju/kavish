export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag?: string;
  slug?: string;
  itemCount?: number;
  featured?: boolean;
}

export const COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-kasavu',
    title: 'Kasavu Masterpieces',
    subtitle: 'Royal Kochi Court Weaves',
    description: 'Authentic GI Tagged Kuthampully Kasavu sarees with 24k electroplated tarnish-free gold zari.',
    image: '/assets/categories/women_kasavu.jpg',
    tag: 'GI Tag Certified',
    slug: 'kasavu-masterpieces',
    itemCount: 18,
    featured: true
  },
  {
    id: 'col-ceremonial',
    title: 'Ceremonial Classics',
    subtitle: 'Traditional Double Mundu & Dhoti',
    description: 'Fine unbleached organic cotton single and double mundus crafted on heritage pit looms.',
    image: '/assets/banners/hero_festive.jpg',
    tag: 'Heritage Weave',
    slug: 'ceremonial-classics',
    itemCount: 12,
    featured: true
  },
  {
    id: 'col-linen',
    title: 'European Flax Linen',
    subtitle: 'Contemporary Heritage Apparel',
    description: '100% pure organic flax linen shirts and drapes tailored for understated modern luxury.',
    image: '/assets/banners/hero_men.jpg',
    tag: '100% Organic Linen',
    slug: 'flax-linen',
    itemCount: 15,
    featured: true
  }
];
