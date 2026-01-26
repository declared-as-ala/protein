'use client';

import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ProductCard } from '@/app/components/ProductCard';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { motion } from 'motion/react';
import type { Product } from '@/types';

interface PacksPageClientProps {
  packs: Product[];
}

export function PacksPageClient({ packs }: PacksPageClientProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nos Packs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Économisez avec nos packs spéciaux conçus pour répondre à vos objectifs spécifiques
          </p>
        </motion.div>

        {packs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Aucun pack disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packs.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={pack} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
