'use client'

import AdminLayout from './components/AdminLayout';

// 导出服务器配置
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// 管理员区域根布局组件
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
} 