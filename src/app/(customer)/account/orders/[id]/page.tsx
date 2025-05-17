'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { useAuth } from '@/src/app/(shared)/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/src/app/(shared)/utils/formatters';

// 订单类型定义
interface OrderDetail {
  id: string;
  order_number: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  discount: number;
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
    phone?: string;
  };
  billing_address?: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };
  payment_method: string;
  tracking_number?: string;
  notes?: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取订单详情数据
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!user || !orderId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/customer/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('获取订单详情失败');
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('获取订单详情时出错:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [user, orderId]);

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
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="text-2xl font-bold">订单详情</h1>
          </div>
          
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex border-b pb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded mr-4"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    );
  }

  // 渲染没有登录的状态
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">订单详情</h1>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 text-center">
            <p className="text-yellow-700 mb-4">请登录查看订单详情</p>
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
  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="text-2xl font-bold">订单详情</h1>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
            <p className="text-red-700 mb-4">{error || '找不到订单信息'}</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                重试
              </button>
              <button 
                onClick={() => router.push('/account/orders')}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                返回订单列表
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-2xl font-bold">订单详情</h1>
        </div>
        
        {/* 订单状态和摘要信息 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold mr-3">订单号: {order.order_number}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">下单时间: {formatDate(order.created_at)}</p>
              </div>
              <div className="mt-3 sm:mt-0">
                <p className="text-gray-700">
                  订单总额: <span className="font-bold text-blue-600 text-xl ml-1">{formatCurrency(order.total)}</span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* 配送信息 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">配送信息</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{order.shipping_address.name}</p>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                  <p>{order.shipping_address.country}</p>
                  {order.shipping_address.phone && <p className="mt-2">电话: {order.shipping_address.phone}</p>}
                  
                  {order.tracking_number && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm">
                        <span className="font-medium">追踪编号: </span>
                        <span className="text-blue-600">{order.tracking_number}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 支付信息 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">支付信息</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    <span className="font-medium">支付方式: </span>
                    {order.payment_method}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between py-1">
                      <span>商品小计:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>运费:</span>
                      <span>{formatCurrency(order.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>税费:</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between py-1 text-green-600">
                        <span>优惠折扣:</span>
                        <span>-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 font-bold border-t border-gray-200 mt-2">
                      <span>总计:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 订单商品列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">订单商品 ({order.items.length})</h3>
            
            <div className="divide-y divide-gray-100">
              {order.items.map(item => (
                <div key={item.id} className="py-4 flex">
                  <div className="flex-shrink-0 mr-4">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/100'} 
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                    <p className="text-gray-500">
                      数量: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                    <p className="mt-1 font-medium">
                      小计: {formatCurrency(item.quantity * item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 底部按钮 */}
        <div className="flex flex-wrap justify-between mb-8">
          <div className="mb-4 w-full sm:w-auto">
            <button 
              onClick={() => router.push('/account/orders')}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              返回订单列表
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {order.status === 'pending' && (
              <button 
                className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => alert('取消订单功能待实现')}
              >
                取消订单
              </button>
            )}
            
            {order.status === 'delivered' && (
              <button 
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => alert('申请退货功能待实现')}
              >
                申请退货
              </button>
            )}
            
            <button 
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => alert('联系客服功能待实现')}
            >
              联系客服
            </button>
          </div>
        </div>
      </div>
  );
} 