'use client'

import { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus, bulkUpdateOrderStatus } from '@/app/(shared)/services/order'
import OrdersTable from '../components/orders/OrdersTable'
import AdminMainContent from '../components/layout/AdminMainContent'
import { Order, OrderStatus } from '@/app/(shared)/types/order'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (orderId: string) => {
    // 处理查看详情
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      await fetchOrders() // 重新获取订单列表
    } catch (error) {
      console.error('更新订单状态失败:', error)
    }
  }

  const handleBulkUpdateStatus = async (orderIds: string[], status: OrderStatus) => {
    try {
      await bulkUpdateOrderStatus(orderIds, status)
      await fetchOrders() // 重新获取订单列表
    } catch (error) {
      console.error('批量更新订单状态失败:', error)
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <AdminMainContent title="订单管理" description="查看和管理所有订单">
      <OrdersTable 
        orders={orders} 
        onViewDetails={handleViewDetails}
        onStatusChange={handleStatusChange}
        onBulkUpdateStatus={handleBulkUpdateStatus}
      />
    </AdminMainContent>
  )
} 