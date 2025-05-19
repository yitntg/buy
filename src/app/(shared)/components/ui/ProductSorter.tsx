'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface ProductSorterProps {
  currentSort: string
  categoryId: string
}

export default function ProductSorter({ currentSort, categoryId }: ProductSorterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // 处理排序变更
  const handleSortChange = (newSort: string) => {
    // 构建新的查询参数
    const params = new URLSearchParams(searchParams.toString())
    
    // 更新或移除排序参数
    if (newSort === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', newSort)
    }
    
    // 跳转到新的URL
    router.push(`${pathname}?${params.toString()}`)
  }
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">排序:</span>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          className={`px-4 py-1 text-sm font-medium border rounded-l-lg ${
            currentSort === 'newest' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => handleSortChange('newest')}
        >
          最新上架
        </button>
        <button
          className={`px-4 py-1 text-sm font-medium border-t border-b ${
            currentSort === 'price_asc' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => handleSortChange('price_asc')}
        >
          价格从低到高
        </button>
        <button
          className={`px-4 py-1 text-sm font-medium border-t border-b ${
            currentSort === 'price_desc' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => handleSortChange('price_desc')}
        >
          价格从高到低
        </button>
        <button
          className={`px-4 py-1 text-sm font-medium border rounded-r-lg ${
            currentSort === 'rating' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => handleSortChange('rating')}
        >
          好评优先
        </button>
      </div>
    </div>
  )
} 