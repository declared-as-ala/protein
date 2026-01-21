'use client';

import Image from 'next/image';
import { useCart } from '@/app/contexts/CartContext';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/app/components/ui/drawer';
import { Button } from '@/app/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCart();

  const totalPrice = getTotalPrice();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="max-h-[96vh] w-full sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">Panier</DrawerTitle>
          <DrawerDescription>
            {items.length === 0
              ? 'Votre panier est vide'
              : `${items.length} article${items.length > 1 ? 's' : ''} dans votre panier`}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Votre panier est vide
              </p>
              <DrawerClose asChild>
                <Button onClick={() => onOpenChange(false)}>
                  Continuer les achats
                </Button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {items.map(item => {
                const price = item.product.price || 0;
                const priceText = item.product.priceText;
                const newPriceMatch = priceText?.match(/(\d+)\s*DT$/);
                const displayPrice = newPriceMatch
                  ? parseInt(newPriceMatch[1])
                  : price;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-700 rounded-lg overflow-hidden relative">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                          sizes="80px"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-red-600 dark:text-red-400 font-bold mb-2">
                        {displayPrice} DT
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {(displayPrice * item.quantity).toFixed(0)} DT
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <DrawerFooter className="border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {totalPrice.toFixed(0)} DT
              </span>
            </div>
            <div className="flex gap-3">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1" onClick={clearCart}>
                  Vider le panier
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Link href="/checkout" className="flex-1">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Commander
                  </Button>
                </Link>
              </DrawerClose>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
