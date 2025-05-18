'use client'

import { Suspense } from 'react';
import Header from '@/src/app/(shared)/components/Header';
import Footer from '@/src/app/(shared)/components/Footer';
import LoadingFallback from '@/src/app/(shared)/components/loading/PageLoading';

// 客户端布局组件
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-20 pb-40 flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </>
  );
} 