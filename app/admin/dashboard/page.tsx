'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 定义仪表盘数据类型
interface DashboardStats {
  totalProducts: number
  totalCategories: number
  recentReviews: any[]
  lowStockProducts: any[]
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    recentReviews: [],
    lowStockProducts: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'not_initialized'>('connected')
  
  // 检查用户是否已登录，如果未登录则重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin/dashboard')
    } else {
      fetchDashboardData()
    }
  }, [isAuthenticated, router])
  
  // 获取仪表盘数据
  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 获取产品数量
      const productsRes = await fetch('/api/products?limit=1')
      const productsData = await productsRes.json()
      
      // 检查是否返回了错误
      if (productsData.error) {
        if (productsData.error.includes('数据库') || productsData.code === '42P01') {
          setDbStatus('not_initialized')
          throw new Error('数据库表尚未初始化，请先初始化数据库')
        } else {
          throw new Error(productsData.error)
        }
      }
      
      // 获取分类数量
      const categoriesRes = await fetch('/api/admin/categories')
      const categoriesData = await categoriesRes.json()
      
      if (categoriesData.error) {
        throw new Error(categoriesData.error)
      }
      
      // 获取最近评论
      const reviewsRes = await fetch('/api/admin/reviews/recent')
      const reviewsData = await reviewsRes.json()
      
      if (reviewsData.error) {
        throw new Error(reviewsData.error)
      }
      
      // 获取库存不足的产品
      const lowStockRes = await fetch('/api/admin/products/low-stock')
      const lowStockData = await lowStockRes.json()
      
      if (lowStockData.error) {
        throw new Error(lowStockData.error)
      }
      
      setStats({
        totalProducts: productsData.total || 0,
        totalCategories: categoriesData.categories?.length || 0,
        recentReviews: reviewsData.reviews || [],
        lowStockProducts: lowStockData.products || []
      })
      
      setDbStatus('connected')
    } catch (error: any) {
      console.error('获取仪表盘数据失败:', error)
      setError(error.message || '获取仪表盘数据失败')
      
      if (error.message?.includes('数据库') || error.message?.includes('表不存在')) {
        setDbStatus('not_initialized')
      } else {
        setDbStatus('error')
      }
    } finally {
      setLoading(false)
    }
  }
  
  // 重试加载数据
  const handleRetry = () => {
    fetchDashboardData()
  }
  
  // 导航到数据库初始化页面
  const handleNavigateToDbSetup = () => {
    router.push('/admin/tools/setup')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }
  
  // 显示数据库错误
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold">管理员仪表盘</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex items-center text-amber-500 mb-4">
              <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold">数据加载失败</h2>
            </div>
            
            <p className="text-gray-600 mb-6">{error}</p>
            
            {dbStatus === 'not_initialized' ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleNavigateToDbSetup}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  初始化数据库
                </button>
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  重试加载
                </button>
              </div>
            ) : (
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                重试加载
              </button>
            )}
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">管理员仪表盘</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* 快速统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500 text-sm uppercase mb-2">商品总数</h2>
            <p className="text-3xl font-bold text-primary">{stats.totalProducts}</p>
            <Link href="/admin/products" className="mt-4 text-sm text-primary hover:underline block">
              查看所有商品 →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500 text-sm uppercase mb-2">分类总数</h2>
            <p className="text-3xl font-bold text-primary">{stats.totalCategories}</p>
            <Link href="/admin/categories" className="mt-4 text-sm text-primary hover:underline block">
              查看所有分类 →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500 text-sm uppercase mb-2">库存不足商品</h2>
            <p className="text-3xl font-bold text-amber-500">{stats.lowStockProducts.length}</p>
            <Link href="/admin/products?filter=low-stock" className="mt-4 text-sm text-primary hover:underline block">
              查看库存不足商品 →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500 text-sm uppercase mb-2">最近评论</h2>
            <p className="text-3xl font-bold text-green-500">{stats.recentReviews.length}</p>
            <Link href="/admin/reviews" className="mt-4 text-sm text-primary hover:underline block">
              查看所有评论 →
            </Link>
          </div>
        </div>
        
        {/* 快速操作 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">快速操作</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/admin/products/new" 
              className="block p-4 border rounded-lg text-center hover:bg-gray-50"
            >
              添加新商品
            </Link>
            
            <Link 
              href="/admin/categories/new" 
              className="block p-4 border rounded-lg text-center hover:bg-gray-50"
            >
              添加新分类
            </Link>
            
            <Link 
              href="/admin/setup" 
              className="block p-4 border rounded-lg text-center hover:bg-gray-50"
            >
              数据库设置
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 最近评论 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">最近评论</h2>
            
            {stats.recentReviews.length > 0 ? (
              <ul className="divide-y">
                {stats.recentReviews.map(review => (
                  <li key={review.id} className="py-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{review.username}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <Link 
                        href={`/product/${review.product_id}`} 
                        className="ml-2 text-sm text-primary hover:underline"
                      >
                        查看商品
                      </Link>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {review.comment.length > 100 
                        ? `${review.comment.slice(0, 100)}...` 
                        : review.comment}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无评论</p>
            )}
            
            {stats.recentReviews.length > 0 && (
              <div className="mt-4 text-right">
                <Link href="/admin/reviews" className="text-sm text-primary hover:underline">
                  查看所有评论 →
                </Link>
              </div>
            )}
          </div>
          
          {/* 库存不足商品 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">库存不足商品</h2>
            
            {stats.lowStockProducts.length > 0 ? (
              <ul className="divide-y">
                {stats.lowStockProducts.map(product => (
                  <li key={product.id} className="py-4">
                    <div className="flex justify-between">
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {product.name}
                      </Link>
                      <span className={`text-sm ${product.inventory <= 5 ? 'text-red-500' : 'text-amber-500'}`}>
                        剩余: {product.inventory}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      价格: ¥{product.price.toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">所有商品库存充足</p>
            )}
            
            {stats.lowStockProducts.length > 0 && (
              <div className="mt-4 text-right">
                <Link href="/admin/products?filter=low-stock" className="text-sm text-primary hover:underline">
                  查看所有库存不足商品 →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 