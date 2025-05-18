// AdminLayout.tsx - 服务器组件

import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { AdminMainContent } from './AdminMainContent';

// 管理员布局主组件 - 服务器组件
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <AdminHeader />

      <div className="flex pt-16">
        {/* 侧边导航栏 */}
        <AdminSidebar />

        {/* 主内容区域 - 客户端组件会控制此区域的响应式布局 */}
        <AdminMainContent>
          {children}
        </AdminMainContent>
      </div>
    </div>
  );
}

// 客户端组件 - 处理主内容区域的响应式布局
'use client'
import { useState } from 'react';

function AdminMainContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 从全局状态获取侧边栏状态
  // 这里假设我们有一个侧边栏状态管理逻辑
  // 实际实现可能需要通过context provider或其他状态管理方式

  return (
    <main
      className={`flex-1 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'ml-[250px]' : 'ml-0'
      }`}
    >
      <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
} 
