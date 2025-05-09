import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '乐购商城 - 现代化电商网站',
  description: '提供各种优质商品，包含商品上传系统的现代化电商平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <FavoritesProvider>
                {children}
              </FavoritesProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 