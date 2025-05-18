'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/src/app/(shared)/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/src/app/(shared)/utils/formatters';

// 订单类型定义
interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }>;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取订单数据
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/customer/orders');
        
        if (!response.ok) {
          throw new Error('获取订单失败');
        }
        
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('获取订单时出错:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // 处理查看订单详情
  const handleViewOrder = (orderId: string) => {
    router.push(`/account/orders/${orderId}`);
  };

  // 获取订单状态的样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化状态文本
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': '待付款',
      'processing': '处理中',
      'shipped': '已发货',
      'delivered': '已送达',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的订单</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between mb-4">
                  <div className="w-1/3 h-6 bg-gray-200 rounded"></div>
                  <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
    );
  }

  // 渲染没有登录的状态
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的订单</h1>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 text-center">
            <p className="text-yellow-700 mb-4">请登录查看您的订单历史</p>
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              去登录
            </button>
          </div>
        </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的订单</h1>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              重试
            </button>
          </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">我的订单</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">您还没有订单</h3>
            <p className="text-gray-500 mb-6">浏览我们的商品并下单吧！</p>
            <button 
              onClick={() => router.push('/products')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              浏览商品
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">订单号: {order.order_number}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      下单时间: {formatDate(order.created_at)}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className="block sm:inline text-gray-700 mr-4">
                      总计: <span className="font-bold text-blue-600">{formatCurrency(order.total)}</span>
                    </span>
                    <button 
                      onClick={() => handleViewOrder(order.id)}
                      className="mt-2 sm:mt-0 px-4 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {order.items.length} 件商品
                  </div>
                  <div className="flex space-x-4 overflow-x-auto py-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex-shrink-0 w-20">
                        <img 
                          src={item.image_url || 'https://via.placeholder.com/80'} 
                          alt={item.product_name}
                          className="w-full h-20 object-cover rounded border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
} 