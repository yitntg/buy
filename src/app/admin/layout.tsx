'use client';

// 强制动态渲染 - 这些配置会应用到所有管理页面
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import React from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import LoadingFallback from '../(shared)/components/loading/PageLoading';
import { API_PATHS } from '@/src/app/api/config';

// 管理员布局组件
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // 检查用户是否是管理员
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // 模拟验证逻辑
        setTimeout(() => {
          setIsAuthenticated(true);
          setIsLoading(false);
        }, 500);
        
        // 实际项目中应该使用API验证
        // const response = await fetch(API_PATHS.ADMIN.AUTH + '/me');
        // const data = await response.json();
        // setIsAuthenticated(!!data.user && data.user.role === 'admin');
      } catch (error) {
        console.error('验证失败:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // 未认证状态
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">访问受限</h1>
          <p className="text-gray-600 mb-6 text-center">您需要管理员权限才能访问此页面</p>
          <div className="flex justify-center">
            <button 
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 管理员布局
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
} 