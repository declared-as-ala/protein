'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import type { Product as ApiProduct } from '@/types';
import { useCart } from '@/app/contexts/CartContext';
import { getStorageUrl } from '@/services/api';
import { toast } from 'sonner';

// Support both old Product type and new API Product type
type Product = ApiProduct | {
  id: number;
  name?: string;
  designation_fr?: string;
  price?: number | null;
  prix?: number;
  priceText?: string | null;
  image?: string | null;
  cover?: string;
  slug?: string;
  category?: string | null;
  new_product?: number;
  best_seller?: number;
  promo?: number;
  promo_expiration_date?: string;
  note?: number;
};
import { useState, useEffect, useMemo, memo, useCallback } from 'react';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
}

export const ProductCard = memo(function ProductCard({ product, showBadge, badgeText }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize computed values to prevent unnecessary recalculations
  const productData = useMemo(() => {
    const name = (product as any).name || product.designation_fr || '';
    const slug = product.slug || '';
    const image = (product as any).image || (product.cover ? getStorageUrl(product.cover) : '');
    const basePrice = (product as any).price || product.prix || 0;
    const promoPrice = product.promo && product.promo_expiration_date ? product.promo : null;
    const newPrice = promoPrice || basePrice;
    const discount = promoPrice && basePrice ? Math.round(((basePrice - promoPrice) / basePrice) * 100) : 0;
    const isNew = product.new_product === 1;
    const isBestSeller = product.best_seller === 1;
    const rating = product.note || 0;
    const isInStock = (product as any).rupture === 1 || (product as any).rupture === undefined;
    
    return {
      name,
      slug,
      image,
      basePrice,
      promoPrice,
      newPrice,
      oldPrice: basePrice,
      discount,
      isNew,
      isBestSeller,
      rating,
      isInStock,
    };
  }, [product]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!productData.isInStock) {
      toast.error('Rupture de stock');
      return;
    }
    
    setIsAdding(true);
    addToCart(product as any);
    toast.success('Produit ajouté au panier');
    setTimeout(() => setIsAdding(false), 500);
  }, [productData.isInStock, addToCart, product]);

  const cardContent = (
    <>
      {/* Badges - Improved contrast for accessibility (WCAG AA) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {!productData.isInStock && (
          <Badge className="bg-gray-900 text-white hover:bg-gray-800 font-semibold border-0">
            Rupture de stock
          </Badge>
        )}
        {productData.isInStock && productData.discount > 0 && (
          <Badge className="bg-red-700 text-white hover:bg-red-800 font-semibold border-0">
            -{productData.discount}%
          </Badge>
        )}
        {productData.isInStock && showBadge && badgeText && (
          <Badge className="bg-green-700 text-white hover:bg-green-800 font-semibold border-0">
            {badgeText}
          </Badge>
        )}
        {productData.isInStock && !showBadge && productData.isNew && (
          <Badge className="bg-blue-700 text-white hover:bg-blue-800 font-semibold border-0">
            New
          </Badge>
        )}
        {productData.isInStock && !showBadge && productData.isBestSeller && (
          <Badge className="bg-yellow-700 text-white hover:bg-yellow-800 font-semibold border-0">
            Top Vendu
          </Badge>
        )}
      </div>

      {/* Image Container - Fixed aspect ratio for CLS */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden" style={{ minHeight: '200px' }}>
        <Link href={`/products/${productData.slug || product.id}`} aria-label={`Voir ${productData.name}`}>
          {productData.image ? (
            <Image
              src={productData.image}
              alt={productData.name}
              width={400}
              height={400}
              className="w-full h-full object-contain p-2 sm:p-4 sm:group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.error-placeholder')) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'error-placeholder w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700';
                  placeholder.innerHTML = '<svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700" aria-hidden="true">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </Link>

        {/* Quick Add to Cart - Shows on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            className={`w-full min-h-[44px] ${productData.isInStock ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'} text-white`}
            onClick={handleAddToCart}
            disabled={isAdding || !productData.isInStock}
            aria-label={`Ajouter ${productData.name} au panier`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
            {!productData.isInStock ? 'Rupture de stock' : isAdding ? 'Ajouté !' : 'Ajouter au panier'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        {/* Product Name */}
        <Link href={`/products/${productData.slug || product.id}`} className="block mb-1 sm:mb-2">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors min-h-[2.5rem] sm:min-h-0">
            {productData.name}
          </h3>
        </Link>

        {/* Nutrition Highlights - Premium Feature - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-full">
            <span className="font-semibold text-red-600 dark:text-red-400">25g</span>
            <span className="text-gray-600 dark:text-gray-400">protéine</span>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded-full">
            <span className="font-semibold text-orange-600 dark:text-orange-400">120</span>
            <span className="text-gray-600 dark:text-gray-400">cal</span>
          </div>
        </div>

        {/* Rating - Smaller on mobile */}
        {productData.rating > 0 && (
          <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3" aria-label={`Note: ${productData.rating.toFixed(1)} sur 5`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  i < Math.floor(productData.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-0.5 sm:ml-1">({productData.rating.toFixed(1)})</span>
          </div>
        )}

        {/* Price - Smaller on mobile */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-2">
            {productData.oldPrice && productData.newPrice && productData.oldPrice !== productData.newPrice ? (
              <>
                <span className="text-sm sm:text-lg font-bold text-red-600 dark:text-red-500">
                  {productData.newPrice} DT
                </span>
                <span className="text-xs sm:text-sm text-gray-400 line-through" aria-label={`Prix original: ${productData.oldPrice} DT`}>
                  {productData.oldPrice} DT
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                {productData.newPrice || productData.oldPrice} DT
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button - Always visible on mobile */}
        <Button
          size="sm"
          className={`w-full min-h-[44px] ${productData.isInStock ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'} text-white md:hidden`}
          onClick={handleAddToCart}
          disabled={isAdding || !productData.isInStock}
          aria-label={`Ajouter ${productData.name} au panier`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
          {!productData.isInStock ? 'Rupture de stock' : isAdding ? 'Ajouté !' : 'Ajouter au panier'}
        </Button>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-red-500 rounded-xl transition-all pointer-events-none" />
    </>
  );

  const className = "group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500";

  if (isMobile) {
    return <article className={className}>{cardContent}</article>;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {cardContent}
    </motion.article>
  );
});
