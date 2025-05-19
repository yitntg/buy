'use client'

import { ReactNode } from 'react'

interface AdminMainContentProps {
  children: ReactNode
  title: string
  description?: string
}

export function AdminMainContent({ children, title, description }: AdminMainContentProps) {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  )
} 