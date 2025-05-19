'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/app/(shared)/utils/formatters'
import { OrderStatus } from '@/app/(shared)/types/order'
import { OrderStatusBadge } from './OrderStatusBadge'

// 订单类型定义
interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
}

// 订单项组件
const OrderItem = ({ order }: { order: Order }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{order.id}</p>
          <p className="text-sm text-gray-500">{order.customer}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatCurrency(order.total)}</p>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <OrderStatusBadge status={order.status} />
        <Link href={`/admin/orders/${order.id}`} className="text-primary text-sm hover:underline">
          查看详情
        </Link>
      </div>
    </div>
  )
}

// 近期订单列表组件
export default function RecentOrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // 获取最近订单数据
    const fetchOrders = async () => {
      try {
        // 这里应该从API获取真实数据
        // const response = await fetch('/api/admin/orders/recent')
        // const data = await response.json()
        
        // 模拟数据，实际应用中应该使用API
        setTimeout(() => {
          setOrders([
            {
              id: 'ORD20231115001',
              customer: '张三',
              date: '2023-11-15',
              total: 598,
              status: OrderStatus.DELIVERED
            },
            {
              id: 'ORD20231102001',
              customer: '李四',
              date: '2023-11-02',
              total: 4999,
              status: OrderStatus.SHIPPED
            },
            {
              id: 'ORD20231025001',
              customer: '王五',
              date: '2023-10-25',
              total: 159,
              status: OrderStatus.PAID
            },
            {
              id: 'ORD20231018001',
              customer: '赵六',
              date: '2023-10-18',
              total: 599,
              status: OrderStatus.CANCELLED
            }
          ])
          setIsLoading(false)
        }, 800)
      } catch (error) {
        console.error('获取最近订单失败:', error)
        setIsLoading(false)
      }
    }
    
    fetchOrders()
  }, [])
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">近期订单</h2>
        <Link href="/admin/orders" className="text-primary hover:underline text-sm">
          查看全部
        </Link>
      </div>
      
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-0">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
} 