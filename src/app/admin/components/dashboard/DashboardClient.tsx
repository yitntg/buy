'use client'

import { useEffect, useState } from 'react'
import DashboardStats from './DashboardStats'
import SalesChart from './SalesChart'
import QuickActions from './QuickActions'
import RecentOrdersList from './RecentOrdersList'
import PopularProducts from '../products/PopularProducts'
import { dashboardService } from '../../services/dashboardService'
import { Order } from '@/app/(shared)/types/order'
import { Product } from '@/app/(shared)/types/product'

interface SalesTrendData {
  date: string;
  sales: number;
  orders: number;
}

export default function DashboardClient() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    sales: {
      total: 0,
      orders: 0,
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    },
    users: {
      total: 0,
      active: 0,
      inactive: 0,
      admin: 0,
      regular: 0
    },
    products: {
      total: 0,
      active: 0,
      draft: 0,
      outOfStock: 0
    }
  })
  const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, trendData, ordersData, productsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSalesTrend(),
          dashboardService.getRecentOrders(),
          dashboardService.getPopularProducts()
        ])
        
        setStats(statsData)
        setSalesTrend(trendData)
        setRecentOrders(ordersData)
        setPopularProducts(productsData)
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} isLoading={isLoading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesTrend} isLoading={isLoading} />
        <QuickActions />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrdersList orders={recentOrders} isLoading={isLoading} />
        <PopularProducts products={popularProducts} isLoading={isLoading} />
      </div>
    </div>
  )
} 