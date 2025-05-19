import { Suspense } from 'react';
import LoadingFallback from '@/src/app/(shared)/components/loading/PageLoading';
import { CustomerProvider } from './contexts/CustomerContext';
import { dynamic, fetchCache, revalidate } from './config';

// 导出服务器配置
export { dynamic, fetchCache, revalidate };

// 客户端布局组件
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CustomerProvider>
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </main>
    </CustomerProvider>
  );
} 