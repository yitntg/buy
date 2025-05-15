'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// Header import removed
// Footer import removed
import { useAuth } from '@/shared/contexts/AuthContext'

// 订单类型定义
interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
}

// 仪表盘Card组件
const StatCard = ({ title, value, icon, color }: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode,
  color: string
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  </div>
)

// 订单项组件
const OrderItem = ({ order }: { order: Order }) => {
  // 获取状态对应的样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800'
      case '已发货':
        return 'bg-blue-100 text-blue-800'
      case '待发货':
        return 'bg-yellow-100 text-yellow-800'
      case '已取消':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{order.id}</p>
          <p className="text-sm text-gray-500">{order.customer}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">¥{order.total}</p>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
        <Link href={`/dashboard/orders/${order.id}`} className="text-primary text-sm hover:underline">
          查看详情
        </Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  
  // 检查用户是否是管理员，如果不是则重定向
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    } else if (!isLoading && user && user?.role !== 'admin') {
      router.push('/account')
    } else {
      // 模拟加载数据
      fetchDashboardData()
    }
  }, [isLoading, user, router])

  // 模拟从API获取仪表盘数据
  const fetchDashboardData = () => {
    // 模拟最近订单数据
    setRecentOrders([
      {
        id: 'ORD20231115001',
        customer: '张三',
        date: '2023-11-15',
        total: 598,
        status: '已完成'
      },
      {
        id: 'ORD20231102001',
        customer: '李四',
        date: '2023-11-02',
        total: 4999,
        status: '已发货'
      },
      {
        id: 'ORD20231025001',
        customer: '王五',
        date: '2023-10-25',
        total: 159,
        status: '待发货'
      },
      {
        id: 'ORD20231018001',
        customer: '赵六',
        date: '2023-10-18',
        total: 599,
        status: '已取消'
      }
    ])
  }
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          </div>
        </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">管理员仪表盘</h1>
            <div className="text-sm text-gray-500">
              欢迎回来，{user?.username}
            </div>
          </div>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="今日销售额" 
              value="¥12,846" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-blue-500"
            />
            <StatCard 
              title="新增订单" 
              value="32" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
              color="bg-green-500"
            />
            <StatCard 
              title="新增用户" 
              value="128" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              color="bg-purple-500"
            />
            <StatCard 
              title="访问量" 
              value="8,642" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              color="bg-yellow-500"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 近期订单 */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">近期订单</h2>
                <Link href="/dashboard/orders" className="text-primary hover:underline text-sm">
                  查看全部
                </Link>
              </div>
              
              <div className="space-y-0">
                {recentOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </div>
            </div>
            
            {/* 快捷操作 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-medium mb-6">快捷操作</h2>
              
              <div className="space-y-4">
                <Link 
                  href="/dashboard/products/new" 
                  className="block w-full text-center py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  添加新商品
                </Link>
                <Link 
                  href="/dashboard/orders/pending" 
                  className="block w-full text-center py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  处理待发货订单
                </Link>
                <Link 
                  href="/dashboard/products/inventory" 
                  className="block w-full text-center py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  更新库存
                </Link>
                <Link 
                  href="/dashboard/promotions" 
                  className="block w-full text-center py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  管理促销活动
                </Link>
              </div>
            </div>
          </div>
          
          {/* 功能导航 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">订单管理</h3>
                  <p className="text-sm text-gray-500">查看和处理订单</p>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/products" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">商品管理</h3>
                  <p className="text-sm text-gray-500">管理商品和库存</p>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/users" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">用户管理</h3>
                  <p className="text-sm text-gray-500">管理用户和权限</p>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/analytics" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">数据分析</h3>
                  <p className="text-sm text-gray-500">查看销售和访问数据</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
  )
} 
