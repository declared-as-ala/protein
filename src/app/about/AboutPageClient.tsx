'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Check, MapPin, Truck, Shield, Award, Users } from 'lucide-react';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { getCoordinates } from '@/services/api';
import { motion } from 'motion/react';

export default function AboutPageClient() {
  const [coordinates, setCoordinates] = useState<any>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const data = await getCoordinates();
        setCoordinates(data);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    fetchCoordinates();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Qui sommes nous ?
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
              SOBITAS, votre distributeur officiel d'articles de sport et de compléments alimentaires en Tunisie
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Bienvenue chez <strong>SOBITAS (STE BITOUTA D'ARTICLE DE SPORT)</strong>, votre partenaire de confiance pour les protéines, créatine, pré-workouts, BCAA et matériel de musculation. Forts de <strong>12 ans d'expérience</strong>, nous offrons aux athlètes et passionnés de fitness en Tunisie des produits authentiques, certifiés et efficaces pour la prise de masse, la perte de poids et l'amélioration des performances sportives.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Notre mission – Votre satisfaction, notre motivation
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Chez SOBITAS, la satisfaction de nos clients est au cœur de notre engagement.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Service client exceptionnel
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Nous vous accompagnons dans le choix des compléments adaptés à vos objectifs.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Expérience d'achat agréable
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Commandez facilement vos produits depuis notre boutique en ligne avec livraison rapide partout en Tunisie.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Produits de qualité
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Protéines, créatine, BCAA, pré-workouts et matériel de musculation de marques reconnues et certifiées.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Notre expertise – 15 ans d'expérience en nutrition sportive
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Depuis 2010, SOBITAS est devenu un acteur incontournable en Tunisie dans la distribution de compléments alimentaires et articles de sport.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Award className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Produits certifiés
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tous nos compléments sont autorisés par le Ministère de la Santé, garantissant sécurité et fiabilité.
                </p>
              </div>

              <div className="text-center">
                <Users className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Conseils d'experts
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Notre équipe est formée pour vous guider et optimiser vos performances.
                </p>
              </div>

              <div className="text-center">
                <Shield className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Gammes complètes
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Protéines pour prise de masse, compléments pour perte de poids, pré-workouts, créatine et matériel de musculation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Nos produits phares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                'Protéines de prise de masse – Whey, isolate, mass gainer',
                'Compléments pour perte de poids – Brûleurs de graisse, CLA, L-carnitine',
                'Pré-workouts et acides aminés – Pour énergie et récupération',
                'Créatine et matériel de musculation – Pour force et performances',
              ].map((product, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <Check className="h-6 w-6 text-red-600 dark:text-red-400 mb-3" />
                  <p className="text-gray-700 dark:text-gray-300">{product}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Couverture nationale – Livraison rapide partout en Tunisie
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Que vous soyez à Sousse, Tunis, Sfax, Bizerte, Kairouan, Gafsa, Nabeul, Medenine, Kebili ou Djerba, notre service de livraison rapide et sécurisé vous permet de recevoir vos produits directement chez vous.
            </p>
          </div>
        </section>

        {/* Commitment */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Notre engagement – Qualité, sécurité et service client
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Chez SOBITAS, nous privilégions :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                'Qualité et authenticité – Produits officiels et certifiés',
                'Sécurité – Produits conformes aux normes du Ministère de la Santé',
                'Service client exceptionnel – Réactif, professionnel et toujours à votre écoute',
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <Check className="h-6 w-6 text-red-600 dark:text-red-400 mb-3" />
                  <p className="text-gray-700 dark:text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Pourquoi choisir SOBITAS ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                'Distributeur officiel avec produits authentiques',
                'Livraison rapide et gratuite dans toute la Tunisie',
                '12 ans d\'expérience en nutrition sportive',
                'Produits certifiés et sécurisés',
                'Service client expert et réactif',
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Notre localisation
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              {coordinates?.gelocalisation ? (
                <div 
                  className="h-96 w-full"
                  dangerouslySetInnerHTML={{ __html: coordinates.gelocalisation }}
                />
              ) : (
                <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Carte en cours de chargement...</p>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      SOBITAS - STE BITOUTA D'ARTICLE DE SPORT
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {coordinates?.adresse || 'Sousse, Tunisie'}
                    </p>
                    {coordinates?.phone && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        <strong>Téléphone:</strong> {coordinates.phone}
                      </p>
                    )}
                    {coordinates?.email && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <strong>Email:</strong> {coordinates.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Rejoignez la communauté SOBITAS
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Que vous soyez un athlète professionnel, passionné de fitness ou débutant, SOBITAS est votre partenaire pour atteindre vos objectifs. Commandez dès maintenant et découvrez pourquoi nous sommes le leader en nutrition sportive en Tunisie.
            </p>
            <p className="text-lg opacity-80">
              <strong>Protein.tn – SOBITAS :</strong> Votre expert en nutrition sportive depuis 2010. Basé à Sousse, livraison rapide et gratuite partout en Tunisie.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
