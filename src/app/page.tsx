import { redirect } from 'next/navigation'
import { clientPageConfig } from './config'

// 页面配置
export const dynamic = clientPageConfig.dynamic;
export const fetchCache = clientPageConfig.fetchCache;
export const revalidate = clientPageConfig.revalidate;

// 将根路径重定向到客户端首页
export default function HomePage() {
  redirect('/');
} 