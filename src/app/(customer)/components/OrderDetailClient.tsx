'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/app/(shared)/contexts/AuthContext'
import { formatPrice } from '@/src/app/(shared)/utils/formatters'

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  shipping: number
  address: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
  }
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

interface OrderDetailClientProps {
  orderId: string
}

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // TODO: 实现实际的订单详情获取逻辑
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error('获取订单详情失败')
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
  }, [orderId, user])

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: '待付款',
      paid: '已付款',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消'
    }
    return statusMap[status]
  }

  const getStatusColor = (status: Order['status']) => {
    const colorMap = {
      pending: 'text-yellow-600',
      paid: 'text-blue-600',
      shipped: 'text-purple-600',
      delivered: 'text-green-600',
      cancelled: 'text-red-600'
    }
    return colorMap[status]
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">请先登录</h1>
        <p className="text-gray-600 mb-6">
          登录后即可查看订单详情
        </p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          去登录
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-center text-gray-600">加载中...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">出错了</h1>
        <p className="text-red-600 mb-6">{error || '订单不存在'}</p>
        <button
          onClick={() => router.push('/account/orders')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          返回订单列表
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* 订单状态 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                订单号: {order.id}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                下单时间: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div
              className={`text-lg font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusText(order.status)}
            </div>
          </div>
        </div>

        {/* 收货信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            收货信息
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">收货人:</span> {order.address.name}
            </p>
            <p>
              <span className="font-medium">联系电话:</span>{' '}
              {order.address.phone}
            </p>
            <p>
              <span className="font-medium">收货地址:</span>{' '}
              {`${order.address.province} ${order.address.city} ${order.address.district} ${order.address.detail}`}
            </p>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            商品信息
          </h3>
          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-20 h-20">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-base font-medium text-gray-900">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      单价: {formatPrice(item.price)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      数量: {item.quantity}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-base font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 订单金额 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            订单金额
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>商品总额</span>
              <span>{formatPrice(order.total - order.shipping)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>运费</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-medium text-gray-900">
                <span>实付金额</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => router.push('/account/orders')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            返回订单列表
          </button>
          {order.status === 'pending' && (
            <button
              onClick={() => router.push(`/checkout/payment/${order.id}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              去支付
            </button>
          )}
          {order.status === 'delivered' && (
            <button
              onClick={() => router.push(`/account/orders/${order.id}/review`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              评价订单
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 