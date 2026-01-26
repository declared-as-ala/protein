import { Metadata } from 'next';
import { getPacks } from '@/services/api';
import { PacksPageClient } from './PacksPageClient';

export const metadata: Metadata = {
  title: 'Packs - Offres Spéciales | Sobitas',
  description: 'Économisez avec nos packs spéciaux conçus pour répondre à vos objectifs spécifiques',
  openGraph: {
    title: 'Packs - Offres Spéciales | Sobitas',
    description: 'Économisez avec nos packs spéciaux conçus pour répondre à vos objectifs spécifiques',
    type: 'website',
  },
};

async function getPacksData() {
  try {
    const packs = await getPacks();
    return { packs };
  } catch (error) {
    console.error('Error fetching packs:', error);
    return { packs: [] };
  }
}

export default async function PacksPage() {
  const { packs } = await getPacksData();
  return <PacksPageClient packs={packs} />;
}
