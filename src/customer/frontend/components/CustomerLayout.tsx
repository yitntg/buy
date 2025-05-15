'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRoutes } from '@/shared/hooks/useRoutes'
import customerRoutes from '@/customer/routes'
import { Home } from 'lucide-react'

interface CustomerLayoutProps {
  children: ReactNode
}

/**
 * 用户端布局组件
 * 包含顶部导航、页脚和内容区域
 */
export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname()
  const { getRouteName } = useRoutes(customerRoutes)
  
  // 获取当前路径的面包屑
  const getBreadcrumbs = () => {
    const result = []
    let currentPath = ''
    
    // 总是添加首页
    result.push({
      name: '首页',
      path: '/'
    })
    
    // 处理路径段
    const segments = pathname.split('/').filter(Boolean)
    
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`
      const name = getRouteName(currentPath)
      
      if (name) {
        result.push({
          name,
          path: currentPath
        })
      }
    }
    
    return result
  }
  
  const breadcrumbs = getBreadcrumbs()
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* 页面内容 */}
      <main className="flex-grow pt-16 pb-10">
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
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">关于我们</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-primary">公司介绍</Link></li>
                <li><Link href="/contact" className="hover:text-primary">联系我们</Link></li>
                <li><Link href="/careers" className="hover:text-primary">加入我们</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">客户服务</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-primary">帮助中心</Link></li>
                <li><Link href="/shipping" className="hover:text-primary">配送方式</Link></li>
                <li><Link href="/returns" className="hover:text-primary">退换货政策</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">商务合作</h3>
              <ul className="space-y-2">
                <li><Link href="/business" className="hover:text-primary">商家入驻</Link></li>
                <li><Link href="/affiliate" className="hover:text-primary">联盟营销</Link></li>
                <li><Link href="/wholesale" className="hover:text-primary">批发采购</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">法律信息</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-primary">使用条款</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">隐私政策</Link></li>
                <li><Link href="/legal" className="hover:text-primary">法律声明</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} 乐购商城. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
