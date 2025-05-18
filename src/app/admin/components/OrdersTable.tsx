import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/src/app/(shared)/types/order';
import { formatCurrency, formatDate } from '@/src/app/(shared)/utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderFilters } from './OrderFilters';
import { OrderActions } from './OrderActions';

// 组件属性接口
interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onBulkUpdateStatus: (orderIds: string[], status: OrderStatus) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function OrdersTable({
  orders,
  onViewDetails,
  onUpdateStatus,
  onBulkUpdateStatus,
  isLoading = false,
  onRefresh
}: OrdersTableProps) {
  // 状态
  const [sortField, setSortField] = useState<keyof Order>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  
  // 更新筛选和排序后的订单列表
  useEffect(() => {
    let result = [...orders];
    
    // 应用状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // 应用搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) || 
        (order.user?.name && order.user.name.toLowerCase().includes(term)) ||
        (order.shipping_address && order.shipping_address.recipient_name.toLowerCase().includes(term))
      );
    }
    
    // 应用排序
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    setFilteredOrders(result);
  }, [orders, searchTerm, sortField, sortDirection, statusFilter]);
  
  // 处理排序
  const handleSort = (field: keyof Order) => {
    if (field === sortField) {
      // 如果点击当前排序字段，则切换排序方向
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // 如果点击新字段，则设置为升序
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // 切换选择所有订单
  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };
  
  // 切换选择单个订单
  const toggleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  
  // 批量更新状态
  const handleBulkStatusUpdate = (status: OrderStatus) => {
    if (selectedOrders.length === 0) return;
    
    if (window.confirm(`确认将选中的 ${selectedOrders.length} 个订单状态更新为"${status}"吗？`)) {
      onBulkUpdateStatus(selectedOrders, status);
      setSelectedOrders([]);
    }
  };
  
  // 获取排序图标
  const getSortIcon = (field: keyof Order) => {
    if (field !== sortField) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  // 加载中显示骨架屏
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex flex-wrap justify-between items-center gap-4">
        {/* 使用筛选组件 */}
        <OrderFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          totalCount={orders.length}
          filteredCount={filteredOrders.length}
        />
        
        {/* 使用操作组件 */}
        <OrderActions 
          selectedOrders={selectedOrders}
          onUpdateBulkStatus={handleBulkStatusUpdate}
          onRefresh={onRefresh}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                订单号 {getSortIcon('id')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                下单时间 {getSortIcon('created_at')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                客户
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('total')}
              >
                金额 {getSortIcon('total')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                状态 {getSortIcon('status')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  没有找到符合条件的订单
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {order.user?.name || '未知客户'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-right space-x-2">
                    <button
                      onClick={() => onViewDetails(order.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => onUpdateStatus(order.id, order.status === OrderStatus.DELIVERED ? OrderStatus.SHIPPED : OrderStatus.DELIVERED)}
                      className="text-green-600 hover:text-green-800 ml-2"
                    >
                      {order.status === OrderStatus.DELIVERED ? '标为已发货' : '标为已完成'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
