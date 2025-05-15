'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/shared/contexts/CartContext'
import { AuthProvider } from '@/shared/contexts/AuthContext'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'
import { FavoritesProvider } from '@/shared/contexts/FavoritesContext'
import Header from './components/Header'
import Footer from './components/Footer'
import { Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'

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
      <body className={inter.className}>
        <AppProviders>
          <ErrorBoundary>
            <Header />
            <main className="pt-20 pb-40">
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
