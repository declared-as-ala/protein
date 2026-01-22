'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Flame, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const entryPaths = [
  {
    id: 'build-muscle',
    title: 'Prise de Masse',
    description: 'Gagnez du muscle rapidement avec nos gainers et protéines premium',
    icon: TrendingUp,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80',
    link: '/shop?category=Prise de Masse',
    color: 'red',
  },
  {
    id: 'lose-fat',
    title: 'Perte de Poids',
    description: 'Brûlez les graisses efficacement avec nos compléments spécialisés',
    icon: Flame,
    gradient: 'from-orange-500 to-yellow-500',
    bgGradient: 'from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80',
    link: '/shop?category=Perte de Poids',
    color: 'orange',
  },
  {
    id: 'improve-performance',
    title: 'Performance',
    description: 'Optimisez vos performances avec nos pré-workouts et boosters',
    icon: Zap,
    gradient: 'from-blue-500 to-purple-500',
    bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop&q=80',
    link: '/shop?category=Compléments d\'Entraînement',
    color: 'blue',
  },
];

export function SmartEntryPaths() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Trouvez votre parcours
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choisissez votre objectif et découvrez les produits parfaitement adaptés à vos besoins
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {entryPaths.map((path, index) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <Link href={path.link}>
                  <div className={`relative h-full bg-gradient-to-br ${path.bgGradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800`}>
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                      <Image
                        src={path.image}
                        alt={path.title}
                        fill
                        className="object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    {/* Content */}
                    <div className="relative p-8 h-full flex flex-col">
                      {/* Icon */}
                      <div className={`mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${path.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {path.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
                        {path.description}
                      </p>

                      {/* CTA */}
                      <Button
                        className={`bg-gradient-to-r ${path.gradient} hover:opacity-90 text-white w-full group-hover:translate-x-2 transition-transform`}
                        size="lg"
                      >
                        Découvrir
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
