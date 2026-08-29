import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../index.css';
import { AppProviders } from '../components/providers/AppProviders';
import { AppShell } from '../components/layout/AppShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#12372A',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kavish.xenotrix.in'),
  title: {
    default: 'Kavish — Authentic Kerala Handlooms, Kasavu Sarees & Luxury Ethnic Wear',
    template: '%s | Kavish Kerala Handlooms',
  },
  description:
    "Shop authentic GI-certified Kuthampully handloom Kasavu sarees, men's double mundus, linen shirts, and kids festive wear. 500 years of royal Devanga weaving traditions with pan-India complimentary express delivery.",
  keywords: [
    'Kavish handlooms',
    'Kuthampully Kasavu sarees',
    'Kerala wedding sarees',
    'Onam sarees',
    'GI tag handlooms',
    'authentic mundu',
    'linen shirts Kerala',
    'Chendamangalam handlooms',
  ],
  authors: [{ name: 'Kavish Handlooms Pvt. Ltd.' }],
  creator: 'Kavish Handlooms',
  publisher: 'Kavish Handlooms',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kavish.xenotrix.in',
    title: 'Kavish — Authentic Kerala Handlooms & GI Tag Kasavu Weaves',
    description:
      '500 years of royal Devanga weaving traditions crafted in Kuthampully, Thrissur. Luxury Kasavu sarees, bridal edits, and pure linen shirts.',
    siteName: 'Kavish Kerala Handlooms',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Kavish Authentic Kerala Handlooms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kavish — Authentic Kerala Handlooms',
    description:
      'Authentic GI-certified Kuthampully handloom Kasavu sarees, double mundus, and luxury linen shirts.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80'],
  },
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data (Schema.org JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ClothingStore',
              name: 'Kavish Handlooms',
              legalName: 'Kavish Handlooms Pvt. Ltd.',
              url: 'https://kavish.xenotrix.in',
              logo: 'https://kavish.xenotrix.in/assets/logo.png',
              description: 'Authentic Kuthampully GI Tag Kasavu Sarees, Men’s Mundu & Luxury Kerala Handlooms',
              telephone: '+919539251789',
              email: 'kavishhandlooms@gmail.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Kuthampully Handloom Village, Near Thiruvilwamala',
                addressLocality: 'Thrissur',
                addressRegion: 'Kerala',
                postalCode: '680594',
                addressCountry: 'IN',
              },
              priceRange: '₹₹',
              paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
              currenciesAccepted: 'INR',
            }),
          }}
        />
      </head>
      <body className="bg-[#FAF8F1] text-[#171717] antialiased selection:bg-[#D4AF37] selection:text-white">
        {/* Razorpay Checkout SDK */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
