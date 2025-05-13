'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, ShoppingBag, Users } from 'lucide-react'
import { AuthProvider } from '@/context/AuthContext'

// 添加客户端组件包装器
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, status } = useAuth()
  const [activeMenu, setActiveMenu] = useState('dashboard')
  
  // 权限检查
  useEffect(() => {
    // 检查是否为管理员
    if (status !== 'authenticated' || user?.role !== 'admin') {
      router.push('/login')
    }
  }, [status, user, router])

  // 如果没有权限，返回null
  if (status !== 'authenticated' || user?.role !== 'admin') {
    return null
  }

  return (
    <AuthProvider>
      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-64 bg-white border-r">
          <nav className="p-4">
            <ul>
              <li>
                <Link 
                  href="/admin/dashboard" 
                  className={`flex items-center p-2 ${activeMenu === 'dashboard' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveMenu('dashboard')}
                >
                  <LayoutDashboard className="mr-2" /> 仪表盘
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/products" 
                  className={`flex items-center p-2 ${activeMenu === 'products' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveMenu('products')}
                >
                  <ShoppingBag className="mr-2" /> 商品管理
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/users" 
                  className={`flex items-center p-2 ${activeMenu === 'users' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveMenu('users')}
                >
                  <Users className="mr-2" /> 用户管理
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}