'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/src/app/(shared)/utils/formatters'

// 订单类型定义
interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
}

// 订单项组件
const OrderItem = ({ order }: { order: Order }) => {
  // 获取状态对应的样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800'
      case '已发货':
        return 'bg-blue-100 text-blue-800'
      case '待发货':
        return 'bg-yellow-100 text-yellow-800'
      case '已取消':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
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
              status: '已完成'
            },
            {
              id: 'ORD20231102001',
              customer: '李四',
              date: '2023-11-02',
              total: 4999,
              status: '已发货'
            },
            {
              id: 'ORD20231025001',
              customer: '王五',
              date: '2023-10-25',
              total: 159,
              status: '待发货'
            },
            {
              id: 'ORD20231018001',
              customer: '赵六',
              date: '2023-10-18',
              total: 599,
              status: '已取消'
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