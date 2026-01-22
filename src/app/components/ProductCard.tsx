'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Product } from '@/data/products';
import { useCart } from '@/app/contexts/CartContext';
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

  // Parse prices
  const oldPrice = product.price;
  const newPriceMatch = product.priceText?.match(/(\d+)\s*DT$/);
  const newPrice = newPriceMatch ? parseInt(newPriceMatch[1]) : product.price;
  const discount = oldPrice && newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const cardContent = (
    <>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <Badge className="bg-red-600 text-white hover:bg-red-700 font-semibold">
            -{discount}%
          </Badge>
        )}
        {showBadge && badgeText && (
          <Badge className="bg-green-600 text-white hover:bg-green-700 font-semibold">
            {badgeText}
          </Badge>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <Link href={`/products/${product.id}`}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAdding ? 'Ajouté !' : 'Ajouter au panier'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <Link href={`/products/${product.id}`} className="block mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
            {product.name}
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
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(4.0)</span>
        </div>

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
          className="w-full bg-red-600 hover:bg-red-700 text-white md:hidden"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAdding ? 'Ajouté !' : 'Ajouter au panier'}
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
