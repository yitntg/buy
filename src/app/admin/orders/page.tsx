'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrdersTable from '../components/orders/OrdersTable';
import AdminMainContent from '../components/layout/AdminMainContent';
import { Order, OrderStatus } from '@/app/(shared)/types/order';

/**
 * 订单管理页面
 */
export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 获取订单数据
  useEffect(() => {
    fetchOrders();
  }, []);

  // 从API获取订单数据
  const fetchOrders = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) {
        throw new Error('获取订单列表失败');
      }
      const data = await response.json();
      // 确保数据是可序列化的
      const serializedOrders = data.map((order: any) => ({
        id: order.id,
        user_id: order.user_id,
        user: order.user ? {
          id: order.user.id,
          name: order.user.name || `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
          email: order.user.email,
          role: order.user.role
        } : null,
        status: order.status,
        total: order.total,
        items: order.items.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        created_at: order.created_at,
        updated_at: order.updated_at,
        shipping_address: order.shipping_address ? {
          id: order.shipping_address.id,
          recipient_name: order.shipping_address.recipient_name,
          address_line1: order.shipping_address.address_line1,
          city: order.shipping_address.city,
          state: order.shipping_address.state,
          postal_code: order.shipping_address.postal_code,
          country: order.shipping_address.country,
          phone: order.shipping_address.phone
        } : null,
        tracking_number: order.tracking_number,
        estimated_delivery: order.estimated_delivery,
        notes: order.notes
      }));
      setOrders(serializedOrders);
    } catch (error) {
      console.error('获取订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 查看订单详情
  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };
  
  // 更新订单状态
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('更新订单状态失败');
      }

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('更新订单状态失败:', error);
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
  
  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <AdminMainContent title="订单管理" description="查看和管理所有订单">
      <OrdersTable
        orders={orders}
        onViewDetails={handleViewOrderDetails}
        onStatusChange={handleStatusChange}
        onBulkUpdateStatus={handleBulkUpdateStatus}
      />
    </AdminMainContent>
  );
} 