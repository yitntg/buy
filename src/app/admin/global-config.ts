// 管理页面全局配置
// 这些值会被各个管理页面导入使用

// 强制使用动态渲染 - 禁用静态生成
export const dynamic = 'force-dynamic';

// 禁用数据缓存 - 确保每次请求都从服务器获取最新数据
export const fetchCache = 'force-no-store';

// 禁用自动重新验证 - 0表示每次请求都重新渲染
export const revalidate = 0; 