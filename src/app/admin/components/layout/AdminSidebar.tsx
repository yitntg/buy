'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { AdminContext } from '../../contexts/AdminContext';

// 定义导航项目类型
interface NavItem {
  title: string;
  path: string;
  icon: string;
}

// 左侧导航栏项目
const navItems: NavItem[] = [
  { title: '仪表盘', path: '/admin/dashboard', icon: '📊' },
  { title: '订单管理', path: '/admin/orders', icon: '📦' },
  { title: '商品管理', path: '/admin/products', icon: '🛍️' },
  { title: '用户管理', path: '/admin/users', icon: '👥' },
  { title: '分类管理', path: '/admin/categories', icon: '🏷️' },
  { title: '系统设置', path: '/admin/settings', icon: '⚙️' },
];

// 管理员侧边栏组件
export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useContext(AdminContext);
  
  return (
    <aside
      className={`fixed left-0 top-16 h-full bg-white shadow-md transform transition-transform duration-300 ease-in-out z-20 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: '250px' }}
    >
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
} 