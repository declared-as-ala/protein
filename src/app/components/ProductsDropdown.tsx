'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isOpen]);

  const dropdownContent = isOpen && mounted ? (
    <div
      className="fixed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-[100] p-6 w-[1200px] max-w-[calc(100vw-2rem)]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        transform: 'translateX(-50%)',
        maxWidth: 'min(1200px, calc(100vw - 2rem))',
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-6">
        {menuCategories.map((category, index) => (
          <div key={index} className="space-y-2 min-w-0">
            <h3 className="font-semibold text-sm text-red-600 dark:text-red-500 mb-3 leading-tight">
              {category.title}
            </h3>
            <ul className="space-y-1.5">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(item)}`}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors block py-1 break-words"
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
          onClick={() => setIsOpen(false)}
        >
          Voir tous les produits →
        </Link>
      </div>
    </div>
  ) : null;

  return (
    <div
      ref={triggerRef}
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

      {mounted && typeof window !== 'undefined' && dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}
