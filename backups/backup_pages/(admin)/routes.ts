/**
 * 管理员端路由配置
 * 
 * 此文件定义了管理员端所有页面的路由映射关系
 * 基于Next.js App Router约定，路径与文件结构对应
 */

import { RouteConfig } from '@/src/app/(shared)/types/route'

// 管理员端路由配置
export const adminRoutes: RouteConfig[] = [
  {
    path: '/admin',
    component: 'DashboardPage',
    exact: true,
    name: '管理首页',
    icon: 'layout-dashboard',
    showInNav: true,
    public: false,
  },
  {
    path: '/admin/dashboard',
    component: 'DashboardPage',
    exact: true,
    name: '仪表盘',
    icon: 'layout-dashboard',
    showInNav: true,
    public: false,
  },
  {
    path: '/admin/products',
    component: 'ProductsPage',
    exact: true,
    name: '商品管理',
    icon: 'shopping-bag',
    showInNav: true,
    public: false,
  },
  {
    path: '/admin/users',
    component: 'UsersPage',
    exact: true,
    name: '用户管理',
    icon: 'users',
    showInNav: true,
    public: false,
  },
  {
    path: '/admin/orders',
    component: 'OrdersPage',
    exact: true,
    name: '订单管理',
    icon: 'file-text',
    showInNav: true,
    public: false,
  },
  {
    path: '/admin/settings',
    component: 'SettingsPage',
    exact: false,
    name: '系统设置',
    icon: 'settings',
    showInNav: true,
    public: false,
    children: [
      {
        path: '/admin/settings/general',
        component: 'GeneralSettingsPage',
        exact: true,
        name: '基本设置',
        showInNav: true,
        public: false,
      },
      {
        path: '/admin/settings/appearance',
        component: 'AppearanceSettingsPage',
        exact: true,
        name: '外观设置',
        showInNav: true,
        public: false,
      },
      {
        path: '/admin/settings/payment',
        component: 'PaymentSettingsPage',
        exact: true,
        name: '支付设置',
        showInNav: true,
        public: false,
      },
      {
        path: '/admin/settings/shipping',
        component: 'ShippingSettingsPage',
        exact: true,
        name: '物流设置',
        showInNav: true,
        public: false,
      },
    ],
  },
  {
    path: '/admin/categories',
    component: 'CategoriesPage',
    exact: true,
    name: '分类管理',
    icon: 'list',
    showInNav: true,
    public: false,
  },
  {
    path: '/admin/reviews',
    component: 'ReviewsPage',
    exact: true,
    name: '评价管理',
    icon: 'message-square',
    showInNav: true,
    public: false,
  },
  {
    path: '/admin/tools',
    component: 'ToolsPage',
    exact: false,
    name: '系统工具',
    icon: 'tool',
    showInNav: true,
    public: false,
    children: [
      {
        path: '/admin/tools/backup',
        component: 'BackupPage',
        exact: true,
        name: '数据备份',
        showInNav: true,
        public: false,
      },
      {
        path: '/admin/tools/import',
        component: 'ImportPage',
        exact: true,
        name: '数据导入',
        showInNav: true,
        public: false,
      },
      {
        path: '/admin/tools/logs',
        component: 'LogsPage',
        exact: true,
        name: '系统日志',
        showInNav: true,
        public: false,
      },
    ],
  },
]

// 导出管理员端路由配置
export default adminRoutes 
