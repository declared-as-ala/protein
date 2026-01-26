import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductDetails, getSimilarProducts } from '@/services/api';
import { getStorageUrl } from '@/services/api';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductDetails(id);
    const imageUrl = product.cover ? getStorageUrl(product.cover) : '';
    
    return {
      title: `${product.designation_fr} | Sobitas`,
      description: product.description_cover || product.description_fr || `Découvrez ${product.designation_fr} sur Sobitas`,
      openGraph: {
        title: product.designation_fr,
        description: product.description_cover || product.description_fr || '',
        images: imageUrl ? [imageUrl] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.designation_fr,
        description: product.description_cover || product.description_fr || '',
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Produit | Sobitas',
      description: 'Découvrez nos produits de qualité',
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  try {
    const [product, similarData] = await Promise.all([
      getProductDetails(id),
      getProductDetails(id).then(p => 
        p.sous_categorie_id ? getSimilarProducts(p.sous_categorie_id) : Promise.resolve({ products: [] })
      ).catch(() => ({ products: [] })),
    ]);

    if (!product) {
      notFound();
    }

    return <ProductDetailClient product={product} similarProducts={similarData.products || []} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
