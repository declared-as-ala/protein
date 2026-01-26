import { Metadata } from 'next';
import { getAccueil, getSlides } from '@/services/api';
import { getStorageUrl } from '@/services/api';
import { HomePageClient } from './components/HomePageClient';
import type { AccueilData } from '@/types';

export const metadata: Metadata = {
  title: 'Sobitas - Protéine Tunisie | Boutique de Compléments Alimentaires',
  description: 'Découvrez notre boutique de protéines en Tunisie ! Nous proposons une large gamme de produits protéines à des prix compétitifs. Whey, créatine, gainer, BCAA et plus.',
  keywords: 'proteine tunisie, protein tunisie, whey protein, whey proteine tunisie, protéine whey tunisie, créatine monohydrate tunisie, gainer tunisie',
  openGraph: {
    title: 'Sobitas - Protéine Tunisie',
    description: 'Découvrez notre boutique de protéines en Tunisie : whey, créatine, gainer, BCAA et plus !',
    images: ['/assets/img/logo/logo.webp'],
    url: 'https://sobitas.tn',
    type: 'website',
  },
};

// Preload critical hero image for LCP optimization
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  };
}

async function getHomeData(): Promise<{ accueil: AccueilData; slides: any[] }> {
  try {
    const [accueil, slides] = await Promise.all([
      getAccueil(),
      getSlides(),
    ]);
    return { accueil, slides };
  } catch (error) {
    console.error('Error fetching home data:', error);
    // Return empty data structure on error
    return {
      accueil: {
        categories: [],
        last_articles: [],
        ventes_flash: [],
        new_product: [],
        packs: [],
        best_sellers: [],
      },
      slides: [],
    };
  }
}

export default async function Home() {
  const { accueil, slides } = await getHomeData();

  return <HomePageClient accueil={accueil} slides={slides} />;
}
