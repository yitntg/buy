'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export default function AccountPage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  // 模拟用户数据，实际应用中应该从会话或API获取
  const userData = user || {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '138****1234',
    avatar: 'https://picsum.photos/id/64/200/200',
    memberSince: '2023年10月',
    orders: [
      { id: 'ORD12345', date: '2023-11-15', status: '已完成', total: 598 },
      { id: 'ORD12346', date: '2023-11-02', status: '已发货', total: 4999 },
    ]
  }
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
    
    // 初始化表单数据
    if (userData) {
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      });
    }
  }, [isLoading, isAuthenticated, router, userData]);
  
  // 处理表单变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 这里应该发送API请求更新用户数据
    console.log('提交的表单数据:', formData);
    
    // 模拟API调用
    setTimeout(() => {
      alert('个人信息已更新成功！');
      setIsEditing(false);
    }, 1000);
  };
  
  // 处理退出登录
  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout();
      router.push('/');
    }
  };
  
  // 账户菜单项
  const menuItems = [
    { id: 'profile', label: '个人信息', href: '#profile' },
    { id: 'orders', label: '我的订单', href: '/account/orders' },
    { id: 'addresses', label: '收货地址', href: '/account/addresses' },
    { id: 'payment', label: '支付方式', href: '/account/payment' },
    { id: 'coupons', label: '优惠券', href: '/account/coupons' },
    { id: 'notifications', label: '消息通知', href: '/account/notifications' },
    { id: 'security', label: '账户安全', href: '/account/security' },
  ]
  
  if (isLoading) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    );
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
                      src={userData.avatar}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{userData.name}</h3>
                    <p className="text-sm text-gray-500">会员自 {userData.memberSince}</p>
                  </div>
                </div>
                
                <nav>
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.label}>
                        {item.id === 'profile' ? (
                          <button
                            onClick={() => setActiveTab('profile')}
                            className={`block w-full text-left px-3 py-2 rounded-md ${
                              activeTab === 'profile'
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <button 
                  className="w-full text-red-500 hover:text-red-600 text-sm font-medium"
                  onClick={handleLogout}
                >
                  退出登录
                </button>
              </div>
            </div>
            
            {/* 主内容区 */}
            <div className="lg:w-3/4">
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">个人信息</h2>
                    {!isEditing && (
                      <button 
                        className="text-primary text-sm hover:underline"
                        onClick={() => setIsEditing(true)}
                      >
                        编辑
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                                src={userData.avatar}
                                alt={userData.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              className="text-sm text-primary border border-primary px-3 py-1 rounded-md hover:bg-blue-50"
                            >
                              更换头像
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          取消
                        </button>
                        <button
                          type="submit"
                          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600"
                        >
                          保存更改
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm text-gray-500">姓名</div>
                          <div className="mt-1">{userData.name}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm text-gray-500">邮箱</div>
                          <div className="mt-1">{userData.email}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm text-gray-500">手机号码</div>
                          <div className="mt-1">{userData.phone}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm text-gray-500">会员等级</div>
                          <div className="mt-1">普通会员</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium">最近订单</h2>
                  <Link href="/account/orders" className="text-primary hover:underline text-sm">
                    查看全部订单
                  </Link>
                </div>
                
                {userData.orders && userData.orders.length > 0 ? (
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
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{order.id}</td>
                            <td className="px-4 py-3">{order.date}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === '已完成' ? 'bg-green-100 text-green-800' :
                                order.status === '已发货' ? 'bg-blue-100 text-blue-800' :
                                order.status === '待发货' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === '已取消' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
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