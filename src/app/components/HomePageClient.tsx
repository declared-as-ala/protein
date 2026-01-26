'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/app/components/Header';
import { PremiumTopBar } from '@/app/components/PremiumTopBar';
import { HeroSlider } from '@/app/components/HeroSlider';
import { SmartEntryPaths } from '@/app/components/SmartEntryPaths';
import { FeaturesSection } from '@/app/components/FeaturesSection';
import { CategoryGrid } from '@/app/components/CategoryGrid';
import { ProductSection } from '@/app/components/ProductSection';
import type { AccueilData, Product } from '@/types';
import { getStorageUrl } from '@/services/api';

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

interface HomePageClientProps {
  accueil: AccueilData;
  slides: any[];
}

export function HomePageClient({ accueil, slides }: HomePageClientProps) {
  // Transform API products to match ProductCard expectations
  const transformProduct = (product: Product) => ({
    id: product.id,
    name: product.designation_fr,
    price: product.promo && product.promo_expiration_date ? product.promo : product.prix,
    priceText: `${product.prix} DT`,
    image: product.cover ? getStorageUrl(product.cover) : undefined,
    category: product.sous_categorie?.designation_fr || '',
    slug: product.slug,
    // Map API fields to component expectations
    designation_fr: product.designation_fr,
    prix: product.prix,
    promo: product.promo,
    cover: product.cover,
    new_product: product.new_product,
    best_seller: product.best_seller,
    note: product.note,
  });

  const newProducts = (accueil.new_product || []).slice(0, 8).map(transformProduct);
  const bestSellers = (accueil.best_sellers || []).slice(0, 4).map(transformProduct);
  const packs = (accueil.packs || []).slice(0, 4).map(transformProduct);
  const flashSales = (accueil.ventes_flash || []).slice(0, 4).map(transformProduct);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PremiumTopBar />
      <Header />
      
      <main>
        <HeroSlider slides={slides} />
        <SmartEntryPaths />
        <FeaturesSection />
        <CategoryGrid categories={accueil.categories || []} />
        
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
        
        <PromoBanner />
        <BrandsSection />
        <TestimonialsSection />
        <BlogSection articles={accueil.last_articles || []} />
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
}
