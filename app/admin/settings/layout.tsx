'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default function AdminSettingsLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 