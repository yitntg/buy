'use client'

import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
  showNumber?: boolean
  editable?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  color = '#FFB800',
  className = '',
  showNumber = false,
  editable = false,
  onChange
}: StarRatingProps) {
  // 确保评分在合理范围内
  const normalizedRating = Math.max(0, Math.min(rating, maxRating))
  
  // 根据size设置星星大小
  const getStarSize = () => {
    switch (size) {
      case 'sm': return 14
      case 'lg': return 24
      default: return 18
    }
  }
  
  const starSize = getStarSize()
  
  // 处理点击星星事件
  const handleStarClick = (index: number) => {
    if (editable && onChange) {
      onChange(index + 1)
    }
  }
  
  // 生成星星数组
  const renderStars = () => {
    const stars = []
    
    for (let i = 0; i < maxRating; i++) {
      if (i < Math.floor(normalizedRating)) {
        // 实心星星
        stars.push(
          <FaStar 
            key={i} 
            color={color} 
            size={starSize} 
            onClick={() => handleStarClick(i)}
            className={editable ? 'cursor-pointer' : ''}
          />
        )
      } else if (i < Math.ceil(normalizedRating) && normalizedRating % 1 !== 0) {
        // 半心星星
        stars.push(
          <FaStarHalfAlt 
            key={i} 
            color={color} 
            size={starSize} 
            onClick={() => handleStarClick(i)}
            className={editable ? 'cursor-pointer' : ''}
          />
        )
      } else {
        // 空心星星
        stars.push(
          <FaRegStar 
            key={i} 
            color={color} 
            size={starSize} 
            onClick={() => handleStarClick(i)}
            className={editable ? 'cursor-pointer' : ''}
          />
        )
      }
    }
    
    return stars
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {renderStars()}
      </div>
      
      {showNumber && (
        <span className="ml-1 text-gray-600 text-sm">
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  )
} 
