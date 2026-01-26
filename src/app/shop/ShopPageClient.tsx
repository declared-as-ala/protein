'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ProductCard } from '@/app/components/ProductCard';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Slider } from '@/app/components/ui/slider';
import { Checkbox } from '@/app/components/ui/checkbox';
import { X, Filter, SlidersHorizontal, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { Pagination } from '@/app/components/ui/pagination';
import type { Product, Category, Brand } from '@/types';
import { searchProducts, getProductsByCategory, getProductsBySubCategory, getProductsByBrand } from '@/services/api';
import { getStorageUrl } from '@/services/api';

interface ShopPageClientProps {
  productsData: {
    products: Product[];
    brands: Brand[];
    categories: Category[];
  };
  categories: Category[];
  brands: Brand[];
}

function ShopContent({ productsData, categories, brands }: ShopPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>(productsData.products || []);
  const [isSearching, setIsSearching] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const PRODUCTS_PER_PAGE = 12;

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    
    if (category) {
      setSelectedCategories([decodeURIComponent(category)]);
    }
    if (brand) {
      setSelectedBrands([parseInt(brand)]);
    }
    if (search) {
      setSearchQuery(decodeURIComponent(search));
    }
  }, [searchParams]);

  // Get unique subcategories from ALL products (not just filtered) for proper mapping
  const subCategories = useMemo(() => {
    const subs = new Map<string, { id: number; name: string; slug: string; categoryId?: number }>();
    const allProducts = productsData.products || [];
    allProducts.forEach(p => {
      if (p.sous_categorie) {
        const key = p.sous_categorie.id.toString();
        if (!subs.has(key)) {
          subs.set(key, {
            id: p.sous_categorie.id,
            name: p.sous_categorie.designation_fr,
            slug: p.sous_categorie.slug,
            categoryId: p.sous_categorie.categorie_id,
          });
        }
      }
    });
    return Array.from(subs.values());
  }, [productsData.products]);

  // Helper to normalize strings for comparison (remove accents, lowercase, remove extra spaces)
  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  // Convert name to slug format (e.g., "Gainers Haute Énergie" -> "gainers-haute-energie")
  const nameToSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .trim();
  };

  // Find subcategory by name (case-insensitive, accent-insensitive, flexible matching)
  const findSubCategoryByName = (name: string): { id: number; name: string; slug: string } | null => {
    const normalizedName = normalizeString(name);
    
    // First try exact match
    let found = subCategories.find(sub => normalizeString(sub.name) === normalizedName);
    
    // If no exact match, try partial match (contains)
    if (!found) {
      found = subCategories.find(sub => 
        normalizeString(sub.name).includes(normalizedName) || 
        normalizedName.includes(normalizeString(sub.name))
      );
    }
    
    return found ? { id: found.id, name: found.name, slug: found.slug } : null;
  };

  // Get min and max prices
  const priceBounds = useMemo(() => {
    const prices = products
      .map(p => p.promo && p.promo_expiration_date ? p.promo : p.prix)
      .filter((price): price is number => price !== null && price !== undefined);
    if (prices.length === 0) return { min: 0, max: 1000 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Update price range when bounds change
  useEffect(() => {
    if (priceBounds.max > 0) {
      setPriceRange([priceBounds.min, priceBounds.max]);
    }
  }, [priceBounds]);

  // Helper function to check if product matches search query (handles multiple words)
  const matchesSearch = (product: Product, query: string): boolean => {
    if (!query.trim()) return true;
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
    if (searchTerms.length === 0) return true;
    
    const productText = [
      product.designation_fr || '',
      product.designation_ar || '',
      product.brand?.designation_fr || '',
      product.sous_categorie?.designation_fr || '',
    ].join(' ').toLowerCase();
    
    // All search terms must be found in the product text
    return searchTerms.every(term => productText.includes(term));
  };

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          // For better multi-word search, always use client-side filtering on all products
          // This handles cases like "isolate whey" where words might be in different positions
          const allProducts = productsData.products || [];
          const foundProducts = allProducts.filter(product => matchesSearch(product, searchQuery));
          setProducts(foundProducts);
          
          // Also try backend search as fallback for single word queries (faster)
          if (searchQuery.trim().split(/\s+/).length === 1) {
            try {
              const result = await searchProducts(searchQuery);
              if (result.products && result.products.length > 0) {
                // Merge results, removing duplicates
                const backendIds = new Set(foundProducts.map(p => p.id));
                const newProducts = result.products.filter(p => !backendIds.has(p.id));
                setProducts([...foundProducts, ...newProducts]);
              }
            } catch (backendError) {
              // Ignore backend errors, use client-side results
            }
          }
        } catch (error) {
          console.error('Search error:', error);
          setProducts([]);
        } finally {
          setIsSearching(false);
        }
      } else if (selectedCategories.length > 0) {
        // Filter by category/subcategory
        try {
          const categoryParam = selectedCategories[0];
          
          // Strategy: Try multiple approaches in order
          // 1. Try as category slug FIRST (for category titles like "prise-de-masse")
          // 2. Try as subcategory slug (for subcategory items like "gainers-haute-energie")
          // 3. Convert name to slug and try subcategory
          // 4. Find subcategory by name and use its slug
          // 5. Fallback to client-side filtering
          
          let productsFound = false;
          
          // First: Try as category slug (e.g., "prise-de-masse", "perte-de-poids")
          // This handles category titles from ProductsDropdown
          try {
            const result = await getProductsByCategory(categoryParam);
            if (result.products && result.products.length > 0) {
              setProducts(result.products);
              productsFound = true;
            } else if (result.products && result.products.length === 0) {
              // API returned empty but valid response - category exists but has no products
              setProducts([]);
              productsFound = true;
            }
          } catch (catError: any) {
            // Not a valid category slug, continue to next attempt
            if (catError.response?.status !== 404) {
              console.warn('Category API error:', catError);
            }
          }
          
          // Second: Try as subcategory slug directly (e.g., "gainers-haute-energie", "carbohydrates")
          if (!productsFound) {
            try {
              const result = await getProductsBySubCategory(categoryParam);
              if (result.products && result.products.length > 0) {
                setProducts(result.products);
                productsFound = true;
              } else if (result.products && result.products.length === 0) {
                // API returned empty but valid response - subcategory exists but has no products
                setProducts([]);
                productsFound = true;
              }
            } catch (subError: any) {
              // Not a valid subcategory slug or API error, continue to next attempt
              if (subError.response?.status !== 404) {
                console.warn('Subcategory API error:', subError);
              }
            }
          }
          
          // Third: Convert name to slug format and try subcategory (e.g., "Gainers Haute Énergie" -> "gainers-haute-energie")
          if (!productsFound) {
            const slugFromName = nameToSlug(categoryParam);
            if (slugFromName && slugFromName !== categoryParam) {
              try {
                const result = await getProductsBySubCategory(slugFromName);
                if (result.products && result.products.length > 0) {
                  setProducts(result.products);
                  productsFound = true;
                }
              } catch (slugError: any) {
                // Slug conversion didn't work, continue
              }
            }
          }
          
          // Fourth: Find subcategory by name and use its slug
          if (!productsFound) {
            const subCategory = findSubCategoryByName(categoryParam);
            if (subCategory) {
              try {
                const result = await getProductsBySubCategory(subCategory.slug);
                setProducts(result.products || []);
                productsFound = true;
              } catch (subError: any) {
                // API failed, will try other methods
                console.warn(`Subcategory found by name but API failed: ${subCategory.slug}`, subError);
              }
            }
          }
          
          // Fifth: Final fallback - client-side filtering by subcategory name
          if (!productsFound) {
            const allProducts = productsData.products || [];
            const filtered = allProducts.filter(p => 
              p.sous_categorie && (
                normalizeString(p.sous_categorie.designation_fr) === normalizeString(categoryParam) ||
                p.sous_categorie.slug === categoryParam ||
                p.sous_categorie.slug === nameToSlug(categoryParam)
              )
            );
            setProducts(filtered);
            if (filtered.length > 0) {
              productsFound = true;
            }
          }
          
          if (!productsFound) {
            console.warn(`No products found for category/subcategory: ${categoryParam}`);
          }
        } catch (error: any) {
          console.error('Category filter error:', error);
          setProducts([]);
        }
      } else if (selectedBrands.length > 0) {
        // Filter by brand
        try {
          const brandId = selectedBrands[0];
          const result = await getProductsByBrand(brandId);
          setProducts(result.products || []);
        } catch (error) {
          console.error('Brand filter error:', error);
        }
      } else {
        // Reset to all products
        setProducts(productsData.products || []);
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategories, selectedBrands, productsData.products]);

  // Filter products locally (for price and additional filters)
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Price filter
    filtered = filtered.filter(product => {
      const price = product.promo && product.promo_expiration_date ? product.promo : product.prix;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Brand filter (if not already filtered by API)
    if (selectedBrands.length > 0 && !searchQuery && selectedCategories.length === 0) {
      filtered = filtered.filter(product => 
        product.brand_id && selectedBrands.includes(product.brand_id)
      );
    }

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => {
        // rupture === 1 means in stock, undefined also means in stock
        const isInStock = (product as any).rupture === 1 || (product as any).rupture === undefined;
        return isInStock;
      });
    }

    return filtered;
  }, [products, priceRange, selectedBrands, searchQuery, selectedCategories, inStockOnly]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, inStockOnly]);

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(c => c !== categorySlug)
        : [categorySlug] // Only one category at a time for API filtering
    );
  };

  const toggleBrand = (brandId: number) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(b => b !== brandId)
        : [brandId] // Only one brand at a time for API filtering
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([priceBounds.min, priceBounds.max]);
    setInStockOnly(false);
    setCurrentPage(1);
    setProducts(productsData.products || []);
    router.push('/shop');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Tous nos produits
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isSearching ? (
              'Recherche en cours...'
            ) : totalPages > 1 ? (
              `Affichage ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-${Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} sur ${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''}`
            ) : (
              `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} trouvé${filteredProducts.length > 1 ? 's' : ''}`
            )}
          </p>
        </motion.div>

        {/* Search and Filter Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="md:hidden mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Filtres</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="text-sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* In Stock Filter - Moved to top for visibility */}
              <div>
                <h3 className="font-medium mb-3">Disponibilité</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobile-in-stock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(checked === true)}
                  />
                  <label
                    htmlFor="mobile-in-stock"
                    className="text-sm cursor-pointer flex-1"
                  >
                    En stock uniquement
                  </label>
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Catégories</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-cat-${category.id}`}
                          checked={selectedCategories.includes(category.slug)}
                          onCheckedChange={() => toggleCategory(category.slug)}
                        />
                        <label
                          htmlFor={`mobile-cat-${category.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {category.designation_fr}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {brands.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Marques</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map(brand => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-brand-${brand.id}`}
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={() => toggleBrand(brand.id)}
                        />
                        <label
                          htmlFor={`mobile-brand-${brand.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {brand.designation_fr}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">
                  Prix: {priceRange[0]} DT - {priceRange[1]} DT
                </h3>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{priceBounds.min} DT</span>
                  <span>{priceBounds.max} DT</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6 sticky top-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Filtres</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Réinitialiser
                </Button>
              </div>

              {/* In Stock Filter - Moved to top for visibility */}
              <div>
                <h3 className="font-medium mb-3">Disponibilité</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="desktop-in-stock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(checked === true)}
                  />
                  <label
                    htmlFor="desktop-in-stock"
                    className="text-sm cursor-pointer flex-1"
                  >
                    En stock uniquement
                  </label>
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Catégories</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`desktop-cat-${category.id}`}
                          checked={selectedCategories.includes(category.slug)}
                          onCheckedChange={() => toggleCategory(category.slug)}
                        />
                        <label
                          htmlFor={`desktop-cat-${category.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {category.designation_fr}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {brands.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Marques</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {brands.map(brand => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`desktop-brand-${brand.id}`}
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={() => toggleBrand(brand.id)}
                        />
                        <label
                          htmlFor={`desktop-brand-${brand.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {brand.designation_fr}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">
                  Prix: {priceRange[0]} DT - {priceRange[1]} DT
                </h3>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{priceBounds.min} DT</span>
                  <span>{priceBounds.max} DT</span>
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isSearching ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Recherche en cours...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Aucun produit trouvé
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export function ShopPageClient(props: ShopPageClientProps) {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Chargement des produits..." />}>
      <ShopContent {...props} />
    </Suspense>
  );
}
