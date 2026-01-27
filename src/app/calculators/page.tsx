import { Metadata } from 'next';
import CalculatorsPageClient from './CalculatorsPageClient';

export const metadata: Metadata = {
  title: 'Calculateur Protéines & Calories | SOBITAS Tunisie',
  description: 'Calculez vos besoins en protéines et calories. Outils gratuits pour adapter votre nutrition en Tunisie.',
};

export default function CalculatorsPage() {
  return <CalculatorsPageClient />;
}
