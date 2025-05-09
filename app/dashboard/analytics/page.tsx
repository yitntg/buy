'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'

// 热门商品类型
interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  category: string;
}

// 销售趋势类型
interface SalesTrend {
  date: string;
  orders: number;
  revenue: number;
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [salesSummary, setSalesSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0
  })
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [salesByCategory, setSalesByCategory] = useState<{category: string, sales: number}[]>([])
  const [newUsers, setNewUsers] = useState(0)
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([])
  
  // 检查用户是否是管理员，如果不是则重定向
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    } else if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      router.push('/account')
    } else {
      // 加载分析数据
      fetchAnalyticsData()
    }
  }, [isLoading, isAuthenticated, user, router, period])
  
  // 模拟从API获取分析数据
  const fetchAnalyticsData = async () => {
    setIsLoadingData(true)
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 根据选择的时间段设置不同的数据
      let revenueMultiplier = 1
      let ordersMultiplier = 1
      let newUsersCount = 128
      
      switch (period) {
        case 'day':
          revenueMultiplier = 0.03
          ordersMultiplier = 0.03
          newUsersCount = 5
          break
        case 'week':
          revenueMultiplier = 0.2
          ordersMultiplier = 0.2
          newUsersCount = 32
          break
        case 'year':
          revenueMultiplier = 12
          ordersMultiplier = 12
          newUsersCount = 1520
          break
        case 'month':
        default:
          // 使用默认值
          break
      }
      
      // 设置销售摘要数据
      setSalesSummary({
        totalRevenue: Math.round(125000 * revenueMultiplier),
        totalOrders: Math.round(430 * ordersMultiplier),
        averageOrderValue: Math.round(290.7),
        conversionRate: 3.2
      })
      
      // 设置新用户数据
      setNewUsers(newUsersCount)
      
      // 设置热门商品数据
      setTopProducts([
        {
          id: '3',
          name: '轻薄笔记本电脑',
          sales: Math.round(24 * ordersMultiplier),
          revenue: Math.round(119976 * revenueMultiplier),
          category: '电子产品'
        },
        {
          id: '7',
          name: '人体工学办公椅',
          sales: Math.round(18 * ordersMultiplier),
          revenue: Math.round(16182 * revenueMultiplier),
          category: '家居用品'
        },
        {
          id: '2',
          name: '智能手表',
          sales: Math.round(15 * ordersMultiplier),
          revenue: Math.round(10485 * revenueMultiplier),
          category: '电子产品'
        },
        {
          id: '1',
          name: '高品质蓝牙耳机',
          sales: Math.round(12 * ordersMultiplier),
          revenue: Math.round(3588 * revenueMultiplier),
          category: '电子产品'
        },
        {
          id: '5',
          name: '时尚双肩包',
          sales: Math.round(10 * ordersMultiplier),
          revenue: Math.round(1990 * revenueMultiplier),
          category: '服装配饰'
        }
      ])
      
      // 设置分类销售数据
      setSalesByCategory([
        { category: '电子产品', sales: Math.round(68000 * revenueMultiplier) },
        { category: '家居用品', sales: Math.round(24000 * revenueMultiplier) },
        { category: '服装配饰', sales: Math.round(18000 * revenueMultiplier) },
        { category: '运动户外', sales: Math.round(8000 * revenueMultiplier) },
        { category: '美妆护肤', sales: Math.round(5000 * revenueMultiplier) },
        { category: '食品饮料', sales: Math.round(2000 * revenueMultiplier) }
      ])
      
      // 生成销售趋势数据
      const trend: SalesTrend[] = []
      let dateFormat = ''
      let dataPoints = 0
      
      switch (period) {
        case 'day':
          dateFormat = '时'
          dataPoints = 24
          for (let i = 0; i < dataPoints; i++) {
            trend.push({
              date: `${i}${dateFormat}`,
              orders: Math.round(Math.random() * 5) + 1,
              revenue: Math.round((Math.random() * 1500) + 500)
            })
          }
          break
        case 'week':
          dateFormat = '日'
          dataPoints = 7
          for (let i = 1; i <= dataPoints; i++) {
            trend.push({
              date: `周${i === 7 ? '日' : i}`,
              orders: Math.round(Math.random() * 15) + 5,
              revenue: Math.round((Math.random() * 5000) + 2000)
            })
          }
          break
        case 'year':
          dateFormat = '月'
          dataPoints = 12
          for (let i = 1; i <= dataPoints; i++) {
            trend.push({
              date: `${i}${dateFormat}`,
              orders: Math.round(Math.random() * 50) + 30,
              revenue: Math.round((Math.random() * 20000) + 8000)
            })
          }
          break
        case 'month':
        default:
          dateFormat = '日'
          dataPoints = 30
          for (let i = 1; i <= dataPoints; i++) {
            trend.push({
              date: `${i}${dateFormat}`,
              orders: Math.round(Math.random() * 20) + 10,
              revenue: Math.round((Math.random() * 6000) + 3000)
            })
          }
          break
      }
      
      setSalesTrend(trend)
      
    } catch (error) {
      console.error('获取分析数据失败:', error)
    } finally {
      setIsLoadingData(false)
    }
  }
  
  // 格式化金额
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
  }
  
  // 计算百分比
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0
    return (value / total * 100).toFixed(1)
  }
  
  // 总销售额
  const totalCategorySales = salesByCategory.reduce((sum, item) => sum + item.sales, 0)
  
  if (isLoading) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* 面包屑导航 */}
          <div className="mb-6 flex items-center text-sm">
            <Link href="/dashboard" className="text-gray-500 hover:text-primary">
              管理后台
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-700">数据分析</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">数据分析</h1>
            
            {/* 时间段选择 */}
            <div className="flex mt-4 md:mt-0 space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  period === 'day'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
                onClick={() => setPeriod('day')}
              >
                今日
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  period === 'week'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
                onClick={() => setPeriod('week')}
              >
                本周
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  period === 'month'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
                onClick={() => setPeriod('month')}
              >
                本月
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  period === 'year'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
                onClick={() => setPeriod('year')}
              >
                全年
              </button>
            </div>
          </div>
          
          {isLoadingData ? (
            <div className="flex justify-center items-center py-20">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {/* 概览卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">总销售额</p>
                      <h3 className="text-2xl font-bold">{formatCurrency(salesSummary.totalRevenue)}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">订单总数</p>
                      <h3 className="text-2xl font-bold">{salesSummary.totalOrders}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">新增用户</p>
                      <h3 className="text-2xl font-bold">{newUsers}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">平均订单金额</p>
                      <h3 className="text-2xl font-bold">{formatCurrency(salesSummary.averageOrderValue)}</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 销售趋势图表 */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-medium mb-4">销售趋势</h2>
                  <div className="h-80">
                    {/* 这里实际项目中可以使用图表库如Chart.js或Recharts */}
                    <div className="flex flex-col h-full">
                      <div className="flex-1 flex items-end">
                        {salesTrend.map((item, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full px-1">
                              <div
                                className="bg-blue-500 w-full rounded-t-sm"
                                style={{ height: `${(item.revenue / (Math.max(...salesTrend.map(t => t.revenue)) * 1.1)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="h-10 mt-2 flex border-t pt-2">
                        {salesTrend.map((item, index) => (
                          <div key={index} className="flex-1 text-center text-xs text-gray-500">
                            {item.date}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 热门商品 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-medium mb-4">热门商品</h2>
                  <div className="space-y-4">
                    {topProducts.map(product => (
                      <div key={product.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between mb-1">
                          <p className="font-medium">{product.name}</p>
                          <span className="text-gray-600">{product.sales}件</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                        <p className="text-sm text-blue-600">{formatCurrency(product.revenue)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 按分类销售 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-medium mb-6">按分类销售</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">分类</th>
                        <th className="px-4 py-2 text-right">销售额</th>
                        <th className="px-4 py-2 text-right">占比</th>
                        <th className="px-4 py-2">完成率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {salesByCategory.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 font-medium">{item.category}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.sales)}</td>
                          <td className="px-4 py-3 text-right">{calculatePercentage(item.sales, totalCategorySales)}%</td>
                          <td className="px-4 py-3">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${calculatePercentage(item.sales, totalCategorySales)}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* 转化漏斗 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-medium mb-6">转化漏斗</h2>
                <div className="flex flex-col items-center">
                  <div className="w-full md:w-2/3 lg:w-1/2 space-y-4">
                    <div className="relative">
                      <div className="bg-blue-100 text-blue-800 p-4 rounded-t-lg text-center">
                        <p className="font-medium">网站访问</p>
                        <p className="text-2xl font-bold">8,642</p>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 border-l-8 border-r-8 border-t-8 border-t-blue-100 border-l-transparent border-r-transparent h-5 w-0"></div>
                    </div>
                    
                    <div className="relative mt-8">
                      <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center" style={{ width: '85%', margin: '0 auto' }}>
                        <p className="font-medium">商品浏览</p>
                        <p className="text-2xl font-bold">5,218</p>
                        <p className="text-sm">60.4%</p>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 border-l-8 border-r-8 border-t-8 border-t-green-100 border-l-transparent border-r-transparent h-5 w-0"></div>
                    </div>
                    
                    <div className="relative mt-8">
                      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center" style={{ width: '70%', margin: '0 auto' }}>
                        <p className="font-medium">加入购物车</p>
                        <p className="text-2xl font-bold">1,896</p>
                        <p className="text-sm">36.3%</p>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 border-l-8 border-r-8 border-t-8 border-t-yellow-100 border-l-transparent border-r-transparent h-5 w-0"></div>
                    </div>
                    
                    <div className="relative mt-8">
                      <div className="bg-red-100 text-red-800 p-4 rounded-b-lg text-center" style={{ width: '55%', margin: '0 auto' }}>
                        <p className="font-medium">完成购买</p>
                        <p className="text-2xl font-bold">{salesSummary.totalOrders}</p>
                        <p className="text-sm">{salesSummary.conversionRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 