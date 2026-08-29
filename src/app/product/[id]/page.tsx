import type { Metadata } from 'next';
import { PRODUCTS } from '../../../data/products';
import { ProductDetail } from '../../../views/ProductDetail';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Handloom Saree & Ethnic Wear',
      description: 'Authentic Kerala Handloom artisanal piece.',
    };
  }

  const title = `${product.name} — ${product.subcategory}`;
  const description = `${product.subtitle || product.name} crafted in authentic ${product.fabric}. ₹${product.price.toLocaleString('en-IN')} with complimentary delivery.`;
  const primaryImage = (product.images?.[0]?.startsWith('http') || product.images?.[0]?.startsWith('data:') || product.images?.[0]?.startsWith('/'))
    ? product.images[0]
    : '/assets/banners/hero_kavish.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 1067,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.subtitle || product.name,
        image: product.images.filter((img) => img.startsWith('http')),
        brand: {
          '@type': 'Brand',
          name: product.brand || 'Kavish Kuthampully Atelier',
        },
        offers: {
          '@type': 'Offer',
          url: `https://kavish.xenotrix.in/product/${product.id}`,
          priceCurrency: 'INR',
          price: product.price,
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetail product={product} />
    </>
  );
}
