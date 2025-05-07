'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

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
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* 筛选侧边栏 */}
            <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">筛选条件</h2>
              
              {/* 分类筛选 */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">商品分类</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <label 
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 价格筛选 */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">价格区间</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <div key={range.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`price-${range.id}`}
                        checked={selectedPriceRanges.includes(range.id)}
                        onChange={() => handlePriceRangeChange(range.id)}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <label 
                        htmlFor={`price-${range.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 评分筛选 */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">商品评分</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`rating-${rating}`}
                        checked={minRating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <label 
                        htmlFor={`rating-${rating}`}
                        className="ml-2 text-sm text-gray-700 flex items-center"
                      >
                        {rating}星及以上
                        <span className="ml-1 text-yellow-400">{'★'.repeat(rating)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600"
                onClick={resetFilters}
              >
                重置筛选
              </button>
            </div>
            
            {/* 商品列表 */}
            <div className="flex-1">
              {/* 排序选项 */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  共找到 <span className="text-primary font-medium">{totalProducts}</span> 件商品
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">排序：</span>
                  <select 
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
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
                  {/* 商品网格 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 