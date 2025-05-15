'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/shared/utils/formatters';

// 用户角色类型
type UserRole = 'admin' | 'user';

// 用户状态类型
type UserStatus = 'active' | 'inactive' | 'blocked';

// 用户类型接口
interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_login?: string;
  avatar_url?: string;
  orders_count: number;
  total_spent: number;
}

// 分页参数接口
interface PaginationParams {
  page: number;
  limit: number;
}

// 筛选参数接口
interface FilterParams {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  sort_by?: string;
}

// 用户管理页面组件
export function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
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
  
  // 加载用户数据
  useEffect(() => {
    fetchUsers(pagination, filters);
  }, [pagination.page, pagination.limit, filters]);
  
  // 模拟从API获取用户数据
  const fetchUsers = async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ) => {
    setIsLoading(true);
    
    try {
      // 实际项目中，应该从API获取数据
      // 这里使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟用户状态和角色
      const userRoles: UserRole[] = ['admin', 'user'];
      const userStatuses: UserStatus[] = ['active', 'inactive', 'blocked'];
      
      // 模拟数据
      const mockUsers: User[] = Array.from({ length: 100 }, (_, i) => {
        const role = i < 5 ? 'admin' : 'user';
        const randomStatus = userStatuses[Math.floor(Math.random() * userStatuses.length)];
        const ordersCount = Math.floor(Math.random() * 20);
        const totalSpent = ordersCount * (Math.floor(Math.random() * 1000) + 100);
        
        return {
          id: `user-${i + 1}`,
          email: `user${i + 1}@example.com`,
          name: `用户 ${i + 1}`,
          username: `user${i + 1}`,
          role: role,
          status: randomStatus,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
          last_login: Math.random() > 0.2 ? new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
          avatar_url: Math.random() > 0.3 ? `https://i.pravatar.cc/150?u=user${i + 1}` : undefined,
          orders_count: ordersCount,
          total_spent: totalSpent
        };
      });
      
      // 筛选
      let filteredUsers = [...mockUsers];
      
      if (filterParams.search) {
        const searchLower = filterParams.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
          u.email.toLowerCase().includes(searchLower) || 
          (u.name && u.name.toLowerCase().includes(searchLower)) ||
          (u.username && u.username.toLowerCase().includes(searchLower))
        );
      }
      
      if (filterParams.role) {
        filteredUsers = filteredUsers.filter(u => u.role === filterParams.role);
      }
      
      if (filterParams.status) {
        filteredUsers = filteredUsers.filter(u => u.status === filterParams.status);
      }
      
      // 排序
      switch (filterParams.sort_by) {
        case 'email':
          filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
          break;
        case 'name':
          filteredUsers.sort((a, b) => {
            const nameA = a.name || '';
            const nameB = b.name || '';
            return nameA.localeCompare(nameB);
          });
          break;
        case 'orders_desc':
          filteredUsers.sort((a, b) => b.orders_count - a.orders_count);
          break;
        case 'spent_desc':
          filteredUsers.sort((a, b) => b.total_spent - a.total_spent);
          break;
        case 'oldest':
          filteredUsers.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        default: // newest
          filteredUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      
      // 分页
      const start = (paginationParams.page - 1) * paginationParams.limit;
      const end = start + paginationParams.limit;
      const paginatedUsers = filteredUsers.slice(start, end);
      
      setUsers(paginatedUsers);
      setTotal(filteredUsers.length);
    } catch (error) {
      console.error('获取用户数据失败:', error);
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
  
  // 处理查看用户详情
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };
  
  // 处理修改用户角色
  const handleChangeRole = (userId: string, newRole: UserRole) => {
    // 实际项目中，应该调用API更新用户角色
    // 这里模拟更新
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      )
    );
  };
  
  // 处理修改用户状态
  const handleChangeStatus = (userId: string, newStatus: UserStatus) => {
    // 实际项目中，应该调用API更新用户状态
    // 这里模拟更新
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      )
    );
  };
  
  // 获取用户状态的CSS类名
  const getStatusClassName = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 获取用户角色的CSS类名
  const getRoleClassName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 获取用户状态的显示文本
  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'inactive':
        return '不活跃';
      case 'blocked':
        return '已封禁';
      default:
        return '未知状态';
    }
  };
  
  // 获取用户角色的显示文本
  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'user':
        return '普通用户';
      default:
        return '未知角色';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜索用户邮箱、名称或用户名..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select
              name="role"
              value={filters.role || ''}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">所有角色</option>
              <option value="admin">管理员</option>
              <option value="user">普通用户</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              name="status"
              value={filters.status || ''}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">所有状态</option>
              <option value="active">活跃</option>
              <option value="inactive">不活跃</option>
              <option value="blocked">已封禁</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              name="sort_by"
              value={filters.sort_by}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="newest">最新注册</option>
              <option value="oldest">最早注册</option>
              <option value="email">邮箱排序</option>
              <option value="name">名称排序</option>
              <option value="orders_desc">订单数量</option>
              <option value="spent_desc">消费金额</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            搜索
          </button>
        </form>
      </div>
      
      {/* 用户表格 */}
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
          ) : users.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单数 / 消费额
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.avatar_url ? (
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={user.avatar_url} 
                              alt={user.name || user.username || user.email} 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {(user.name || user.username || user.email).charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || user.username || user.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClassName(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {formatDate(user.created_at)}
                      </div>
                      {user.last_login && (
                        <div className="text-xs text-gray-400">
                          上次登录: {formatDate(user.last_login)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.orders_count} 个订单
                      </div>
                      <div className="text-xs text-gray-500">
                        ¥{user.total_spent.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => handleViewUserDetails(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          详情
                        </button>
                        
                        {user.role === 'user' && (
                          <button 
                            onClick={() => handleChangeRole(user.id, 'admin')}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            设为管理员
                          </button>
                        )}
                        
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => handleChangeRole(user.id, 'user')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            设为普通用户
                          </button>
                        )}
                        
                        {user.status !== 'blocked' && (
                          <button 
                            onClick={() => handleChangeStatus(user.id, 'blocked')}
                            className="text-red-600 hover:text-red-900"
                          >
                            封禁
                          </button>
                        )}
                        
                        {user.status === 'blocked' && (
                          <button 
                            onClick={() => handleChangeStatus(user.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            解除封禁
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
              未找到符合条件的用户
            </div>
          )}
        </div>
        
        {/* 分页 */}
        {!isLoading && users.length > 0 && (
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
      
      {/* 这里可以添加用户详情模态框 */}
    </div>
  );
} 
