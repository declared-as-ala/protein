'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Sparkles, Award, Shield, Truck, Gift, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { motion } from 'motion/react';
import { subscribeNewsletter } from '@/services/api';
import { toast } from 'sonner';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Lazy load Google Maps only when footer is visible (Intersection Observer)
  useEffect(() => {
    if (!mapRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before footer is visible
    );
    
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setIsSubscribing(true);
    try {
      const result = await subscribeNewsletter({ email: newsletterEmail });
      if ('success' in result) {
        toast.success(result.success || 'Inscription réussie !');
        setNewsletterEmail('');
      } else if ('error' in result) {
        toast.error(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setIsSubscribing(false);
    }
  };

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
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              PROTEINE TUNISIE - SOBITAS votre distributeur officiel d'articles de sport et de compléments alimentaires en Tunisie.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3">
              <a href="tel:+21673200500" className="flex items-center gap-3 text-sm hover:text-red-500 transition-colors" aria-label="Appeler au +216 73 200 500">
                <Phone className="h-5 w-5 text-red-500" aria-hidden="true" />
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
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/sobitass/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-[#1877F2] flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/sobitass/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/TunisieProteine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-[#1DA1F2] flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://wa.me/21627612500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-[#25D366] flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@sobitassousse?_t=8fxdJ9IKeur&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-black flex items-center justify-center transition-colors group"
                  aria-label="TikTok"
                >
                  <svg className="h-5 w-5 text-white group-hover:text-[#FF0050]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
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
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Votre email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl"
                  required
                />
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 font-bold rounded-xl shadow-lg"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    'S\'abonner'
                  )}
                </Button>
              </form>
              <p className="text-xs text-gray-500">
                En vous abonnant, vous acceptez de recevoir nos offres par email
              </p>
            </div>

            {/* App Download */}
            <div>
              <h3 className="font-semibold text-white mb-4">Télécharger notre application</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Google Play Badge */}
                <a
                  href="#"
                  className="block w-full hover:scale-[1.02] transition-all duration-200 rounded-lg overflow-hidden"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative w-full aspect-[3/1]">
                    <Image
                      src="/googleplay.png"
                      alt="Google Play"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover rounded-lg"
                      priority
                    />
                  </div>
                </a>

                {/* App Store Badge */}
                <a
                  href="#"
                  className="block w-full hover:scale-[1.02] transition-all duration-200 rounded-lg overflow-hidden"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative w-full aspect-[3/1]">
                    <Image
                      src="/app-store.png"
                      alt="App Store"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover rounded-lg"
                      priority
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Deferred loading for performance */}
        <div className="mt-12" ref={mapRef}>
          <h3 className="font-semibold text-white mb-4">Géolocalisation</h3>
          <div className="rounded-xl overflow-hidden h-64 bg-gray-800">
            {shouldLoadMap ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3235.786044474428!2d10.608766315195954!3d35.82829698016563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8b4e8e8e8e8f%3A0x8e8e8e8e8e8e8e8e!2sSousse%2C%20Tunisia!5e0!3m2!1sen!2stn!4v1642509876543!5m2!1sen!2stn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Protein.tn Location"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <MapPin className="h-12 w-12" aria-hidden="true" />
                <span className="sr-only">Carte de localisation</span>
              </div>
            )}
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
