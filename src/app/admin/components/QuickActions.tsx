'use client'

import Link from 'next/link'

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-medium mb-6">快捷操作</h2>
      
      <div className="space-y-4">
        <Link 
          href="/admin/products/new" 
          className="block w-full text-center py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          添加新商品
        </Link>
        <Link 
          href="/admin/orders?status=待发货" 
          className="block w-full text-center py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          处理待发货订单
        </Link>
        <Link 
          href="/admin/products?inventory=low" 
          className="block w-full text-center py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          更新库存
        </Link>
        <Link 
          href="/admin/promotions" 
          className="block w-full text-center py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          管理促销活动
        </Link>
      </div>
    </div>
  )
} 