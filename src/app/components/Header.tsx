'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, User, Menu, X, Moon, Sun, Phone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useTheme } from 'next-themes';
import { AnnouncementBar } from './AnnouncementBar';
import { PremiumTopBar } from './PremiumTopBar';
import { ProductsDropdown } from './ProductsDropdown';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/app/contexts/CartContext';
import { motion } from 'motion/react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  return (
    <>
      {/* Premium Top Bar */}
      <PremiumTopBar />
      
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-2.5 px-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+21673200500" className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">+216 73 200 500</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Livraison gratuite à partir de 300 DT</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex items-center"
            >
              <Link href="/" className="flex-shrink-0 relative h-12 w-auto mr-8 flex items-center">
                <Image
                  src="https://admin.protein.tn/storage/coordonnees/September2023/OXC3oL0LreP3RCsgR3k6.webp"
                  alt="Protein.tn"
                  width={150}
                  height={48}
                  className="h-12 w-auto drop-shadow-lg"
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 overflow-visible ml-8">
              <Link href="/" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap">
                ACCUEIL
              </Link>
              <ProductsDropdown />
              <Link href="/packs" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap">
                PACKS
              </Link>
              <Link href="/blog" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap">
                BLOG
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap">
                CONTACT
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap">
                QUI SOMMES NOUS
              </Link>
              <Link href="/calculators" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap">
                CALCULATEURS
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <Input
                  type="search"
                  placeholder="Rechercher un produit..."
                  className="pl-12 pr-4 w-full h-11 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 rounded-xl shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden md:flex hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                  asChild
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                      >
                        {cartItemsCount}
                      </motion.span>
                    )}
                  </Link>
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-10 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <nav className="px-4 py-6 space-y-4">
              <Link href="/" className="block text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                ACCUEIL
              </Link>
              <Link href="/shop" className="block text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                NOS PRODUITS
              </Link>
              <Link href="/packs" className="block text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                PACKS
              </Link>
              <Link href="/blog" className="block text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                BLOG
              </Link>
              <Link href="/contact" className="block text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                CONTACT
              </Link>
              <Link href="/about" className="block text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                QUI SOMMES NOUS
              </Link>
              <Link href="/calculators" className="block text-base font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                CALCULATEURS
              </Link>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <User className="h-5 w-5 mr-2" />
                Mon Compte
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}