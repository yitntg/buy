/**
 * 管理员路由配置
 * 用于导航菜单、面包屑和权限控制
 */

export interface AdminRoute {
  name: string;        // 路由名称
  path: string;        // 路由路径
  icon?: string;       // 图标名称（对应Lucide图标集）
  children?: AdminRoute[]; // 子路由
  permission?: string; // 权限标识（可选）
}

// 管理员路由定义
const adminRoutes: AdminRoute[] = [
  {
    name: '仪表盘',
    path: '/admin',
    icon: 'layout-dashboard'
  },
  {
    name: '产品管理',
    path: '/admin/products',
    icon: 'shopping-bag',
    children: [
      {
        name: '所有产品',
        path: '/admin/products',
      },
      {
        name: '添加产品',
        path: '/admin/products/new',
      },
      {
        name: '分类管理',
        path: '/admin/products/categories',
      }
    ]
  },
  {
    name: '订单管理',
    path: '/admin/orders',
    icon: 'file-text'
  },
  {
    name: '用户管理',
    path: '/admin/users',
    icon: 'users'
  },
  {
    name: '营销工具',
    path: '/admin/marketing',
    icon: 'message-square',
    children: [
      {
        name: '优惠券',
        path: '/admin/marketing/coupons',
      },
      {
        name: '促销活动',
        path: '/admin/marketing/promotions',
      }
    ]
  },
  {
    name: '系统设置',
    path: '/admin/settings',
    icon: 'settings',
    children: [
      {
        name: '基本设置',
        path: '/admin/settings',
      },
      {
        name: '支付设置',
        path: '/admin/settings/payment',
      },
      {
        name: '物流设置',
        path: '/admin/settings/shipping',
      }
    ]
  }
];

export default adminRoutes; 