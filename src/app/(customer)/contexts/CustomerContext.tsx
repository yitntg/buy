'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

// 定义上下文类型
interface CustomerContextType {
  // 添加客户相关的状态
  cartCount: number;
  setCartCount: (count: number) => void;
  // 可以根据需要添加更多状态
}

// 创建上下文
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// 提供者组件
export function CustomerProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  // 上下文值
  const value = {
    cartCount,
    setCartCount,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

// 自定义钩子
export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}

export { CustomerContext }; 