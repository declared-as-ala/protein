import { Metadata } from 'next';
import BrandsPageClient from './BrandsPageClient';

export const metadata: Metadata = {
  title: 'Nos Marques - Sobitas',
  description: 'Découvrez toutes nos marques partenaires de compléments alimentaires et nutrition sportive.',
  openGraph: {
    title: 'Nos Marques - Sobitas',
    description: 'Découvrez toutes nos marques partenaires de compléments alimentaires et nutrition sportive.',
    url: 'https://sobitas.tn/brands',
    siteName: 'Sobitas',
    images: [
      {
        url: 'https://sobitas.tn/assets/img/logo/logo.webp',
        width: 1200,
        height: 630,
        alt: 'Sobitas - Nos Marques',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nos Marques - Sobitas',
    description: 'Découvrez toutes nos marques partenaires de compléments alimentaires et nutrition sportive.',
    images: ['https://sobitas.tn/assets/img/logo/logo.webp'],
  },
  alternates: {
    canonical: 'https://sobitas.tn/brands',
  },
};

export default function BrandsPage() {
  return <BrandsPageClient />;
}
