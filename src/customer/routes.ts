/**
 * 用户端路由配置
 * 
 * 此文件定义了用户端所有页面的路由映射关系
 * 基于Next.js Pages Router约定，实际路由由pages目录文件决定
 * 这里的配置用于组件内部的导航和面包屑
 */

import { RouteConfig } from '@/shared/types/route'

// 用户端路由配置
export const customerRoutes: RouteConfig[] = [
  {
    path: '/',
    component: 'HomePage',
    exact: true,
    name: '首页',
    icon: 'home',
    showInNav: true,
    public: true,
  },
  {
    path: '/products',
    component: 'ProductsPage',
    exact: true,
    name: '商品列表',
    icon: 'shopping-bag',
    showInNav: true,
    public: true,
  },
  {
    path: '/product/:id',
    component: 'ProductDetailPage',
    exact: true,
    name: '商品详情',
    showInNav: false,
    public: true,
  },
  {
    path: '/category/:id',
    component: 'CategoryDetailPage',
    exact: true,
    name: '分类详情',
    showInNav: false,
    public: true,
  },
  {
    path: '/cart',
    component: 'CartPage',
    exact: true,
    name: '购物车',
    icon: 'shopping-cart',
    showInNav: true,
    public: true,
  },
  {
    path: '/checkout',
    component: 'CheckoutPage',
    exact: true,
    name: '结账',
    showInNav: false,
    public: false,
  },
  {
    path: '/orders',
    redirect: '/account/orders',
    exact: true,
    name: '我的订单',
    icon: 'file-text',
    showInNav: true,
    public: false,
  },
  {
    path: '/account',
    component: 'AccountPage',
    exact: true,
    name: '我的账户',
    icon: 'user',
    showInNav: true,
    public: false,
    children: [
      {
        path: '/account/orders',
        component: 'OrdersPage',
        exact: true,
        name: '我的订单',
        showInNav: true,
        public: false,
      },
      {
        path: '/account/addresses',
        component: 'AddressesPage',
        exact: true,
        name: '收货地址',
        showInNav: true,
        public: false,
      },
    ],
  },
  {
    path: '/favorites',
    component: 'FavoritesPage',
    exact: true,
    name: '收藏夹',
    icon: 'heart',
    showInNav: true,
    public: false,
  },
  {
    path: '/about',
    component: 'AboutPage',
    exact: true,
    name: '关于我们',
    icon: 'info',
    showInNav: true,
    public: true,
  },
  {
    path: '/contact',
    component: 'ContactPage',
    exact: true,
    name: '联系我们',
    icon: 'mail',
    showInNav: true,
    public: true,
  },
  {
    path: '/privacy',
    component: 'PrivacyPage',
    exact: true,
    name: '隐私政策',
    showInNav: false,
    public: true,
  },
  {
    path: '/terms',
    component: 'TermsPage',
    exact: true,
    name: '服务条款',
    showInNav: false,
    public: true,
  },
]

// 导出用户端路由配置
export default customerRoutes 
