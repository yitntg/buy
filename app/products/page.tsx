'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useTheme } from '../context/ThemeContext'

// 定义商品类型接口
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: number
  inventory: number
  rating: number
  reviews: number
  specifications?: Record<string, string | number>
}

// 定义分页类型
interface Pagination {
  total: number
  totalPages: number
  currentPage: number
  limit: number
}

export default function ProductsPage() {
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
  const [limit] = useState(10)
  
  // 筛选器下拉菜单状态
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  // 自定义价格范围
  const [customPriceMin, setCustomPriceMin] = useState('')
  const [customPriceMax, setCustomPriceMax] = useState('')
  
  // 分类数据
  const categories = [
    { id: 1, name: '电子产品' },
    { id: 2, name: '家居用品' },
    { id: 3, name: '服装鞋帽' },
    { id: 4, name: '美妆护肤' },
    { id: 5, name: '食品饮料' },
    { id: 6, name: '运动户外' }
  ]
  
  // 价格区间
  const priceRanges = [
    { id: '0-100', name: '¥0 - ¥100' },
    { id: '100-300', name: '¥100 - ¥300' },
    { id: '300-500', name: '¥300 - ¥500' },
    { id: '500-1000', name: '¥500 - ¥1000' },
    { id: '1000-999999', name: '¥1000以上' }
  ]
  
  // 获取主题设置
  const { theme, updateTheme } = useTheme()
  
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
      
      // 获取数据
      const res = await fetch(`/api/products?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      if (!res.ok) {
        throw new Error('获取商品列表失败')
      }
      
      const data = await res.json()
      
      if (data && data.products) {
        // 无限滚动模式下，将新数据追加到现有数据
        if (append) {
          setProducts(prev => [...prev, ...data.products])
        } else {
          setProducts(data.products)
        }
        
        // 判断是否还有更多数据
        setHasMore(data.products.length === limit && pageNumber < (data.totalPages || 1))
      } else {
        console.error('API返回的数据格式不正确', data)
        setProducts(append ? products : [])
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
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            {/* 商品页标题栏 - 左侧标题，右侧搜索*/}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                全部商品
                <span className="ml-3 text-sm font-normal text-gray-500">({products.length}件)</span>
              </h1>
              
              {/* 搜索栏 - 集成在标题行 */}
              <div className="w-full md:w-auto md:min-w-[300px]">
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
            
            {/* 高级筛选栏 - 合并筛选和布局控制 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  {/* 筛选按钮组 - 左侧 */}
                  <div className="flex flex-wrap gap-3">
                    {/* 分类筛选下拉菜单 */}
                    <div className="relative inline-block text-left">
                      <button 
                        id="category-button"
                        type="button" 
                        className={`inline-flex justify-center items-center rounded-md border ${selectedCategories.length > 0 ? 'border-primary bg-blue-50' : 'border-gray-300'} shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary`}
                        onClick={() => toggleDropdown('category')}
                        aria-expanded={openDropdown === 'category'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${selectedCategories.length > 0 ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        分类
                        {selectedCategories.length > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                            {selectedCategories.length}
                          </span>
                        )}
                      </button>
                      <div 
                        id="category-dropdown" 
                        className={`${openDropdown === 'category' ? 'block' : 'hidden'} origin-top-right absolute left-0 mt-2 w-64 md:w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10`} 
                        role="menu"
                      >
                        <div className="py-1 p-2 max-h-60 overflow-y-auto" role="none">
                          {categories.map(category => (
                            <div key={category.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                              <input 
                                type="checkbox" 
                                id={`category-${category.id}`}
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                                className="h-4 w-4 text-primary rounded focus:ring-primary"
                              />
                              <label 
                                htmlFor={`category-${category.id}`}
                                className="ml-2 text-sm text-gray-700 block w-full cursor-pointer"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        {selectedCategories.length > 0 && (
                          <div className="border-t border-gray-100 p-2">
                            <button
                              onClick={() => {
                                setSelectedCategories([]);
                                setPage(1);
                              }}
                              className="w-full text-sm text-gray-500 hover:text-primary py-1"
                            >
                              清除所有分类
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 价格筛选下拉菜单 */}
                    <div className="relative inline-block text-left">
                      <button 
                        id="price-button"
                        type="button" 
                        className={`inline-flex justify-center items-center rounded-md border ${selectedPriceRanges.length > 0 ? 'border-primary bg-blue-50' : 'border-gray-300'} shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary`}
                        onClick={() => toggleDropdown('price')}
                        aria-expanded={openDropdown === 'price'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${selectedPriceRanges.length > 0 ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        价格
                        {selectedPriceRanges.length > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                            {selectedPriceRanges.length}
                          </span>
                        )}
                      </button>
                      <div 
                        id="price-dropdown" 
                        className={`${openDropdown === 'price' ? 'block' : 'hidden'} origin-top-right absolute left-0 mt-2 w-64 md:w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10`} 
                        role="menu"
                      >
                        <div className="py-1 p-2 max-h-60 overflow-y-auto" role="none">
                          {priceRanges.map(range => (
                            <div key={range.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                              <input 
                                type="checkbox" 
                                id={`price-${range.id}`}
                                checked={selectedPriceRanges.includes(range.id)}
                                onChange={() => handlePriceRangeChange(range.id)}
                                className="h-4 w-4 text-primary rounded focus:ring-primary"
                              />
                              <label 
                                htmlFor={`price-${range.id}`}
                                className="ml-2 text-sm text-gray-700 block w-full cursor-pointer"
                              >
                                {range.name}
                              </label>
                            </div>
                          ))}
                          
                          {/* 自定义价格范围 */}
                          <div className="border-t border-gray-100 mt-2 pt-3 px-2">
                            <p className="text-sm text-gray-500 mb-2">自定义价格范围</p>
                            <form onSubmit={handleCustomPriceSubmit} className="flex items-center space-x-2">
                              <input 
                                type="number" 
                                placeholder="¥最低" 
                                min="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={customPriceMin}
                                onChange={(e) => setCustomPriceMin(e.target.value)}
                              />
                              <span className="text-gray-400">-</span>
                              <input 
                                type="number" 
                                placeholder="¥最高" 
                                min="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={customPriceMax}
                                onChange={(e) => setCustomPriceMax(e.target.value)}
                              />
                              <button 
                                type="submit"
                                className="bg-primary text-white p-1 rounded hover:bg-blue-600"
                                disabled={!customPriceMin || !customPriceMax}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            </form>
                          </div>
                        </div>
                        {selectedPriceRanges.length > 0 && (
                          <div className="border-t border-gray-100 p-2">
                            <button
                              onClick={() => {
                                setSelectedPriceRanges([]);
                                setPage(1);
                              }}
                              className="w-full text-sm text-gray-500 hover:text-primary py-1"
                            >
                              清除所有价格筛选
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 评分筛选下拉菜单 */}
                    <div className="relative inline-block text-left">
                      <button 
                        id="rating-button"
                        type="button" 
                        className={`inline-flex justify-center items-center rounded-md border ${minRating ? 'border-primary bg-blue-50' : 'border-gray-300'} shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary`}
                        onClick={() => toggleDropdown('rating')}
                        aria-expanded={openDropdown === 'rating'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${minRating ? 'text-yellow-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        评分
                        {minRating && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                            {minRating}★+
                          </span>
                        )}
                      </button>
                      <div 
                        id="rating-dropdown" 
                        className={`${openDropdown === 'rating' ? 'block' : 'hidden'} origin-top-right absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10`} 
                        role="menu"
                      >
                        <div className="py-1 p-2" role="none">
                          {[4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                              <input 
                                type="radio" 
                                id={`rating-${rating}`}
                                checked={minRating === rating}
                                onChange={() => handleRatingChange(rating)}
                                className="h-4 w-4 text-primary focus:ring-primary"
                              />
                              <label 
                                htmlFor={`rating-${rating}`}
                                className="ml-2 text-sm text-gray-700 flex items-center cursor-pointer w-full"
                              >
                                {rating}星及以上
                                <span className="ml-1 text-yellow-400">{'★'.repeat(rating)}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                        {minRating && (
                          <div className="border-t border-gray-100 p-2">
                            <button
                              onClick={() => {
                                setMinRating(null);
                                setPage(1);
                              }}
                              className="w-full text-sm text-gray-500 hover:text-primary py-1"
                            >
                              清除评分筛选
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 排序选项 */}
                  <div className="relative inline-block">
                    <select 
                      className="rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={sortBy}
                      onChange={handleSortChange}
                    >
                      <option value="recommend">推荐</option>
                      <option value="newest">最新</option>
                      <option value="price-asc">价格由低到高</option>
                      <option value="price-desc">价格由高到低</option>
                      <option value="rating">评分</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* 已选择的筛选条件标签 */}
              {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || minRating) && (
                <div className="flex flex-wrap gap-2 mt-3 border-t pt-3 border-gray-100">
                  {selectedCategories.length > 0 && selectedCategories.map(catId => {
                    const category = categories.find(c => c.id === catId);
                    return category ? (
                      <span key={category.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.name}
                        <button
                          type="button"
                          className="ml-1 inline-flex text-blue-500 hover:text-blue-700 focus:outline-none"
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ) : null;
                  })}
                  
                  {selectedPriceRanges.length > 0 && selectedPriceRanges.map(rangeId => {
                    const range = priceRanges.find(r => r.id === rangeId);
                    return range ? (
                      <span key={range.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {range.name}
                        <button
                          type="button"
                          className="ml-1 inline-flex text-green-500 hover:text-green-700 focus:outline-none"
                          onClick={() => handlePriceRangeChange(range.id)}
                        >
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ) : null;
                  })}
                  
                  {minRating && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {minRating}星及以上
                      <button
                        type="button"
                        className="ml-1 inline-flex text-yellow-500 hover:text-yellow-700 focus:outline-none"
                        onClick={() => handleRatingChange(minRating)}
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  )}
                  
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    清除全部
                  </button>
                </div>
              )}
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
      </main>
      <Footer />
    </>
  )
} 