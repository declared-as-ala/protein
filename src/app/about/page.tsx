import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'Qui sommes nous - À propos de SOBITAS',
  description: 'Découvrez SOBITAS, votre distributeur officiel d\'articles de sport et de compléments alimentaires en Tunisie depuis 2010',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
