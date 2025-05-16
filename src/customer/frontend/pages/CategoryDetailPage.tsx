'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import CustomerLayout from '../components/CustomerLayout'
import { ProductCard } from '../components/ProductCard'

// 产品接口
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

// 分类接口
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  image?: string
  products_count?: number
  created_at: string
}

// API错误响应接口
interface ErrorResponse {
  error: string
  details?: string
  code?: string
}

const CategoryDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!id) return
    
    // 加载分类商品数据
    const fetchCategoryProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // 获取分类信息
        const categoryResponse = await fetch(`/api/customer/categories?id=${id}`)
        if (!categoryResponse.ok) {
          const errorData: ErrorResponse = await categoryResponse.json()
          throw new Error(errorData.error || `获取分类信息失败: ${categoryResponse.status}`)
        }
        const categoryData: Category = await categoryResponse.json()
        setCategoryName(categoryData.name)
        
        // 获取该分类的商品
        const productsResponse = await fetch(`/api/customer/products?category=${id}&limit=20`, {
          headers: { 'Cache-Control': 'no-cache' }
        })
        
        if (!productsResponse.ok) {
          const errorData: ErrorResponse = await productsResponse.json()
          throw new Error(errorData.error || `获取分类商品失败: ${productsResponse.status}`)
        }
        
        const data = await productsResponse.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error('获取分类数据失败:', err)
        setError(err instanceof Error ? err.message : '加载失败，请重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategoryProducts()
  }, [id])
  
  return (
    <CustomerLayout>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{categoryName || '加载中...'}</h1>
              <Link href="/" className="text-blue-600 hover:underline">
                返回首页
              </Link>
            </div>
            <div className="mt-2 text-gray-500">
              <Link href="/" className="hover:text-blue-600">首页</Link>
              <span className="mx-2">›</span>
              <span>{categoryName || '加载中...'}</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-medium mb-2">加载失败</h2>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:underline"
              >
                点击刷新
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-medium mb-2">暂无相关商品</h2>
              <p className="text-gray-500 mb-4">我们正在积极丰富该分类的商品</p>
              <Link href="/" className="text-blue-600 hover:underline">
                返回首页浏览其他商品
              </Link>
            </div>
          )}
        </div>
      </main>
    </CustomerLayout>
  )
}

export default CategoryDetailPage 