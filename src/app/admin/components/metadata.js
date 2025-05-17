/**
 * 管理员页面的元数据和配置
 * 这个文件用于替代直接在页面文件中导出配置
 */

export const adminMetadata = {
  title: "管理员仪表盘 | 现代电商",
  description: "管理员后台仪表盘页面",
  keywords: "管理, 后台, 电商, 仪表盘",
};

// 直接导出配置值而不是对象
// 强制动态渲染
export const dynamic = 'force-dynamic';
// 禁用缓存
export const fetchCache = 'force-no-store';
// 禁用重验证时间
export const revalidate = 0; 