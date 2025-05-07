'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
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
  const { theme } = useTheme()
  const [isAdding, setIsAdding] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isFadeIn, setIsFadeIn] = useState(false)
  
  // 组件加载后执行渐入动画
  useState(() => {
    setTimeout(() => setIsFadeIn(true), 50);
  });
  
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
  
  // 处理收藏商品
  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  // 快速查看商品
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 这里可以实现快速查看功能，如弹出模态框
    alert(`快速查看: ${product.name}`);
  };

  // 根据主题设置动态构建样式
  const cardClasses = [
    "bg-white rounded-lg overflow-hidden",
    "transition-all duration-300",
    isFadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
    theme.cardHoverShadow ? "hover:shadow-lg shadow-md" : "",
    theme.cardHoverTransform ? "hover:-translate-y-1" : "",
    "w-full"
  ].filter(Boolean).join(" ");

  // 显示评级星星
  const renderStars = () => {
    if (!product.rating) return null;
    
    return (
      <div className="flex text-yellow-400 text-xs">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full flex flex-col">
        <Link href={`/product/${product.id}`} className="block relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-in-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {isHovered && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button 
                onClick={handleToggleLike} 
                className="bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                aria-label={isLiked ? "从收藏中移除" : "添加到收藏"}
              >
                {isLiked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
            </div>
          )}
          
          {product.inventory !== undefined && product.inventory <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-medium px-2 py-1 rounded">已售罄</span>
            </div>
          )}
          
          {/* 打折标签示例 */}
          {product.id % 3 === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              限时优惠
            </div>
          )}
        </Link>
        
        {/* 紧凑的卡片底部信息 */}
        <div className="p-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <Link href={`/product/${product.id}`} className="flex-1">
              <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            
            {/* 加入购物车按钮 */}
            <button 
              className="ml-2 bg-primary text-white p-1.5 rounded-full hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center flex-shrink-0"
              onClick={handleAddToCart}
              disabled={isAdding || (product.inventory !== undefined && product.inventory <= 0)}
              aria-label="加入购物车"
            >
              {isAdding ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
            {product.rating && (
              <div className="flex items-center">
                {renderStars()}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviews || 0})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 