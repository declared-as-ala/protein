'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const menuCategories = [
  {
    title: 'COMPLÉMENTS ALIMENTAIRES',
    items: [
      'Acides Aminés',
      'Bcaa',
      'Citrulline',
      'Creatine',
      'EAA',
      'Glutamine',
      'HMB',
      'L-Arginine',
      'Mineraux',
      'Omega 3',
      'Boosters Hormonaux',
      'Vitamines',
      'ZMA',
      'Beta Alanine',
      'Ashwagandha',
      'Tribulus',
      'Collagene',
      'Zinc',
      'Magnésium',
    ],
  },
  {
    title: 'PERTE DE POIDS',
    items: ['CLA', 'Fat Burner', 'L-Carnitine', 'Brûleurs De Graisse'],
  },
  {
    title: 'PRISE DE MASSE',
    items: [
      'Gainers Haute Énergie',
      'Gainers Riches En Protéines',
      'Protéines',
      'Carbohydrates',
    ],
  },
  {
    title: 'PROTÉINES',
    items: [
      'Protéine Whey',
      'Isolat De Whey',
      'Protéine De Caséine',
      'Protéines Complètes',
      'Protéine De Bœuf',
      'Protéines Pour Cheveux',
      'Whey Hydrolysée',
    ],
  },
  {
    title: 'COMPLEMENTS D\'ENTRAINEMENT',
    items: [
      'Pré-Workout',
      'Pendant L\'entraînement',
      'Récupération Après Entraînement',
    ],
  },
  {
    title: 'ÉQUIPEMENTS ET ACCESSOIRES SPORTIFS',
    items: [
      'Bandages De Soutien Musculaire',
      'Ceinture De Musculation',
      'Gants De Musculation Et Fitness',
      'Shakers Et Bouteilles Sportives',
      'T-Shirts De Sport',
      'Matériel De Musculation',
      'Équipement Cardio Fitness',
    ],
  },
];

export function ProductsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(e) => {
        // Only close if focus is moving outside the dropdown
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOpen(false);
        }
      }}
    >
      <Link
        href="/shop"
        className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-1"
      >
        NOS PRODUITS
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[900px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 p-6">
          <div className="grid grid-cols-3 gap-6">
            {menuCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-sm text-red-600 dark:text-red-500 mb-3">
                  {category.title}
                </h3>
                <ul className="space-y-1.5">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(item)}`}
                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors block py-1"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/shop"
              className="text-sm font-semibold text-red-600 dark:text-red-500 hover:underline"
            >
              Voir tous les produits →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
