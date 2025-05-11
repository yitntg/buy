// 所有可能的动态导出选项，以确保页面绝不会被静态生成
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'edge';
export const preferredRegion = 'auto';
export const maxDuration = 60;

// 以下导出用于确保在构建时不会尝试静态预渲染
export async function generateStaticParams() {
  return [];
}

// 导出一个空函数，以确保文件被正确处理
export default function NoStatic() {
  return null;
} 