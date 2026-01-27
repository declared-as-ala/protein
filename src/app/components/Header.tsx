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
  const [cartOpen, setCartOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const cartItemsCount = getTotalItems();

  return (
    <>
      {/* Premium Top Bar */}
      <PremiumTopBar />
      
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-2.5 px-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <a href="tel:+21673200500" className="flex items-center gap-2 hover:text-red-500 transition-colors" aria-label="Appeler au +216 73 200 500">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
              <span>+216 73 200 500</span>
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

            {/* Right Actions: Profile, Theme, Cart, Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl h-10 w-10 relative z-50">
                      <User className="h-5 w-5" />
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
                <Button variant="ghost" size="sm" className="hidden sm:flex h-10 px-4" asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl h-10 w-10"
                aria-label="Toggle theme"
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
                  className="relative hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors h-10 w-10 min-h-[48px] min-w-[48px]"
                  asChild
                >
                  <Link href="/cart" aria-label={`Panier${cartItemsCount > 0 ? ` avec ${cartItemsCount} article${cartItemsCount > 1 ? 's' : ''}` : ''}`}>
                    <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                    {cartItemsCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                        aria-label={`${cartItemsCount} article${cartItemsCount > 1 ? 's' : ''} dans le panier`}
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
                className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 h-10 w-10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Bottom Row: Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 pb-4 border-t border-gray-200/50 dark:border-gray-800/50 pt-4">
            <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              ACCUEIL
            </Link>
            <ProductsDropdown />
            <Link href="/packs" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              PACKS
            </Link>
            <Link href="/brands" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              MARQUES
            </Link>
            <Link href="/blog" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              BLOG
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              CONTACT
            </Link>
            <Link href="/about" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              QUI SOMMES NOUS
            </Link>
            <Link href="/calculators" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors whitespace-nowrap px-2 py-1">
              CALCULATEURS
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
                className="block text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                ACCUEIL
              </Link>
              <Link 
                href="/shop" 
                className="block text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                NOS PRODUITS
              </Link>
              <Link 
                href="/packs" 
                className="block text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                PACKS
              </Link>
              <Link 
                href="/brands" 
                className="block text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                MARQUES
              </Link>
              <Link 
                href="/blog" 
                className="block text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                BLOG
              </Link>
              <Link 
                href="/contact" 
                className="block text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
              <Link 
                href="/about" 
                className="block text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                QUI SOMMES NOUS
              </Link>
              <Link 
                href="/calculators" 
                className="block text-base font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                CALCULATEURS
              </Link>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
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
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}