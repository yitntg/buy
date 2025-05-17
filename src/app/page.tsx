import { redirect } from 'next/navigation'

// 页面配置 - 直接导出配置值
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// 将根路径重定向到客户端首页
export default function HomePage() {
  redirect('/');
} 