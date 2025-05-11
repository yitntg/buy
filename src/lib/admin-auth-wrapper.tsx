'use client';

import { ReactNode } from 'react';

// 移除权限验证，允许所有用户直接访问管理后台
export function AdminAuthWrapper({ children }: { children: ReactNode }) {
  // 直接渲染子组件，不做任何权限校验
  return <>{children}</>;
} 