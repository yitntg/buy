'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';

export function AdminAuthWrapper({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 使用useEffect确保只在客户端执行
  useEffect(() => {
    setIsClient(true);
    
    // 检查用户权限
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=/admin');
      } else if (user && user.role !== 'admin') {
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, loading, router, user]);

  // 服务器端渲染时或加载中时显示加载界面
  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证用户权限...</p>
        </div>
      </div>
    );
  }

  // 已认证并有权限
  if (isAuthorized) {
    return <>{children}</>;
  }

  // 已认证但没有权限或未认证，显示加载状态，等待路由跳转
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">正在跳转...</p>
      </div>
    </div>
  );
} 