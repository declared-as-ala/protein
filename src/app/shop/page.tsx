import { Metadata } from 'next';
import { getAllProducts, getCategories, getAllBrands } from '@/services/api';
import { ShopPageClient } from './ShopPageClient';

export const metadata: Metadata = {
  title: 'Boutique - Tous nos Produits | Sobitas',
  description: 'Découvrez notre large gamme de produits protéines, créatine, gainer, BCAA et compléments alimentaires en Tunisie.',
};

async function getShopData() {
  try {
    const [productsData, categories, brands] = await Promise.all([
      getAllProducts(),
      getCategories(),
      getAllBrands(),
    ]);
    return { productsData, categories, brands };
  } catch (error) {
    console.error('Error fetching shop data:', error);
    return {
      productsData: { products: [], brands: [], categories: [] },
      categories: [],
      brands: [],
    };
  }
}

export default async function ShopPage() {
  const { productsData, categories, brands } = await getShopData();

  return <ShopPageClient productsData={productsData} categories={categories} brands={brands} />;
}
