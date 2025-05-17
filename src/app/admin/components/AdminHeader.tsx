'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 管理员顶部导航组件
export default function AdminHeader() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // 通知列表
  const notifications = [
    { id: 1, message: '新的订单 #12345 已创建', time: '3分钟前' },
    { id: 2, message: '存货不足提醒: 产品ID 789', time: '1小时前' },
    { id: 3, message: '系统更新将在今晚进行', time: '2小时前' },
  ];
  
  // 处理登出
  const handleLogout = () => {
    // 实际项目中应该调用API登出
    // 然后重定向到登录页面
    router.push('/login');
  };
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <button className="text-gray-500 focus:outline-none mr-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">管理控制台</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 搜索 */}
          <div className="md:block hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索..."
                className="bg-gray-100 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 通知 */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <div className="relative">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </div>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20">
                <div className="py-2 px-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">通知</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center border-t border-gray-100">
                  <Link href="/admin/notifications" className="text-xs text-blue-600 hover:underline">
                    查看全部
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* 用户菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                A
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <div className="py-2 px-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">管理员</p>
                  <p className="text-xs text-gray-500">admin@shophub.com</p>
                </div>
                <div className="py-1">
                  <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    个人信息
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    系统设置
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 