'use client';

import { CartProvider } from '@/src/app/(shared)/contexts/CartContext'
import { AuthProvider } from '@/src/app/(shared)/contexts/AuthContext'
import { ThemeProvider } from '@/src/app/(shared)/contexts/ThemeContext'
import { FavoritesProvider } from '@/src/app/(shared)/contexts/FavoritesContext'
import ErrorBoundary from '@/src/app/(shared)/components/ErrorBoundary'
import Header from '@/src/app/(shared)/layouts/components/Header'
import Footer from '@/src/app/(shared)/layouts/components/Footer'

// 组合Context Providers简化嵌套
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header />
              {children}
              <Footer />
            </FavoritesProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
} 