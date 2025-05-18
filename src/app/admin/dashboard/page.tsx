'use client'

// 直接导出服务器配置
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ErrorAlert from '@/src/app/(shared)/components/ErrorAlert'
import RecentOrdersList from '@/src/app/admin/components/RecentOrdersList'
import { OrdersCard, RevenueCard, UsersCard, ProductsCard } from '@/src/app/admin/components/DashboardCard'
import { getDashboardStats, TimeRange, DashboardStats } from '@/src/app/admin/services/dashboardService'
import { OrderStatus } from '@/src/app/(shared)/types/order'
import { formatCurrency, formatDate } from '@/src/app/(shared)/utils/formatters'

// 仪表盘页面
export default function AdminDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  
  // 检查用户是否是管理员，如果不是则重定向
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 获取当前登录用户信息
        const response = await fetch('/api/admin/auth/me')
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '认证失败')
        }
        
        const data = await response.json()
        
        if (!data.user || data.user.role !== 'admin') {
          // 不是管理员，重定向到登录页面
          router.push('/auth/login?redirect=/admin/dashboard')
          return
        }
        
        setUser(data.user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('认证检查失败:', error)
        setError(error instanceof Error ? error.message : '认证服务暂时不可用')
        // 不立即重定向，显示错误消息并提供重试选项
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router])
  
  // 重试登录检查
  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    // 刷新页面
    window.location.reload()
  }
  
  // 强制退出
  const handleForceLogout = () => {
    router.push('/auth/login?redirect=/admin/dashboard')
  }
  
  // 获取仪表盘数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await getDashboardStats(timeRange)
        setStats(data)
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [timeRange])
  
  // 获取订单状态标签的CSS类
  const getOrderStatusClass = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800'
      case OrderStatus.SHIPPED:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.PAID:
        return 'bg-indigo-100 text-indigo-800'
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // 跳转到订单详情
  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`)
  }
  
  // 跳转到产品详情
  const handleViewProductDetails = (productId: string) => {
    router.push(`/admin/products/${productId}`)
  }
  
  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            正在加载管理面板
          </h2>
          <p className="text-gray-500">请稍候...</p>
        </div>
      </div>
    )
  }
  
  // 错误状态显示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert 
          title="访问管理面板失败" 
          message={error}
          actions={[
            { label: '重新尝试', onClick: handleRetry, primary: true },
            { label: '返回登录', onClick: handleForceLogout, primary: false }
          ]}
        />
      </div>
    )
  }
  
  // 已认证才显示仪表盘内容
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">仪表盘</h1>
      
        <div className="bg-white rounded-lg shadow-sm p-1">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'day' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            本周
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            本月
          </button>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <OrdersCard 
          value={stats?.orders.total || 0}
          trend={stats?.orders.trend ? { 
            value: Math.abs(stats.orders.trend),
            isPositive: stats.orders.trend > 0
          } : undefined}
          description={`相比上个${timeRange === 'day' ? '天' : timeRange === 'week' ? '周' : '月'}`}
          isLoading={isLoading}
        />
        
        <RevenueCard 
          value={formatCurrency(stats?.revenue.total || 0)}
          trend={stats?.revenue.trend ? { 
            value: Math.abs(stats.revenue.trend),
            isPositive: stats.revenue.trend > 0
          } : undefined}
          description={`相比上个${timeRange === 'day' ? '天' : timeRange === 'week' ? '周' : '月'}`}
          isLoading={isLoading}
        />
        
        <UsersCard 
          value={stats?.users.total || 0}
          trend={stats?.users.trend ? { 
            value: Math.abs(stats.users.trend),
            isPositive: stats.users.trend > 0
          } : undefined}
          description={`相比上个${timeRange === 'day' ? '天' : timeRange === 'week' ? '周' : '月'}`}
          isLoading={isLoading}
        />
        
        <ProductsCard 
          value={stats?.products.total || 0}
          trend={stats?.products.trend ? { 
            value: Math.abs(stats.products.trend),
            isPositive: stats.products.trend > 0
          } : undefined}
          description={`相比上个${timeRange === 'day' ? '天' : timeRange === 'week' ? '周' : '月'}`}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近订单 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">最近订单</h2>
            <button 
              onClick={() => router.push('/admin/orders')} 
              className="text-blue-600 hover:underline text-sm"
            >
              查看全部
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      订单编号
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      客户
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金额
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.map(order => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewOrderDetails(order.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              暂无订单数据
            </div>
          )}
        </div>
        
        {/* 热门商品 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">热门商品</h2>
            <button 
              onClick={() => router.push('/admin/products')} 
              className="text-blue-600 hover:underline text-sm"
            >
              查看全部
            </button>
          </div>
          
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : stats?.topProducts && stats.topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      商品
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      销量
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      收入
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topProducts.map(product => (
                    <tr 
                      key={product.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewProductDetails(product.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sales} 件
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              暂无商品数据
          </div>
          )}
        </div>
      </div>
    </div>
  )
} 