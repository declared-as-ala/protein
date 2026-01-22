'use client';

import Image from 'next/image';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, Sparkles, Award, Shield, Truck, Gift } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 border-t border-gray-800">
      {/* Premium Trust Section */}
      <div className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, text: 'Paiement Sécurisé', color: 'text-green-400' },
              { icon: Truck, text: 'Livraison Rapide', color: 'text-blue-400' },
              { icon: Award, text: 'Produits Certifiés', color: 'text-yellow-400' },
              { icon: Gift, text: 'Garantie Qualité', color: 'text-purple-400' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center gap-3 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <div className={`${item.color} p-3 rounded-full bg-gray-900`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-center">{item.text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Contact Info & Social */}
          <div className="space-y-6">
            <div className="relative h-12 w-auto">
              <Image
                src="https://admin.protein.tn/storage/coordonnees/September2023/OXC3oL0LreP3RCsgR3k6.webp"
                alt="Protein.tn"
                width={150}
                height={48}
                className="h-12 w-auto"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              PROTEINE TUNISIE - SOBITAS votre distributeur officiel d'articles de sport et de compléments alimentaires en Tunisie.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3">
              <a href="tel:+21673200500" className="flex items-center gap-3 text-sm hover:text-red-500 transition-colors">
                <Phone className="h-5 w-5 text-red-500" />
                <span>+216 73 200 500 / +216 73 200 169</span>
              </a>
              <a href="mailto:contact@protein.tn" className="flex items-center gap-3 text-sm hover:text-red-500 transition-colors">
                <Mail className="h-5 w-5 text-red-500" />
                <span>contact@protein.tn</span>
              </a>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Rue Rihab, 4000 Sousse, Tunisie</span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-white mb-4">Suivez-nous</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                  aria-label="Youtube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-6">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-sm hover:text-red-500 transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#products" className="text-sm hover:text-red-500 transition-colors">
                  Nos produits
                </a>
              </li>
              <li>
                <a href="#packs" className="text-sm hover:text-red-500 transition-colors">
                  Packs
                </a>
              </li>
              <li>
                <a href="#blog" className="text-sm hover:text-red-500 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm hover:text-red-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services & Legal */}
          <div>
            <h3 className="font-semibold text-white mb-6">Services & Ventes</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-red-500 transition-colors">
                  Conditions générales
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-red-500 transition-colors">
                  Politique de remboursement
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-red-500 transition-colors">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-red-500 transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-red-500 transition-colors">
                  Qui sommes nous
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & App */}
          <div className="space-y-6">
            {/* Newsletter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <h3 className="font-bold text-white text-lg">Abonnez-vous</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Recevez les dernières offres exclusives et nouveautés
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Votre email..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl"
                />
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 font-bold rounded-xl shadow-lg">
                  S'abonner
                </Button>
                <p className="text-xs text-gray-500">
                  En vous abonnant, vous acceptez de recevoir nos offres par email
                </p>
              </div>
            </div>

            {/* App Download */}
            <div>
              <h3 className="font-semibold text-white mb-4">Télécharger notre application</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Disponible sur</div>
                      <div className="text-sm font-semibold text-white">Google Play</div>
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                      <span className="text-xl">🍎</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Télécharger sur</div>
                      <div className="text-sm font-semibold text-white">App Store</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <h3 className="font-semibold text-white mb-4">Géolocalisation</h3>
          <div className="rounded-xl overflow-hidden h-64 bg-gray-800">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3235.786044474428!2d10.608766315195954!3d35.82829698016563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8b4e8e8e8e8f%3A0x8e8e8e8e8e8e8e8e!2sSousse%2C%20Tunisia!5e0!3m2!1sen!2stn!4v1642509876543!5m2!1sen!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Protein.tn Location"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/50 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left text-sm text-gray-400">
              © {new Date().getFullYear()} <span className="text-red-500 font-bold">PROTEINE TUNISIE</span>. Tous droits réservés.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-red-500 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-red-500 transition-colors">CGV</a>
              <a href="#" className="hover:text-red-500 transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
