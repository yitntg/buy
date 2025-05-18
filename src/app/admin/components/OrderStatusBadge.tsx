import { OrderStatus } from '@/src/app/(shared)/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

/**
 * 订单状态标签组件
 * 根据不同状态显示不同颜色的标签
 */
export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  // 获取状态标签样式
  const getStatusClass = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PAID:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.SHIPPED:
        return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态显示文本
  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return '待付款';
      case OrderStatus.PAID:
        return '待发货';
      case OrderStatus.SHIPPED:
        return '已发货';
      case OrderStatus.DELIVERED:
        return '已完成';
      case OrderStatus.CANCELLED:
        return '已取消';
      default:
        return '未知状态';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(status)}`}>
      {getStatusText(status)}
    </span>
  );
} 