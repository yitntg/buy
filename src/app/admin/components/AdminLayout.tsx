'use client'

import { ReactNode, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AdminNavigation from './AdminNavigation'
import adminRoutes, { AdminRoute } from '../routes'

// 面包屑导航组件
const BreadcrumbNav = ({ path, routes }: { path: string, routes: AdminRoute[] }) => {
  // 查找当前路径的所有父路径
  const findBreadcrumbs = (routes: AdminRoute[], path: string, breadcrumbs: AdminRoute[] = []): AdminRoute[] => {
    for (const route of routes) {
      if (route.path === path) {
        return [...breadcrumbs, route]
      }
      
      if (route.children) {
        const newBreadcrumbs = [...breadcrumbs, route]
        const result = findBreadcrumbs(route.children, path, newBreadcrumbs)
        if (result.length) return result
      }
    }
    
    return []
  }
  
  const breadcrumbs = findBreadcrumbs(routes, path)
  
  return (
    <div className="flex text-sm text-gray-500 mt-1">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          <span className={index === breadcrumbs.length - 1 ? 'text-gray-700' : ''}>
            {crumb.name}
          </span>
        </div>
      ))}
    </div>
  )
}

interface AdminLayoutProps {
  children: ReactNode
}

/**
 * 管理员端布局组件
 * 包含导航、面包屑和内容区域
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [pageTitle, setPageTitle] = useState('')
  
  // 根据当前路径设置页面标题
  useEffect(() => {
    const findRouteTitle = (routes: AdminRoute[]): string => {
      for (const route of routes) {
        if (route.path === pathname) {
          return route.name
        }
        
        if (route.children) {
          const title = findRouteTitle(route.children)
          if (title) return title
        }
      }
      return ''
    }
    
    setPageTitle(findRouteTitle(adminRoutes))
  }, [pathname])
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航组件 */}
      <AdminNavigation />
      
      {/* 主内容区域 */}
      <main
        className={`pt-14 transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        {/* 页面标题和面包屑 */}
        <div className="bg-white shadow-sm mb-6">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
            <BreadcrumbNav path={pathname} routes={adminRoutes} />
          </div>
        </div>
        
        {/* 页面内容 */}
        <div className="px-6 py-4">
          {children}
        </div>
      </main>
    </div>
  )
} 
