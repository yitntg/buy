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
