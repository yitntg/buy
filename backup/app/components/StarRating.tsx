'use client'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  reviewCount?: number
  className?: string
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  reviewCount,
  className = ''
}: StarRatingProps) {
  // 根据尺寸计算星星大小
  const starSizeClass = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];
  
  // 根据尺寸计算文本大小
  const textSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];
  
  // 根据尺寸设置间距
  const spacingClass = {
    sm: 'space-x-0.5',
    md: 'space-x-1',
    lg: 'space-x-1.5'
  }[size];
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex text-yellow-400 ${spacingClass}`}>
        {[...Array(maxRating)].map((_, i) => (
          <svg
            key={i}
            className={`${starSizeClass} ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={i < Math.floor(rating) ? 0 : 2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ))}
      </div>
      
      {showNumber && (
        <span className={`ml-1.5 ${textSizeClass} text-gray-600 font-medium`}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {reviewCount !== undefined && (
        <span className={`ml-1 ${textSizeClass} text-gray-500`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
} 