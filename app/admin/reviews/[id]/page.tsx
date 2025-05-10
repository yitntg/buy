'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// 评论类型定义
interface Review {
  id: number
  product_id: number
  user_id: string
  username: string
  rating: number
  comment: string
  created_at: string
  product_name?: string
}

// 产品类型定义
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export default function ReviewDetail({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // 检查用户是否已登录并且是管理员
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/admin/reviews/' + params.id)
    } else if (user.role !== 'admin') {
      router.push('/') // 如果不是管理员，重定向到首页
    } else {
      fetchReviewData()
    }
  }, [user, router, params.id])
  
  // 获取评论数据
  const fetchReviewData = async () => {
    setLoading(true)
    try {
      // 获取评论详情
      const reviewResponse = await fetch(`/api/admin/reviews/${params.id}`)
      
      if (!reviewResponse.ok) {
        if (reviewResponse.status === 404) {
          throw new Error('评论不存在')
        }
        throw new Error('获取评论失败')
      }
      
      const reviewData = await reviewResponse.json()
      setReview(reviewData)
      
      // 获取相关产品详情
      const productResponse = await fetch(`/api/products/${reviewData.product_id}`)
      
      if (productResponse.ok) {
        const productData = await productResponse.json()
        setProduct(productData)
      }
    } catch (err: any) {
      console.error('获取评论详情失败:', err)
      setError(err.message || '获取评论详情失败')
    } finally {
      setLoading(false)
    }
  }
  
  // 删除评论
  const handleDeleteReview = async () => {
    if (!confirm('确定要删除此评论吗？此操作不可撤销。')) {
      return
    }
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/reviews/${params.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('删除评论失败')
      }
      
      alert('评论已成功删除')
      router.push('/admin/reviews')
    } catch (err: any) {
      console.error('删除评论失败:', err)
      alert(err.message || '删除评论失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }
  
  // 渲染星级评分
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }
  
  if (error || !review) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-red-500">出错了</h1>
            <Link href="/admin/reviews" className="text-primary hover:underline">
              返回评论列表
            </Link>
          </div>
          <p className="text-gray-700">{error || '评论不存在'}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">评论详情</h1>
          <Link href="/admin/reviews" className="text-primary hover:underline">
            返回评论列表
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold mb-1">评论 #{review.id}</h2>
                <div className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleString('zh-CN')}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteReview}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? '删除中...' : '删除评论'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4">评论信息</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">用户名</div>
                  <div className="font-medium">{review.username}</div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">评分</div>
                  {renderStars(review.rating)}
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">评论内容</div>
                  <div className="font-medium whitespace-pre-wrap">{review.comment}</div>
                </div>
              </div>
              
              {product && (
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">产品信息</div>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">¥{product.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 