// 全局页面配置
// 确保所有动态页面正确配置

// 直接导出配置值
// 强制动态渲染
export const dynamic = 'force-dynamic';
// 禁用缓存
export const fetchCache = 'force-no-store';
// 禁用重验证（每次请求都重新验证）
export const revalidate = 0;

// API路由配置的重验证时间（可选，供API路由使用）
export const apiRevalidate = 60;

// 静态页面配置值（可选，供静态页面使用）
export const staticDynamic = 'auto';
export const staticFetchCache = 'auto';
export const staticRevalidate = 3600; 