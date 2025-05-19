'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from './AdminLayout'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminMainContent from './AdminMainContent'
import AdminNavigation from './AdminNavigation'

export default function AdminClient() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到仪表板
    router.push('/admin/dashboard')
  }, [router])

  return (
    <AdminLayout>
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <AdminMainContent>
          <AdminNavigation />
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">管理后台</h1>
            <p>正在跳转到仪表板...</p>
          </div>
        </AdminMainContent>
      </div>
    </AdminLayout>
  )
} 