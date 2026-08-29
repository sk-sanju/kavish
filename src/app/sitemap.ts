import type { MetadataRoute } from 'next';
import { PRODUCTS } from '../data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kavish.xenotrix.in';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/shop',
    '/shop/category/women',
    '/shop/category/men',
    '/shop/category/kids',
    '/shop/collection/bridal-edit',
    '/shop/collection/festive-edit',
    '/heritage',
    '/contact',
    '/faq',
    '/track-order',
    '/privacy-policy',
    '/terms-and-conditions',
    '/return-refund-policy',
    '/shipping-policy',
    '/payment-information',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/shop') ? 0.9 : 0.7,
  }));

  // Dynamic Product routes
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
