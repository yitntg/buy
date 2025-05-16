'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
// Header import removed
// Footer import removed
import { useAuth } from '@/shared/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import UserAvatar from '../components/UserAvatar'
import AccountSidebar from '../components/AccountSidebar'
import AvatarUploader from '../components/AvatarUploader'
import CustomerLayout from '../components/CustomerLayout'

export default function AccountPage() {
  const { user, logout, updateProfile, isLoading } = useAuth()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [previewURL, setPreviewURL] = useState<string>('')
  
  // 使用useEffect在用户数据加载后更新表单
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  // 扩展用户类型，添加可能的字段
  interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
  }

  // 使用从AuthContext获取的用户数据
  const userData = {
    name: user?.username || '用户',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || 'https://picsum.photos/id/64/200/200',
    memberSince: user?.join_date ? new Date(user.join_date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }) : '2023年10月',
    orders: [
      { id: 'ORD12345', date: '2023-11-15', status: '已完成', total: 598 },
      { id: 'ORD12346', date: '2023-11-02', status: '已发货', total: 4999 },
    ] as Order[]
  }
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone
  });
  
  // 账户菜单项 - 包含已实现的功能
  const menuItems = [
    { label: '个人信息', href: '/account', active: true },
    { label: '我的订单', href: '/account/orders', active: false },
    { label: '收货地址', href: '/account/addresses', active: false },
    { label: '支付方式', href: '/account/payment', active: false },
    { label: '优惠券', href: '/account/coupons', active: false },
    { label: '消息通知', href: '/account/notifications', active: false },
    { label: '账户安全', href: '/account/security', active: false },
  ]
  
  // 处理退出登录
  const handleLogout = () => {
    logout()
    router.push('/')
  }
  
  // 处理表单字段变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage({ type: '', text: '' })
    
    try {
      // 准备更新数据
      const updateData = {
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        // 如果有预览URL，说明用户上传了新头像
        ...(previewURL && { avatar: previewURL })
      };
      
      // 调用API更新用户信息
      await updateProfile(updateData);
      
      // 显示成功消息
      setMessage({ 
        type: 'success', 
        text: '个人信息已更新' 
      })
      
      // 消息3秒后自动消失
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: '更新失败，请重试' 
      })
      console.error('更新失败:', error);
    } finally {
      setIsUpdating(false)
    }
  }
  
  // 如果用户未登录，显示加载状态或重定向到登录页面
  if (!user) {
    // 简单的检查以避免页面闪烁
    if (typeof window !== 'undefined') {
      router.push('/auth/login');
    }
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">正在加载...</span>
          </div>
          <p className="mt-2">正在检查登录状态...</p>
        </div>
      </div>
    );
  }
  
  return (
    <CustomerLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">我的账户</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 使用全局侧边栏组件 */}
          <AccountSidebar activePage="profile" />
          
          {/* 主内容区 */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-medium mb-4">个人信息</h2>
              
              {message.text && (
                <div className={`p-3 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message.text}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      姓名
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      邮箱
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      手机号码
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                      头像
                    </label>
                    <AvatarUploader 
                      user={{
                        username: userData.name,
                        avatar: userData.avatar
                      }}
                      onAvatarChange={(url: string) => {
                        setPreviewURL(url);
                      }}
                      size={48}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        正在保存...
                      </>
                    ) : '保存更改'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">最近订单</h2>
                <Link href="/account/orders" className="text-primary hover:underline text-sm">
                  查看全部订单
                </Link>
              </div>
              
              {userData.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">订单号</th>
                        <th className="px-4 py-2 text-left">日期</th>
                        <th className="px-4 py-2 text-left">状态</th>
                        <th className="px-4 py-2 text-right">金额</th>
                        <th className="px-4 py-2 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userData.orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-3">{order.id}</td>
                          <td className="px-4 py-3">{order.date}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">¥{order.total}</td>
                          <td className="px-4 py-3 text-center">
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="text-primary hover:underline"
                            >
                              查看详情
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>您还没有任何订单</p>
                  <Link href="/products" className="text-primary hover:underline block mt-2">
                    开始购物
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
} 
