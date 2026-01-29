'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, Moon, Sun, Phone, Package } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useTheme } from 'next-themes';
import { PremiumTopBar } from './PremiumTopBar';
import { ProductsDropdown } from './ProductsDropdown';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { getTotalItems, cartDrawerOpen, setCartDrawerOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const cartItemsCount = getTotalItems();

  return (
    <>
      {/* Premium Top Bar */}
      <PremiumTopBar />
      
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-2.5 px-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-sm sm:text-base">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
            <a href="tel:+21627612500" className="flex items-center gap-2 hover:text-red-500 transition-colors" aria-label="Appeler au +216 27 612 500">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
              <span>+216 27 612 500</span>
            </a>
            <span className="hidden sm:inline text-gray-500" aria-hidden="true">|</span>
            <a href="tel:+21627612500" className="flex items-center gap-2 hover:text-red-500 transition-colors" aria-label="Appeler au +216 27 612 500">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
              <span>+216 27 612 500</span>
            </a>
          </div>
          <div className="flex items-center">
            <span className="text-center sm:text-left">Livraison gratuite à partir de 300 DT</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Logo + Actions */}
          <div className="flex items-center justify-between h-16 lg:h-20 py-3 lg:py-4">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex items-center flex-shrink-0"
            >
              <Link href="/" className="relative h-10 lg:h-12 w-auto flex items-center">
                <Image
                  src="https://admin.protein.tn/storage/coordonnees/September2023/OXC3oL0LreP3RCsgR3k6.webp"
                  alt="Protein.tn"
                  width={150}
                  height={48}
                  className="h-10 lg:h-12 w-auto drop-shadow-lg"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </Link>
            </motion.div>

            {/* Right Actions: smaller on mobile so toggle fits; Profile, Theme, Cart, Menu */}
            <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-3 flex-shrink-0">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg sm:rounded-xl h-9 w-9 min-h-[40px] min-w-[40px] sm:h-10 sm:w-10 sm:min-h-[44px] sm:min-w-[44px] relative z-50 shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="z-[100] min-w-[200px] shadow-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    sideOffset={8}
                  >
                    <div className="px-3 py-2.5 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20">
                      <Link href="/account" className="flex items-center w-full">
                        Mon Compte
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20">
                      <Link href="/account/orders" className="flex items-center w-full">
                        <Package className="h-4 w-4 mr-2" />
                        Mes Commandes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20 text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300"
                    >
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" className="flex shrink-0 h-9 min-h-[40px] sm:h-10 sm:min-h-[44px] px-2.5 sm:px-3 lg:px-4 text-[11px] sm:text-sm lg:text-base font-semibold rounded-lg sm:rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg sm:rounded-xl h-9 w-9 min-h-[40px] min-w-[40px] sm:h-10 sm:w-10 sm:min-h-[44px] sm:min-w-[44px]"
                aria-label="Changer le thème"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              
              <motion.div className="shrink-0" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg sm:rounded-xl transition-colors h-9 w-9 min-h-[40px] min-w-[40px] sm:h-10 sm:w-10 sm:min-h-[44px] sm:min-w-[44px]"
                  onClick={() => setCartDrawerOpen(true)}
                  aria-label={`Panier${cartItemsCount > 0 ? ` avec ${cartItemsCount} article${cartItemsCount > 1 ? 's' : ''}` : ''}`}
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold shadow-lg"
                      aria-label={`${cartItemsCount} article${cartItemsCount > 1 ? 's' : ''} dans le panier`}
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* Mobile: hamburger always visible; 44px touch target so it stays tappable */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg sm:rounded-xl min-h-[44px] min-w-[44px] h-11 w-11 border border-gray-200 dark:border-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </Button>
            </div>
          </div>

          {/* Bottom Row: Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 pb-4 border-t border-gray-200/50 dark:border-gray-800/50 pt-4">
            <Link href="/" className="text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              ACCUEIL
            </Link>
            <ProductsDropdown />
            <Link href="/packs" className="text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              PACKS
            </Link>
            <Link href="/brands" className="text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              MARQUES
            </Link>
            <Link href="/blog" className="text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              BLOG
            </Link>
            <Link href="/contact" className="text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              CONTACT
            </Link>
            <Link href="/about" className="text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              QUI SOMMES NOUS
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <nav className="px-4 py-6 space-y-3">
              <Link 
                href="/" 
                className="block text-[15px] font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                ACCUEIL
              </Link>
              <Link 
                href="/shop" 
                className="block text-[15px] font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                NOS PRODUITS
              </Link>
              <Link 
                href="/packs" 
                className="block text-[15px] font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                PACKS
              </Link>
              <Link 
                href="/brands" 
                className="block text-[15px] font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                MARQUES
              </Link>
              <Link 
                href="/blog" 
                className="block text-[15px] font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                BLOG
              </Link>
              <Link 
                href="/contact" 
                className="block text-[15px] font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
              <Link 
                href="/about" 
                className="block text-[15px] font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                QUI SOMMES NOUS
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="lg"
                  onClick={() => { setCartDrawerOpen(true); setMobileMenuOpen(false); }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Panier{cartItemsCount > 0 ? ` (${cartItemsCount})` : ''}
                </Button>
                {isAuthenticated ? (
                  <>
                    <Link href="/account" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start" size="lg">
                        <User className="h-5 w-5 mr-2" />
                        Mon Compte
                      </Button>
                    </Link>
                    <Link href="/account/orders" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start" size="lg">
                        <Package className="h-5 w-5 mr-2" />
                        Mes Commandes
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start" size="lg" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <User className="h-5 w-5 mr-2" />
                      Connexion
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="lg"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                  {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  );
}