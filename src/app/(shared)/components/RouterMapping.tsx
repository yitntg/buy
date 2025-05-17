'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { RouteConfig, RouteNavItem, routesToNavItems } from '@/src/app/(shared)/types/route'

interface RouterMappingProps {
  routes: RouteConfig[]
  navComponent?: (props: { items: RouteNavItem[] }) => ReactNode
  breadcrumbComponent?: (props: { path: string, routes: RouteConfig[] }) => ReactNode
}

/**
 * 路由映射组件
 * 生成路由导航和面包屑导航
 */
export function RouterMapping({
  routes,
  navComponent,
  breadcrumbComponent
}: RouterMappingProps) {
  const pathname = usePathname()
  const navItems = routesToNavItems(routes)
  
  return (
    <>
      {navComponent && navComponent({ items: navItems })}
      {breadcrumbComponent && breadcrumbComponent({ path: pathname, routes })}
    </>
  )
}

/**
 * 默认导航菜单组件
 */
export function DefaultNav({ items }: { items: RouteNavItem[] }) {
  const pathname = usePathname()
  
  return (
    <nav className="py-4">
      <ul className="flex flex-col space-y-2">
        {items.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                pathname === item.path ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
            
            {item.children && item.children.length > 0 && (
              <ul className="pl-4 mt-2 space-y-1">
                {item.children.map((child) => (
                  <li key={child.path}>
                    <Link
                      href={child.path}
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        pathname === child.path ? 'bg-primary/80 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * 面包屑导航组件
 */
export function BreadcrumbNav({
  path,
  routes
}: {
  path: string
  routes: RouteConfig[]
}) {
  // 生成面包屑路径
  const breadcrumbs = getBreadcrumbs(path, routes)
  
  return (
    <nav className="flex py-3 px-4 text-sm">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="inline-flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-primary">{crumb.name}</span>
            ) : (
              <Link href={crumb.path} className="text-gray-500 hover:text-primary">
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * 获取面包屑导航路径
 */
function getBreadcrumbs(path: string, routes: RouteConfig[]): RouteNavItem[] {
  const breadcrumbs: RouteNavItem[] = []
  let currentPath = ''
  
  // 首页始终在最前面
  const home = routes.find(route => route.path === '/' || route.path === '/admin')
  if (home) {
    breadcrumbs.push({
      path: home.path,
      name: home.name,
      icon: home.icon
    })
  }
  
  // 分割路径并逐级查找
  const pathSegments = path.split('/').filter(Boolean)
  
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`
    
    // 在所有路由中查找当前路径
    const findRoute = (routes: RouteConfig[]): RouteConfig | undefined => {
      for (const route of routes) {
        if (route.path === currentPath) {
          return route
        }
        
        if (route.children) {
          const found = findRoute(route.children)
          if (found) return found
        }
      }
      return undefined
    }
    
    const route = findRoute(routes)
    if (route) {
      breadcrumbs.push({
        path: route.path,
        name: route.name,
        icon: route.icon
      })
    }
  }
  
  return breadcrumbs
} 
