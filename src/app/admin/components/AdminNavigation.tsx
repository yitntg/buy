'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRoutes } from '@/src/app/(shared)/hooks/useRoutes'
import adminRoutes from '@/admin/routes'
import { Menu, X, ChevronDown, LogOut, Settings, User } from 'lucide-react'

/**
 * 管理员端导航组件
 * 包含左侧菜单和顶部导航栏
 */
export default function AdminNavigation() {
  const { isActiveRoute, navItems } = useRoutes(adminRoutes)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  // 菜单图标映射
  const getIcon = (iconName?: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'layout-dashboard': <span className="i-lucide-layout-dashboard w-5 h-5" />,
      'shopping-bag': <span className="i-lucide-shopping-bag w-5 h-5" />,
      'users': <span className="i-lucide-users w-5 h-5" />,
      'file-text': <span className="i-lucide-file-text w-5 h-5" />,
      'settings': <span className="i-lucide-settings w-5 h-5" />,
      'list': <span className="i-lucide-list w-5 h-5" />,
      'message-square': <span className="i-lucide-message-square w-5 h-5" />,
      'tool': <span className="i-lucide-tool w-5 h-5" />,
    }
    
    return iconName && iconMap[iconName] ? iconMap[iconName] : <span className="i-lucide-circle w-5 h-5" />
  }
  
  return (
    <>
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm h-14 fixed w-full top-0 z-40">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            {/* 移动端侧边栏切换按钮 */}
            <button
              className="md:hidden text-gray-600 mr-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo */}
            <Link href="/admin" className="text-xl font-bold text-primary">
              管理中心
            </Link>
          </div>
          
          {/* 用户菜单 */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-primary"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <User size={20} />
              <span className="hidden md:inline-block">管理员</span>
              <ChevronDown size={16} />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                <Link
                  href="/admin/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User size={16} className="mr-2" />
                  个人资料
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings size={16} className="mr-2" />
                  系统设置
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link
                  href="/auth/logout"
                  className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <LogOut size={16} className="mr-2" />
                  退出登录
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* 侧边导航栏 */}
      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 z-30 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-16'
        } overflow-hidden`}
      >
        <nav className="p-4 h-full overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center py-2 px-4 rounded-md ${
                    isActiveRoute(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{getIcon(item.icon)}</span>
                  <span className={sidebarOpen ? 'block' : 'hidden md:block md:opacity-0'}>
                    {item.name}
                  </span>
                </Link>
                
                {/* 子菜单 */}
                {sidebarOpen && item.children && item.children.length > 0 && (
                  <ul className="ml-9 mt-1 space-y-1 border-l border-gray-200 pl-2">
                    {item.children.map(child => (
                      <li key={child.path}>
                        <Link
                          href={child.path}
                          className={`block py-2 px-3 rounded-md ${
                            isActiveRoute(child.path)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
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
      </aside>
      
      {/* 主内容区域 */}
      <div 
        className={`pt-14 transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        {/* 这里将会渲染页面内容 */}
      </div>
    </>
  )
} 
