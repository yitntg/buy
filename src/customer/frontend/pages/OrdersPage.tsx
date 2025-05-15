'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/customer/frontend/components/Header';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';

// 定义订单类型
interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

export function OrdersPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('all'); // all, processing, completed, cancelled
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  
  // 添加会员注册时间
  const memberSince = '2023年10月';
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    } else {
      // 加载订单数据
      fetchOrders();
    }
  }, [isLoading, user, router, activeTab]);
  
  // 模拟从API获取订单数据
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      ];
      
      // 根据选项卡筛选订单
      let filteredOrders = mockOrders;
      if (activeTab === 'processing') {
        filteredOrders = mockOrders.filter(order => 
          order.status === '待发货' || order.status === '已发货'
        );
      } else if (activeTab === 'completed') {
        filteredOrders = mockOrders.filter(order => order.status === '已完成');
      } else if (activeTab === 'cancelled') {
        filteredOrders = mockOrders.filter(order => order.status === '已取消');
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };
  
  // 获取订单状态对应的样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800';
      case '已发货':
        return 'bg-blue-100 text-blue-800';
      case '待发货':
        return 'bg-yellow-100 text-yellow-800';
      case '已取消':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 切换订单筛选选项卡
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的账户</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏 */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* 用户信息 */}
                <div className="p-6 border-b">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl font-semibold">
                      {user?.name?.slice(0, 1) || '用'}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-lg">{user?.name || '用户'}</h3>
                      <p className="text-gray-500 text-sm">会员自 {memberSince}</p>
                    </div>
                  </div>
                </div>
                
                {/* 导航菜单 */}
                <div className="p-4">
                  <nav className="space-y-1">
                    <Link 
                      href="/account/dashboard" 
                      className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      账户概览
                    </Link>
                    <Link 
                      href="/account/orders" 
                      className="block px-4 py-2 rounded-md text-primary bg-blue-50 font-medium"
                    >
                      我的订单
                    </Link>
                    <Link 
                      href="/account/favorites" 
                      className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      我的收藏
                    </Link>
                    <Link 
                      href="/account/addresses" 
                      className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      地址管理
                    </Link>
                    <Link 
                      href="/account/settings" 
                      className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      账户设置
                    </Link>
                    <button 
                      className="w-full text-left block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => confirm('确定要退出登录吗？') && router.push('/auth/logout')}
                    >
                      退出登录
                    </button>
                  </nav>
                </div>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium">没有找到订单</h3>
                      <p className="mt-2 text-gray-500">暂无符合条件的订单记录</p>
                      <Link href="/products" className="mt-6 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        去购物
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="border rounded-lg overflow-hidden">
                          {/* 订单头部 */}
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-gray-500">订单号:</span>
                              <span className="ml-2 font-medium">{order.id}</span>
                              <span className="ml-4 text-gray-500">下单时间:</span>
                              <span className="ml-2">{formatDate(order.date)}</span>
                            </div>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          
                          {/* 订单内容 */}
                          <div className="p-4">
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center py-3 border-b last:border-b-0">
                                <div className="w-16 h-16 relative flex-shrink-0">
                                  <Image 
                                    src={item.image} 
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="ml-4 flex-1">
                                  <Link href={`/product/${item.id}`} className="text-gray-800 hover:text-primary font-medium">
                                    {item.name}
                                  </Link>
                                  <div className="mt-1 text-gray-500 text-sm flex">
                                    <span className="flex-1">
                                      单价: {formatCurrency(item.price)}
                                    </span>
                                    <span>
                                      数量: {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* 订单底部 */}
                          <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center">
                            <div className="font-medium">
                              总计: <span className="text-primary">{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex space-x-3 mt-3 sm:mt-0">
                              <Link 
                                href={`/account/orders/${order.id}`} 
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                查看详情
                              </Link>
                              
                              {order.status === '待发货' && (
                                <button 
                                  className="px-4 py-2 border border-red-300 rounded-md text-red-600 bg-white hover:bg-red-50"
                                  onClick={() => {
                                    if (confirm('确定要取消该订单吗？')) {
                                      alert('订单已取消');
                                      // 在实际应用中，这里应该调用取消订单的API
                                      fetchOrders();
                                    }
                                  }}
                                >
                                  取消订单
                                </button>
                              )}
                              
                              {order.status === '已完成' && (
                                <button 
                                  className="px-4 py-2 border border-primary rounded-md text-primary bg-white hover:bg-blue-50"
                                  onClick={() => {
                                    router.push(`/review/order/${order.id}`);
                                  }}
                                >
                                  评价商品
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
      </main>
    </div>
  );
}

export default OrdersPage; 
