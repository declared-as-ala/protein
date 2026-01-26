import { Metadata } from 'next';
import CalculatorsPageClient from './CalculatorsPageClient';

export const metadata: Metadata = {
  title: 'Calculateurs - Protéines & Calories | Sobitas',
  description: 'Calculez vos besoins en protéines et calories pour optimiser vos performances',
};

export default function CalculatorsPage() {
  return <CalculatorsPageClient />;
}
