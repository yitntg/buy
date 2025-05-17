import { Suspense } from 'react';
import Header from '../(shared)/components/Header';
import Footer from '../(shared)/components/Footer';
import LoadingFallback from '../(shared)/components/loading/PageLoading';

// 客户端路由布局
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