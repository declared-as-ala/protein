'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { useCart } from '@/app/contexts/CartContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Sparkles, Shield, Truck, TrendingUp, X } from 'lucide-react';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { motion, AnimatePresence } from 'motion/react';
import { productsData } from '@/data/products';
import { getStorageUrl } from '@/services/api';

const FREE_SHIPPING_THRESHOLD = 300;

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getEffectivePrice,
    addToCart,
  } = useCart();

  const [showUpsells, setShowUpsells] = useState(true);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
  const finalTotal = totalPrice + shippingCost;

  // Calculate remaining amount for free shipping
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const freeShippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  // Smart upsells - products not in cart
  const upsellProducts = useMemo(() => {
    const cartProductIds = new Set(items.map(item => item.product.id));
    return productsData
      .filter(p => !cartProductIds.has(p.id))
      .slice(0, 3);
  }, [items]);


  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-700 mb-6" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Découvrez nos produits premium pour atteindre vos objectifs
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 h-14 text-lg shadow-lg">
              <Link href="/shop">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Découvrir nos produits
              </Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Mon Panier
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {totalItems} article{totalItems > 1 ? 's' : ''} • {totalPrice.toFixed(0)} DT
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-6">
            {/* Cart Items Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 lg:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Articles ({totalItems})
                </h2>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => {
                    const displayPrice = getEffectivePrice(item.product);

                    return (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col sm:flex-row gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                      >
                        {/* Product Image */}
                        <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {(item.product as any).image || (item.product as any).cover ? (
                            <Image
                              src={(item.product as any).image || ((item.product as any).cover ? getStorageUrl((item.product as any).cover) : '')}
                              alt={(item.product as any).name || (item.product as any).designation_fr || 'Product'}
                              fill
                              className="object-contain p-2"
                              sizes="(max-width: 640px) 100vw, 128px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {(item.product as any).name || (item.product as any).designation_fr}
                          </h3>
                          {(item.product as any).category && (
                            <Badge variant="outline" className="mb-2">
                              {(item.product as any).category}
                            </Badge>
                          )}
                          <div className="flex items-center gap-4 mb-4">
                            <div>
                              <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                                {displayPrice} DT
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {displayPrice} DT / unité
                              </p>
                              {(item.product as any).prix != null && (item.product as any).prix > displayPrice && (
                                <p className="text-xs text-gray-400 line-through">
                                  {(item.product as any).prix} DT
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-lg"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-16 text-center font-bold text-lg">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-lg"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 ml-auto"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sous-total</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {(displayPrice * item.quantity).toFixed(0)} DT
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Smart Upsells */}
            {showUpsells && upsellProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Recommandé pour vous
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUpsells(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Les clients qui ont acheté ces articles ont également ajouté :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {upsellProducts.map((product) => {
                    const price = product.price || 0;
                    const priceText = product.priceText;
                    const newPriceMatch = priceText?.match(/(\d+)\s*DT$/);
                    const displayPrice = newPriceMatch ? parseInt(newPriceMatch[1]) : price;

                    return (
                      <div
                        key={product.id}
                        className="group relative bg-gray-50 dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => addToCart(product)}
                      >
                        {product.image && (
                          <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-2"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                          </div>
                        )}
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">
                          {displayPrice} DT
                        </p>
                        <Button
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          Ajouter
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Order Summary (Sticky) */}
          <div className="lg:w-96 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-6"
            >
              {/* Order Summary Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Résumé de la commande
                </h2>

                {/* Free Shipping Progress */}
                {totalPrice < FREE_SHIPPING_THRESHOLD && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl border border-yellow-200 dark:border-yellow-900">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Livraison gratuite
                      </span>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        {remainingForFreeShipping.toFixed(0)} DT restants
                      </span>
                    </div>
                    <Progress value={freeShippingProgress} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Ajoutez {remainingForFreeShipping.toFixed(0)} DT pour bénéficier de la livraison gratuite
                    </p>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Sous-total</span>
                    <span className="font-semibold">{totalPrice.toFixed(0)} DT</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Livraison</span>
                    <span className={shippingCost === 0 ? 'text-green-600 dark:text-green-400 font-semibold' : 'font-semibold'}>
                      {shippingCost === 0 ? 'Gratuite' : `${shippingCost} DT`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span className="text-red-600 dark:text-red-400">
                        {finalTotal.toFixed(0)} DT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Paiement sécurisé
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Livraison rapide
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-bold shadow-lg mb-4"
                  asChild
                >
                  <Link href="/checkout">
                    Passer la commande
                    <TrendingUp className="h-5 w-5 ml-2" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12"
                  asChild
                >
                  <Link href="/shop">
                    Continuer vos achats
                  </Link>
                </Button>
              </div>

              {/* Delivery Estimation */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900 p-6">
                <div className="flex items-start gap-3">
                  <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Estimation de livraison
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {shippingCost === 0 ? 'Livraison gratuite en 2-3 jours' : 'Livraison standard en 3-5 jours'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
