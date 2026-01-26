'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

// Static hero slides using all local images for optimal performance
const heroSlides = [
  {
    id: 1,
    titre: "Protéines Premium",
    description: "Commencez votre journée avec l'énergie parfaite : protéines premium de qualité pour booster vos performances et atteindre vos objectifs",
    lien: "/shop",
    image: "/hero/protein_and_coffee_1db3f8a9-b5d6-4e73-920e-eab0012ecb83.webp",
  },
  {
    id: 2,
    titre: "Optimum Nutrition",
    description: "Découvrez la gamme Optimum Nutrition, leader mondial en compléments alimentaires",
    lien: "/shop",
    image: "/hero/GET_YOKD_OPTIMUM_NUTRITION_BANNER_DESKTOP-min.webp",
  },
  {
    id: 3,
    titre: "Protéines Premium",
    description: "Notre sélection exclusive de protéines de qualité supérieure pour vos objectifs",
    lien: "/shop",
    image: "/hero/87c08beaae1ef66964cca248d39dbe63.jpg",
  },
  {
    id: 4,
    titre: "Compléments Alimentaires",
    description: "Toute notre gamme de compléments pour votre performance et votre bien-être",
    lien: "/shop",
    image: "/hero/hero 2.png",
  },
  {
    id: 5,
    titre: "Performance & Résultats",
    description: "Optimisez vos performances avec nos produits premium et certifiés",
    lien: "/shop",
    image: "/hero/hero 4.webp",
  },
  {
    id: 6,
    titre: "Excellence & Innovation",
    description: "Découvrez les dernières innovations en compléments alimentaires",
    lien: "/shop",
    image: "/hero/hero 5.png",
  },
  {
    id: 7,
    titre: "Gamme Complète",
    description: "Explorez notre collection complète de produits pour tous vos besoins fitness",
    lien: "/shop",
    image: "/hero/IMG_3293.webp",
  },
];

interface HeroSliderProps {
  slides?: any[]; // Keep for backward compatibility but won't be used
}

// Optimized slide image component - optimized for production performance
const SlideImage = memo(({ 
  src, 
  alt, 
  isFirst, 
  className 
}: { 
  src: string; 
  alt: string; 
  isFirst: boolean;
  className?: string;
}) => {
  if (!isFirst) {
    // Lazy load non-first slides for faster initial load
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className || 'object-contain'}
        sizes="100vw"
        quality={85}
        loading="lazy"
      />
    );
  }
  
  // First slide - critical for LCP, highest priority
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      fetchPriority="high"
      className={className || 'object-contain'}
      sizes="100vw"
      quality={90}
    />
  );
});
SlideImage.displayName = 'SlideImage';

export const HeroSlider = memo(function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use static hero slides (ignore API slides for performance)
  const slidesToUse = heroSlides;

  useEffect(() => {
    if (slidesToUse.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToUse.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slidesToUse.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesToUse.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesToUse.length) % slidesToUse.length);
  };

  const currentSlideData = slidesToUse[currentSlide];
  const isFirstSlide = currentSlide === 0;
  // Photos 4 and 7 (indices 3, 6) should be wider
  const isWideSlide = currentSlide === 3 || currentSlide === 6;
  // Photo 1 (index 0) - minimized width
  const isPhoto1 = currentSlide === 0;
  // Photo 3 (index 2) uses minimal scale
  const isPhoto3 = currentSlide === 2;

  return (
    <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gray-900" aria-label="Hero carousel">
      <div 
        key={currentSlide}
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
      >
        {/* Background Image - Optimized for fast loading, showing full image */}
        <SlideImage
          src={currentSlideData.image}
          alt={currentSlideData.titre}
          isFirst={isFirstSlide}
          className={
            isPhoto1 
              ? "object-contain" // Photo 1: normal size, no scale
              : isPhoto3 
              ? "object-contain scale-105 sm:scale-110" // Photo 3: minimal scale
              : isWideSlide 
              ? "object-contain scale-110 sm:scale-125 md:scale-[1.4] lg:scale-[1.5]" // Photos 4 and 7: wider
              : "object-contain" // Other photos: normal
          }
        />
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" aria-hidden="true" />

        {/* Content - Responsive and centered */}
        <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl lg:max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
              {currentSlideData.titre}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 max-w-xl drop-shadow-md">
              {currentSlideData.description}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base min-h-[44px] min-w-[120px] shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href={currentSlideData.lien}>
                  Découvrir
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base min-h-[44px] min-w-[160px] backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/shop">Voir Catégories</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Responsive and accessible */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center z-10 shadow-lg hover:shadow-xl"
        aria-label="Slide précédent"
        type="button"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center z-10 shadow-lg hover:shadow-xl"
        aria-label="Slide suivant"
        type="button"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </button>

      {/* Indicators - Responsive */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10" role="tablist" aria-label="Indicateurs de diapositives">
        {slidesToUse.map((slide, index: number) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Aller à la diapositive ${index + 1}`}
            className={`h-2.5 sm:h-3 rounded-full transition-all min-w-[10px] sm:min-w-[12px] ${
              index === currentSlide 
                ? 'w-10 sm:w-12 bg-red-600 shadow-lg' 
                : 'w-2.5 sm:w-3 bg-white/50 hover:bg-white/75'
            }`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
});
