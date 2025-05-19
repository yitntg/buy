'use client'

import { Card } from '../ui/card'
import { OrderStatus } from '@/app/(shared)/types/order'
import Link from 'next/link'

interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
}

interface RecentOrdersListProps {
  orders?: Order[];
  isLoading?: boolean;
}

const statusColors = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.PAID]: 'bg-blue-100 text-blue-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800'
}

const statusText = {
  [OrderStatus.PENDING]: '待付款',
  [OrderStatus.PAID]: '已付款',
  [OrderStatus.SHIPPED]: '已发货',
  [OrderStatus.DELIVERED]: '已送达',
  [OrderStatus.CANCELLED]: '已取消'
}

export default function RecentOrdersList({ orders = [], isLoading = false }: RecentOrdersListProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">最近订单</h2>
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          查看全部
        </Link>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {order.id.slice(-4)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  订单号: {order.id}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                {statusText[order.status]}
              </span>
              <span className="text-sm font-medium text-gray-900">
                ¥{order.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 