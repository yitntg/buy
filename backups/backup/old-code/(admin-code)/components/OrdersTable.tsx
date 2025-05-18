import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/src/app/shared/types/order';
import { formatCurrency, formatDate } from '@/src/app/shared/utils/formatters';

// 组件属性接口
interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onBulkUpdateStatus: (orderIds: string[], status: OrderStatus) => void;
  isLoading?: boolean;
}

export function OrdersTable({
  orders,
  onViewDetails,
  onUpdateStatus,
  onBulkUpdateStatus,
  isLoading = false
}: OrdersTableProps) {
  // 状态
  const [sortField, setSortField] = useState<keyof Order>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  
  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部订单' },
    { value: OrderStatus.PENDING, label: '待付款' },
    { value: OrderStatus.PAID, label: '待发货' },
    { value: OrderStatus.SHIPPED, label: '已发货' },
    { value: OrderStatus.DELIVERED, label: '已完成' },
    { value: OrderStatus.CANCELLED, label: '已取消' }
  ];
  
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
  
  // 获取状态标签样式
  const getStatusBadgeClass = (status: OrderStatus): string => {
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
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="搜索订单号或客户名称..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            显示 {filteredOrders.length} / {orders.length} 个订单
          </span>
        </div>
        
        {/* 批量操作按钮 */}
        {selectedOrders.length > 0 && (
          <div className="flex flex-wrap items-center space-x-2">
            <button 
              onClick={() => handleBulkStatusUpdate(OrderStatus.SHIPPED)}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              批量发货
            </button>
            <button 
              onClick={() => handleBulkStatusUpdate(OrderStatus.DELIVERED)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              标记完成
            </button>
            <button 
              onClick={() => handleBulkStatusUpdate(OrderStatus.CANCELLED)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              取消订单
            </button>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input 
                  type="checkbox" 
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded"
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
                日期 {getSortIcon('created_at')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                客户
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('total')}
              >
                总金额 {getSortIcon('total')}
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
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                  没有找到订单
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.name || '匿名用户'}
                    </div>
                    {order.user?.email && (
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{formatCurrency(order.total)}</div>
                    <div className="text-xs text-gray-500">{order.items.length} 件商品</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => onViewDetails(order.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        详情
                      </button>
                      
                      {order.status === OrderStatus.PENDING && (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.PAID)}
                          className="text-green-600 hover:text-green-900"
                        >
                          标记付款
                        </button>
                      )}
                      
                      {order.status === OrderStatus.PAID && (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.SHIPPED)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          发货
                        </button>
                      )}
                      
                      {order.status === OrderStatus.SHIPPED && (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)}
                          className="text-green-600 hover:text-green-900"
                        >
                          标记完成
                        </button>
                      )}
                      
                      {(order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID) && (
                        <button 
                          onClick={() => {
                            if (window.confirm(`确认取消订单 ${order.id} 吗?`)) {
                              onUpdateStatus(order.id, OrderStatus.CANCELLED);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          取消
                        </button>
                      )}
                    </div>
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
