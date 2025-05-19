'use client'

import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/app/(shared)/contexts/AuthContext'
import { CartProvider } from '@/app/(shared)/contexts/CartContext'
import { FavoritesProvider } from '@/app/(shared)/contexts/FavoritesContext'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
          <Toaster position="top-center" />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
} 