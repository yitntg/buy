'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrdersCard, RevenueCard, UsersCard, ProductsCard } from '@/admin/frontend/components/DashboardCard';
import { OrderStatus } from '@/shared/types/order';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';

// 定义仪表盘数据类型
interface DashboardStats {
  orders: {
    total: number;
    trend: number;
  };
  revenue: {
    total: number;
    trend: number;
  };
  users: {
    total: number;
    trend: number;
  };
  products: {
    total: number;
    trend: number;
  };
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

// 最近订单类型
interface RecentOrder {
  id: string;
  date: string;
  customer: string;
  status: OrderStatus;
  total: number;
}

// 热门商品类型
interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

// 时间范围类型
type TimeRange = 'day' | 'week' | 'month';

export function DashboardPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 获取仪表盘数据
  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);
  
  // 模拟从API获取统计数据
  const fetchDashboardStats = async () => {
    setIsLoading(true);
    
    try {
      // 在实际项目中，应该从API获取数据
      // 这里使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 生成随机趋势数据
      const generateTrend = () => {
        const value = Math.floor(Math.random() * 25) + 1;
        return Math.random() > 0.3 ? value : -value;
      };
      
      // 模拟数据
      const mockStats: DashboardStats = {
        orders: {
          total: 142,
          trend: generateTrend()
        },
        revenue: {
          total: 24680,
          trend: generateTrend()
        },
        users: {
          total: 327,
          trend: generateTrend()
        },
        products: {
          total: 86,
          trend: generateTrend()
        },
        recentOrders: [
          {
            id: 'ORD123456',
            date: '2023-12-12',
            customer: '张三',
            status: OrderStatus.DELIVERED,
            total: 399,
          },
          {
            id: 'ORD123457',
            date: '2023-12-11',
            customer: '李四',
            status: OrderStatus.PAID,
            total: 1299,
          },
          {
            id: 'ORD123458',
            date: '2023-12-10',
            customer: '王五',
            status: OrderStatus.DELIVERED,
            total: 599,
          },
          {
            id: 'ORD123459',
            date: '2023-12-09',
            customer: '赵六',
            status: OrderStatus.CANCELLED,
            total: 799,
          },
          {
            id: 'ORD123460',
            date: '2023-12-08',
            customer: '钱七',
            status: OrderStatus.DELIVERED,
            total: 1999,
          },
        ],
        topProducts: [
          {
            id: '1',
            name: '高品质蓝牙耳机',
            sales: 42,
            revenue: 12558,
          },
          {
            id: '3',
            name: '轻薄笔记本电脑',
            sales: 18,
            revenue: 89982,
          },
          {
            id: '2',
            name: '智能手表',
            sales: 35,
            revenue: 20965,
          },
          {
            id: '6',
            name: '多功能厨房料理机',
            sales: 29,
            revenue: 17371,
          },
          {
            id: '4',
            name: '专业摄影相机',
            sales: 15,
            revenue: 49485,
          },
        ],
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 获取订单状态标签的CSS类
  const getOrderStatusClass = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.SHIPPED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PAID:
        return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 跳转到订单详情
  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };
  
  // 跳转到产品详情
  const handleViewProductDetails = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };
  
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
  );
} 
