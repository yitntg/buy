'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminMainContent } from '../layout/AdminMainContent'
import { formatCurrency, formatDate } from '@/app/(shared)/utils/formatters'
import { Order, OrderStatus } from '@/app/(shared)/types/order'
import { Product } from '@/app/(shared)/types/product'

interface OrderDetailClientProps {
  id: string
}

export default function OrderDetailClient({ id }: OrderDetailClientProps) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setOrder({
        id,
        user_id: '1',
        user: {
          id: '1',
          name: '张三',
          email: 'zhangsan@example.com'
        },
        status: OrderStatus.PENDING,
        total: 299.99,
        items: [
          {
            id: '1',
            product_id: '1',
            product: {
              id: '1',
              name: '商品1',
              price: 99.99,
              primary_image: '/images/product1.jpg',
              description: '这是一个示例商品',
              sku: 'SKU001',
              inventory: 100,
              status: 'active'
            } as Product,
            quantity: 2,
            price: 99.99,
            created_at: new Date().toISOString()
          }
        ],
        created_at: new Date().toISOString(),
        shipping_address: {
          id: '1',
          user_id: '1',
          recipient_name: '张三',
          address_line1: '北京市朝阳区',
          address_line2: '某某街道123号',
          city: '北京',
          state: '北京',
          postal_code: '100000',
          country: '中国',
          phone: '13800138000',
          is_default: true,
          created_at: new Date().toISOString()
        }
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return

    setIsSaving(true)
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder({ ...order, status: newStatus })
    } catch (error) {
      console.error('更新状态失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case OrderStatus.PAID:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800'
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800'
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '待付款'
      case OrderStatus.PAID:
        return '已付款'
      case OrderStatus.SHIPPED:
        return '已发货'
      case OrderStatus.DELIVERED:
        return '已送达'
      case OrderStatus.CANCELLED:
        return '已取消'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <AdminMainContent title="订单详情">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminMainContent>
    )
  }

  if (!order) {
    return (
      <AdminMainContent title="订单详情">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">订单不存在</h2>
        </div>
      </AdminMainContent>
    )
  }

  return (
    <AdminMainContent title="订单详情">
      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">订单信息</h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">订单号</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">创建时间</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(order.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">订单状态</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">总金额</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatCurrency(order.total)}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">客户信息</h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">姓名</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.user?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">邮箱</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.user?.email}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">收货地址</h3>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">收货人</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.shipping_address?.recipient_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">地址</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.shipping_address?.address_line1}
                    {order.shipping_address?.address_line2 && (
                      <span>, {order.shipping_address.address_line2}</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">城市</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">国家</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.shipping_address?.country}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">电话</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.shipping_address?.phone}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">商品列表</h3>
              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        商品
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        单价
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        数量
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        小计
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={item.product?.primary_image || '/images/placeholder.png'}
                                alt={item.product?.name || '商品图片'}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{item.product?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">订单操作</h3>
              <div className="mt-4 flex space-x-3">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  disabled={isSaving}
                >
                  <option value={OrderStatus.PENDING}>待付款</option>
                  <option value={OrderStatus.PAID}>已付款</option>
                  <option value={OrderStatus.SHIPPED}>已发货</option>
                  <option value={OrderStatus.DELIVERED}>已送达</option>
                  <option value={OrderStatus.CANCELLED}>已取消</option>
                </select>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => router.back()}
                >
                  返回
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminMainContent>
  )
} 