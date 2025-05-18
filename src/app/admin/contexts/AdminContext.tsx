'use client'

import { createContext, useState, useContext, ReactNode } from 'react';

// 定义上下文类型
interface AdminContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

// 创建上下文
export const AdminContext = createContext<AdminContextType>({
  sidebarOpen: true,
  toggleSidebar: () => {}
});

// 上下文提供者
export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AdminContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </AdminContext.Provider>
  );
}

// 自定义Hook，方便使用上下文
export function useAdmin() {
  return useContext(AdminContext);
} 