'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
// Header import removed
// Footer import removed
import { useAuth } from '@/src/app/(shared)/contexts/AuthContext'
import AccountSidebar from '../../components/AccountSidebar'
import CustomerLayout from '../../components/CustomerLayout'

// 定义订单类型
interface Order {
  id: string
  date: string
  status: string
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('all') // all, processing, completed, cancelled
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  
  // 添加会员注册时间
  const memberSince = '2023年10月'
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    } else {
      // 加载订单数据
      fetchOrders()
    }
  }, [isLoading, user, router, activeTab])
  
  // 模拟从API获取订单数据
  const fetchOrders = async () => {
    setIsLoadingOrders(true)
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟订单数据
      const mockOrders: Order[] = [
        {
          id: 'ORD20231115001',
          date: '2023-11-15',
          status: '已完成',
          total: 598,
          items: [
            {
              id: '1',
              name: '高品质蓝牙耳机',
              price: 299,
              quantity: 1,
              image: 'https://picsum.photos/id/1/400/300'
            },
            {
              id: '5',
              name: '时尚双肩包',
              price: 199,
              quantity: 1,
              image: 'https://picsum.photos/id/5/400/300'
            }
          ]
        },
        {
          id: 'ORD20231102001',
          date: '2023-11-02',
          status: '已发货',
          total: 4999,
          items: [
            {
              id: '3',
              name: '轻薄笔记本电脑',
              price: 4999,
              quantity: 1,
              image: 'https://picsum.photos/id/3/400/300'
            }
          ]
        },
        {
          id: 'ORD20231025001',
          date: '2023-10-25',
          status: '待发货',
          total: 159,
          items: [
            {
              id: '8',
              name: '专业瑜伽垫',
              price: 159,
              quantity: 1,
              image: 'https://picsum.photos/id/8/400/300'
            }
          ]
        },
        {
          id: 'ORD20231018001',
          date: '2023-10-18',
          status: '已取消',
          total: 599,
          items: [
            {
              id: '6',
              name: '多功能厨房料理机',
              price: 599,
              quantity: 1,
              image: 'https://picsum.photos/id/6/400/300'
            }
          ]
        }
      ]
      
      // 根据选项卡筛选订单
      let filteredOrders = mockOrders
      if (activeTab === 'processing') {
        filteredOrders = mockOrders.filter(order => 
          order.status === '待发货' || order.status === '已发货'
        )
      } else if (activeTab === 'completed') {
        filteredOrders = mockOrders.filter(order => order.status === '已完成')
      } else if (activeTab === 'cancelled') {
        filteredOrders = mockOrders.filter(order => order.status === '已取消')
      }
      
      setOrders(filteredOrders)
    } catch (error) {
      console.error('获取订单失败:', error)
    } finally {
      setIsLoadingOrders(false)
    }
  }
  
  // 获取订单状态对应的样式
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
  
  // 切换订单筛选选项卡
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }
  
  // 处理退出登录
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // 在实际应用中，这里应该调用登出API
      router.push('/')
    }
  }
  
  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 flex justify-center items-center py-16">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </CustomerLayout>
    )
  }
  
  return (
    <CustomerLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">我的账户</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 使用全局侧边栏组件 */}
          <AccountSidebar activePage="orders" />
          
          {/* 主内容区 */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-medium">我的订单</h2>
              </div>
              
              {/* 订单筛选选项卡 */}
              <div className="border-b">
                <div className="flex flex-wrap">
                  <button 
                    className={`px-6 py-3 font-medium ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => handleTabChange('all')}
                  >
                    全部订单
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium ${activeTab === 'processing' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => handleTabChange('processing')}
                  >
                    处理中
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium ${activeTab === 'completed' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => handleTabChange('completed')}
                  >
                    已完成
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium ${activeTab === 'cancelled' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => handleTabChange('cancelled')}
                  >
                    已取消
                  </button>
                </div>
              </div>
              
              {/* 订单列表 */}
              <div className="p-6">
                {isLoadingOrders ? (
                  <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center">
                      <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-4 text-gray-600">正在加载订单数据...</p>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl text-gray-200 mb-4">📋</div>
                    <h3 className="text-lg font-medium mb-2">暂无订单</h3>
                    <p className="text-gray-500 mb-8">您还没有创建任何订单</p>
                    <Link href="/products" className="text-primary border border-primary px-6 py-2 rounded-md hover:bg-blue-50">
                      立即购物
                    </Link>
                  </div>
                ) : (
                  <div>
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                        <div className="bg-gray-50 flex flex-wrap justify-between p-4 items-center">
                          <div>
                            <span className="text-gray-500">订单号: </span>
                            <span className="font-medium">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">下单时间: </span>
                            <span>{order.date}</span>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        {/* 订单商品 */}
                        <div className="p-4">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-start py-3 border-b last:border-0">
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <div className="text-gray-500">x{item.quantity}</div>
                                </div>
                                <div className="text-primary mt-1">¥{item.price}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* 订单合计和操作 */}
                        <div className="p-4 bg-gray-50 flex flex-wrap justify-between items-center">
                          <div className="text-gray-500">
                            共 <span className="font-medium">{order.items.length}</span> 件商品，
                            合计：<span className="text-primary font-bold">¥{order.total}</span>
                            <span className="text-gray-400 text-xs ml-1">(含运费)</span>
                          </div>
                          <div className="flex space-x-2 mt-2 sm:mt-0">
                            <Link href={`/account/orders/${order.id}`} className="text-primary border border-primary px-4 py-1 rounded hover:bg-blue-50 text-sm">
                              订单详情
                            </Link>
                            {order.status === '待发货' && (
                              <button className="bg-white border border-gray-300 px-4 py-1 rounded hover:bg-gray-50 text-sm">
                                取消订单
                              </button>
                            )}
                            {order.status === '已完成' && (
                              <button className="bg-primary text-white px-4 py-1 rounded hover:bg-blue-600 text-sm">
                                申请售后
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
} 
