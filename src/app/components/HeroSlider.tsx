'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
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

// Optimized slide image component - no lazy loading for first slide
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
    // Lazy load non-first slides
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
  
  // First slide - critical for LCP
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      fetchPriority="high"
      className={className || 'object-cover'}
      sizes="100vw"
      quality={90}
    />
  );
});
SlideImage.displayName = 'SlideImage';

export const HeroSlider = memo(function HeroSlider({ slides = defaultSlides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modify slides to use photo.avif as the first image
  const modifiedSlides = useMemo(() => {
    if (!slides || slides.length === 0) return defaultSlides;
    
    const slidesCopy = [...slides];
    // Always use /photo.avif for the first slide
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
    if (modifiedSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % modifiedSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [modifiedSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % modifiedSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + modifiedSlides.length) % modifiedSlides.length);
  };

  const currentSlideData = modifiedSlides[currentSlide];
  const imageSrc = currentSlideData?.image || (currentSlideData?.cover ? getStorageUrl(currentSlideData.cover) : defaultSlides[0].image);
  const isFirstSlide = currentSlide === 0;

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-900" aria-label="Hero carousel">
      <div 
        key={currentSlide}
        className="absolute inset-0"
      >
        {/* Background Image - Always render first slide immediately */}
        <SlideImage
          src={imageSrc}
          alt={currentSlideData?.titre || currentSlideData?.title || 'Slide'}
          isFirst={isFirstSlide}
          className={currentSlideData?.image === '/photo.avif' ? 'object-cover scale-[0.85]' : 'object-cover'}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" aria-hidden="true" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {currentSlideData?.titre || currentSlideData?.title || 'Protéines & Whey Premium'}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
              {currentSlideData?.description || 'Des protéines de qualité supérieure pour maximiser vos gains musculaires'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 h-12 text-base min-h-[48px] min-w-[120px]"
                asChild
              >
                <Link href={currentSlideData?.lien || currentSlideData?.link || '/shop'}>
                  {currentSlideData?.cta || 'Découvrir'}
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black px-8 h-12 text-base min-h-[48px] min-w-[160px]"
                asChild
              >
                <Link href="/shop">Voir Catégories</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all min-h-[48px] min-w-[48px] flex items-center justify-center"
        aria-label="Slide précédent"
        type="button"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all min-h-[48px] min-w-[48px] flex items-center justify-center"
        aria-label="Slide suivant"
        type="button"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3" role="tablist" aria-label="Indicateurs de diapositives">
        {modifiedSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Aller à la diapositive ${index + 1}`}
            className={`h-3 rounded-full transition-all min-w-[12px] ${
              index === currentSlide ? 'w-12 bg-red-600' : 'w-3 bg-white/50 hover:bg-white/75'
            }`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
});
