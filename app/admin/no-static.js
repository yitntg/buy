// 所有admin路径动态导出配置
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const preferredRegion = 'auto';

// 以下导出用于确保在构建时不会尝试静态预渲染
export async function generateStaticParams() {
  return [];
}

// 导出一个空函数，以确保文件被正确处理
export default function NoStatic() {
  return null;
} 