'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/(shared)/contexts/AuthContext'
import { formatDate, formatPrice } from '@/app/(shared)/utils/formatters'
import { Order, OrderStatus, ShippingAddress } from '@/app/(shared)/types/order'
import { ProductImage } from '@/app/(shared)/types/product'

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
    if (!user) {
      router.push('/login')
      return
    }

    fetchOrderDetails()
  }, [orderId, user])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error('获取订单详情失败')
      }
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error('获取订单详情失败:', error)
      setError('获取订单详情失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  if (!order) {
    return <div className="text-center py-12">未找到订单信息</div>
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '待处理'
      case OrderStatus.PAID:
        return '已支付'
      case OrderStatus.SHIPPED:
        return '已发货'
      case OrderStatus.DELIVERED:
        return '已送达'
      case OrderStatus.CANCELLED:
        return '已取消'
      default:
        return '未知状态'
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800'
      case OrderStatus.SHIPPED:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getImageUrl = (images?: ProductImage[]) => {
    if (!images || images.length === 0) return '/placeholder.png'
    const primaryImage = images.find(img => img.is_primary)
    return primaryImage ? primaryImage.image_url : images[0].image_url
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* 订单头部信息 */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">订单详情</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            订单号：{order.id}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            下单时间：{formatDate(order.created_at)}
          </div>
        </div>

        {/* 订单商品列表 */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">商品信息</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-20 h-20">
                  <img
                    src={getImageUrl(item.product?.images)}
                    alt={item.product?.name || '商品图片'}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.product?.name || '未知商品'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    数量：{item.quantity}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 订单金额信息 */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
            <span>实付金额</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* 收货信息 */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">收货信息</h2>
          <div className="space-y-2 text-sm text-gray-600">
            {order.shipping_address && (
              <>
                <p>收货人：{order.shipping_address.recipient_name}</p>
                <p>联系电话：{order.shipping_address.phone}</p>
                <p>收货地址：{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && (
                  <p>{order.shipping_address.address_line2}</p>
                )}
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                <p>{order.shipping_address.country}</p>
              </>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              返回
            </button>
            {order.status === OrderStatus.PENDING && (
              <button
                onClick={() => {
                  // 取消订单逻辑
                  console.log('取消订单:', order.id)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                取消订单
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 