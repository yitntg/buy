'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AdminContext } from '../../contexts/AdminContext';

// 管理员顶部导航组件
export default function AdminHeader() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { sidebarOpen, toggleSidebar } = useContext(AdminContext);
  
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
    <header className="bg-white shadow-sm z-10 fixed top-0 left-0 right-0">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 focus:outline-none focus:text-gray-700"
            aria-label={sidebarOpen ? '关闭侧边栏' : '打开侧边栏'}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">商城管理系统</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            返回前台
          </Link>
          <div className="relative">
            <button className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none">
              <span className="mr-2">管理员</span>
              <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                👤
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 