'use client'

import { useState } from 'react';
import { User } from '@/src/app/(shared)/types/auth';
import { formatDate } from '@/src/app/(shared)/utils/formatters';

// 用户角色类型
type UserRole = 'admin' | 'user';

// 用户状态类型
type UserStatus = 'active' | 'inactive' | 'blocked';

// 扩展用户类型，添加管理界面需要的字段
interface AdminUser extends User {
  status: UserStatus;
  orders_count?: number;
  total_spent?: number;
}

// 表格列定义
type ColumnKey = 'user' | 'role' | 'status' | 'registered' | 'orders' | 'actions';

// 表格属性接口
interface UsersTableProps {
  users: AdminUser[];
  isLoading?: boolean;
  onViewDetails: (userId: string) => void;
  onChangeRole: (userId: string, newRole: UserRole) => void;
  onChangeStatus: (userId: string, newStatus: UserStatus) => void;
}

/**
 * 用户表格组件
 */
export function UsersTable({
  users,
  isLoading = false,
  onViewDetails,
  onChangeRole,
  onChangeStatus
}: UsersTableProps) {
  // 表格列配置
  const columns: { key: ColumnKey; title: string; sortable?: boolean }[] = [
    { key: 'user', title: '用户', sortable: true },
    { key: 'role', title: '角色', sortable: true },
    { key: 'status', title: '状态', sortable: true },
    { key: 'registered', title: '注册时间', sortable: true },
    { key: 'orders', title: '订单数 / 消费额', sortable: true },
    { key: 'actions', title: '操作' },
  ];

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
  
  // 安全格式化日期，处理undefined情况
  const formatDateSafe = (date?: string) => {
    if (!date) return '未知';
    return formatDate(date);
  };

  // 渲染表格
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center text-gray-500">
          未找到符合条件的用户
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.key === 'actions' ? 'text-right' : 'text-left'
                  }`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* 用户信息 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {user.avatar_url ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar_url}
                          alt={user.name || user.email || '用户头像'}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {(user.name || user.email || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || user.username || user.email || '未知用户'}
                      </div>
                      <div className="text-xs text-gray-500">{user.email || '无邮箱'}</div>
                    </div>
                  </div>
                </td>

                {/* 角色 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClassName(
                      user.role as UserRole
                    )}`}
                  >
                    {getRoleText(user.role as UserRole)}
                  </span>
                </td>

                {/* 状态 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(
                      user.status
                    )}`}
                  >
                    {getStatusText(user.status)}
                  </span>
                </td>

                {/* 注册时间 */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{formatDateSafe(user.created_at)}</div>
                  {user.last_login && (
                    <div className="text-xs text-gray-400">
                      上次登录: {formatDateSafe(user.last_login)}
                    </div>
                  )}
                </td>

                {/* 订单数和消费额 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.orders_count || 0} 个订单
                  </div>
                  <div className="text-xs text-gray-500">
                    ¥{(user.total_spent || 0).toLocaleString()}
                  </div>
                </td>

                {/* 操作 */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onViewDetails(user.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      详情
                    </button>

                    {user.role === 'user' && (
                      <button
                        onClick={() => onChangeRole(user.id, 'admin')}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        设为管理员
                      </button>
                    )}

                    {user.role === 'admin' && (
                      <button
                        onClick={() => onChangeRole(user.id, 'user')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        设为普通用户
                      </button>
                    )}

                    {user.status !== 'blocked' && (
                      <button
                        onClick={() => onChangeStatus(user.id, 'blocked')}
                        className="text-red-600 hover:text-red-900"
                      >
                        封禁
                      </button>
                    )}

                    {user.status === 'blocked' && (
                      <button
                        onClick={() => onChangeStatus(user.id, 'active')}
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
      </div>
    </div>
  );
} 
