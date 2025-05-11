'use client';

// 此文件已经废弃，使用src/app/admin/layout.tsx替代
// 由于存在重复的layout文件导致AuthProvider冲突，因此不再使用此文件

// 强制动态渲染，不进行静态生成
export const dynamic = 'force-dynamic';

export default function AdminLayoutDeprecated({ children }: { children: React.ReactNode }) {
  // 此组件已不再使用
  return null;
} 