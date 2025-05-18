import { OrderStatus } from '@/src/app/(shared)/types/order';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: OrderStatus | 'all';
  onStatusFilterChange: (status: OrderStatus | 'all') => void;
  totalCount: number;
  filteredCount: number;
}

/**
 * 订单筛选组件
 * 处理搜索和状态筛选
 */
export function OrderFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  filteredCount
}: OrderFiltersProps) {
  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部订单' },
    { value: OrderStatus.PENDING, label: '待付款' },
    { value: OrderStatus.PAID, label: '待发货' },
    { value: OrderStatus.SHIPPED, label: '已发货' },
    { value: OrderStatus.DELIVERED, label: '已完成' },
    { value: OrderStatus.CANCELLED, label: '已取消' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="搜索订单号或客户名称..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <select
        value={statusFilter}
        onChange={e => onStatusFilterChange(e.target.value as OrderStatus | 'all')}
        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <span className="text-sm text-gray-500">
        显示 {filteredCount} / {totalCount} 个订单
      </span>
    </div>
  );
} 