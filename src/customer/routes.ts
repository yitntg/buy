/**
 * 用户端路由配置
 * 
 * 此文件定义了用户端所有页面的路由映射关系
 * 基于Next.js App Router约定，路径与文件结构对应
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
    exact: false,
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
        path: '/account/profile',
        component: 'ProfilePage',
        exact: true,
        name: '个人资料',
        showInNav: true,
        public: false,
      },
      {
        path: '/account/settings',
        component: 'SettingsPage',
        exact: true,
        name: '账户设置',
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
