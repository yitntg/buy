'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

// 定义产品类型
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
}

// 定义分类类型
interface Category {
  id: number
  name: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const categoryId = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sort = searchParams.get('sort') || 'relevance'
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId)
  const [priceRange, setPriceRange] = useState({
    min: minPrice || '',
    max: maxPrice || ''
  })
  const [selectedSort, setSelectedSort] = useState(sort)
  
  // 模拟分类数据
  useEffect(() => {
    const mockCategories = [
      { id: 1, name: '电子产品' },
      { id: 2, name: '家居用品' },
      { id: 3, name: '服装鞋帽' },
      { id: 4, name: '美妆护肤' },
      { id: 5, name: '食品饮料' },
      { id: 6, name: '运动户外' }
    ]
    
    setCategories(mockCategories)
  }, [])
  
  // 获取搜索结果
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      
      try {
        // 构建查询参数
        const params = new URLSearchParams()
        if (query) params.append('keyword', query)
        if (selectedCategory) params.append('category', selectedCategory)
        if (priceRange.min) params.append('minPrice', priceRange.min)
        if (priceRange.max) params.append('maxPrice', priceRange.max)
        params.append('sortBy', selectedSort)
        params.append('page', currentPage.toString())
        
        // 发送API请求
        const res = await fetch(`/api/products?${params.toString()}`)
        
        if (!res.ok) {
          throw new Error('获取搜索结果失败')
        }
        
        const data = await res.json()
        setProducts(data.products)
        setTotalProducts(data.total)
      } catch (error) {
        console.error('搜索错误:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchSearchResults()
  }, [query, selectedCategory, priceRange.min, priceRange.max, selectedSort, currentPage])
  
  // 处理分类选择
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1) // 重置页码
  }
  
  // 处理价格范围变化
  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 应用价格筛选
  const applyPriceFilter = () => {
    setCurrentPage(1) // 重置页码
    // 价格过滤应用已经在useEffect依赖中，这里只需要重置页码
  }
  
  // 处理排序方式变化
  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType)
    setCurrentPage(1) // 重置页码
  }
  
  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-light">
        <div className="container mx-auto px-4">
          {/* 搜索标题 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              {query ? `"${query}" 的搜索结果` : '所有商品'}
            </h1>
            <p className="text-gray-600 mt-1">
              找到 {totalProducts} 个商品
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧筛选栏 */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">筛选条件</h2>
                
                {/* 商品分类 */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">商品分类</h3>
                  <div className="space-y-2">
                    <div 
                      className={`cursor-pointer ${selectedCategory === null ? 'text-primary font-medium' : 'hover:text-primary'}`}
                      onClick={() => handleCategoryChange(null)}
                    >
                      全部分类
                    </div>
                    {categories.map(category => (
                      <div 
                        key={category.id}
                        className={`cursor-pointer ${selectedCategory === category.id.toString() ? 'text-primary font-medium' : 'hover:text-primary'}`}
                        onClick={() => handleCategoryChange(category.id.toString())}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 价格区间 */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">价格区间</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="最低价"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="最高价"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={applyPriceFilter}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    应用价格筛选
                  </button>
                </div>
                
                {/* 商品评分 */}
                <div>
                  <h3 className="font-medium mb-3">商品评分</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center cursor-pointer hover:text-primary">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-1">及以上</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 右侧商品列表 */}
            <div className="lg:w-3/4">
              {/* 排序选项 */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
                <div className="text-gray-600 hidden md:block">排序方式</div>
                <div className="flex items-center space-x-4">
                  <button
                    className={`px-3 py-1 rounded ${selectedSort === 'relevance' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => handleSortChange('relevance')}
                  >
                    相关度
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${selectedSort === 'latest' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => handleSortChange('latest')}
                  >
                    最新
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${selectedSort === 'priceAsc' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => handleSortChange('priceAsc')}
                  >
                    价格从低到高
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${selectedSort === 'priceDesc' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => handleSortChange('priceDesc')}
                  >
                    价格从高到低
                  </button>
                </div>
              </div>
              
              {/* 商品列表 */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-80">
                      <div className="w-full h-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h2 className="text-xl font-medium mb-2">未找到相关商品</h2>
                  <p className="text-gray-600 mb-4">
                    尝试使用其他搜索词或调整筛选条件
                  </p>
                  <Link 
                    href="/products"
                    className="text-primary hover:underline"
                  >
                    查看全部商品
                  </Link>
                </div>
              )}
              
              {/* 分页 */}
              {products.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      上一页
                    </button>
                    
                    {Array.from({ length: Math.min(5, Math.ceil(totalProducts / 12)) }).map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded ${
                            currentPage === pageNum
                              ? 'bg-primary text-white'
                              : 'border hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(totalProducts / 12)}
                      className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 