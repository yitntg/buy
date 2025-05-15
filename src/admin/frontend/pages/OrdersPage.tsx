'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrderStatus } from '@/shared/types/order';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';

// 订单类型接口
interface Order {
  id: string;
  user_id: string;
  user_name: string;
  status: OrderStatus;
  total: number;
  items_count: number;
  created_at: string;
  updated_at?: string;
  tracking_number?: string;
  shipping_address?: string;
  payment_method?: string;
}

// 分页参数接口
interface PaginationParams {
  page: number;
  limit: number;
}

// 筛选参数接口
interface FilterParams {
  status?: OrderStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
}

// 订单管理页面组件
export function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // 分页状态
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });
  
  // 筛选状态
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    sort_by: 'newest'
  });
  
  // 加载订单数据
  useEffect(() => {
    fetchOrders(pagination, filters);
  }, [pagination.page, pagination.limit, filters]);
  
  // 模拟从API获取订单数据
  const fetchOrders = async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ) => {
    setIsLoading(true);
    
    try {
      // 实际项目中，应该从API获取数据
      // 这里使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟订单状态
      const orderStatuses = [
        OrderStatus.PENDING,
        OrderStatus.PAID,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED
      ];
      
      // 模拟数据
      const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
        id: `ORD${100000 + i}`,
        user_id: `user-${Math.floor(Math.random() * 100) + 1}`,
        user_name: `用户${Math.floor(Math.random() * 100) + 1}`,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        total: Math.floor(Math.random() * 10000) + 99,
        items_count: Math.floor(Math.random() * 10) + 1,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        updated_at: new Date(Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)).toISOString(),
        tracking_number: Math.random() > 0.3 ? `TRK${Math.floor(Math.random() * 1000000)}` : undefined,
        shipping_address: `${['北京市', '上海市', '广州市', '深圳市', '杭州市'][Math.floor(Math.random() * 5)]}${['朝阳区', '浦东新区', '天河区', '南山区', '西湖区'][Math.floor(Math.random() * 5)]}某某街道`,
        payment_method: ['支付宝', '微信支付', '银行卡', '货到付款'][Math.floor(Math.random() * 4)]
      }));
      
      // 筛选
      let filteredOrders = [...mockOrders];
      
      if (filterParams.search) {
        const searchLower = filterParams.search.toLowerCase();
        filteredOrders = filteredOrders.filter(o => 
          o.id.toLowerCase().includes(searchLower) || 
          o.user_name.toLowerCase().includes(searchLower)
        );
      }
      
      if (filterParams.status) {
        filteredOrders = filteredOrders.filter(o => o.status === filterParams.status);
      }
      
      if (filterParams.date_from) {
        const fromDate = new Date(filterParams.date_from).getTime();
        filteredOrders = filteredOrders.filter(o => 
          new Date(o.created_at).getTime() >= fromDate
        );
      }
      
      if (filterParams.date_to) {
        const toDate = new Date(filterParams.date_to).getTime();
        filteredOrders = filteredOrders.filter(o => 
          new Date(o.created_at).getTime() <= toDate
        );
      }
      
      // 排序
      switch (filterParams.sort_by) {
        case 'total_asc':
          filteredOrders.sort((a, b) => a.total - b.total);
          break;
        case 'total_desc':
          filteredOrders.sort((a, b) => b.total - a.total);
          break;
        case 'oldest':
          filteredOrders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        default: // newest
          filteredOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      
      // 分页
      const start = (paginationParams.page - 1) * paginationParams.limit;
      const end = start + paginationParams.limit;
      const paginatedOrders = filteredOrders.slice(start, end);
      
      setOrders(paginatedOrders);
      setTotal(filteredOrders.length);
    } catch (error) {
      console.error('获取订单数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // 处理筛选条件变更
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // 重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // 处理日期筛选条件变更
  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // 重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // 处理分页
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  // 处理每页显示数量变更
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setPagination({ page: 1, limit: newLimit });
  };
  
  // 计算总页数
  const totalPages = Math.ceil(total / pagination.limit);
  
  // 处理查看订单详情
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };
  
  // 获取订单状态的CSS类名
  const getStatusClassName = (status: OrderStatus) => {
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
  
  // 获取订单状态的显示文本
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '待支付';
      case OrderStatus.PAID:
        return '已支付';
      case OrderStatus.SHIPPED:
        return '已发货';
      case OrderStatus.DELIVERED:
        return '已送达';
      case OrderStatus.CANCELLED:
        return '已取消';
      default:
        return '未知状态';
    }
  };
  
  // 更新订单状态
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // 实际项目中，应该调用API更新订单状态
    // 这里模拟更新
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      )
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">订单管理</h1>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜索订单号或客户..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select
              name="status"
              value={filters.status || ''}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">所有状态</option>
              <option value={OrderStatus.PENDING}>待支付</option>
              <option value={OrderStatus.PAID}>已支付</option>
              <option value={OrderStatus.SHIPPED}>已发货</option>
              <option value={OrderStatus.DELIVERED}>已送达</option>
              <option value={OrderStatus.CANCELLED}>已取消</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              name="sort_by"
              value={filters.sort_by}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="newest">最新订单</option>
              <option value="oldest">最早订单</option>
              <option value="total_desc">金额从高到低</option>
              <option value="total_asc">金额从低到高</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <input
              type="date"
              name="date_from"
              value={filters.date_from || ''}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="开始日期"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <input
              type="date"
              name="date_to"
              value={filters.date_to || ''}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="结束日期"
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            搜索
          </button>
        </form>
      </div>
      
      {/* 订单表格 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: pagination.limit }, (_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : orders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单编号
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客户
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单金额
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewOrderDetails(order)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {order.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items_count} 件商品
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {order.user_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {order.status === OrderStatus.PENDING && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(order.id, OrderStatus.CANCELLED);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            取消
                          </button>
                        )}
                        
                        {order.status === OrderStatus.PENDING && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(order.id, OrderStatus.PAID);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            标记已支付
                          </button>
                        )}
                        
                        {order.status === OrderStatus.PAID && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(order.id, OrderStatus.SHIPPED);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            标记已发货
                          </button>
                        )}
                        
                        {order.status === OrderStatus.SHIPPED && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(order.id, OrderStatus.DELIVERED);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            标记已送达
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              未找到符合条件的订单
            </div>
          )}
        </div>
        
        {/* 分页 */}
        {!isLoading && orders.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.page === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                上一页
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
                disabled={pagination.page === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.page === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                下一页
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  显示第 <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> 至 
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, total)}</span> 条结果，
                  共 <span className="font-medium">{total}</span> 条
                </p>
              </div>
              <div className="flex items-center">
                <select
                  value={pagination.limit}
                  onChange={handleLimitChange}
                  className="mr-4 px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value={10}>10条/页</option>
                  <option value={20}>20条/页</option>
                  <option value={50}>50条/页</option>
                  <option value={100}>100条/页</option>
                </select>
                
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.page === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">首页</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* 页码 */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // 显示当前页附近的页码
                    let pageToShow = pagination.page;
                    
                    if (totalPages <= 5) {
                      // 如果总页数小于等于5，直接显示所有页码
                      pageToShow = i + 1;
                    } else if (pagination.page <= 3) {
                      // 当前页靠近开始
                      pageToShow = i + 1;
                    } else if (pagination.page >= totalPages - 2) {
                      // 当前页靠近结束
                      pageToShow = totalPages - 4 + i;
                    } else {
                      // 当前页在中间
                      pageToShow = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageToShow}
                        onClick={() => handlePageChange(pageToShow)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          pageToShow === pagination.page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={pagination.page === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.page === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">尾页</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 这里可以添加订单详情模态框 */}
    </div>
  );
} 
