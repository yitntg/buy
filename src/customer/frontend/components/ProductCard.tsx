'use client'

import React from 'react'
import Link from 'next/link'
import { Product } from '@/shared/types/product'
import { formatCurrency } from '@/shared/utils/formatters'
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'
import { useFavorites } from '@/shared/contexts/FavoritesContext'
import { useCart } from '@/shared/contexts/CartContext'
import StarRating from './StarRating'

interface ProductCardProps {
  product: Product
  showActions?: boolean
  showRating?: boolean
  className?: string
}

export function ProductCard({ 
  product, 
  showActions = true, 
  showRating = true,
  className = '' 
}: ProductCardProps) {
  const { isInFavorites, addToFavorites, removeFromFavorites } = useFavorites()
  const { addItem, isInCart } = useCart()
  
  const isFavorited = isInFavorites(product.id)
  const isInCartAlready = isInCart(product.id.toString())
  
  // 获取要显示的图片
  const displayImage = product.primary_image || 
                      (product.images && product.images.length > 0 ? product.images[0].image_url : '/images/placeholder.jpg')
  
  // 处理添加到收藏夹
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isFavorited) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }
  
  // 处理添加到购物车
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem(product, 1)
  }
  
  return (
    <Link href={`/product/${product.id}`}>
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md ${className}`}>
        {/* 产品图片 */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={displayImage} 
            alt={product.name} 
            className="w-full h-full object-cover object-center"
          />
          
          {/* 收藏和购物车按钮 */}
          {showActions && (
            <div className="absolute top-2 right-2 flex flex-col space-y-2">
              <button 
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full ${isFavorited ? 'bg-pink-50 text-pink-500' : 'bg-white text-gray-400 hover:text-pink-500'}`}
                title={isFavorited ? '取消收藏' : '添加到收藏夹'}
              >
                {isFavorited ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              </button>
              
              <button 
                onClick={handleAddToCart}
                className={`p-2 rounded-full ${isInCartAlready ? 'bg-blue-50 text-blue-500' : 'bg-white text-gray-400 hover:text-blue-500'}`}
                title={isInCartAlready ? '已在购物车中' : '添加到购物车'}
                disabled={(product.stock || 0) <= 0}
              >
                <FaShoppingCart size={16} />
              </button>
            </div>
          )}
          
          {/* 库存状态 */}
          {(product.stock || 0) <= 0 && (
            <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-xs py-1 px-2 text-center">
              售罄
            </div>
          )}
          
          {(product.stock || 0) > 0 && (product.stock || 0) <= 5 && (
            <div className="absolute top-0 left-0 w-full bg-yellow-500 text-white text-xs py-1 px-2 text-center">
              仅剩 {product.stock} 件
            </div>
          )}
        </div>
        
        {/* 产品信息 */}
        <div className="p-4">
          <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-gray-500 text-sm mb-2 line-clamp-2 h-10">
            {product.description}
          </p>
          
          {/* 评分 */}
          {showRating && (product.rating !== undefined) && (
            <div className="flex items-center mb-2">
              <StarRating rating={product.rating} size="sm" />
              {product.reviews !== undefined && (
                <span className="ml-1 text-xs text-gray-500">
                  ({product.reviews})
                </span>
              )}
            </div>
          )}
          
          {/* 价格 */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-blue-600 font-bold">
              {formatCurrency(product.price)}
            </span>
            
            {/* 销量信息 */}
            {product.reviews !== undefined && (
              <span className="text-xs text-gray-500">
                销量: {product.reviews}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
} 
