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
import { hasValidPromo } from '@/util/productPrice';

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
import { useState, useMemo, memo, useCallback } from 'react';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
  /** Compact variant for shop listing: image + name (2 lines) + price + one CTA, no rating, minimal badges */
  variant?: 'default' | 'compact';
}

export const ProductCard = memo(function ProductCard({ product, showBadge, badgeText, variant = 'default' }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Memoize computed values – single source of truth: API prix, promo, promo_expiration_date (null = no expiry)
  const productData = useMemo(() => {
    const name = (product as any).name || product.designation_fr || '';
    const slug = product.slug || '';
    const image = (product as any).image || (product.cover ? getStorageUrl(product.cover) : '');
    const oldPrice = product.prix ?? (product as any).price ?? 0;
    const validPromo = hasValidPromo(product as any);
    const promoPrice = validPromo && product.promo != null ? product.promo : null;
    const newPrice = promoPrice ?? oldPrice;
    const discount = promoPrice != null && oldPrice > 0 ? Math.round(((oldPrice - promoPrice) / oldPrice) * 100) : 0;
    const isNew = product.new_product === 1;
    const isBestSeller = product.best_seller === 1;
    const rating = product.note || 0;
    const reviews = (product as any).reviews?.filter((r: any) => r.publier === 1) || [];
    const reviewCount = reviews.length;
    const isInStock = (product as any).rupture === 1 || (product as any).rupture === undefined;
    
    return {
      name,
      slug,
      image,
      oldPrice,
      promoPrice,
      newPrice,
      discount,
      isNew,
      isBestSeller,
      rating,
      reviewCount,
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

  const isCompact = variant === 'compact';

  const cardContent = (
    <>
      {/* Badges - compact: only rupture + discount; default: all */}
      <div className={`absolute z-10 flex flex-col gap-1 ${isCompact ? 'top-1.5 left-1.5' : 'top-3 left-3 gap-2'}`}>
        {!productData.isInStock && (
          <Badge className={`bg-gray-900 text-white hover:bg-gray-800 font-semibold border-0 ${isCompact ? 'text-[10px] px-1.5 py-0' : ''}`}>
            Rupture
          </Badge>
        )}
        {productData.isInStock && productData.discount > 0 && (
          <Badge className={`bg-red-700 text-white hover:bg-red-800 font-semibold border-0 ${isCompact ? 'text-[10px] px-1.5 py-0' : ''}`}>
            -{productData.discount}%
          </Badge>
        )}
        {!isCompact && (
          <>
            {productData.isInStock && showBadge && badgeText && (
              <Badge className="bg-green-700 text-white hover:bg-green-800 font-semibold border-0">
                {badgeText}
              </Badge>
            )}
            {productData.isInStock && productData.promoPrice == null && !showBadge && productData.isNew && (
              <Badge className="bg-blue-700 text-white hover:bg-blue-800 font-semibold border-0">
                New
              </Badge>
            )}
            {productData.isInStock && productData.promoPrice == null && !showBadge && productData.isBestSeller && (
              <Badge className="bg-yellow-700 text-white hover:bg-yellow-800 font-semibold border-0">
                Top Vendu
              </Badge>
            )}
          </>
        )}
      </div>

      {/* Image Container - 1:1 aspect, no fixed min-height on compact */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden" style={isCompact ? undefined : { minHeight: '200px' }}>
        <Link href={`/products/${productData.slug || product.id}`} aria-label={`Voir ${productData.name}`}>
          {productData.image ? (
            <Image
              src={productData.image}
              alt={productData.name}
              width={400}
              height={400}
              className={`w-full h-full object-contain transition-transform duration-300 ${isCompact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-4'} [@media(hover:hover)]:sm:group-hover:scale-110`}
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={70}
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

        {/* Quick Add to Cart - Desktop only: show on hover (hover-capable devices) */}
        <div
          className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent hidden opacity-0 transition-opacity duration-300 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:opacity-100"
          aria-hidden="true"
        >
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
      <div className={isCompact ? 'p-2' : 'p-2 sm:p-4'}>
        {/* Product Name - always 2 lines max */}
        <Link href={`/products/${productData.slug || product.id}`} className="block mb-1 sm:mb-2">
          <h3 className={`font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors ${isCompact ? 'text-[11px] sm:text-xs min-h-[2rem]' : 'text-xs sm:text-sm min-h-[2.5rem] sm:min-h-0'}`}>
            {productData.name}
          </h3>
        </Link>

        {/* Rating & Reviews - hidden in compact */}
        {!isCompact && productData.rating > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3" aria-label={`Note: ${productData.rating.toFixed(1)} sur 5${productData.reviewCount > 0 ? `, ${productData.reviewCount} avis` : ''}`}>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    i < Math.floor(productData.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs font-semibold text-gray-900 dark:text-white">
                {productData.rating.toFixed(1)}
              </span>
              {productData.reviewCount > 0 && (
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  ({productData.reviewCount})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price – compact: smaller text */}
        <div className={`flex flex-wrap items-baseline gap-1 sm:gap-2 ${isCompact ? 'mb-2' : 'mb-2 sm:mb-3'}`}>
          {productData.promoPrice != null && productData.oldPrice !== productData.newPrice ? (
            <>
              <span className={`font-bold text-red-600 dark:text-red-400 tabular-nums ${isCompact ? 'text-sm' : 'text-base sm:text-xl'}`}>
                {productData.newPrice} DT
              </span>
              <span
                className={`text-gray-500 dark:text-gray-400 line-through tabular-nums ${isCompact ? 'text-[10px]' : 'text-xs sm:text-sm'}`}
                style={{ textDecorationThickness: '1.5px' }}
                aria-label={`Prix barré: ${productData.oldPrice} DT`}
              >
                {productData.oldPrice} DT
              </span>
              {!isCompact && productData.discount > 0 && (
                <span className="rounded-md bg-red-100 dark:bg-red-950/50 px-1.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400">
                  -{productData.discount}%
                </span>
              )}
            </>
          ) : (
            <span className={`font-bold text-gray-900 dark:text-white tabular-nums ${isCompact ? 'text-sm' : 'text-sm sm:text-lg'}`}>
              {productData.newPrice || productData.oldPrice} DT
            </span>
          )}
        </div>

        {/* Add to Cart - mobile only: short "Ajouter" button; desktop uses hover overlay with "Ajouter au panier" */}
        <Button
          size="sm"
          className={`w-full min-h-[44px] ${productData.isInStock ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'} text-white hidden [@media(hover:none)]:inline-flex ${isCompact ? 'text-xs' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding || !productData.isInStock}
          aria-label={`Ajouter ${productData.name} au panier`}
        >
          <ShoppingCart className={`shrink-0 mr-1.5 ${isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4 mr-2'}`} aria-hidden="true" />
          {!productData.isInStock ? 'Rupture' : isAdding ? 'Ajouté !' : 'Ajouter'}
        </Button>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-red-500 rounded-xl transition-all pointer-events-none" />
    </>
  );

  const className = isCompact
    ? "group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:border-red-500 [@media(hover:hover)]:dark:hover:border-red-500"
    : "group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 [@media(hover:hover)]:hover:shadow-2xl [@media(hover:hover)]:hover:border-red-500 [@media(hover:hover)]:dark:hover:border-red-500";

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
