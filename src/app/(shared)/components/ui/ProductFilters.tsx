'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { formatCurrency } from '@/src/app/(shared)/utils/formatters'

interface ProductFiltersProps {
  categoryId: string
  minPrice?: number
  maxPrice?: number
  lowestPrice: number
  highestPrice: number
  currentSort: string
}

export default function ProductFilters({
  categoryId,
  minPrice,
  maxPrice,
  lowestPrice,
  highestPrice,
  currentSort
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // 价格范围状态
  const [priceRange, setPriceRange] = useState({
    min: minPrice || lowestPrice,
    max: maxPrice || highestPrice
  })
  
  // 当可用价格范围变化时更新状态
  useEffect(() => {
    setPriceRange({
      min: minPrice !== undefined ? minPrice : lowestPrice,
      max: maxPrice !== undefined ? maxPrice : highestPrice
    })
  }, [lowestPrice, highestPrice, minPrice, maxPrice])
  
  // 应用价格过滤
  const applyPriceFilter = () => {
    // 构建查询参数
    const params = new URLSearchParams()
    
    // 保留现有的排序参数
    if (currentSort && currentSort !== 'newest') {
      params.set('sort', currentSort)
    }
    
    // 添加价格范围
    if (priceRange.min > lowestPrice) {
      params.set('min_price', priceRange.min.toString())
    }
    
    if (priceRange.max < highestPrice) {
      params.set('max_price', priceRange.max.toString())
    }
    
    // 跳转到带有新参数的当前页面
    router.push(`${pathname}?${params.toString()}`)
  }
  
  // 重置所有过滤器
  const resetFilters = () => {
    setPriceRange({
      min: lowestPrice,
      max: highestPrice
    })
    router.push(pathname)
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-medium text-lg mb-4">商品筛选</h3>
      
      {/* 价格范围筛选 */}
      <div className="mb-6">
        <h4 className="text-gray-700 font-medium mb-3">价格范围</h4>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            {formatCurrency(priceRange.min)}
          </span>
          <span className="text-sm text-gray-500">
            {formatCurrency(priceRange.max)}
          </span>
        </div>
        
        <div className="relative mt-2 mb-6">
          <div className="absolute h-1 bg-gray-200 rounded-full w-full"></div>
          <input
            type="range"
            min={lowestPrice}
            max={highestPrice}
            value={priceRange.min}
            onChange={(e) => setPriceRange({
              ...priceRange,
              min: Number(e.target.value)
            })}
            className="absolute w-full appearance-none bg-transparent pointer-events-auto"
            style={{ zIndex: 1 }}
          />
          <input
            type="range"
            min={lowestPrice}
            max={highestPrice}
            value={priceRange.max}
            onChange={(e) => setPriceRange({
              ...priceRange,
              max: Number(e.target.value)
            })}
            className="absolute w-full appearance-none bg-transparent pointer-events-auto"
            style={{ zIndex: 2 }}
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">最低价</label>
            <input
              type="number"
              min={lowestPrice}
              max={priceRange.max}
              value={priceRange.min}
              onChange={(e) => setPriceRange({
                ...priceRange,
                min: Number(e.target.value)
              })}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">最高价</label>
            <input
              type="number"
              min={priceRange.min}
              max={highestPrice}
              value={priceRange.max}
              onChange={(e) => setPriceRange({
                ...priceRange,
                max: Number(e.target.value)
              })}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* 按钮 */}
      <div className="flex space-x-2">
        <button
          onClick={applyPriceFilter}
          className="flex-1 bg-primary text-white rounded-md py-2 text-sm hover:bg-primary-dark transition-colors"
        >
          应用筛选
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50 transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  )
} 