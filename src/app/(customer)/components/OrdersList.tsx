'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../../(shared)/contexts/AuthContext'
import { formatPrice } from '../../../../(shared)/utils/formatters'

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }[]
}

export default function OrdersList() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 这里应该是实际的API调用
        const response = await fetch('/api/orders')
        if (!response.ok) {
          throw new Error('获取订单数据失败')
        }
        const data = await response.json()
        setOrders(data)
      } catch (err) {
        setError('加载订单时出错')
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">您还没有任何订单</p>
        <Link 
          href="/products" 
          className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
        >
          开始购物
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">订单号：</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">下单时间：</span>
                  <span>{new Date(order.date).toLocaleString('zh-CN')}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        数量：{item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price)}</p>
                      <p className="text-sm text-gray-500">
                        小计：{formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">订单状态：</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === '已完成' ? 'bg-green-100 text-green-800' :
                    order.status === '已发货' ? 'bg-blue-100 text-blue-800' :
                    order.status === '待付款' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">订单总额：</span>
                  <span className="text-lg font-bold text-primary ml-2">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-4">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  查看详情
                </Link>
                {order.status === '待付款' && (
                  <Link
                    href={`/checkout?orderId=${order.id}`}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                  >
                    立即付款
                  </Link>
                )}
                {order.status === '已发货' && (
                  <button
                    onClick={() => {/* 确认收货逻辑 */}}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    确认收货
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 