'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { useCart } from '@/app/contexts/CartContext';
import { ProductCard } from '@/app/components/ProductCard';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Minus, Plus, ShoppingCart, Star, Shield, Truck, Award, ArrowLeft, Heart, Share2, ZoomIn, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/app/components/ui/card';
import type { Product } from '@/types';
import { getStorageUrl, addReview } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProductDetailClientProps {
  product: Product;
  similarProducts: Product[];
}

export function ProductDetailClient({ product, similarProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const basePrice = product.prix || 0;
  const promoPrice = product.promo && product.promo_expiration_date ? product.promo : null;
  const displayPrice = promoPrice || basePrice;
  const oldPrice = promoPrice ? basePrice : null;
  const discount = promoPrice ? Math.round(((basePrice - promoPrice) / basePrice) * 100) : 0;
  const rating = product.note || 0;
  const reviews = product.reviews?.filter(r => r.publier === 1) || [];
  const reviewCount = reviews.length;

  const images = product.cover ? [product.cover] : [];
  const productImage = images[0] ? getStorageUrl(images[0]) : '';

  const handleAddToCart = () => {
    // Check if product is out of stock
    if (product.rupture !== 1) {
      toast.error('Rupture de stock - Ce produit n\'est pas disponible');
      return;
    }
    
    // Transform product to match cart expectations
    const cartProduct = {
      ...product,
      name: product.designation_fr,
      price: displayPrice,
      priceText: `${displayPrice} DT`,
      image: productImage,
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct as any);
    }
    toast.success('Produit ajouté au panier');
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour laisser un avis');
      router.push('/login');
      return;
    }

    if (reviewStars === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    try {
      await addReview({
        product_id: product.id,
        stars: reviewStars,
        comment: reviewComment,
      });
      toast.success('Avis ajouté avec succès');
      setReviewStars(0);
      setReviewComment('');
      setShowReviewForm(false);
      // Refresh page to show new review
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'avis');
    }
  };

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
            <div className="relative aspect-square bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 group">
              {productImage ? (
                <Image
                  src={productImage}
                  alt={product.designation_fr}
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  onError={(e) => {
                    // Fallback to placeholder if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.error-placeholder')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'error-placeholder absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800';
                      placeholder.innerHTML = '<svg class="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>
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
              {product.new_product === 1 && (
                <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                  Nouveau
                </Badge>
              )}
              {product.best_seller === 1 && (
                <Badge className="bg-yellow-600 text-white text-sm px-3 py-1">
                  Top Vendu
                </Badge>
              )}
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {product.rupture === 1 ? 'En Stock' : 'Rupture de stock'}
              </Badge>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.designation_fr}
              </h1>
              {product.sous_categorie && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {product.sous_categorie.designation_fr}
                </p>
              )}
            </div>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  ({rating.toFixed(1)}) • {reviewCount} avis
                </span>
              </div>
            )}

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
                disabled={product.rupture !== 1}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.rupture === 1 ? 'Ajouter au panier' : 'Rupture de stock'}
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
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.designation_fr,
                      text: product.description_fr || '',
                      url: window.location.href,
                    });
                  }
                }}
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
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
              <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
              <TabsTrigger value="nutrition" className="rounded-lg">Valeurs Nutritionnelles</TabsTrigger>
              <TabsTrigger value="usage" className="rounded-lg">Mode d'emploi</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg">Avis ({reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-bold mb-4">Description du produit</h3>
              <div 
                className="text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description_fr || product.description_cover || 'Aucune description disponible.' }}
              />
            </TabsContent>
            
            <TabsContent value="nutrition" className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-bold mb-6">Valeurs Nutritionnelles</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Les informations nutritionnelles détaillées sont disponibles sur l'emballage du produit.
              </p>
            </TabsContent>
            
            <TabsContent value="usage" className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-bold mb-4">Mode d'emploi</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Consultez les instructions sur l'emballage du produit pour le mode d'emploi recommandé.
              </p>
            </TabsContent>

            <TabsContent value="reviews" className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Avis clients ({reviewCount})</h3>
                {isAuthenticated && (
                  <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                    Laisser un avis
                  </Button>
                )}
              </div>

              {showReviewForm && isAuthenticated && (
                <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h4 className="font-semibold mb-4">Votre avis</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Note</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewStars(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= reviewStars
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Commentaire</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg"
                        rows={4}
                        placeholder="Partagez votre expérience..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSubmitReview}>Envoyer</Button>
                      <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Aucun avis pour le moment.</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {review.user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.user?.name || 'Anonyme'}</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.stars
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Produits similaires
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct, index) => (
                <ProductCard
                  key={similarProduct.id || `similar-${index}`}
                  product={similarProduct}
                />
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
            disabled={product.rupture !== 1}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.rupture === 1 ? 'Ajouter' : 'Rupture'}
          </Button>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
