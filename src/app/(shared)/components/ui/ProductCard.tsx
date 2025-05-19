'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/app/(shared)/utils/formatters'
import { Heart } from 'lucide-react'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  image: string
  category?: number
  inventory?: number
  rating?: number
  reviews?: number
  discount_percentage?: number
  is_new?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // 添加收藏
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsFavorite(!isFavorite)
    // 这里可以添加API调用来更新收藏状态
  }
  
  // 添加到购物车
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAddingToCart(true)
    
    // 模拟API调用
    setTimeout(() => {
      setIsAddingToCart(false)
      // 显示成功提示
      console.log('添加到购物车:', product.id)
    }, 500)
  }
  
  // 计算折扣价格
  const discountedPrice = product.discount_percentage
    ? product.price * (1 - product.discount_percentage / 100)
    : null
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative h-52 w-full overflow-hidden">
          <Image 
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className={`object-cover object-center w-full h-full transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            width={300}
            height={300}
          />
          
          {/* 库存标签 */}
          {(product.inventory === 0 || product.inventory === undefined) && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              缺货
            </div>
          )}
          
          {product.inventory !== undefined && product.inventory > 0 && product.inventory < 5 && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              库存紧张
            </div>
          )}
          
          {/* 新品标签 */}
          {product.is_new && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              新品
            </div>
          )}
          
          {/* 折扣标签 */}
          {product.discount_percentage && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount_percentage}%
            </div>
          )}
          
          {/* 收藏按钮 */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-400 hover:bg-gray-100'
            }`}
          >
            <Heart size={16} fill={isFavorite ? "white" : "none"} />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-gray-900 font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {discountedPrice ? (
                <>
                  <span className="text-lg font-bold text-red-500">
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            {product.rating !== undefined && (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm text-gray-600">
                  {product.rating.toFixed(1)}
                  {product.reviews !== undefined && <span className="text-xs ml-1">({product.reviews})</span>}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <button 
          className={`w-full rounded-md py-2 transition-colors flex items-center justify-center ${
            isAddingToCart
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
          onClick={addToCart}
          disabled={isAddingToCart || product.inventory === 0}
        >
          {isAddingToCart ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              添加中...
            </>
          ) : product.inventory === 0 ? (
            '缺货'
          ) : (
            '加入购物车'
          )}
        </button>
      </div>
    </div>
  )
} 