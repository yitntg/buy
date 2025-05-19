import { formatCurrency, formatDate } from '@/app/(shared)/utils/formatters'
import { Order, OrderStatus } from '@/app/(shared)/types/order'

interface OrdersTableProps {
  orders: Order[]
  onViewDetails: (orderId: string) => void
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
  onBulkUpdateStatus: (orderIds: string[], status: OrderStatus) => Promise<void>
}

export default function OrdersTable({ orders, onViewDetails, onStatusChange, onBulkUpdateStatus }: OrdersTableProps) {
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

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    订单号
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    客户
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    日期
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    状态
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    总金额
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {order.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {order.user?.name || '未知用户'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => onViewDetails(order.id)}
                        className="text-primary hover:text-primary-dark"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 