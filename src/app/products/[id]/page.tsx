'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { useCart } from '@/app/contexts/CartContext';
import { productsData, Product } from '@/data/products';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Minus, Plus, ShoppingCart, Star, Shield, Truck, Award, ArrowLeft, Heart, Share2, ZoomIn, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/app/components/ui/card';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const productId = parseInt(params.id as string);
  const product = productsData.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Button asChild>
            <Link href="/shop">Retour à la boutique</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const price = product.price || 0;
  const priceText = product.priceText;
  const newPriceMatch = priceText?.match(/(\d+)\s*DT$/);
  const displayPrice = newPriceMatch ? parseInt(newPriceMatch[1]) : price;
  const oldPrice = price !== displayPrice ? price : null;
  const discount = oldPrice ? Math.round(((oldPrice - displayPrice) / oldPrice) * 100) : 0;

  // Related products
  const relatedProducts = useMemo(() => {
    return productsData
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const images = [product.image, product.image, product.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 group cursor-zoom-in">
              {product.image && (
                <>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-red-500 shadow-lg'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {discount > 0 && (
                <Badge className="bg-red-600 text-white text-sm px-3 py-1">
                  -{discount}% OFF
                </Badge>
              )}
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                En Stock
              </Badge>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                <Award className="h-3 w-3 mr-1" />
                Produit Certifié
              </Badge>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {product.category}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">(4.0) • 128 avis</span>
            </div>

            {/* Price */}
            <div className="py-6 border-y border-gray-200 dark:border-gray-800">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-red-600 dark:text-red-400">
                  {displayPrice} DT
                </span>
                {oldPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    {oldPrice} DT
                  </span>
                )}
              </div>
              {oldPrice && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Vous économisez {oldPrice - displayPrice} DT
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">
                Quantité
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-xl p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total: <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {(displayPrice * quantity).toFixed(0)} DT
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-bold shadow-lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-6"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-6"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-center">Paiement Sécurisé</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-center">Livraison 2-3 jours</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs font-semibold text-center">Garantie Qualité</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
              <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
              <TabsTrigger value="nutrition" className="rounded-lg">Valeurs Nutritionnelles</TabsTrigger>
              <TabsTrigger value="usage" className="rounded-lg">Mode d'emploi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-bold mb-4">Description du produit</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description || `Découvrez ${product.name}, un produit premium de qualité supérieure. 
                Formulé avec les meilleurs ingrédients pour maximiser vos résultats. 
                Idéal pour les athlètes et les passionnés de fitness qui recherchent l'excellence.`}
              </p>
            </TabsContent>
            
            <TabsContent value="nutrition" className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-bold mb-6">Valeurs Nutritionnelles</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-semibold">Protéines</span>
                  <span className="text-red-600 dark:text-red-400 font-bold">25g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-semibold">Glucides</span>
                  <span>5g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-semibold">Lipides</span>
                  <span>2g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-semibold">Calories</span>
                  <span>120 kcal</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="usage" className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-bold mb-4">Mode d'emploi</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-400">
                <li>Mélangez 1 dose (30g) avec 250ml d'eau ou de lait</li>
                <li>Agitez bien dans un shaker pendant 30 secondes</li>
                <li>Consommez après l'entraînement ou entre les repas</li>
                <li>Ne pas dépasser 3 doses par jour</li>
              </ol>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Produits similaires
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all">
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                      {relatedProduct.image && (
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {relatedProduct.price || 0} DT
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Sticky Add to Cart (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-2xl z-50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {(displayPrice * quantity).toFixed(0)} DT
            </p>
          </div>
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
