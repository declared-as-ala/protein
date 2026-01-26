'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { getStorageUrl } from '@/services/api';

const defaultSlides = [
  {
    id: 1,
    titre: "Protéines & Whey Premium",
    description: "Des protéines de qualité supérieure pour maximiser vos gains musculaires",
    lien: "/shop",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1920&h=800&fit=crop&q=80"
  },
  {
    id: 2,
    titre: "Prise de Masse & Performance",
    description: "Gagnez en masse musculaire avec nos gainers haute énergie",
    lien: "/shop",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=800&fit=crop&q=80"
  },
  {
    id: 3,
    titre: "Accessoires & Équipements",
    description: "Tout l'équipement nécessaire pour votre entraînement",
    lien: "/shop",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=800&fit=crop&q=80"
  }
];

interface HeroSliderProps {
  slides?: any[];
}

export function HeroSlider({ slides = defaultSlides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Modify slides to use photo.jpg as the first image
  const modifiedSlides = useMemo(() => {
    if (!slides || slides.length === 0) return defaultSlides;
    
    const slidesCopy = [...slides];
    // Always use /photo.jpg for the first slide
    if (slidesCopy[0]) {
      slidesCopy[0] = {
        ...slidesCopy[0],
        image: '/photo.avif',
        cover: null, // Clear cover to use image instead
      };
    }
    return slidesCopy;
  }, [slides]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || modifiedSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % modifiedSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isClient, modifiedSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % modifiedSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + modifiedSlides.length) % modifiedSlides.length);
  };

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <Image
            src={modifiedSlides[currentSlide]?.image || (modifiedSlides[currentSlide]?.cover ? getStorageUrl(modifiedSlides[currentSlide].cover) : defaultSlides[0].image)}
            alt={modifiedSlides[currentSlide]?.titre || modifiedSlides[currentSlide]?.title || 'Slide'}
            fill
            priority={currentSlide === 0}
            className={modifiedSlides[currentSlide]?.image === '/photo.avif' ? 'object-cover scale-[0.85]' : 'object-cover'}
            sizes="100vw"
            quality={85}
            onError={(e) => {
              // Fallback to default image if current slide image fails
              const target = e.target as HTMLImageElement;
              if (target.src !== defaultSlides[0].image) {
                target.src = defaultSlides[0].image;
              }
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl"
            >
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                {modifiedSlides[currentSlide]?.titre || modifiedSlides[currentSlide]?.title || 'Protéines & Whey Premium'}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl"
              >
                {modifiedSlides[currentSlide]?.description || 'Des protéines de qualité supérieure pour maximiser vos gains musculaires'}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 h-12 text-base"
                  asChild
                >
                  <Link href={modifiedSlides[currentSlide]?.lien || modifiedSlides[currentSlide]?.link || '/shop'}>
                    {modifiedSlides[currentSlide]?.cta || 'Découvrir'}
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-black px-8 h-12 text-base"
                  asChild
                >
                  <Link href="/shop">Voir Catégories</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {modifiedSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-12 bg-red-600' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
