'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'

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
  const { user, isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('all') // all, processing, completed, cancelled
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  
  // 账户菜单项
  const menuItems = [
    { label: '个人信息', href: '/account', active: false },
    { label: '我的订单', href: '/account/orders', active: true },
    { label: '收货地址', href: '/account/addresses', active: false },
    { label: '支付方式', href: '/account/payment', active: false },
    { label: '优惠券', href: '/account/coupons', active: false },
    { label: '消息通知', href: '/account/notifications', active: false },
    { label: '账户安全', href: '/account/security', active: false },
  ]
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    } else {
      // 加载订单数据
      fetchOrders()
    }
  }, [isLoading, isAuthenticated, router, activeTab])
  
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
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的账户</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏菜单 */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {user?.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.username || "用户头像"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{user?.username || '用户'}</h3>
                    <p className="text-sm text-gray-500">会员</p>
                  </div>
                </div>
                
                <nav>
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`block px-3 py-2 rounded-md ${
                            item.active
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <button 
                  onClick={handleLogout}
                  className="w-full text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  退出登录
                </button>
              </div>
            </div>
            
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
                      <div className="text-6xl text-gray-300 mb-4">📦</div>
                      <p className="text-gray-500 mb-4">没有{activeTab !== 'all' ? '相关' : ''}订单</p>
                      <Link href="/products" className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        去购物
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
                            <div>
                              <span className="text-gray-500 mr-4">订单号: {order.id}</span>
                              <span className="text-gray-500">下单时间: {order.date}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="p-4">
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center py-3 border-b last:border-0">
                                <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="ml-4 flex-grow">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">¥{item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t">
                            <div>
                              <span className="text-gray-500">共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-4">订单金额: <span className="font-medium">¥{order.total.toFixed(2)}</span></span>
                              <Link
                                href={`/account/orders/${order.id}`}
                                className="bg-primary text-white px-4 py-1 rounded-md hover:bg-blue-600 text-sm"
                              >
                                订单详情
                              </Link>
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
      </main>
      <Footer />
    </>
  )
} 