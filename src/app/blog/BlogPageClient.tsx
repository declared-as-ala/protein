'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { Pagination } from '@/app/components/ui/pagination';
import { motion } from 'motion/react';
import type { Article } from '@/types';
import { getStorageUrl } from '@/services/api';
import { format } from 'date-fns';

interface BlogPageClientProps {
  articles: Article[];
}

const ARTICLES_PER_PAGE = 9;

export function BlogPageClient({ articles }: BlogPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 1;
  });

  // Sort articles by date (latest to oldest)
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
  }, [articles]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = useMemo(
    () => sortedArticles.slice(startIndex, endIndex),
    [sortedArticles, startIndex, endIndex]
  );

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage === 1) {
      params.delete('page');
    } else {
      params.set('page', currentPage.toString());
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '/blog';
    router.replace(newUrl, { scroll: false });
  }, [currentPage, router, searchParams]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Découvrez nos articles sur la nutrition sportive, l'entraînement et les compléments alimentaires
          </motion.p>
        </div>

        {sortedArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Aucun article disponible pour le moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedArticles.map((article, index) => {
              const articleDate = article.created_at ? new Date(article.created_at) : new Date();
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <Link href={`/blog/${article.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      {article.cover ? (
                        <Image
                          src={getStorageUrl(article.cover)}
                          alt={article.designation_fr}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{format(articleDate, 'dd MMMM yyyy')}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {article.designation_fr}
                      </h2>
                      {article.description_fr && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {article.description_fr}
                        </p>
                      )}
                      <Button variant="outline" className="w-full">
                        Lire la suite
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </Link>
                </motion.article>
              );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Results Info */}
            {sortedArticles.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Affichage de {startIndex + 1} à {Math.min(endIndex, sortedArticles.length)} sur {sortedArticles.length} article{sortedArticles.length > 1 ? 's' : ''}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
