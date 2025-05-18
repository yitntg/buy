'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 管理员欢迎页面
export default function AdminHomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
} 
