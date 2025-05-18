'use client'

import AdminLayout from './components/AdminLayout';

// 导入服务器配置
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
    <AdminLayout>
      {children}
    </AdminLayout>
  );
} 