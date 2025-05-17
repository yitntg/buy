/**
 * 管理员页面的元数据和配置
 * 这个文件用于替代直接在页面文件中导出配置
 */

export const adminMetadata = {
  title: "管理员仪表盘 | 现代电商",
  description: "管理员后台仪表盘页面",
  keywords: "管理, 后台, 电商, 仪表盘",
};

// 页面配置 - 使用具体的值而不是对象引用
export const pageConfig = {
  // 强制动态渲染
  dynamic: 'force-dynamic',
  // 禁用缓存
  fetchCache: 'force-no-store',
  // 禁用重验证时间
  revalidate: 0
}; 