'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const { user: authUser, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string>('')

  // 扩展用户类型，添加可能的字段
  interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
  }

  // 模拟用户数据，实际应用中应该从会话或API获取
  const user = {
    name: authUser?.username || '张三',
    email: authUser?.email || 'zhangsan@example.com',
    phone: '138****1234', // 默认值
    avatar: authUser?.avatar || 'https://picsum.photos/id/64/200/200',
    memberSince: '2023年10月', // 默认值
    orders: [
      { id: 'ORD12345', date: '2023-11-15', status: '已完成', total: 598 },
      { id: 'ORD12346', date: '2023-11-02', status: '已发货', total: 4999 },
    ] as Order[]
  }
  
  // 账户菜单项 - 只保留已实现的功能
  const menuItems = [
    { label: '个人信息', href: '/account', active: true },
    { label: '我的订单', href: '/account/orders', active: false },
  ]
  
  // 处理退出登录
  const handleLogout = () => {
    logout()
    router.push('/')
  }
  
  // 处理表单提交
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })
    
    // 模拟API请求延迟
    setTimeout(() => {
      setIsLoading(false)
      setMessage({ type: 'success', text: '个人信息已更新' })
      
      // 消息3秒后自动消失
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
    }, 800)
  }
  
  // 处理头像上传
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        if (typeof result === 'string') {
          setPreviewURL(result)
        }
      }
      reader.readAsDataURL(file)
      setAvatar(file)
    }
  }
  
  // 触发文件选择
  const triggerFileInput = () => {
    const fileInput = document.getElementById('avatarInput') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的账户</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏菜单 */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={previewURL || user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">会员自 {user.memberSince}</p>
                  </div>
                </div>
                
                <nav>
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`block px-3 py-2 rounded-md ${
                            item.active
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <button 
                  onClick={handleLogout}
                  className="w-full text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  退出登录
                </button>
              </div>
            </div>
            
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
                        defaultValue={user.name}
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
                        defaultValue={user.email}
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
                        defaultValue={user.phone}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                        头像
                      </label>
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={previewURL || user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <input 
                          type="file" 
                          id="avatarInput" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarChange}
                        />
                        <button
                          type="button"
                          className="text-sm text-primary border border-primary px-3 py-1 rounded-md hover:bg-blue-50"
                          onClick={triggerFileInput}
                        >
                          更换头像
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={`bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? '保存中...' : '保存更改'}
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
                
                {user.orders.length > 0 ? (
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
                        {user.orders.map((order) => (
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
      </main>
      <Footer />
    </>
  )
} 