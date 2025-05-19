// 此文件应采用服务器组件模式
// 移除'use client'标记

import AdminLayout from './components/layout/AdminLayout';
import { AdminProvider } from './contexts/AdminContext';
import { dynamic, fetchCache, revalidate } from './config';

// 导出服务器配置
export { dynamic, fetchCache, revalidate };

// 管理员区域根布局组件
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminProvider>
  );
} 