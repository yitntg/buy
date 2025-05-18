'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react'

interface ProductActionsProps {
  price: number
  originalPrice?: number
  inventory: number
  onAddToCart: (quantity: number) => Promise<void>
  onBuyNow: (quantity: number) => Promise<void>
  onAddToWishlist?: () => void
  disablePurchase?: boolean
}

export default function ProductActions({
  price,
  originalPrice,
  inventory,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  disablePurchase = false
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  
  // 监听滚动来控制粘性效果
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsSticky(scrollPosition > 200)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 手动调整数量
  const adjustQuantity = (amount: number) => {
    setQuantity(prev => {
      const newValue = prev + amount
      return newValue > 0 && newValue <= inventory ? newValue : prev
    })
  }
  
  // 手动输入数量
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0 && value <= inventory) {
      setQuantity(value)
    }
  }
  
  // 添加到购物车
  const handleAddToCart = async () => {
    if (disablePurchase || inventory <= 0 || isProcessing) return
    
    setIsProcessing(true)
    try {
      await onAddToCart(quantity)
      setShowSuccessAnimation(true)
      setTimeout(() => setShowSuccessAnimation(false), 2000)
    } catch (error) {
      console.error('添加到购物车失败:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  // 立即购买
  const handleBuyNow = async () => {
    if (disablePurchase || inventory <= 0 || isProcessing) return
    
    setIsProcessing(true)
    try {
      await onBuyNow(quantity)
    } catch (error) {
      console.error('立即购买失败:', error)
      setIsProcessing(false)
    }
  }
  
  return (
    <div className={`transition-all ${isSticky ? 'md:sticky md:top-24' : ''}`}>
      {/* 价格区域 */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-primary">¥{price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className="ml-2 text-gray-500 line-through text-sm">¥{originalPrice.toFixed(2)}</span>
          )}
          
          {originalPrice && originalPrice > price && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
              {Math.round((1 - price / originalPrice) * 100)}% 优惠
            </span>
          )}
        </div>
        
        {/* 促销信息 */}
        <div className="mt-2 text-sm text-red-500 font-medium">
          {inventory <= 5 && inventory > 0 ? `仅剩 ${inventory} 件，抓紧下单！` : ''}
        </div>
      </div>
      
      {/* 数量选择器 */}
      <div className="mb-6">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
          数量:
        </label>
        <div className="flex w-36">
          <button
            type="button"
            onClick={() => adjustQuantity(-1)}
            disabled={quantity <= 1 || disablePurchase}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronDown size={18} />
          </button>
          <input
            type="text"
            id="quantity"
            value={quantity}
            onChange={handleInputChange}
            disabled={disablePurchase}
            className="w-16 h-10 border-y border-gray-300 text-center focus:ring-primary focus:border-primary"
          />
          <button
            type="button"
            onClick={() => adjustQuantity(1)}
            disabled={quantity >= inventory || disablePurchase}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronUp size={18} />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {inventory > 0 ? `库存 ${inventory} 件` : '无货'}
        </div>
      </div>
      
      {/* 购买按钮 */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={disablePurchase || inventory <= 0 || isProcessing}
          className={`relative flex items-center justify-center px-6 py-3 border ${
            inventory <= 0
              ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-primary bg-white text-primary hover:bg-blue-50 active:bg-blue-100'
          } rounded-md font-medium transition-colors`}
        >
          {showSuccessAnimation && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-primary text-white text-xs items-center justify-center">
                +1
              </span>
            </span>
          )}
          <ShoppingCart size={20} className="mr-2" />
          {isProcessing ? '添加中...' : '加入购物车'}
        </button>
        
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={disablePurchase || inventory <= 0 || isProcessing}
          className={`flex items-center justify-center px-6 py-3 ${
            inventory <= 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-blue-600 active:bg-blue-700'
          } text-white rounded-md font-medium transition-colors`}
        >
          {isProcessing ? '处理中...' : '立即购买'}
        </button>
      </div>
    </div>
  )
} 