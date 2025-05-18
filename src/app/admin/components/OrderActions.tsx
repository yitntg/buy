import { OrderStatus } from '@/src/app/(shared)/types/order';

interface OrderActionsProps {
  selectedOrders: string[];
  onUpdateBulkStatus: (status: OrderStatus) => void;
  onRefresh?: () => void;
}

/**
 * 订单操作组件
 * 提供批量更新订单状态的功能
 */
export function OrderActions({
  selectedOrders,
  onUpdateBulkStatus,
  onRefresh
}: OrderActionsProps) {
  // 订单数量
  const orderCount = selectedOrders.length;
  
  // 无选中订单时不显示
  if (orderCount === 0) {
    return (
      <div className="flex items-center space-x-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            刷新数据
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap items-center space-x-2">
      <span className="text-sm text-gray-500 mr-2">
        已选择 {orderCount} 个订单
      </span>
      
      <button 
        onClick={() => onUpdateBulkStatus(OrderStatus.PAID)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        标记已支付
      </button>
      
      <button 
        onClick={() => onUpdateBulkStatus(OrderStatus.SHIPPED)}
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        批量发货
      </button>
      
      <button 
        onClick={() => onUpdateBulkStatus(OrderStatus.DELIVERED)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        标记完成
      </button>
      
      <button 
        onClick={() => onUpdateBulkStatus(OrderStatus.CANCELLED)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        批量取消
      </button>
    </div>
  );
} 