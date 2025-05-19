'use client'

import { OrderStatus } from '@/app/(shared)/types/order'

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: '待付款',
    color: 'bg-yellow-100 text-yellow-800'
  },
  [OrderStatus.PAID]: {
    label: '已付款',
    color: 'bg-blue-100 text-blue-800'
  },
  [OrderStatus.SHIPPED]: {
    label: '已发货',
    color: 'bg-purple-100 text-purple-800'
  },
  [OrderStatus.DELIVERED]: {
    label: '已送达',
    color: 'bg-green-100 text-green-800'
  },
  [OrderStatus.CANCELLED]: {
    label: '已取消',
    color: 'bg-red-100 text-red-800'
  }
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
} 