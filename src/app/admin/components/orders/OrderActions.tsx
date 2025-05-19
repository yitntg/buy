'use client'

import { useState } from 'react'
import { OrderStatus } from '@/app/(shared)/types/order'

interface Order {
  id: string;
  status: OrderStatus;
}

interface OrderActionsProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onDelete: (orderId: string) => void;
}

export function OrderActions({ order, onStatusChange, onDelete }: OrderActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const handleStatusChange = (status: OrderStatus) => {
    onStatusChange(order.id, status)
    setIsMenuOpen(false)
  }
  
  const handleDelete = () => {
    if (window.confirm('确定要删除这个订单吗？')) {
      onDelete(order.id)
    }
    setIsMenuOpen(false)
  }
  
  return (
    <div className="relative">
      <button
        type="button"
        className="text-gray-400 hover:text-gray-500"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="sr-only">打开菜单</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      
      {isMenuOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {order.status === OrderStatus.PENDING && (
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleStatusChange(OrderStatus.PAID)}
              >
                标记为已付款
              </button>
            )}
            
            {order.status === OrderStatus.PAID && (
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleStatusChange(OrderStatus.SHIPPED)}
              >
                标记为已发货
              </button>
            )}
            
            {order.status === OrderStatus.SHIPPED && (
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleStatusChange(OrderStatus.DELIVERED)}
              >
                标记为已送达
              </button>
            )}
            
            {order.status !== OrderStatus.CANCELLED && (
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleStatusChange(OrderStatus.CANCELLED)}
              >
                取消订单
              </button>
            )}
            
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={handleDelete}
            >
              删除订单
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 