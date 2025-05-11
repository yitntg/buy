'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 定义统计数据类型
interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
}

// 最近订单类型
interface RecentOrder {
  id: string
  date: string
  customer: string
  status: 'completed' | 'processing' | 'cancelled'
  total: number
}

// 热门商品类型
interface TopProduct {
  id: number
  name: string
  sales: number
  revenue: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')
  
  // 获取仪表盘数据
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true)
      
      try {
        // 在实际应用中，应该从API获取数据
        // 这里使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 模拟数据
        const mockStats: DashboardStats = {
          totalProducts: 86,
          totalOrders: 142,
          totalUsers: 327,
          totalRevenue: 24680,
          recentOrders: [
            {
              id: 'ORD123456',
              date: '2023-12-12',
              customer: '张三',
              status: 'completed',
              total: 399,
            },
            {
              id: 'ORD123457',
              date: '2023-12-11',
              customer: '李四',
              status: 'processing',
              total: 1299,
            },
            {
              id: 'ORD123458',
              date: '2023-12-10',
              customer: '王五',
              status: 'completed',
              total: 599,
            },
            {
              id: 'ORD123459',
              date: '2023-12-09',
              customer: '赵六',
              status: 'cancelled',
              total: 799,
            },
            {
              id: 'ORD123460',
              date: '2023-12-08',
              customer: '钱七',
              status: 'completed',
              total: 1999,
            },
          ],
          topProducts: [
            {
              id: 1,
              name: '高品质蓝牙耳机',
              sales: 42,
              revenue: 12558,
            },
            {
              id: 3,
              name: '轻薄笔记本电脑',
              sales: 18,
              revenue: 89982,
            },
            {
              id: 2,
              name: '智能手表',
              sales: 35,
              revenue: 20965,
            },
            {
              id: 6,
              name: '多功能厨房料理机',
              sales: 29,
              revenue: 17371,
            },
            {
              id: 4,
              name: '专业摄影相机',
              sales: 15,
              revenue: 49485,
            },
          ],
        }
        
        setStats(mockStats)
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardStats()
  }, [timeRange])
  
  // 渲染订单状态标签
  const renderOrderStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">已完成</span>
      case 'processing':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">处理中</span>
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">已取消</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">未知</span>
    }
  }
  
  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载数据中...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        
        <div className="flex bg-white rounded-lg shadow-sm p-1">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'day' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'week' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            本周
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'month' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            本月
          </button>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* 总订单数 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">总订单数</div>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            <span className="font-medium">↑ 12%</span> 相比上个{timeRange === 'day' ? '天' : timeRange === 'week' ? '周' : '月'}
          </div>
        </div>
        
        {/* 总收入 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">总收入</div>
              <div className="text-3xl font-bold">¥{stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            <span className="font-medium">↑ 18%</span> 相比上个{timeRange === 'day' ? '天' : timeRange === 'week' ? '周' : '月'}
          </div>
        </div>
        
        {/* 总用户数 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">总用户数</div>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            <span className="font-medium">↑ 5%</span> 相比上个{timeRange === 'day' ? '天' : timeRange === 'week' ? '周' : '月'}
          </div>
        </div>
        
        {/* 总商品数 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">总商品数</div>
              <div className="text-3xl font-bold">{stats.totalProducts}</div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            <span className="font-medium">↑ 3%</span> 相比上个{timeRange === 'day' ? '天' : timeRange === 'week' ? '周' : '月'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近订单 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">最近订单</h2>
              <Link href="/admin/orders" className="text-primary hover:underline text-sm">
                查看全部
              </Link>
            </div>
          </div>
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
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderOrderStatus(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ¥{order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 热门商品 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">热门商品</h2>
              <Link href="/admin/products" className="text-primary hover:underline text-sm">
                查看全部
              </Link>
            </div>
          </div>
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
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sales} 件
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ¥{product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 