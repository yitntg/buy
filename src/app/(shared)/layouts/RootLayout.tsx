'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/src/app/(shared)/contexts/CartContext'
import { AuthProvider } from '@/src/app/(shared)/contexts/AuthContext'
import { ThemeProvider } from '@/src/app/(shared)/contexts/ThemeContext'
import { FavoritesProvider } from '@/src/app/(shared)/contexts/FavoritesContext'
import Header from '@/src/app/(shared)/components/Header'
import Footer from '@/src/app/(shared)/components/Footer'
import { Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '乐购商城-测试版本e835f8c',
  description: '现代化电商平台',
}

// 组合Context Providers简化嵌套
const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ThemeProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </CartProvider>
    </ThemeProvider>
  </AuthProvider>
)

// 加载中状态组件
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

// 修改为使用全局页眉页脚的布局
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AppProviders>
          <ErrorBoundary>
            <Header />
            <main className="pt-20 pb-40 flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                {children}
              </Suspense>
            </main>
            <Footer />
          </ErrorBoundary>
        </AppProviders>
      </body>
    </html>
  )
} 
