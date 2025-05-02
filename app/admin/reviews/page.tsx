'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
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
  product_name?: string
}

// 分页信息类型定义
interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function AdminReviews() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedReviews, setSelectedReviews] = useState<number[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState<number | string>('all')
  
  // 检查用户是否已登录并且是管理员
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin/reviews')
    } else if (user?.role !== 'admin') {
      router.push('/') // 如果不是管理员，重定向到首页
    } else {
      fetchReviews()
    }
  }, [isAuthenticated, user, router])
  
  // 加载评论数据
  const fetchReviews = async (page = 1) => {
    setLoading(true)
    try {
      let url = `/api/admin/reviews?page=${page}&limit=${paginationInfo.limit}`
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }
      
      if (filterRating !== 'all') {
        url += `&rating=${filterRating}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('获取评论失败')
      }
      
      const data = await response.json()
      setReviews(data.reviews || [])
      setPaginationInfo({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: data.totalPages || 0
      })
    } catch (error) {
      console.error('加载评论数据出错:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= paginationInfo.totalPages) {
      fetchReviews(newPage)
    }
  }
  
  // 处理选择评论
  const handleSelectReview = (id: number) => {
    setSelectedReviews(prev => {
      if (prev.includes(id)) {
        return prev.filter(reviewId => reviewId !== id)
      } else {
        return [...prev, id]
      }
    })
  }
  
  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(reviews.map(review => review.id))
    }
  }
  
  // 删除所选评论
  const handleDeleteSelected = async () => {
    if (selectedReviews.length === 0 || !confirm('确定要删除所选评论吗？此操作不可撤销。')) {
      return
    }
    
    setIsDeleting(true)
    
    try {
      const response = await fetch('/api/admin/reviews/batch', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedReviews })
      })
      
      if (!response.ok) {
        throw new Error('删除评论失败')
      }
      
      // 重新加载评论
      fetchReviews(paginationInfo.page)
      setSelectedReviews([])
      alert('评论已成功删除')
    } catch (error) {
      console.error('删除评论失败:', error)
      alert('删除评论失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }
  
  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchReviews(1) // 搜索时重置到第一页
  }
  
  // 处理评分筛选变化
  const handleRatingFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRating(e.target.value)
    // 立即应用筛选
    setTimeout(() => fetchReviews(1), 0)
  }
  
  // 处理搜索输入变化
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  
  // 渲染星级评分
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
  
  if (loading && reviews.length === 0) {
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">评论管理</h1>
          <Link href="/admin/dashboard" className="text-primary hover:underline">
            返回仪表盘
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* 工具栏 */}
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            {/* 搜索 */}
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="搜索用户名或评论内容"
                className="px-3 py-2 border rounded w-full sm:w-64"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                搜索
              </button>
            </form>
            
            <div className="flex items-center space-x-4">
              {/* 评分筛选 */}
              <select
                value={filterRating}
                onChange={handleRatingFilterChange}
                className="px-3 py-2 border rounded"
              >
                <option value="all">所有评分</option>
                <option value="5">5星</option>
                <option value="4">4星</option>
                <option value="3">3星</option>
                <option value="2">2星</option>
                <option value="1">1星</option>
              </select>
              
              {/* 删除按钮 */}
              <button
                onClick={handleDeleteSelected}
                disabled={selectedReviews.length === 0 || isDeleting}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? '删除中...' : `删除 (${selectedReviews.length})`}
              </button>
            </div>
          </div>
          
          {/* 评论列表 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={selectedReviews.length === reviews.length && reviews.length > 0}
                      onChange={handleSelectAll}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    评分
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    评论内容
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <tr key={review.id} className={selectedReviews.includes(review.id) ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => handleSelectReview(review.id)}
                          className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{review.username}</div>
                        <div className="text-xs text-gray-500">{review.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/product/${review.product_id}`} className="text-sm text-primary hover:underline">
                          {review.product_name || `商品 #${review.product_id}`}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{review.comment}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('zh-CN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/reviews/${review.id}`} className="text-primary hover:underline mr-3">
                          查看
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('确定要删除此评论吗？')) {
                              handleSelectReview(review.id)
                              setTimeout(handleDeleteSelected, 0)
                            }
                          }}
                          className="text-red-500 hover:underline"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm || filterRating !== 'all' ? '没有找到匹配的评论' : '暂无评论'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* 分页 */}
          {paginationInfo.totalPages > 1 && (
            <div className="px-6 py-4 flex justify-center">
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
          )}
        </div>
      </main>
    </div>
  )
} 