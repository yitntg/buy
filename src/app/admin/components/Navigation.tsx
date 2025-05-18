/**
 * 【已废弃】请使用 AdminNavigation.tsx 替代
 * 此文件保留仅作参考，新功能请在 AdminNavigation.tsx 中实现
 */

'use client'

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 菜单项接口
export interface MenuItem {
  name: string;
  path: string;
  icon: ReactNode;
  subItems?: MenuItem[];
}

// 导航属性接口
interface NavigationProps {
  items: MenuItem[];
  collapsed?: boolean;
  onItemClick?: () => void;
}

/**
 * 管理员端导航组件
 */
export function Navigation({ items, collapsed = false, onItemClick }: NavigationProps) {
  const pathname = usePathname();

  // 判断菜单项是否激活
  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(path);
  };

  // 渲染菜单项
  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.path);
    
    return (
      <li key={item.path}>
        <Link
          href={item.path}
          className={`flex items-center space-x-2 py-2 px-4 rounded-md transition duration-150 ${
            active
              ? 'bg-blue-700 text-white'
              : 'hover:bg-blue-600 hover:text-white text-gray-200'
          }`}
          onClick={onItemClick}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
          {collapsed && (
            <span className="sr-only">{item.name}</span>
          )}
        </Link>
        
        {/* 子菜单项 */}
        {!collapsed && item.subItems && item.subItems.length > 0 && active && (
          <ul className="mt-1 ml-6 space-y-1">
            {item.subItems.map((subItem) => (
              <li key={subItem.path}>
                <Link
                  href={subItem.path}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-md transition duration-150 ${
                    isActive(subItem.path)
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-600 hover:text-white text-gray-300'
                  }`}
                  onClick={onItemClick}
                >
                  {subItem.icon}
                  <span className="text-sm">{subItem.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={`px-2 py-4 ${collapsed ? 'w-16' : 'w-64'}`}>
      <ul className="space-y-1">
        {items.map(renderMenuItem)}
      </ul>
    </nav>
  );
}

/**
 * 默认菜单项配置
 */
export const defaultMenuItems: MenuItem[] = [
  {
    name: '仪表盘',
    path: '/admin',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    name: '产品管理',
    path: '/admin/products',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    subItems: [
      {
        name: '所有产品',
        path: '/admin/products',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        ),
      },
      {
        name: '添加产品',
        path: '/admin/products/new',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        ),
      },
      {
        name: '分类管理',
        path: '/admin/products/categories',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    name: '订单管理',
    path: '/admin/orders',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  {
    name: '用户管理',
    path: '/admin/users',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    name: '统计分析',
    path: '/admin/analytics',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    name: '设置',
    path: '/admin/settings',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
]; 
