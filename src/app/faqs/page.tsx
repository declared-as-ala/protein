import { Metadata } from 'next';
import { getFAQs } from '@/services/api';
import { FAQsPageClient } from './FAQsPageClient';

export const metadata: Metadata = {
  title: 'FAQ - Questions Fréquentes | Sobitas',
  description: 'Trouvez les réponses à vos questions sur nos produits, commandes et livraisons',
};

async function getFAQsData() {
  try {
    const faqs = await getFAQs();
    return { faqs };
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return { faqs: [] };
  }
}

export default async function FAQsPage() {
  const { faqs } = await getFAQsData();
  return <FAQsPageClient faqs={faqs} />;
}
