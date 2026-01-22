'use client';

import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { ProteinCalculator } from '@/app/components/ProteinCalculator';
import { CalorieCalculator } from '@/app/components/CalorieCalculator';
import { motion } from 'motion/react';
import { Calculator, Sparkles } from 'lucide-react';

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Calculateurs Nutritionnels
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Calculez vos besoins en protéines et calories pour optimiser vos résultats
          </p>
        </motion.div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Protein Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProteinCalculator />
          </motion.div>

          {/* Calorie Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CalorieCalculator />
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-4">
            <Sparkles className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Comment utiliser ces calculateurs ?
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                  <span><strong>Calculateur de Protéines :</strong> Entrez votre poids, objectif et niveau d'activité pour connaître vos besoins quotidiens en protéines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span><strong>Calculateur de Calories :</strong> Calculez votre métabolisme de base (BMR) et vos besoins caloriques totaux (TDEE) selon vos objectifs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                  <span>Ces résultats sont des estimations. Consultez un professionnel de santé pour des conseils personnalisés.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
