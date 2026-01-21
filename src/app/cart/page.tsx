'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { useCart } from '@/app/contexts/CartContext';
import { Button } from '@/app/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { ScrollToTop } from '@/app/components/ScrollToTop';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-700 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Ajoutez des produits à votre panier pour continuer vos achats
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/shop">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continuer vos achats
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mon Panier
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalItems} article{totalItems > 1 ? 's' : ''} dans votre panier
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Articles</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  Vider le panier
                </Button>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-200 dark:border-gray-800 last:border-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {item.product.image && (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 96px"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                        {item.product.name}
                      </h3>
                      {item.product.category && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {item.product.category}
                        </p>
                      )}
                      <p className="text-xl font-bold text-red-600 dark:text-red-500">
                        {item.product.price !== null
                          ? `${(item.product.price * item.quantity).toFixed(2)} DT`
                          : 'Prix non disponible'}
                      </p>
                      {item.product.price !== null && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.product.price.toFixed(2)} DT / unité
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Résumé de la commande</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Livraison</span>
                  <span className="text-green-600 dark:text-green-500">
                    {totalPrice >= 300 ? 'Gratuite' : 'À calculer'}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600 dark:text-red-500">
                      {totalPrice.toFixed(2)} DT
                    </span>
                  </div>
                </div>
              </div>

              {totalPrice < 300 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Ajoutez encore {(300 - totalPrice).toFixed(2)} DT pour bénéficier de la
                    livraison gratuite !
                  </p>
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white mb-4"
              >
                Passer la commande
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                asChild
              >
                <Link href="/shop">Continuer vos achats</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
