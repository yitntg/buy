'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=/admin');
      } else if (user?.role !== 'admin') {
        router.push('/');
      } else {
        setAuthorized(true);
      }
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证用户权限...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
} 