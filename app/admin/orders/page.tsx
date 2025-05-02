'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 订单状态类型
type OrderStatus = '全部' | '待付款' | '待发货' | '已发货' | '已完成' | '已取消' | '退款中' | '已退款'

// 订单类型定义
interface Order {
  id: string
  date: string
  status: string
  total: number
  items: number
  customer: {
    id: string
    name: string
    email: string
  }
  payment: {
    method: string
    status: string
  }
  shipping: {
    address: string
    method: string
    trackingNumber?: string
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('全部')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  // 可用的订单状态选项
  const statusOptions: OrderStatus[] = ['全部', '待付款', '待发货', '已发货', '已完成', '已取消', '退款中', '已退款']
  
  // 获取订单数据
  useEffect(() => {
    fetchOrders()
  }, [currentPage, selectedStatus, searchQuery])
  
  // 模拟获取订单数据
  const fetchOrders = async () => {
    setLoading(true)
    try {
      // 在实际应用中，这里应该调用API获取订单数据
      // 这里使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟订单数据
      const mockOrders: Order[] = Array.from({ length: 15 }, (_, i) => ({
        id: `ORD-${10000 + i}`,
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        status: getRandomStatus(),
        total: Math.floor(Math.random() * 10000) / 100 * 100 + 50,
        items: Math.floor(Math.random() * 5) + 1,
        customer: {
          id: `USR-${1000 + i}`,
          name: `客户 ${i + 1}`,
          email: `customer${i + 1}@example.com`
        },
        payment: {
          method: Math.random() > 0.5 ? '支付宝' : '微信支付',
          status: Math.random() > 0.2 ? '已支付' : '待支付'
        },
        shipping: {
          address: `中国某省某市某区某街道${i + 1}号`,
          method: '快递',
          trackingNumber: Math.random() > 0.3 ? `SF${1000000 + i}` : undefined
        }
      }))
      
      // 筛选订单
      let filteredOrders = mockOrders
      
      // 根据状态筛选
      if (selectedStatus !== '全部') {
        filteredOrders = filteredOrders.filter(order => order.status === selectedStatus)
      }
      
      // 根据搜索词筛选（订单号或客户名称）
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredOrders = filteredOrders.filter(order => 
          order.id.toLowerCase().includes(query) || 
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query)
        )
      }
      
      setOrders(filteredOrders)
      setTotalPages(Math.ceil(filteredOrders.length / 10))
    } catch (error) {
      console.error('获取订单失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 选择或取消选择订单
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId)
      } else {
        return [...prev, orderId]
      }
    })
  }
  
  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(order => order.id))
    }
  }
  
  // 更新订单状态
  const updateOrderStatus = async (status: string) => {
    if (selectedOrders.length === 0) return
    
    setIsProcessing(true)
    
    try {
      // 在实际应用中，这里应该调用API更新订单状态
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟更新订单状态
      const updatedOrders = orders.map(order => {
        if (selectedOrders.includes(order.id)) {
          return { ...order, status }
        }
        return order
      })
      
      setOrders(updatedOrders)
      setSelectedOrders([])
      
      alert(`已成功将${selectedOrders.length}个订单状态更新为"${status}"`)
    } catch (error) {
      console.error('更新订单状态失败:', error)
      alert('更新订单状态失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // 获取随机订单状态（仅用于模拟数据）
  const getRandomStatus = (): string => {
    const statuses = statusOptions.filter(status => status !== '全部')
    return statuses[Math.floor(Math.random() * statuses.length)]
  }
  
  // 获取订单状态对应的颜色
  const getStatusColor = (status: string): string => {
    switch (status) {
      case '待付款':
        return 'bg-yellow-100 text-yellow-800'
      case '待发货':
        return 'bg-blue-100 text-blue-800'
      case '已发货':
        return 'bg-indigo-100 text-indigo-800'
      case '已完成':
        return 'bg-green-100 text-green-800'
      case '已取消':
        return 'bg-gray-100 text-gray-800'
      case '退款中':
        return 'bg-orange-100 text-orange-800'
      case '已退款':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">订单管理</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => updateOrderStatus('已发货')}
            disabled={selectedOrders.length === 0 || isProcessing}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            批量发货
          </button>
          <button
            onClick={() => updateOrderStatus('已完成')}
            disabled={selectedOrders.length === 0 || isProcessing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            标记完成
          </button>
          <button
            onClick={() => updateOrderStatus('已取消')}
            disabled={selectedOrders.length === 0 || isProcessing}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            取消订单
          </button>
        </div>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索订单号、客户名称或邮箱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-md pr-10"
              />
              <button 
                onClick={() => fetchOrders()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="md:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className="w-full px-4 py-2 border rounded-md"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* 订单列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-500">加载订单数据...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">没有找到匹配的订单</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-primary rounded"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      订单号
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      客户
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金额
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支付方式
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="h-4 w-4 text-primary rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{order.customer.name}</div>
                        <div className="text-xs text-gray-500">{order.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ¥{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/orders/${order.id}`} className="text-primary hover:text-primary-dark">
                          详情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页 */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                显示 {orders.length} 个订单中的 {Math.min(10, orders.length)} 个
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  上一页
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 