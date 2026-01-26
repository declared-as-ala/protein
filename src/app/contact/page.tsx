import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contactez-nous - Sobitas',
  description: 'Contactez notre équipe pour toute question ou demande',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
