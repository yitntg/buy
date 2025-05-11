'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// 用户类型定义
interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive' | 'banned'
  joinDate: string
  lastLogin?: string
  avatar?: string
  orders: number
  totalSpent: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  // 获取用户数据
  useEffect(() => {
    fetchUsers()
  }, [currentPage, selectedRole, selectedStatus, searchQuery])
  
  // 从API获取用户数据
  const fetchUsers = async () => {
    setLoading(true)
    try {
      // 构建API参数
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchQuery
      })
      
      // 添加角色筛选
      if (selectedRole !== 'all') {
        params.append('role', selectedRole)
      }
      
      // 添加状态筛选
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }
      
      // 调用API获取用户数据
      const response = await fetch(`/api/users?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      if (!response.ok) {
        throw new Error(`获取用户失败: ${response.status}`)
      }
      
      const data = await response.json()
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('获取用户失败:', error)
      // 出错时显示空数据
      setUsers([])
      setTotalPages(1)
      alert('获取用户数据失败，请刷新页面重试。')
    } finally {
      setLoading(false)
    }
  }
  
  // 选择或取消选择用户
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }
  
  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user.id))
    }
  }
  
  // 更新用户状态
  const updateUserStatus = async (status: 'active' | 'inactive' | 'banned') => {
    if (selectedUsers.length === 0) return
    
    setIsProcessing(true)
    
    try {
      // 调用API批量更新用户状态
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: selectedUsers,
          status: status
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `更新用户状态失败: ${response.status}`)
      }
      
      const result = await response.json()
      
      // 刷新用户列表
      fetchUsers()
      setSelectedUsers([])
      
      alert(`已成功将${result.updated}个用户状态更新为"${getStatusName(status)}"`)
    } catch (error) {
      console.error('更新用户状态失败:', error)
      alert('更新用户状态失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // 获取用户状态显示名称
  const getStatusName = (status: string): string => {
    switch (status) {
      case 'active':
        return '正常'
      case 'inactive':
        return '未激活'
      case 'banned':
        return '已禁用'
      default:
        return status
    }
  }
  
  // 获取用户状态对应的颜色
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'banned':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // 获取用户角色显示名称
  const getRoleName = (role: string): string => {
    switch (role) {
      case 'admin':
        return '管理员'
      case 'user':
        return '普通用户'
      default:
        return role
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => updateUserStatus('active')}
            disabled={selectedUsers.length === 0 || isProcessing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            激活用户
          </button>
          <button
            onClick={() => updateUserStatus('inactive')}
            disabled={selectedUsers.length === 0 || isProcessing}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed"
          >
            禁用登录
          </button>
          <button
            onClick={() => updateUserStatus('banned')}
            disabled={selectedUsers.length === 0 || isProcessing}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            封禁账号
          </button>
        </div>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索用户名、邮箱或ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-md pr-10"
              />
              <button 
                onClick={() => fetchUsers()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="md:w-40">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="all">所有角色</option>
              <option value="admin">管理员</option>
              <option value="user">普通用户</option>
            </select>
          </div>
          
          <div className="md:w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="all">所有状态</option>
              <option value="active">正常</option>
              <option value="inactive">未激活</option>
              <option value="banned">已禁用</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-500">加载用户数据...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">没有找到匹配的用户</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-primary rounded"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      注册日期
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      订单数
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="h-4 w-4 text-primary rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                            <Image 
                              src={user.avatar || 'https://api.dicebear.com/6.x/avataaars/svg?seed=default'} 
                              alt={user.username} 
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {getRoleName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                          {getStatusName(user.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.orders > 0 ? (
                          <Link href={`/admin/orders?user=${user.id}`} className="hover:text-primary">
                            {user.orders} 个订单
                          </Link>
                        ) : '无订单'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/users/${user.id}`} className="text-primary hover:text-primary-dark mr-3">
                          详情
                        </Link>
                        <button 
                          onClick={() => updateUserStatus(user.status === 'active' ? 'inactive' : 'active')}
                          className="text-gray-600 hover:text-primary"
                        >
                          {user.status === 'active' ? '禁用' : '激活'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页 */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                显示 {users.length} 个用户中的 {Math.min(10, users.length)} 个
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  上一页
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 