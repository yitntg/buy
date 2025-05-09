'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating?: number
}

interface ProductRecommendationsProps {
  title?: string
  products: Product[]
  currentProductId?: string // 当前产品的ID，用于排除自身
}

export default function ProductRecommendations({
  title = '猜你喜欢',
  products,
  currentProductId
}: ProductRecommendationsProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  
  // 过滤掉当前产品
  useEffect(() => {
    if (currentProductId) {
      setVisibleProducts(products.filter(p => p.id !== currentProductId))
    } else {
      setVisibleProducts(products)
    }
  }, [products, currentProductId])
  
  // 如果没有产品或只有当前产品，则不显示组件
  if (visibleProducts.length === 0) {
    return null
  }
  
  // 处理滚动
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('recommendations-container')
    if (!container) return
    
    const scrollAmount = 300 // 每次滚动的像素量
    const maxScroll = container.scrollWidth - container.clientWidth
    
    let newPosition = direction === 'left' 
      ? Math.max(scrollPosition - scrollAmount, 0)
      : Math.min(scrollPosition + scrollAmount, maxScroll)
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' })
    setScrollPosition(newPosition)
    
    // 更新箭头显示状态
    setShowLeftArrow(newPosition > 0)
    setShowRightArrow(newPosition < maxScroll)
  }
  
  return (
    <div className="mt-12 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        
        {/* 箭头导航 */}
        <div className="flex space-x-2">
          <button 
            className={`p-1 rounded-full border ${
              showLeftArrow 
                ? 'border-gray-300 text-gray-600 hover:bg-gray-100' 
                : 'border-gray-200 text-gray-300 cursor-default'
            }`}
            onClick={() => handleScroll('left')}
            disabled={!showLeftArrow}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className={`p-1 rounded-full border ${
              showRightArrow 
                ? 'border-gray-300 text-gray-600 hover:bg-gray-100' 
                : 'border-gray-200 text-gray-300 cursor-default'
            }`}
            onClick={() => handleScroll('right')}
            disabled={!showRightArrow}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      {/* 产品滚动容器 */}
      <div 
        id="recommendations-container"
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-4 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleProducts.map(product => (
          <Link 
            href={`/product/${product.id}`} 
            key={product.id}
            className="min-w-[180px] max-w-[180px] snap-start flex-shrink-0 group"
          >
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-all">
              <div className="relative w-full h-40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="180px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="mt-2 text-primary font-bold">
                  ¥{product.price.toFixed(2)}
                </div>
                {product.rating !== undefined && (
                  <div className="mt-1 flex items-center">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg 
                          key={star} 
                          className={`w-3 h-3 ${star <= Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* 自定义滚动条 */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
} 