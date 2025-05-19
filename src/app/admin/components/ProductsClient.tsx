'use client'

import AdminLayout from './AdminLayout'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminMainContent from './AdminMainContent'
import AdminNavigation from './AdminNavigation'
import ProductsManagement from './ProductsManagement'

export default function ProductsClient() {
  return (
    <AdminLayout>
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <AdminMainContent>
          <AdminNavigation />
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">商品管理</h1>
              <p className="text-gray-600">管理您的商品目录</p>
            </div>
            <ProductsManagement />
          </div>
        </AdminMainContent>
      </div>
    </AdminLayout>
  )
} 