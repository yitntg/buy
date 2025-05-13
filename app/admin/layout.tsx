'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { LayoutDashboard, ShoppingBag, ListTodo, FileText, Users, Settings, Wrench } from 'lucide-react'

// 添加客户端组件包装器
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin } = useAuth()
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // 权限检查
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin()) {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isAdmin, loading, router])

  // 如果正在加载或没有权限，返回null
  if (loading || !isAuthenticated || !isAdmin()) {
    return null
  }

  return (
    <div>
      {children}
    </div>
  )
}