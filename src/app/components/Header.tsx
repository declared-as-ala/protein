'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, User, Menu, X, Moon, Sun, Phone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useTheme } from 'next-themes';
import { AnnouncementBar } from './AnnouncementBar';
import { ProductsDropdown } from './ProductsDropdown';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/app/contexts/CartContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Top Bar */}
      <div className="bg-black text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+21673200500" className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">+216 73 200 500</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Livraison gratuite à partir de 300 DT</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 text-white hover:text-red-500 hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative h-12 w-auto mr-8">
              <Image
                src="https://admin.protein.tn/storage/coordonnees/September2023/OXC3oL0LreP3RCsgR3k6.webp"
                alt="Protein.tn"
                width={150}
                height={48}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 overflow-visible">
              <Link href="/" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                ACCUEIL
              </Link>
              <ProductsDropdown />
              <Link href="/packs" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                PACKS
              </Link>
              <Link href="/blog" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                BLOG
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                CONTACT
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
                QUI SOMMES NOUS
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un produit..."
                  className="pl-10 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-gray-100 dark:hover:bg-gray-800">
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

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