'use client'

// 直接导出服务器配置
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrdersTable } from '@/src/app/admin/components/OrdersTable';
import { Order, OrderStatus } from '@/src/app/(shared)/types/order';

/**
 * 订单管理页面
 */
export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 获取订单数据
  useEffect(() => {
    fetchOrders();
  }, []);

  // 从API获取订单数据
  const fetchOrders = async () => {
    setIsLoading(true);
    
    try {
      // 实际项目中应从API获取数据
      // const response = await fetch('/api/admin/orders');
      // if (!response.ok) throw new Error('获取订单数据失败');
      // const data = await response.json();
      // setOrders(data.orders);

      // 模拟数据加载延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟订单数据
      const mockOrders: Order[] = [
        {
          id: 'ORD-1001',
          user: { id: 'USR-1', name: '张三', email: 'zhang@example.com' },
          items: [{ product_id: '1', name: '智能手表', price: 1299, quantity: 1 }],
          total: 1299,
          status: OrderStatus.DELIVERED,
          shipping_address: { 
            recipient_name: '张三', 
            province: '北京市', 
            city: '北京市', 
            district: '海淀区',
            address: '科技园路10号', 
            phone: '13800138000' 
          },
          created_at: '2023-11-20T10:30:00Z',
          updated_at: '2023-11-21T14:45:00Z'
        },
        {
          id: 'ORD-1002',
          user: { id: 'USR-2', name: '李四', email: 'li@example.com' },
          items: [{ product_id: '2', name: '无线耳机', price: 599, quantity: 2 }],
          total: 1198,
          status: OrderStatus.SHIPPED,
          shipping_address: { 
            recipient_name: '李四', 
            province: '上海市', 
            city: '上海市', 
            district: '浦东新区',
            address: '陆家嘴金融中心', 
            phone: '13900139000' 
          },
          created_at: '2023-11-19T08:15:00Z',
          updated_at: '2023-11-20T09:30:00Z'
        },
        {
          id: 'ORD-1003',
          user: { id: 'USR-3', name: '王五', email: 'wang@example.com' },
          items: [
            { product_id: '3', name: '笔记本电脑', price: 6999, quantity: 1 },
            { product_id: '4', name: '电脑包', price: 299, quantity: 1 }
          ],
          total: 7298,
          status: OrderStatus.PAID,
          shipping_address: { 
            recipient_name: '王五', 
            province: '广东省', 
            city: '深圳市', 
            district: '南山区',
            address: '科技园路88号', 
            phone: '13700137000' 
          },
          created_at: '2023-11-18T15:45:00Z',
          updated_at: '2023-11-18T16:00:00Z'
        },
        {
          id: 'ORD-1004',
          user: { id: 'USR-4', name: '赵六', email: 'zhao@example.com' },
          items: [{ product_id: '5', name: '智能手环', price: 299, quantity: 1 }],
          total: 299,
          status: OrderStatus.PENDING,
          shipping_address: { 
            recipient_name: '赵六', 
            province: '浙江省', 
            city: '杭州市', 
            district: '西湖区',
            address: '西湖文化广场', 
            phone: '13600136000' 
          },
          created_at: '2023-11-17T21:30:00Z',
          updated_at: '2023-11-17T21:30:00Z'
        },
        {
          id: 'ORD-1005',
          user: { id: 'USR-5', name: '钱七', email: 'qian@example.com' },
          items: [{ product_id: '6', name: '游戏手柄', price: 399, quantity: 1 }],
          total: 399,
          status: OrderStatus.CANCELLED,
          shipping_address: { 
            recipient_name: '钱七', 
            province: '江苏省', 
            city: '南京市', 
            district: '鼓楼区',
            address: '中山北路100号', 
            phone: '13500135000' 
          },
          created_at: '2023-11-16T10:00:00Z',
          updated_at: '2023-11-16T16:45:00Z'
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('获取订单数据失败:', error);
      // 错误处理可以在这里添加
    } finally {
      setIsLoading(false);
    }
  };
  
  // 查看订单详情
  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };
  
  // 更新订单状态
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // 实际项目中应调用API更新状态
      // const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status })
      // });
      // if (!response.ok) throw new Error('更新订单状态失败');
      
      // 模拟API调用
      console.log(`更新订单 ${orderId} 状态为 ${status}`);
      
      // 更新本地状态
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('更新订单状态失败:', error);
      alert('更新订单状态失败，请重试');
    }
  };
  
  // 批量更新订单状态
  const handleBulkUpdateStatus = async (orderIds: string[], status: OrderStatus) => {
    try {
      // 实际项目中应调用API批量更新状态
      // const response = await fetch('/api/admin/orders/bulk-update', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderIds, status })
      // });
      // if (!response.ok) throw new Error('批量更新订单状态失败');
      
      // 模拟API调用
      console.log(`批量更新订单 ${orderIds.join(', ')} 状态为 ${status}`);
      
      // 更新本地状态
      setOrders(orders.map(order => 
        orderIds.includes(order.id) ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('批量更新订单状态失败:', error);
      alert('批量更新订单状态失败，请重试');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">订单管理</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          刷新数据
        </button>
      </div>
      
      <OrdersTable
        orders={orders}
        onViewDetails={handleViewOrderDetails}
        onUpdateStatus={handleUpdateStatus}
        onBulkUpdateStatus={handleBulkUpdateStatus}
        isLoading={isLoading}
        onRefresh={fetchOrders}
      />
    </div>
  );
} 