'use client'

import { useState, useEffect } from 'react'
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
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [limit] = useState(12)
  
  // 筛选和搜索状态
  const [keyword, setKeyword] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('recommend')
  
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
  const fetchProducts = async () => {
    setLoading(true)
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
      
      params.append('page', currentPage.toString())
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
        setProducts(data.products)
        setTotalProducts(data.total || 0)
        setTotalPages(data.totalPages || 1)
      } else {
        console.error('API返回的数据格式不正确', data)
        setProducts([])
        setTotalProducts(0)
        setTotalPages(1)
      }
    } catch (err) {
      console.error('获取商品列表出错:', err)
      setError('获取商品列表失败，请稍后重试')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }
  
  // 首次加载和筛选条件变化时获取数据
  useEffect(() => {
    fetchProducts()
  }, [
    keyword, 
    selectedCategories, 
    selectedPriceRanges, 
    minRating, 
    sortBy, 
    currentPage
  ])
  
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
    setCurrentPage(1)
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
    setCurrentPage(1)
  }
  
  // 处理评分选择
  const handleRatingChange = (rating: number) => {
    setMinRating(prev => prev === rating ? null : rating)
    // 重置到第一页
    setCurrentPage(1)
  }
  
  // 处理排序方式变化
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value)
    // 重置到第一页
    setCurrentPage(1)
  }
  
  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }
  
  // 处理搜索
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    // 重置到第一页
    setCurrentPage(1)
    fetchProducts()
  }
  
  // 重置筛选条件
  const resetFilters = () => {
    setKeyword('')
    setSelectedCategories([])
    setSelectedPriceRanges([])
    setMinRating(null)
    setSortBy('recommend')
    setCurrentPage(1)
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">全部商品</h1>
          
          {/* 搜索栏 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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
                className="bg-primary text-white px-6 py-2 rounded-r-md hover:bg-blue-600"
              >
                搜索
              </button>
            </form>
          </div>
          
          {/* 新的水平筛选栏 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* 分类筛选下拉菜单 */}
              <div className="relative inline-block text-left">
                <button 
                  type="button" 
                  className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  onClick={() => {
                    const elem = document.getElementById('category-dropdown');
                    if (elem) elem.classList.toggle('hidden');
                  }}
                >
                  分类
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div id="category-dropdown" className="hidden origin-top-right absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu">
                  <div className="py-1 p-2" role="none">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                        <input 
                          type="checkbox" 
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="h-4 w-4 text-primary rounded"
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
                </div>
              </div>
              
              {/* 价格筛选下拉菜单 */}
              <div className="relative inline-block text-left">
                <button 
                  type="button" 
                  className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  onClick={() => {
                    const elem = document.getElementById('price-dropdown');
                    if (elem) elem.classList.toggle('hidden');
                  }}
                >
                  价格区间
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div id="price-dropdown" className="hidden origin-top-right absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu">
                  <div className="py-1 p-2" role="none">
                    {priceRanges.map(range => (
                      <div key={range.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                        <input 
                          type="checkbox" 
                          id={`price-${range.id}`}
                          checked={selectedPriceRanges.includes(range.id)}
                          onChange={() => handlePriceRangeChange(range.id)}
                          className="h-4 w-4 text-primary rounded"
                        />
                        <label 
                          htmlFor={`price-${range.id}`}
                          className="ml-2 text-sm text-gray-700 block w-full cursor-pointer"
                        >
                          {range.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 评分筛选下拉菜单 */}
              <div className="relative inline-block text-left">
                <button 
                  type="button" 
                  className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  onClick={() => {
                    const elem = document.getElementById('rating-dropdown');
                    if (elem) elem.classList.toggle('hidden');
                  }}
                >
                  评分
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div id="rating-dropdown" className="hidden origin-top-right absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu">
                  <div className="py-1 p-2" role="none">
                    {[4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                        <input 
                          type="checkbox" 
                          id={`rating-${rating}`}
                          checked={minRating === rating}
                          onChange={() => handleRatingChange(rating)}
                          className="h-4 w-4 text-primary rounded"
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
                </div>
              </div>
              
              {/* 排序选项 */}
              <div className="relative inline-block text-left">
                <select 
                  className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
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
              
              {/* 已选择的筛选条件标签 */}
              <div className="flex flex-wrap gap-2 mt-4 w-full">
                {selectedCategories.length > 0 && selectedCategories.map(catId => {
                  const category = categories.find(c => c.id === catId);
                  return category ? (
                    <span key={category.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {category.name}
                      <button
                        type="button"
                        className="ml-1 inline-flex text-blue-500 hover:text-blue-700 focus:outline-none"
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ) : null;
                })}
                
                {selectedPriceRanges.length > 0 && selectedPriceRanges.map(rangeId => {
                  const range = priceRanges.find(r => r.id === rangeId);
                  return range ? (
                    <span key={range.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {range.name}
                      <button
                        type="button"
                        className="ml-1 inline-flex text-green-500 hover:text-green-700 focus:outline-none"
                        onClick={() => handlePriceRangeChange(range.id)}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ) : null;
                })}
                
                {minRating && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {minRating}星及以上
                    <button
                      type="button"
                      className="ml-1 inline-flex text-yellow-500 hover:text-yellow-700 focus:outline-none"
                      onClick={() => handleRatingChange(minRating)}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                )}
                
                {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || minRating) && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    清除全部
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* 商品统计和排列方式 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap justify-between items-center">
            <div className="text-sm text-gray-500">
              共找到 <span className="text-primary font-medium">{totalProducts}</span> 件商品
            </div>
            
            {/* 添加布局切换按钮 */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => updateTheme({ productLayout: 'grid' })}
                className={`p-2 rounded-md ${theme.productLayout === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                title="网格布局"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => updateTheme({ productLayout: 'waterfall' })}
                className={`p-2 rounded-md ${theme.productLayout === 'waterfall' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                title="瀑布流布局"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </button>
              <button 
                onClick={() => updateTheme({ productLayout: 'list' })}
                className={`p-2 rounded-md ${theme.productLayout === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                title="列表布局"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-600">加载商品中...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-red-500 mb-4">⚠️</div>
              <h2 className="text-xl font-medium mb-4">{error}</h2>
              <button 
                onClick={fetchProducts}
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
              {/* 商品展示 - 根据主题设置选择布局 */}
              {theme.productLayout === 'waterfall' ? (
                // 瀑布流布局
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 [column-fill:_balance]" style={{columnGap: '1.5rem'}}>
                  {products.map((product) => (
                    <div key={product.id} className="break-inside-avoid-column mb-6 w-full inline-block">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : theme.productLayout === 'list' ? (
                // 列表布局
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="w-full">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 relative" style={{height: '200px'}}>
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="p-4 md:w-3/4 flex flex-col justify-between">
                            <div>
                              <h3 className="font-medium text-lg mb-2 hover:text-primary transition-colors">
                                <Link href={`/product/${product.id}`}>
                                  {product.name}
                                </Link>
                              </h3>
                              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                              {product.rating !== undefined && (
                                <div className="mb-2 flex items-center">
                                  <div className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500 ml-1">
                                    {product.rating?.toFixed(1)} ({product.reviews || 0}评价)
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-primary font-bold">{product.price.toLocaleString('zh-CN', {style: 'currency', currency: 'CNY'})}</span>
                              <Link 
                                href={`/product/${product.id}`}
                                className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                              >
                                查看详情
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // 默认网格布局
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              
              {/* 分页组件，完全重写为更直观的分页控件 */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow">
                    {/* 上一页按钮 */}
                    <button
                      onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } rounded-l-md border border-gray-300`}
                    >
                      上一页
                    </button>
                    
                    {/* 页码按钮 - 逻辑完全重写 */}
                    <div className="flex">
                      {/* 始终显示第一页 */}
                      <button
                        onClick={() => handlePageChange(1)}
                        className={`px-4 py-2 text-sm font-medium border-t border-b border-l border-gray-300 ${
                          currentPage === 1
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        1
                      </button>
                      
                      {/* 如果不在第一页附近，显示省略号 */}
                      {currentPage > 3 && (
                        <span className="px-3 py-2 border-t border-b border-l border-gray-300 bg-white text-gray-500">
                          ...
                        </span>
                      )}
                      
                      {/* 显示当前页码的前后页 */}
                      {Array.from({ length: totalPages })
                        .map((_, i) => i + 1)
                        .filter(page => {
                          // 不显示第一页和最后一页(已单独处理)
                          if (page === 1 || page === totalPages) return false;
                          
                          // 显示当前页及其前后一页
                          return Math.abs(currentPage - page) <= 1 ||
                               // 如果当前页靠近开始，多显示几页
                               (currentPage <= 3 && page <= 4) ||
                               // 如果当前页靠近结束，多显示几页
                               (currentPage >= totalPages - 2 && page >= totalPages - 3);
                        })
                        .map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 text-sm font-medium border-t border-b border-l border-gray-300 ${
                              currentPage === page
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      
                      {/* 如果不在最后页附近，显示省略号 */}
                      {currentPage < totalPages - 2 && (
                        <span className="px-3 py-2 border-t border-b border-l border-gray-300 bg-white text-gray-500">
                          ...
                        </span>
                      )}
                      
                      {/* 始终显示最后一页 */}
                      {totalPages > 1 && (
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className={`px-4 py-2 text-sm font-medium border-t border-b border-l border-gray-300 ${
                            currentPage === totalPages
                              ? 'bg-primary text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>
                    
                    {/* 下一页按钮 */}
                    <button
                      onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } rounded-r-md border border-gray-300`}
                    >
                      下一页
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 