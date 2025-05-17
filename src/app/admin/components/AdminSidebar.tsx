'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 管理员侧边栏组件
export default function AdminSidebar() {
  const pathname = usePathname();
  
  // 侧边栏链接配置
  const sidebarLinks = [
    { href: '/admin', label: '仪表盘', icon: '📊' },
    { href: '/admin/products', label: '产品管理', icon: '📦' },
    { href: '/admin/orders', label: '订单管理', icon: '📋' },
    { href: '/admin/customers', label: '客户管理', icon: '👥' },
    { href: '/admin/categories', label: '分类管理', icon: '🗂️' },
    { href: '/admin/settings', label: '系统设置', icon: '⚙️' },
  ];
  
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex-shrink-0">
      <div className="p-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">ShopHub</span>
          <span className="text-xs bg-blue-600 px-2 py-1 rounded">管理</span>
        </Link>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center px-4 py-3 text-sm ${
                    isActive 
                      ? 'bg-gray-700 text-blue-400 border-l-4 border-blue-400' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 bg-gray-900 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            A
          </div>
          <div>
            <p className="text-sm font-medium">管理员</p>
            <p className="text-xs text-gray-400">admin@shophub.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 