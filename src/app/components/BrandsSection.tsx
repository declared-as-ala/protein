'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { getAllBrands, getStorageUrl } from '@/services/api';
import type { Brand } from '@/types';
import Link from 'next/link';

// Brand Card Component
function BrandCard({ brand, index }: { brand: Brand; index: number }) {
  const [imageError, setImageError] = useState(false);
  const logoUrl = brand.logo ? getStorageUrl(brand.logo) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 group"
    >
      <Link
        href={`/shop?brand=${brand.id}`}
        className="block bg-white dark:bg-gray-800 rounded-xl p-6 h-32 w-48 md:w-56 flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:shadow-xl transition-all duration-300"
      >
        {logoUrl && !imageError ? (
          <div className="relative w-full h-full">
            <Image
              src={logoUrl}
              alt={brand.designation_fr || brand.alt_cover || 'Brand logo'}
              fill
              className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 192px, 224px"
              loading="lazy"
              unoptimized
              onError={() => {
                console.error('Image failed to load:', logoUrl);
                setImageError(true);
              }}
            />
          </div>
        ) : (
          <div className="text-center w-full">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              {brand.designation_fr}
            </p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export function BrandsSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await getAllBrands();
        console.log('Brands data:', brandsData); // Debug log
        // Log first brand to see structure
        if (brandsData.length > 0) {
          console.log('First brand structure:', brandsData[0]);
          console.log('First brand logo:', brandsData[0].logo);
          console.log('First brand logo URL:', brandsData[0].logo ? getStorageUrl(brandsData[0].logo) : 'No logo');
          // Filter out brands without logos for now to see if that's the issue
          const brandsWithLogos = brandsData.filter(b => b.logo);
          console.log(`Brands with logos: ${brandsWithLogos.length} out of ${brandsData.length}`);
        }
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (brands.length === 0) {
    return null; // Don't show section if no brands
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Nos Marques Partenaires
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Distributeur officiel des plus grandes marques internationales
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10 hidden md:flex"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Scrollable Brands Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-2 scrollbar-hide"
          >
            {brands.map((brand, index) => (
              <BrandCard key={brand.id} brand={brand} index={index} />
            ))}
          </div>

          {/* Right Scroll Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-10 w-10 hidden md:flex"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Scroll Indicator (for mobile) */}
        <div className="flex justify-center mt-4 md:hidden">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Faites glisser pour voir plus
          </p>
        </div>
      </div>
    </section>
  );
}
