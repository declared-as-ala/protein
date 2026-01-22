'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/app/components/Header';
import { PremiumTopBar } from '@/app/components/PremiumTopBar';
import { HeroSlider } from '@/app/components/HeroSlider';
import { SmartEntryPaths } from '@/app/components/SmartEntryPaths';
import { FeaturesSection } from '@/app/components/FeaturesSection';
import { CategoryGrid } from '@/app/components/CategoryGrid';
import { ProductSection } from '@/app/components/ProductSection';
import { productsData } from '@/data/products';

// Lazy load non-critical components
const PromoBanner = dynamic(() => import('@/app/components/PromoBanner').then(mod => ({ default: mod.PromoBanner })), {
  ssr: false,
});
const BrandsSection = dynamic(() => import('@/app/components/BrandsSection').then(mod => ({ default: mod.BrandsSection })), {
  ssr: false,
});
const TestimonialsSection = dynamic(() => import('@/app/components/TestimonialsSection').then(mod => ({ default: mod.TestimonialsSection })), {
  ssr: false,
});
const BlogSection = dynamic(() => import('@/app/components/BlogSection').then(mod => ({ default: mod.BlogSection })), {
  ssr: false,
});
const Footer = dynamic(() => import('@/app/components/Footer').then(mod => ({ default: mod.Footer })));
const ScrollToTop = dynamic(() => import('@/app/components/ScrollToTop').then(mod => ({ default: mod.ScrollToTop })), {
  ssr: false,
});

export default function Home() {
  // Filter products by category - limit for mobile performance
  const newProducts = productsData.filter((_, index) => index < 4);
  const bestSellers = productsData.filter(p => 
    p.name.includes('PURE WHEY') || p.name.includes('ISO') || p.name.includes('GOLD')
  ).slice(0, 4);
  const packs = productsData.filter(p => p.category === 'Packs').slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PremiumTopBar />
      <Header />
      
      <main>
        <HeroSlider />
        <SmartEntryPaths />
        <FeaturesSection />
        <CategoryGrid />
        
        <ProductSection
          id="products"
          title="Nouveaux Produits"
          subtitle="Découvrez nos dernières nouveautés"
          products={newProducts}
          showBadge
          badgeText="New"
        />
        
        <ProductSection
          title="Meilleurs Ventes"
          subtitle="Les produits les plus populaires"
          products={bestSellers}
          showBadge
          badgeText="Top Vendu"
        />
        
        <ProductSection
          id="packs"
          title="Nos Packs"
          subtitle="Économisez avec nos packs spéciaux"
          products={packs}
        />
        
        <PromoBanner />
        <BrandsSection />
        <TestimonialsSection />
        <BlogSection />
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
}
