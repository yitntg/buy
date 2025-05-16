/**
 * 路由配置类型定义
 * 
 * 定义应用程序路由配置的类型，用于用户端和管理员端路由配置
 */

/**
 * 路由配置接口
 */
export interface RouteConfig {
  path: string;           // 路由路径，与URL对应
  component?: string;     // 对应的组件名称
  redirect?: string;      // 重定向路径
  exact: boolean;          // 是否精确匹配
  name: string;           // 路由名称，用于显示
  icon?: string;          // 图标名称
  showInNav: boolean;     // 是否在导航栏显示
  public: boolean;        // 是否为公开路由（不需要登录）
  children?: RouteConfig[]; // 子路由配置
}

/**
 * 路由导航项接口
 * 用于导航菜单显示
 */
export interface RouteNavItem {
  path: string;
  name: string;
  icon?: string;
  children?: RouteNavItem[];
}

/**
 * 将路由配置转换为导航项
 * @param routes 路由配置数组
 * @returns 导航项数组
 */
export function routesToNavItems(routes: RouteConfig[]): RouteNavItem[] {
  return routes
    .filter(route => route.showInNav)
    .map(route => ({
      path: route.path,
      name: route.name,
      icon: route.icon,
      children: route.children 
        ? routesToNavItems(route.children) 
        : undefined
    }));
} 
