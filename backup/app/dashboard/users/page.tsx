'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// Header import removed
// Footer import removed
import { useAuth } from '../../context/AuthContext'

// 用户类型定义
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'blocked';
  lastLogin: string;
  createdAt: string;
  orders: number;
  totalSpent: number;
}

export default function UsersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all') // all, admin, user, blocked
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('lastLogin') // username, email, lastLogin, createdAt, orders, totalSpent
  const [sortOrder, setSortOrder] = useState('desc') // asc, desc
  
  // 检查用户是否是管理员，如果不是则重定向
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    } else if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      router.push('/account')
    } else {
      // 加载用户数据
      fetchUsers()
    }
  }, [isLoading, isAuthenticated, user, router])
  
  // 模拟从API获取用户数据
  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟用户数据
      const mockUsers: User[] = [
        {
          id: '1',
          username: '管理员',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2023-11-25 14:30',
          createdAt: '2023-01-01',
          orders: 12,
          totalSpent: 9680
        },
        {
          id: '2',
          username: '张三',
          email: 'zhangsan@example.com',
          role: 'user',
          status: 'active',
          lastLogin: '2023-11-20 09:15',
          createdAt: '2023-02-15',
          orders: 8,
          totalSpent: 4590
        },
        {
          id: '3',
          username: '李四',
          email: 'lisi@example.com',
          role: 'user',
          status: 'active',
          lastLogin: '2023-11-18 16:45',
          createdAt: '2023-03-20',
          orders: 5,
          totalSpent: 2340
        },
        {
          id: '4',
          username: '王五',
          email: 'wangwu@example.com',
          role: 'user',
          status: 'inactive',
          lastLogin: '2023-10-10 11:20',
          createdAt: '2023-04-05',
          orders: 2,
          totalSpent: 890
        },
        {
          id: '5',
          username: '赵六',
          email: 'zhaoliu@example.com',
          role: 'user',
          status: 'blocked',
          lastLogin: '2023-09-15 08:30',
          createdAt: '2023-05-12',
          orders: 1,
          totalSpent: 499
        },
        {
          id: '6',
          username: '钱七',
          email: 'qianqi@example.com',
          role: 'user',
          status: 'active',
          lastLogin: '2023-11-22 13:45',
          createdAt: '2023-06-30',
          orders: 3,
          totalSpent: 1560
        },
        {
          id: '7',
          username: '孙八',
          email: 'sunba@example.com',
          role: 'user',
          status: 'active',
          lastLogin: '2023-11-24 10:10',
          createdAt: '2023-07-18',
          orders: 4,
          totalSpent: 2080
        },
        {
          id: '8',
          username: '周九',
          email: 'zhoujiu@example.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2023-11-23 15:20',
          createdAt: '2023-08-05',
          orders: 0,
          totalSpent: 0
        }
      ]
      
      setUsers(mockUsers)
    } catch (error) {
      console.error('获取用户失败:', error)
    } finally {
      setIsLoadingUsers(false)
    }
  }
  
  // 筛选和排序用户
  const filteredAndSortedUsers = () => {
    // 先筛选用户
    let result = [...users]
    
    // 根据状态筛选
    if (activeFilter !== 'all') {
      if (activeFilter === 'admin') {
        result = result.filter(user => user.role === 'admin')
      } else if (activeFilter === 'user') {
        result = result.filter(user => user.role === 'user')
      } else {
        result = result.filter(user => user.status === activeFilter)
      }
    }
    
    // 根据搜索关键字筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        user => 
          user.username.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      )
    }
    
    // 排序
    result.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number
      
      // 根据排序字段获取值
      switch (sortBy) {
        case 'username':
          aValue = a.username.toLowerCase()
          bValue = b.username.toLowerCase()
          break
        case 'email':
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case 'orders':
          aValue = a.orders
          bValue = b.orders
          break
        case 'totalSpent':
          aValue = a.totalSpent
          bValue = b.totalSpent
          break
        case 'createdAt':
          aValue = a.createdAt
          bValue = b.createdAt
          break
        case 'lastLogin':
        default:
          aValue = a.lastLogin
          bValue = b.lastLogin
          break
      }
      
      // 根据排序方向比较
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return result
  }
  
  // 获取用户状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">活跃</span>
      case 'inactive':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">非活跃</span>
      case 'blocked':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">已封禁</span>
      default:
        return null
    }
  }
  
  // 更新用户状态
  const updateUserStatus = (id: string, status: 'active' | 'inactive' | 'blocked') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, status } 
          : user
      )
    )
  }
  
  // 处理排序
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // 如果已经按这个字段排序，则切换排序方向
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // 否则，设置新的排序字段，默认降序
      setSortBy(field)
      setSortOrder('desc')
    }
  }
  
  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 搜索逻辑已经在筛选函数中实现
  }
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          </div>
        </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* 面包屑导航 */}
          <div className="mb-6 flex items-center text-sm">
            <Link href="/dashboard" className="text-gray-500 hover:text-primary">
              管理后台
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-700">用户管理</span>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">用户管理</h1>
              <Link 
                href="/dashboard/users/new" 
                className="mt-3 md:mt-0 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                添加用户
              </Link>
            </div>
            
            {/* 搜索和筛选栏 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex mb-4 md:mb-0">
                <button
                  className={`mr-2 px-3 py-1 rounded ${
                    activeFilter === 'all'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => setActiveFilter('all')}
                >
                  全部
                </button>
                <button
                  className={`mr-2 px-3 py-1 rounded ${
                    activeFilter === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => setActiveFilter('admin')}
                >
                  管理员
                </button>
                <button
                  className={`mr-2 px-3 py-1 rounded ${
                    activeFilter === 'user'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => setActiveFilter('user')}
                >
                  普通用户
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    activeFilter === 'blocked'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => setActiveFilter('blocked')}
                >
                  已封禁
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="搜索用户名或邮箱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            {/* 用户表格 */}
            {isLoadingUsers ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">
                          <button 
                            className="flex items-center font-medium text-gray-700"
                            onClick={() => handleSort('username')}
                          >
                            用户名
                            {sortBy === 'username' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ml-1 transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-left">
                          <button 
                            className="flex items-center font-medium text-gray-700"
                            onClick={() => handleSort('email')}
                          >
                            邮箱
                            {sortBy === 'email' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ml-1 transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-left">角色</th>
                        <th className="px-4 py-2 text-left">状态</th>
                        <th className="px-4 py-2 text-left">
                          <button 
                            className="flex items-center font-medium text-gray-700"
                            onClick={() => handleSort('lastLogin')}
                          >
                            最近登录
                            {sortBy === 'lastLogin' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ml-1 transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-center">
                          <button 
                            className="flex items-center justify-center font-medium text-gray-700"
                            onClick={() => handleSort('orders')}
                          >
                            订单数
                            {sortBy === 'orders' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ml-1 transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-center">
                          <button 
                            className="flex items-center justify-center font-medium text-gray-700"
                            onClick={() => handleSort('totalSpent')}
                          >
                            消费总额
                            {sortBy === 'totalSpent' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ml-1 transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedUsers().map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 font-medium">{user.username}</td>
                          <td className="px-4 py-4">{user.email}</td>
                          <td className="px-4 py-4">
                            {user.role === 'admin' ? (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">管理员</span>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">用户</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="px-4 py-4 text-gray-500">{user.lastLogin}</td>
                          <td className="px-4 py-4 text-center">{user.orders}</td>
                          <td className="px-4 py-4 text-center">¥{user.totalSpent}</td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center space-x-2">
                              <Link 
                                href={`/dashboard/users/${user.id}`}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="查看详情"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Link>
                              <Link 
                                href={`/dashboard/users/edit/${user.id}`}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="编辑"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Link>
                              {user.status === 'blocked' ? (
                                <button 
                                  onClick={() => updateUserStatus(user.id, 'active')}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="解除封禁"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => updateUserStatus(user.id, 'blocked')}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="封禁"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredAndSortedUsers().length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>没有找到符合条件的用户</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
  )
} 