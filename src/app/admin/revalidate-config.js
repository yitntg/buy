'use client'

// 管理员页面动态配置
// 确保这些页面始终动态渲染，不缓存

// 直接导出配置值
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0; 