'use client'

import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  )
} 