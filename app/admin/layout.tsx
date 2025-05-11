'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/app/context/AuthContext';

// 强制动态渲染，不进行静态生成
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          {/* 简单的侧边栏 */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">管理后台</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li><a href="/admin/dashboard" className="block p-2 hover:bg-gray-100 rounded">仪表板</a></li>
              <li><a href="/admin/products" className="block p-2 hover:bg-gray-100 rounded">产品管理</a></li>
              <li><a href="/admin/orders" className="block p-2 hover:bg-gray-100 rounded">订单管理</a></li>
              <li><a href="/admin/users" className="block p-2 hover:bg-gray-100 rounded">用户管理</a></li>
              <li><a href="/admin/reviews" className="block p-2 hover:bg-gray-100 rounded">评论管理</a></li>
              <li><a href="/admin/settings" className="block p-2 hover:bg-gray-100 rounded">系统设置</a></li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">管理控制台</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">管理员</span>
                <button className="text-sm text-blue-600 hover:text-blue-800">退出</button>
              </div>
            </div>
          </header>
          <main className="p-4">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
} 