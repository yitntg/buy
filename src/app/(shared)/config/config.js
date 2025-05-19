// API路由重验证时间配置（单位：秒）
export const apiRevalidate = 60; // 1分钟

// 其他全局配置
export const config = {
  // API配置
  api: {
    revalidate: 60,
    timeout: 30000, // 30秒
  },
  // 缓存配置
  cache: {
    maxAge: 60 * 60 * 24, // 24小时
  }
}; 