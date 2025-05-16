'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ProductCard } from '../components/ProductCard'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Product } from '@/shared/types/product'
import CustomerLayout from '../components/CustomerLayout'

// 定义分类类型
interface Category {
  id: number
  name: string
  description?: string
}

// 定义分页类型
interface Pagination {
  total: number
  totalPages: number
  currentPage: number
  limit: number
}

export default function ProductsPage() {
  // 获取主题设置
  const { theme, updateTheme } = useTheme()

  // 分类数据状态
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  // 加载分类数据
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/customer/categories')
      const data = await response.json()
      
      if (response.ok) {
        setCategories(Array.isArray(data) ? data : [])
      } else {
        console.error('获取分类失败:', data.error || '未知错误')
      }
    } catch (err) {
      console.error('获取分类列表出错:', err)
    } finally {
      setLoadingCategories(false)
    }
  }

  // 初始加载分类数据
  useEffect(() => {
    fetchCategories()
  }, [])
  
  // 价格区间
  const priceRanges = [
    { id: '0-100', name: '¥0 - ¥100' },
    { id: '100-300', name: '¥100 - ¥300' },
    { id: '300-500', name: '¥300 - ¥500' },
    { id: '500-1000', name: '¥500 - ¥1000' },
    { id: '1000-999999', name: '¥1000以上' }
  ]
  
  // 状态管理
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // 无限滚动状态
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  
  // 筛选和搜索状态
  const [keyword, setKeyword] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('recommend')
  // 每次加载的商品数量
  const [limit] = useState(12)
  
  // 筛选器下拉菜单状态
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  // 自定义价格范围
  const [customPriceMin, setCustomPriceMin] = useState('')
  const [customPriceMax, setCustomPriceMax] = useState('')
  
  // 筛选项商品计数
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>({})
  const [priceRangeCounts, setPriceRangeCounts] = useState<Record<string, number>>({})
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({})
  const [totalProducts, setTotalProducts] = useState(0)
  
  // 获取产品数据
  const fetchProducts = async (pageNumber = 1, append = false) => {
    if (pageNumber === 1) {
      setLoading(true)
    }
    setError('')
    
    try {
      // 构建查询参数
      const params = new URLSearchParams()
      
      if (keyword) {
        params.append('keyword', keyword)
      }
      
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(category => {
          params.append('category', category.toString())
        })
      }
      
      if (selectedPriceRanges.length > 0) {
        // 获取最低和最高价格
        const minPrice = Math.min(...selectedPriceRanges.map(range => parseInt(range.split('-')[0])))
        const maxPrice = Math.max(...selectedPriceRanges.map(range => parseInt(range.split('-')[1])))
        
        params.append('minPrice', minPrice.toString())
        params.append('maxPrice', maxPrice.toString())
      }
      
      if (minRating) {
        params.append('minRating', minRating.toString())
      }
      
      if (sortBy && sortBy !== 'recommend') {
        params.append('sortBy', sortBy)
      }
      
      params.append('page', pageNumber.toString())
      params.append('limit', limit.toString())

      console.log('筛选参数:', params.toString());
      
      // 调用API获取商品数据
      const response = await fetch(`/api/customer/products?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok && data) {
        // 无限滚动模式下，将新数据追加到现有数据
        if (append) {
          setProducts(prev => [...prev, ...data.products])
        } else {
          setProducts(data.products || [])
        }
        
        // 更新商品总数
        if (data.total !== undefined) {
          setTotalProducts(data.total)
        }
        
        // 更新筛选计数
        if (pageNumber === 1 && data.filterCounts) {
          setCategoryCounts(data.filterCounts.categories || {})
          setPriceRangeCounts(data.filterCounts.priceRanges || {})
          setRatingCounts(data.filterCounts.ratings || {})
        }
        
        // 判断是否还有更多数据
        const totalPages = data.totalPages || Math.ceil((data.total || 0) / limit)
        setHasMore(data.products?.length === limit && pageNumber < totalPages)
      } else {
        console.error('获取商品失败:', data.error || '未知错误')
        if (!append) {
          setProducts([])
        }
        setError(data.error || '获取商品列表失败，请稍后重试')
        setHasMore(false)
      }
    } catch (err) {
      console.error('获取商品列表出错:', err)
      setError('获取商品列表失败，请稍后重试')
      if (!append) {
        setProducts([])
      }
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // 监听滚动加载更多
  const lastProductRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // 当最后一个商品元素可见时，加载更多商品
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  // 初始加载和页码变化时获取数据
  useEffect(() => {
    fetchProducts(page, page > 1);
  }, [page]);
  
  // 筛选条件变化时重置页码并重新获取数据
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    // 主动触发数据获取
    fetchProducts(1, false);
  }, [
    keyword, 
    selectedCategories, 
    selectedPriceRanges, 
    minRating, 
    sortBy
  ]);
  
  // 处理点击其他区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const target = event.target as HTMLElement;
        const dropdown = document.getElementById(`${openDropdown}-dropdown`);
        const button = document.getElementById(`${openDropdown}-button`);
        
        if (dropdown && button && !dropdown.contains(target) && !button.contains(target)) {
          setOpenDropdown(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);
  
  // 切换下拉菜单
  const toggleDropdown = (id: string) => {
    setOpenDropdown(prevDropdown => prevDropdown === id ? null : id);
  };
  
  // 处理自定义价格范围提交
  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (customPriceMin && customPriceMax) {
      const min = parseInt(customPriceMin);
      const max = parseInt(customPriceMax);
      
      if (!isNaN(min) && !isNaN(max) && min >= 0 && max > min) {
        const customRangeId = `${min}-${max}`;
        
        // 检查自定义范围是否已存在
        if (!selectedPriceRanges.includes(customRangeId)) {
          setSelectedPriceRanges(prev => [...prev, customRangeId]);
          setPage(1);
          setOpenDropdown(null);
        }
      }
    }
  };
  
  // 处理分类选择
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
    // 重置到第一页
    setPage(1)
  }
  
  // 处理价格区间选择
  const handlePriceRangeChange = (rangeId: string) => {
    setSelectedPriceRanges(prev => {
      if (prev.includes(rangeId)) {
        return prev.filter(id => id !== rangeId)
      } else {
        return [...prev, rangeId]
      }
    })
    // 重置到第一页
    setPage(1)
  }
  
  // 处理评分选择
  const handleRatingChange = (rating: number) => {
    setMinRating(prev => prev === rating ? null : rating)
    // 重置到第一页
    setPage(1)
  }
  
  // 处理排序方式变化
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value)
    // 重置到第一页
    setPage(1)
  }
  
  // 处理搜索
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    // 重置数据并从第一页开始
    setProducts([])
    setPage(1)
    setHasMore(true)
  }
  
  // 重置筛选条件
  const resetFilters = () => {
    setKeyword('')
    setSelectedCategories([])
    setSelectedPriceRanges([])
    setMinRating(null)
    setSortBy('recommend')
    setProducts([])
    setPage(1)
    setHasMore(true)
  }
  
  return (
    <CustomerLayout>
      <div className="bg-white">
        <div className="container mx-auto pb-16">
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-900">全部商品 <span className="text-base font-normal text-gray-500">({totalProducts})</span></h1>
              
              {/* 筛选器和排序控件 */}
              <div className="flex flex-wrap items-center space-x-2 mt-4 md:mt-0">
                {/* 保留其他筛选和排序控件 */}
              </div>

              {/* 搜索栏 */}
              <div className="flex-1 max-w-xl ml-auto">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="搜索商品..."
                    className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {loading && products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-600">加载商品中...</p>
              </div>
            </div>
          ) : error && products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-red-500 mb-4">⚠️</div>
              <h2 className="text-xl font-medium mb-4">{error}</h2>
              <button 
                onClick={() => {
                  setPage(1)
                  fetchProducts(1, false)
                }}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 inline-block"
              >
                重试
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-gray-400 mb-4">🔍</div>
              <h2 className="text-xl font-medium mb-4">未找到符合条件的商品</h2>
              <p className="text-gray-500 mb-8">尝试调整筛选条件或搜索关键词</p>
              <button 
                onClick={resetFilters}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 inline-block"
              >
                清除筛选
              </button>
            </div>
          ) : (
            <>
              {/* 商品展示 - 使用网格布局 */}
              <div className="transition-all duration-500">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {products.map((product, index) => {
                    // 将最后一个元素添加引用，用于无限滚动
                    if (index === products.length - 1) {
                      return (
                        <div key={product.id} ref={lastProductRef} className="transform transition duration-300 hover:scale-[1.03]">
                          <ProductCard product={product} />
                        </div>
                      );
                    } else {
                      return (
                        <div key={product.id} className="transform transition duration-300 hover:scale-[1.03]">
                          <ProductCard product={product} />
                        </div>
                      );
                    }
                  })}
                </div>
                
                {/* 加载更多指示器 */}
                {loading && products.length > 0 && (
                  <div className="flex justify-center items-center py-8" ref={loadingRef}>
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                
                {/* 已到底提示 */}
                {!hasMore && products.length > 0 && (
                  <div className="text-center text-gray-500 py-8">
                    已显示全部商品
                  </div>
                )}
              </div>
              
              {/* 添加悬浮"返回顶部"按钮 */}
              <div className="fixed bottom-10 right-6 z-50">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-primary bg-opacity-80 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none"
                  aria-label="返回顶部"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
} 
