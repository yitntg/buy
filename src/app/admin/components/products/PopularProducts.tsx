'use client'

import { Card } from '../ui/card'
import { Product } from '@/app/(shared)/types/product'
import Link from 'next/link'
import Image from 'next/image'

interface PopularProductsProps {
  products?: Product[];
  isLoading?: boolean;
}

export default function PopularProducts({ products = [], isLoading = false }: PopularProductsProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">热门商品</h2>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          查看全部
        </Link>
      </div>
      
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={product.primary_image || '/images/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </p>
              <p className="text-sm text-gray-500">
                库存: {product.inventory}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <span className="text-sm font-medium text-gray-900">
                ¥{product.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 