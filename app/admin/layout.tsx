'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth, AuthProvider } from '@/lib/auth'
import { LayoutDashboard, ShoppingBag, ListTodo, FileText, Users, Settings, Wrench } from 'lucide-react'

// 移除所有配置，直接使用Next.js的默认行为
// Next.js 14+会自动处理admin目录下页面的动态性

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin } = useAuth()
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // 权限检查
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      router.push('/login')
    }
  }, [isAuthenticated, isAdmin, router])

  // 如果没有权限，返回null
  if (!isAuthenticated || !isAdmin()) {
    return null
  }

  return (
    <AdminLayoutContent 
      children={children} 
      activeMenu={activeMenu} 
      setActiveMenu={setActiveMenu}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      router={router}
    />
  )
}

// 分离布局内容为单独组件
function AdminLayoutContent({
  children,
  activeMenu,
  setActiveMenu,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  router
}: {
  children: React.ReactNode
  activeMenu: string
  setActiveMenu: (id: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
  router: any
}) {
  const { user, isAuthenticated } = useAuth()
  
  // 添加 useEffect 来初始化存储桶
  useEffect(() => {
    // 初始化存储桶
    const initStorage = async () => {
      try {
        const response = await fetch('/api/storage/init', {
          method: 'GET',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('初始化存储失败:', errorData);
        } else {
          console.log('存储初始化成功');
        }
      } catch (error) {
        console.error('请求初始化存储时出错:', error);
      }
    };
    
    initStorage();
  }, []);
  
  // 菜单项
  const menuItems = [
    { id: 'dashboard', name: '控制面板', icon: 'dashboard', path: '/admin' },
    { id: 'products', name: '商品管理', icon: 'shopping-bag', path: '/admin/products' },
    { id: 'new-product', name: '添加商品', icon: 'add', path: '/admin/products/new' },
    { id: 'orders', name: '订单管理', icon: 'clipboard-list', path: '/admin/orders' },
    { id: 'users', name: '用户管理', icon: 'users', path: '/admin/users' },
    { id: 'categories', name: '分类管理', icon: 'tag', path: '/admin/categories' },
    { id: 'settings', name: '系统设置', icon: 'cog', path: '/admin/settings' },
    { id: 'tools', name: '开发工具', icon: 'tools', path: '/admin/tools' },
  ]
  
  // 获取当前活动菜单
  useEffect(() => {
    const path = window.location.pathname
    const currentMenu = menuItems.find(item => path === item.path)
    if (currentMenu) {
      setActiveMenu(currentMenu.id)
    }
  }, [])
  
  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  // 渲染图标
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard':
        return (
          <LayoutDashboard className="h-5 w-5" />
        )
      case 'shopping-bag':
        return (
          <ShoppingBag className="h-5 w-5" />
        )
      case 'clipboard-list':
        return (
          <FileText className="h-5 w-5" />
        )
      case 'users':
        return (
          <Users className="h-5 w-5" />
        )
      case 'tag':
        return (
          <ListTodo className="h-5 w-5" />
        )
      case 'cog':
        return (
          <Settings className="h-5 w-5" />
        )
      case 'add':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )
      case 'tools':
        return (
          <Wrench className="h-5 w-5" />
        )
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 侧边栏 - 桌面版 */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        {/* 管理后台 Logo */}
        <div className="p-4 border-b">
          <Link 
            href="/admin" 
            className="text-xl font-bold text-primary flex items-center"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            管理后台
          </Link>
        </div>
        
        {/* 导航菜单 */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-3 ${
                    activeMenu === item.id
                      ? 'bg-primary bg-opacity-10 text-primary border-r-4 border-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await router.push(item.path);
                      setActiveMenu(item.id);
                    } catch (error) {
                      console.error('导航错误:', error);
                    }
                  }}
                >
                  {renderIcon(item.icon)}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* 回到前台 */}
        <div className="p-4 border-t">
          <Link href="/" className="flex items-center text-gray-600 hover:text-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回商城
          </Link>
        </div>
      </aside>
      
      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* 移动端菜单按钮 */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* 移动端Logo */}
            <div className="md:hidden font-bold text-primary">管理后台</div>
            
            {/* 用户信息 */}
            <div className="flex items-center space-x-4">
              <Link href="/admin/settings" className="text-gray-600 hover:text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.email || '访客用户'}</p>
                <p className="text-gray-500">{user?.role === 'admin' ? '管理员' : '游客模式'}</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* 移动端侧边栏 */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* 背景蒙层 */}
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
            
            {/* 侧边栏内容 */}
            <div className="relative flex flex-col w-4/5 max-w-xs h-full bg-white">
              {/* 管理后台 Logo */}
              <div className="p-4 border-b">
                <Link
                  href="/admin"
                  className="text-xl font-bold text-primary flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  管理后台
                </Link>
              </div>
              
              {/* 导航菜单 */}
              <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1">
                  {menuItems.map(item => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className={`flex items-center px-4 py-3 ${
                          activeMenu === item.id
                            ? 'bg-primary bg-opacity-10 text-primary border-r-4 border-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                        }`}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            await router.push(item.path);
                            setActiveMenu(item.id);
                          } catch (error) {
                            console.error('导航错误:', error);
                          }
                        }}
                      >
                        {renderIcon(item.icon)}
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {/* 回到前台 */}
              <div className="p-4 border-t">
                <Link 
                  href="/"
                  className="flex items-center text-gray-600 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  返回商城
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* 页面内容 */}
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 