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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Get the related target (element mouse is moving to)
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    // Check if mouse is moving to dropdown or trigger
    const isMovingToDropdown = dropdownRef.current?.contains(relatedTarget);
    const isMovingToTrigger = triggerRef.current?.contains(relatedTarget);
    
    // Only close if not moving to dropdown or trigger
    if (!isMovingToDropdown && !isMovingToTrigger) {
      // Add a small delay to allow smooth transition
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const dropdownContent = isOpen && mounted ? (
    <div
      ref={dropdownRef}
      className="fixed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-[100] p-4 w-[800px] max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        transform: 'translateX(-50%)',
        maxWidth: 'min(800px, calc(100vw - 2rem))',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid grid-cols-3 gap-6">
        {menuCategories.map((category, index) => (
          <div key={index} className="space-y-2 min-w-0">
            <h3 className="font-semibold text-xs text-red-600 dark:text-red-500 mb-2 leading-tight">
              {category.title}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(item)}`}
                    className="text-xs text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors block py-0.5 break-words"
                    onMouseDown={(e) => {
                      // Prevent blur from closing menu when clicking
                      e.preventDefault();
                    }}
                    onClick={() => {
                      // Close menu after navigation
                      setTimeout(() => setIsOpen(false), 100);
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/shop"
          className="text-xs font-semibold text-red-600 dark:text-red-500 hover:underline"
          onMouseDown={(e) => {
            // Prevent blur from closing menu when clicking
            e.preventDefault();
          }}
          onClick={() => {
            // Close menu after navigation
            setTimeout(() => setIsOpen(false), 100);
          }}
        >
          Voir tous les produits →
        </Link>
      </div>
    </div>
  ) : null;

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsOpen(true)}
      onBlur={(e) => {
        // Don't close on blur when clicking links inside dropdown
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (dropdownRef.current?.contains(relatedTarget)) {
          return;
        }
        // Only close if focus is moving outside both trigger and dropdown
        if (!e.currentTarget.contains(relatedTarget)) {
          // Add delay to allow click events to process
          closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
          }, 200);
        }
      }}
    >
      <Link
        href="/shop"
        className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-1 whitespace-nowrap"
      >
        NOS PRODUITS
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      {mounted && typeof window !== 'undefined' && dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}
