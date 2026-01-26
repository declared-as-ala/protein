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
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
}

export function ProductCard({ product, showBadge, badgeText }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Parse prices - support both old and new product types
  const productName = (product as any).name || product.designation_fr || '';
  const productSlug = product.slug || '';
  const productImage = (product as any).image || (product.cover ? getStorageUrl(product.cover) : '');
  const basePrice = (product as any).price || product.prix || 0;
  const promoPrice = product.promo && product.promo_expiration_date ? product.promo : null;
  const oldPrice = basePrice;
  const newPrice = promoPrice || basePrice;
  const discount = promoPrice && basePrice ? Math.round(((basePrice - promoPrice) / basePrice) * 100) : 0;
  const isNew = product.new_product === 1;
  const isBestSeller = product.best_seller === 1;
  const rating = product.note || 0;
  // Check if product is in stock: rupture === 1 means in stock, !== 1 means out of stock
  const isInStock = (product as any).rupture === 1 || (product as any).rupture === undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if product is out of stock
    if (!isInStock) {
      toast.error('Rupture de stock');
      return;
    }
    
    setIsAdding(true);
    addToCart(product as any);
    toast.success('Produit ajouté au panier');
    setTimeout(() => setIsAdding(false), 500);
  };

  const cardContent = (
    <>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {!isInStock && (
          <Badge className="bg-gray-600 text-white hover:bg-gray-700 font-semibold">
            Rupture de stock
          </Badge>
        )}
        {isInStock && discount > 0 && (
          <Badge className="bg-red-600 text-white hover:bg-red-700 font-semibold">
            -{discount}%
          </Badge>
        )}
        {isInStock && showBadge && badgeText && (
          <Badge className="bg-green-600 text-white hover:bg-green-700 font-semibold">
            {badgeText}
          </Badge>
        )}
        {isInStock && !showBadge && isNew && (
          <Badge className="bg-blue-600 text-white hover:bg-blue-700 font-semibold">
            New
          </Badge>
        )}
        {isInStock && !showBadge && isBestSeller && (
          <Badge className="bg-yellow-600 text-white hover:bg-yellow-700 font-semibold">
            Top Vendu
          </Badge>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <Link href={`/products/${productSlug || product.id}`}>
          {productImage ? (
            <Image
              src={productImage}
              alt={productName}
              width={400}
              height={400}
              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={(e) => {
                // Hide broken image and show placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700';
                  placeholder.innerHTML = '<svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                  if (!parent.querySelector('.error-placeholder')) {
                    placeholder.classList.add('error-placeholder');
                    parent.appendChild(placeholder);
                  }
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </Link>

        {/* Quick Add to Cart - Shows on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            className={`w-full ${isInStock ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'} text-white`}
            onClick={handleAddToCart}
            disabled={isAdding || !isInStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {!isInStock ? 'Rupture de stock' : isAdding ? 'Ajouté !' : 'Ajouter au panier'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <Link href={`/products/${productSlug || product.id}`} className="block mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
            {productName}
          </h3>
        </Link>

        {/* Nutrition Highlights - Premium Feature */}
        <div className="flex items-center gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-full">
            <span className="font-semibold text-red-600 dark:text-red-400">25g</span>
            <span className="text-gray-600 dark:text-gray-400">protéine</span>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded-full">
            <span className="font-semibold text-orange-600 dark:text-orange-400">120</span>
            <span className="text-gray-600 dark:text-gray-400">cal</span>
          </div>
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({rating.toFixed(1)})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {oldPrice && newPrice && oldPrice !== newPrice ? (
            <>
              <span className="text-lg font-bold text-red-600 dark:text-red-500">
                {newPrice} DT
              </span>
              <span className="text-sm text-gray-400 line-through">
                {oldPrice} DT
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {newPrice || oldPrice} DT
            </span>
          )}
        </div>
        </div>

        {/* Add to Cart Button - Always visible on mobile */}
        <Button
          size="sm"
          className={`w-full ${isInStock ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'} text-white md:hidden`}
          onClick={handleAddToCart}
          disabled={isAdding || !isInStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {!isInStock ? 'Rupture de stock' : isAdding ? 'Ajouté !' : 'Ajouter au panier'}
        </Button>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-red-500 rounded-xl transition-all pointer-events-none" />
    </>
  );

  const className = "group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500";

  if (isMobile) {
    return <div className={className}>{cardContent}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={className}
    >
      {cardContent}
    </motion.div>
  );
}
