'use client'

import { usePathname } from 'next/navigation'
import { RouteConfig, RouteNavItem, routesToNavItems } from '@/src/app/(shared)/types/route'

/**
 * 路由钩子函数
 * 提供路由导航和匹配功能
 * @param routes 路由配置数组
 */
export function useRoutes(routes: RouteConfig[]) {
  const pathname = usePathname()
  
  /**
   * 获取当前活动路由
   */
  const getCurrentRoute = (): RouteConfig | undefined => {
    const findRoute = (routes: RouteConfig[]): RouteConfig | undefined => {
      for (const route of routes) {
        if (route.path === pathname) {
          return route
        }
        
        if (route.children) {
          const found = findRoute(route.children)
          if (found) return found
        }
      }
      return undefined
    }
    
    return findRoute(routes)
  }
  
  /**
   * 判断路由是否为当前活动路由
   */
  const isActiveRoute = (path: string): boolean => {
    // 精确匹配
    if (pathname === path) {
      return true
    }
    
    // 子路由匹配（当前路径是给定路径的子路径）
    if (pathname.startsWith(path) && path !== '/') {
      // 确保这是一个真正的子路径，例如 /admin/users 是 /admin 的子路径
      // 但 /admin-settings 不是 /admin 的子路径
      const nextChar = pathname.charAt(path.length)
      return nextChar === '' || nextChar === '/'
    }
    
    return false
  }
  
  /**
   * 获取导航项
   */
  const getNavItems = (): RouteNavItem[] => {
    return routesToNavItems(routes)
  }
  
  /**
   * 根据路径获取路由名称
   */
  const getRouteName = (path: string): string | undefined => {
    const findRouteName = (routes: RouteConfig[]): string | undefined => {
      for (const route of routes) {
        if (route.path === path) {
          return route.name
        }
        
        if (route.children) {
          const found = findRouteName(route.children)
          if (found) return found
        }
      }
      return undefined
    }
    
    return findRouteName(routes)
  }
  
  /**
   * 获取当前路由的子路由
   */
  const getChildRoutes = (): RouteConfig[] => {
    const currentRoute = getCurrentRoute()
    return currentRoute?.children || []
  }
  
  return {
    currentRoute: getCurrentRoute(),
    isActiveRoute,
    navItems: getNavItems(),
    getRouteName,
    childRoutes: getChildRoutes(),
  }
} 
