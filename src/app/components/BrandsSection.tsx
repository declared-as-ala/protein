'use client';

import { motion } from 'motion/react';

const brands = [
  { name: 'Optimum Nutrition', logo: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200&h=100&fit=crop' },
  { name: 'BioTech USA', logo: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&h=100&fit=crop' },
  { name: 'Kevin Levrone', logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&h=100&fit=crop' },
  { name: 'BPI Sports', logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=100&fit=crop' },
  { name: 'Eric Favre', logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=100&fit=crop' },
  { name: 'HX Nutrition', logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=100&fit=crop' }
];

export function BrandsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Marques Officielles
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Distributeur officiel des plus grandes marques internationales
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-[3/2] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="absolute inset-0 p-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-full h-12 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">{brand.name.split(' ')[0]}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{brand.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
