'use client'

import { useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';

// 管理主内容区域的客户端组件
export function AdminMainContent({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useContext(AdminContext);

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