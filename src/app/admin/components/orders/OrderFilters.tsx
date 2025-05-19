'use client'

import { useState } from 'react'
import { OrderStatus } from '@/app/(shared)/types/order'

interface OrderFiltersProps {
  onFilter: (filters: any) => void;
}

export function OrderFilters({ onFilter }: OrderFiltersProps) {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: {
      start: '',
      end: ''
    },
    search: ''
  })
  
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters }
    
    if (key === 'dateRange') {
      newFilters.dateRange = { ...newFilters.dateRange, ...value }
    } else {
      newFilters[key] = value
    }
    
    setFilters(newFilters)
    onFilter(newFilters)
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          搜索
        </label>
        <input
          type="text"
          id="search"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder="订单号或客户名"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          状态
        </label>
        <select
          id="status"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">全部</option>
          <option value={OrderStatus.PENDING}>待付款</option>
          <option value={OrderStatus.PAID}>已付款</option>
          <option value={OrderStatus.SHIPPED}>已发货</option>
          <option value={OrderStatus.DELIVERED}>已送达</option>
          <option value={OrderStatus.CANCELLED}>已取消</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          开始日期
        </label>
        <input
          type="date"
          id="startDate"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={filters.dateRange.start}
          onChange={(e) => handleFilterChange('dateRange', { start: e.target.value })}
        />
      </div>
      
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          结束日期
        </label>
        <input
          type="date"
          id="endDate"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={filters.dateRange.end}
          onChange={(e) => handleFilterChange('dateRange', { end: e.target.value })}
        />
      </div>
    </div>
  )
} 