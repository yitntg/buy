// API路由配置
// 确保所有API路由是动态的，不会在构建时静态生成

// 导入API路由重验证时间配置
import { apiRevalidate } from '../config';

// 直接导出配置值
export const revalidate = apiRevalidate;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// API路径映射配置
// 用于统一处理API路径，解决路由分组引起的路径不一致问题
export const API_PATHS = {
  // 客户端API
  CUSTOMER: {
    PRODUCTS: '/api/products',
    PRODUCTS_HOME: '/api/products/home',
    CATEGORIES: '/api/categories',
    ORDERS: '/api/orders',
    USER: '/api/user',
  },
  // 管理员API
  ADMIN: {
    PRODUCTS: '/api/admin/products',
    CATEGORIES: '/api/admin/categories',
    ORDERS: '/api/admin/orders',
    USERS: '/api/admin/users',
    AUTH: '/api/admin/auth',
    STATS: '/api/admin/stats',
  }
}; 