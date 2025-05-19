import { Suspense } from 'react'
import { getOrders, updateOrderStatus, bulkUpdateOrderStatus } from '@/app/(shared)/services/order'
import OrdersTable from '../components/orders/OrdersTable'
import AdminMainContent from '../components/layout/AdminMainContent'
import { OrderStatus } from '@/app/(shared)/types/order'

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <AdminMainContent title="订单管理" description="查看和管理所有订单">
      <Suspense fallback={<div>加载中...</div>}>
        <OrdersTable 
          orders={orders} 
          onViewDetails={(orderId) => {
            // 处理查看详情
          }}
          onStatusChange={async (orderId, newStatus) => {
            await updateOrderStatus(orderId, newStatus)
          }}
          onBulkUpdateStatus={async (orderIds, status) => {
            await bulkUpdateOrderStatus(orderIds, status)
          }}
        />
      </Suspense>
    </AdminMainContent>
  )
} 