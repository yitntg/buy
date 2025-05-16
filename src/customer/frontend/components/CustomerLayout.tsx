'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRoutes } from '@/shared/hooks/useRoutes'
import customerRoutes from '@/customer/routes'
import { Home } from 'lucide-react'
import { RouteConfig } from '@/shared/types/route'

interface CustomerLayoutProps {
  children: ReactNode
}

interface Breadcrumb {
  name: string
  path: string
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname() || '/'
  const { currentRoute, childRoutes } = useRoutes(customerRoutes)

  // 生成面包屑导航
  const generateBreadcrumbs = (): Breadcrumb[] => {
    const breadcrumbs: Breadcrumb[] = []
    let currentPath = ''

    // 添加首页
    breadcrumbs.push({ name: '首页', path: '/' })

    // 如果不是首页，添加当前页面的路径
    if (pathname !== '/') {
      const pathSegments = pathname.split('/').filter(Boolean)
      
      pathSegments.forEach(segment => {
        currentPath += `/${segment}`
        const route = customerRoutes.find(r => r.path === currentPath)
        if (route) {
          breadcrumbs.push({ name: route.name, path: currentPath })
        }
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div>
      {/* 面包屑导航 - 仅在非首页显示 */}
      {pathname !== '/' && (
        <div className="container mx-auto px-4 py-3 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index === 0 && <Home size={14} className="mr-1" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-primary font-medium">{crumb.name}</span>
                ) : (
                  <>
                    <Link href={crumb.path} className="hover:text-primary">
                      {crumb.name}
                    </Link>
                    <span className="mx-2">/</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 主要内容 */}
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  )
} 