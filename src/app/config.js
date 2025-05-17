// 全局页面配置
// 确保所有动态页面正确配置

// 客户端页面配置
export const clientPageConfig = {
  // 启用动态渲染
  dynamic: 'force-dynamic',
  // 禁用缓存
  fetchCache: 'force-no-store',
  // 禁用重验证（每次请求都重新验证）
  revalidate: 0
};

// 管理员页面配置
export const adminPageConfig = {
  // 始终使用动态渲染
  dynamic: 'force-dynamic',
  // 禁用缓存
  fetchCache: 'force-no-store',
  // 禁用重验证 - 修改为字符串"0"以避免被解析为对象
  revalidate: "0"
};

// API路由配置
export const apiRouteConfig = {
  // 使用合理的缓存时间（60秒）
  revalidate: 60
};

// 静态页面配置
export const staticPageConfig = {
  // 使用静态渲染
  dynamic: 'auto',
  // 使用默认缓存策略
  fetchCache: 'auto',
  // 每小时重新验证一次
  revalidate: 3600
};

// 默认导出当前使用的配置（动态配置）
// 重要：这里一定要导出具体的值，不能导出对象引用
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0; 