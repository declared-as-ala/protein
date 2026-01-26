'use client';

import { useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroSlider } from '@/app/components/HeroSlider';

import { FeaturesSection } from '@/app/components/FeaturesSection';
import { CategoryGrid } from '@/app/components/CategoryGrid';
import { ProductSection } from '@/app/components/ProductSection';

// Lazy load SmartEntryPaths - it's below the fold
const SmartEntryPaths = dynamic(() => import('@/app/components/SmartEntryPaths').then(mod => ({ default: mod.SmartEntryPaths })), {
  ssr: false,
  loading: () => null,
});
import type { AccueilData, Product } from '@/types';
import { getStorageUrl } from '@/services/api';

// Defer header and topbar - they're not critical for LCP but keep SSR for SEO
const Header = dynamic(() => import('@/app/components/Header').then(mod => ({ default: mod.Header })), {
  ssr: true,
});
const PremiumTopBar = dynamic(() => import('@/app/components/PremiumTopBar').then(mod => ({ default: mod.PremiumTopBar })), {
  ssr: true,
});

// Lazy load non-critical below-the-fold components
const PromoBanner = dynamic(() => import('@/app/components/PromoBanner').then(mod => ({ default: mod.PromoBanner })), {
  ssr: false,
  loading: () => null, // Don't show loading for banner
});
const BrandsSection = dynamic(() => import('@/app/components/BrandsSection').then(mod => ({ default: mod.BrandsSection })), {
  ssr: false,
  loading: () => null,
});
const TestimonialsSection = dynamic(() => import('@/app/components/TestimonialsSection').then(mod => ({ default: mod.TestimonialsSection })), {
  ssr: false,
  loading: () => null,
});
const BlogSection = dynamic(() => import('@/app/components/BlogSection').then(mod => ({ default: mod.BlogSection })), {
  ssr: false,
  loading: () => null,
});
const Footer = dynamic(() => import('@/app/components/Footer').then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-64 bg-gray-50 dark:bg-gray-900" />, // Placeholder height
});
const ScrollToTop = dynamic(() => import('@/app/components/ScrollToTop').then(mod => ({ default: mod.ScrollToTop })), {
  ssr: false,
});

interface HomePageClientProps {
  accueil: AccueilData;
  slides: any[];
}

export function HomePageClient({ accueil, slides }: HomePageClientProps) {
  // Memoize product transformations to prevent unnecessary recalculations
  const transformProduct = useMemo(() => (product: Product) => ({
    id: product.id,
    name: product.designation_fr,
    price: product.promo && product.promo_expiration_date ? product.promo : product.prix,
    priceText: `${product.prix} DT`,
    image: product.cover ? getStorageUrl(product.cover) : undefined,
    category: product.sous_categorie?.designation_fr || '',
    slug: product.slug,
    designation_fr: product.designation_fr,
    prix: product.prix,
    promo: product.promo,
    cover: product.cover,
    new_product: product.new_product,
    best_seller: product.best_seller,
    note: product.note,
  }), []);

  const newProducts = useMemo(() => 
    (accueil.new_product || []).slice(0, 8).map(transformProduct),
    [accueil.new_product, transformProduct]
  );
  const bestSellers = useMemo(() => 
    (accueil.best_sellers || []).slice(0, 4).map(transformProduct),
    [accueil.best_sellers, transformProduct]
  );
  const packs = useMemo(() => 
    (accueil.packs || []).slice(0, 4).map(transformProduct),
    [accueil.packs, transformProduct]
  );
  const flashSales = useMemo(() => 
    (accueil.ventes_flash || []).slice(0, 4).map(transformProduct),
    [accueil.ventes_flash, transformProduct]
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PremiumTopBar />
      <Header />
      
      <main>
        {/* Above the fold - Critical content - Hero must render first */}
        <HeroSlider slides={slides} />
        {/* SmartEntryPaths - Below fold, can be deferred */}
        <Suspense fallback={null}>
          <SmartEntryPaths />
        </Suspense>
        <FeaturesSection />
        <CategoryGrid categories={accueil.categories || []} />
        
        {/* Product sections */}
        {newProducts.length > 0 && (
          <ProductSection
            id="products"
            title="Nouveaux Produits"
            subtitle="Découvrez nos dernières nouveautés"
            products={newProducts as any}
            showBadge
            badgeText="New"
          />
        )}
        
        {bestSellers.length > 0 && (
          <ProductSection
            title="Meilleurs Ventes"
            subtitle="Les produits les plus populaires"
            products={bestSellers as any}
            showBadge
            badgeText="Top Vendu"
          />
        )}

        {flashSales.length > 0 && (
          <ProductSection
            title="Ventes Flash"
            subtitle="Offres limitées - Ne manquez pas ces promotions"
            products={flashSales as any}
            showBadge
            badgeText="Promo"
          />
        )}
        
        {packs.length > 0 && (
          <ProductSection
            id="packs"
            title="Nos Packs"
            subtitle="Économisez avec nos packs spéciaux"
            products={packs as any}
          />
        )}
        
        {/* Below the fold - Lazy loaded */}
        <Suspense fallback={null}>
          <PromoBanner />
        </Suspense>
        <Suspense fallback={null}>
          <BrandsSection />
        </Suspense>
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={null}>
          <BlogSection articles={accueil.last_articles || []} />
        </Suspense>
      </main>
      
      <Suspense fallback={<div className="h-64 bg-gray-50 dark:bg-gray-900" />}>
        <Footer />
      </Suspense>
      <ScrollToTop />
    </div>
  );
}
