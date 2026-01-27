'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

// Static hero slides using images from public/hero (hero 1 is first in carousel)
const heroSlides = [
  {
    id: 1,
    titre: "Protéines Premium",
    description: "Commencez votre journée avec l'énergie parfaite : protéines premium de qualité pour booster vos performances et atteindre vos objectifs",
    lien: "/shop",
    image: "/hero/hero1.png",
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
    image: "/hero/hero 6.jpg",
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
    // Lazy load non-first slides for faster initial load (quality 75 for mobile PageSpeed)
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className || 'object-cover'}
        sizes="100vw"
        quality={75}
        loading="lazy"
      />
    );
  }
  
  // First slide - critical for LCP; quality 75 saves ~9 KiB and improves LCP on mobile
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      fetchPriority="high"
      className={className || 'object-cover'}
      sizes="(max-width: 768px) 100vw, 100vw"
      quality={75}
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

  // Swipe gesture handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  return (
    <section 
      className="relative w-full overflow-hidden bg-gray-900" 
      style={{ 
        aspectRatio: '12/5',
        height: 'clamp(55vh, 60vh, 65vh)' // Mobile: 55-65vh max
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Hero carousel"
    >
      <div 
        key={currentSlide}
        className="absolute inset-0 transition-opacity duration-300 ease-in-out"
        style={{ willChange: 'opacity' }}
      >
        {/* Background Image - Fills container edge to edge with proper aspect ratio */}
        <SlideImage
          src={currentSlideData.image}
          alt={currentSlideData.titre}
          isFirst={isFirstSlide}
          className="object-cover"
        />
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" aria-hidden="true" />

        {/* Content - Responsive and centered */}
        <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl lg:max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-lg">
              {currentSlideData.titre}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 mb-4 sm:mb-6 md:mb-8 max-w-xl drop-shadow-md line-clamp-2 sm:line-clamp-none">
              {currentSlideData.description}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 md:px-8 h-10 sm:h-12 text-xs sm:text-sm md:text-base min-h-[44px] sm:min-h-[48px] min-w-[100px] sm:min-w-[120px] shadow-lg hover:shadow-xl transition-colors"
                asChild
              >
                <Link href={currentSlideData.lien} aria-label="Découvrir nos produits">
                  Découvrir
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-4 sm:px-6 md:px-8 h-10 sm:h-12 text-xs sm:text-sm md:text-base min-h-[44px] sm:min-h-[48px] min-w-[140px] sm:min-w-[160px] backdrop-blur-sm shadow-lg hover:shadow-xl transition-colors"
                asChild
              >
                <Link href="/shop" aria-label="Voir toutes les catégories de produits">Voir Catégories</Link>
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

      {/* Indicators - Much smaller on mobile, subtle opacity */}
      <div className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-3 z-10 items-center" role="tablist" aria-label="Indicateurs de diapositives">
        {slidesToUse.map((slide, index: number) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Aller à la diapositive ${index + 1}`}
            className={`rounded-full transition-all flex items-center justify-center ${
              index === currentSlide 
                ? 'h-2 w-8 sm:h-3 sm:w-12 bg-red-600 shadow-lg opacity-100' 
                : 'h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white/30 hover:bg-white/50 opacity-60'
            }`}
            type="button"
          >
            <span className="sr-only">Diapositive {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
});
