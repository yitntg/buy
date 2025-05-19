'use client'

import AdminLayout from './AdminLayout'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminMainContent from './AdminMainContent'
import AdminNavigation from './AdminNavigation'
import DashboardStats from './DashboardStats'
import SalesChart from './SalesChart'
import RecentOrdersList from './RecentOrdersList'
import PopularProducts from './PopularProducts'
import QuickActions from './QuickActions'

export default function DashboardClient() {
  return (
    <AdminLayout>
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <AdminMainContent>
          <AdminNavigation />
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">仪表板</h1>
              <p className="text-gray-600">欢迎回来，管理员</p>
            </div>

            <QuickActions />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <DashboardStats />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">销售趋势</h2>
                <SalesChart />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">热门商品</h2>
                <PopularProducts />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">最近订单</h2>
              <RecentOrdersList />
            </div>
          </div>
        </AdminMainContent>
      </div>
    </AdminLayout>
  )
} 