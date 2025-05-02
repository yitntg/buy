'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

// 评论类型定义
interface Review {
  id: number
  product_id: number
  user_id: string
  username: string
  rating: number
  comment: string
  created_at: string
}

// 分页信息类型定义
interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

// 组件属性类型定义
interface ReviewSectionProps {
  productId: string | number
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0
  })
  const [loading, setLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const [userReviewData, setUserReviewData] = useState<Review | null>(null)
  
  // 加载评论
  const loadReviews = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${page}&limit=${paginationInfo.limit}`
      )
      
      if (!response.ok) {
        throw new Error('获取评论失败')
      }
      
      const data = await response.json()
      setReviews(data.reviews || [])
      setPaginationInfo({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 5,
        totalPages: data.totalPages || 0
      })
      
      // 检查当前用户是否已经评论过
      if (isAuthenticated && user?.id) {
        const userReview = data.reviews?.find((review: Review) => review.user_id === user.id)
        if (userReview) {
          setUserHasReviewed(true)
          setUserReviewData(userReview)
          setUserReview({
            rating: userReview.rating,
            comment: userReview.comment
          })
        } else {
          setUserHasReviewed(false)
          setUserReviewData(null)
        }
      }
    } catch (error) {
      console.error('加载评论出错:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 在组件挂载和产品ID变化时加载评论
  useEffect(() => {
    loadReviews()
  }, [productId])
  
  // 处理评分变化
  const handleRatingChange = (newRating: number) => {
    setUserReview(prev => ({ ...prev, rating: newRating }))
  }
  
  // 处理评论文本变化
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserReview(prev => ({ ...prev, comment: e.target.value }))
  }
  
  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= paginationInfo.totalPages) {
      loadReviews(newPage)
    }
  }
  
  // 提交评论
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user) {
      alert('请先登录后再评论')
      return
    }
    
    if (userReview.rating < 1 || userReview.comment.trim() === '') {
      alert('请输入评论内容并选择评分')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          username: user.username || user.email?.split('@')[0] || '匿名用户',
          rating: userReview.rating,
          comment: userReview.comment
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '提交评论失败')
      }
      
      // 重新加载评论
      await loadReviews()
      
      // 如果是新评论，隐藏表单
      if (!userHasReviewed) {
        setShowReviewForm(false)
      }
      
      alert(userHasReviewed ? '评论已更新' : '评论已提交')
    } catch (error: any) {
      console.error('提交评论失败:', error)
      alert(`提交评论失败: ${error.message}`)
    } finally {
      setSubmitting(false)
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
  
  // 渲染可交互的星级评分
  const renderInteractiveStars = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 ${star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer hover:text-yellow-400`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }
  
  // 渲染分页控件
  const renderPagination = () => {
    if (paginationInfo.totalPages <= 1) return null
    
    return (
      <div className="flex justify-center mt-6">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(paginationInfo.page - 1)}
            disabled={paginationInfo.page === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            上一页
          </button>
          
          {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1)
            .filter(page => {
              // 显示第一页、最后一页，以及当前页附近的页码
              return (
                page === 1 ||
                page === paginationInfo.totalPages ||
                Math.abs(page - paginationInfo.page) <= 1
              )
            })
            .map((page, index, array) => {
              // 如果页码不连续，添加省略号
              const showEllipsis = index > 0 && page - array[index - 1] > 1
              
              return (
                <div key={page} className="flex items-center">
                  {showEllipsis && <span className="px-2">...</span>}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      page === paginationInfo.page
                        ? 'bg-primary text-white'
                        : 'border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              )
            })}
          
          <button
            onClick={() => handlePageChange(paginationInfo.page + 1)}
            disabled={paginationInfo.page === paginationInfo.totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            下一页
          </button>
        </nav>
      </div>
    )
  }
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold">商品评价 ({paginationInfo.total})</h2>
      
      {isAuthenticated && (
        <div className="mt-6">
          {userHasReviewed ? (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                您已经评价过此商品。您可以编辑您的评价：
              </p>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-primary hover:underline text-sm"
              >
                {showReviewForm ? '取消编辑' : '编辑我的评价'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {showReviewForm ? '取消评价' : '添加评价'}
            </button>
          )}
          
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">您的评分</label>
                {renderInteractiveStars()}
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700 mb-2">
                  评价内容
                </label>
                <textarea
                  id="comment"
                  value={userReview.comment}
                  onChange={handleCommentChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="请分享您对此商品的看法..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {submitting ? '提交中...' : userHasReviewed ? '更新评价' : '提交评价'}
              </button>
            </form>
          )}
        </div>
      )}
      
      {!isAuthenticated && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">
            请 <Link href="/auth/login" className="text-primary hover:underline">登录</Link> 后发表评价
          </p>
        </div>
      )}
      
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <ul className="space-y-6">
              {reviews.map(review => (
                <li key={review.id} className="border-b pb-6">
                  <div className="flex items-start">
                    {/* 用户头像 */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm font-medium">
                          {review.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium mr-2">{review.username}</h4>
                        {user && review.user_id === user.id && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            我的评价
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {renderPagination()}
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">暂无评价</p>
          </div>
        )}
      </div>
    </div>
  )
} 