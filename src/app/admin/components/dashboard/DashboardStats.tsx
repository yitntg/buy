'use client'

import { Card } from '../ui/card'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

interface StatsProps {
  stats: {
    sales: {
      total: number;
      orders: number;
      pending: number;
      paid: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };
    users: {
      total: number;
      active: number;
      inactive: number;
      admin: number;
      regular: number;
    };
    products: {
      total: number;
      active: number;
      draft: number;
      outOfStock: number;
    };
  };
  isLoading: boolean;
}

export default function DashboardStats({ stats, isLoading }: StatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">总销售额</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">¥{stats.sales.total.toFixed(2)}</p>
          <span className="ml-2 text-sm font-medium text-green-600">
            <ArrowUpIcon className="h-4 w-4 inline" />
            12%
          </span>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">总订单数</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{stats.sales.orders}</p>
          <span className="ml-2 text-sm font-medium text-green-600">
            <ArrowUpIcon className="h-4 w-4 inline" />
            8%
          </span>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">总用户数</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{stats.users.total}</p>
          <span className="ml-2 text-sm font-medium text-red-600">
            <ArrowDownIcon className="h-4 w-4 inline" />
            3%
          </span>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500">总商品数</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{stats.products.total}</p>
          <span className="ml-2 text-sm font-medium text-green-600">
            <ArrowUpIcon className="h-4 w-4 inline" />
            5%
          </span>
        </div>
      </Card>
    </div>
  )
} 