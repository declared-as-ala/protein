'use client';

import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Livraison Rapide',
    description: 'Livraison gratuite à partir de 300 DT dans toute la Tunisie'
  },
  {
    icon: Shield,
    title: 'Produits Authentiques',
    description: '100% originaux avec certificats d\'authenticité'
  },
  {
    icon: CreditCard,
    title: 'Paiement Sécurisé',
    description: 'Paiement à la livraison ou par carte bancaire'
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Notre équipe est disponible pour vous aider'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="features-heading" className="sr-only">Nos avantages</h2>
        {/* Fixed height to prevent CLS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 min-h-[200px] sm:min-h-[240px]">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center group h-full"
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-600 dark:group-hover:bg-red-600 transition-colors" aria-hidden="true">
                <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 dark:text-red-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
