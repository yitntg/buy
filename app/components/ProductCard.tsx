'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

// 定义商品类型接口
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category?: number
  inventory?: number
  rating?: number
  reviews?: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  
  // 格式化价格显示
  const formatPrice = (price: number) => {
    return price.toLocaleString('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };
  
  // 处理加入购物车
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.inventory !== undefined && product.inventory <= 0) {
      return
    }
    
    setIsAdding(true)
    
    try {
      // 添加商品到购物车
      await new Promise(resolve => setTimeout(resolve, 300))  // 模拟延迟
      addItem(product, 1)
      
      // 显示成功消息
      window.alert(`已将 ${product.name} 添加到购物车`)
    } catch (err) {
      console.error('加入购物车失败:', err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {product.inventory !== undefined && product.inventory <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-medium px-2 py-1 rounded">已售罄</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold">{formatPrice(product.price)}</span>
          <button 
            className="bg-primary text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={isAdding || (product.inventory !== undefined && product.inventory <= 0)}
          >
            {isAdding ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中
              </>
            ) : "加入购物车"}
          </button>
        </div>
        {product.rating !== undefined && (
          <div className="mt-2 flex items-center">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {product.rating?.toFixed(1)} ({product.reviews || 0}评价)
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 