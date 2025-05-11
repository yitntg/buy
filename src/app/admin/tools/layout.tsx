'use client';

import { ReactNode } from 'react';
import AdminToolsWrapper from './wrapper';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default function AdminToolsLayout({ children }: { children: ReactNode }) {
  return (
    <AdminToolsWrapper>
      {children}
    </AdminToolsWrapper>
  );
} 