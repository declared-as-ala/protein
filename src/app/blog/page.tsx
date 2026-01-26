import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllArticles } from '@/services/api';
import { BlogPageClient } from './BlogPageClient';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Blog - Articles & Conseils | Sobitas',
  description: 'Découvrez nos articles sur la nutrition sportive, l\'entraînement et les compléments alimentaires',
};

async function getBlogData() {
  try {
    const articles = await getAllArticles();
    return { articles };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return { articles: [] };
  }
}

export default async function BlogPage() {
  const { articles } = await getBlogData();
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Chargement du blog..." />}>
      <BlogPageClient articles={articles} />
    </Suspense>
  );
}
