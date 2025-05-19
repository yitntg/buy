'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { formatDate, formatPrice } from '@/app/(shared)/utils/formatters'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  createdAt: string
  total: number
  items: OrderItem[]
  shippingAddress: {
    name: string
    phone: string
    address: string
  }
}

export default function OrderDetailClient() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // 这里应该调用实际的API
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) {
          throw new Error('订单获取失败')
        }
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取订单详情失败')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  if (!order) {
    return <div className="text-center py-12">订单不存在</div>
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          订单详情
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          订单号: {order.orderNumber}
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">订单状态</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {order.status}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">创建时间</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(order.createdAt)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">收货地址</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900">
          商品列表
        </h4>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <li key={item.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12">
                  <img
                    className="h-12 w-12 rounded-md object-cover"
                    src={item.image}
                    alt={item.productName}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-500">
                    数量: {item.quantity}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-900">
                  {formatPrice(item.price)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">总计</span>
          <span className="text-lg font-medium text-gray-900">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
} 