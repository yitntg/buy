'use client'

import { useState, useEffect } from 'react'

export default function SalesChart() {
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<{
    labels: string[];
    sales: number[];
    orders: number[];
  }>({
    labels: [],
    sales: [],
    orders: []
  })
  
  // 最大值和颜色设置
  const maxSales = Math.max(...chartData.sales, 1)
  const maxOrders = Math.max(...chartData.orders, 1)
  
  // 获取图表数据
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // 模拟API调用
        // const response = await fetch('/api/admin/stats/sales-chart')
        // const data = await response.json()
        
        // 模拟数据
        setTimeout(() => {
          const today = new Date()
          const labels = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today)
            d.setDate(d.getDate() - 6 + i)
            return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
          })
          
          // 模拟销售额数据
          const sales = [
            15000, 
            12500, 
            18000, 
            16500, 
            22000, 
            19500, 
            25000
          ]
          
          // 模拟订单数据
          const orders = [
            12, 
            10, 
            15, 
            13, 
            18, 
            16, 
            20
          ]
          
          setChartData({ labels, sales, orders })
          setIsLoading(false)
        }, 800)
      } catch (error) {
        console.error('获取图表数据失败:', error)
        setIsLoading(false)
      }
    }
    
    fetchChartData()
  }, [])
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            <span className="text-sm text-gray-600">销售额</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span className="text-sm text-gray-600">订单数</span>
          </div>
        </div>
        <div>
          <select className="text-sm border rounded px-2 py-1">
            <option value="7">最近7天</option>
            <option value="30">最近30天</option>
            <option value="90">最近90天</option>
          </select>
        </div>
      </div>
      
      {/* 图表区域 */}
      <div className="relative h-64">
        {/* 水平网格线 */}
        {[0, 1, 2, 3, 4].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-full h-px bg-gray-200"
            style={{ bottom: `${i * 25}%` }}
          ></div>
        ))}
        
        {/* 销售额柱状图 */}
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {chartData.sales.map((sale, index) => (
            <div key={`sale-${index}`} className="flex flex-col items-center">
              <div 
                className="w-6 bg-blue-500 rounded-t transition-all duration-500"
                style={{ 
                  height: `${(sale / maxSales) * 80}%`,
                  opacity: 0.7
                }}
              ></div>
            </div>
          ))}
        </div>
        
        {/* 订单折线图 */}
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={chartData.orders.map((order, i) => 
              `${i * (100 / (chartData.orders.length - 1))},${100 - (order / maxOrders) * 80}`
            ).join(' ')}
            fill="none"
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartData.orders.map((order, i) => (
            <circle
              key={i}
              cx={`${i * (100 / (chartData.orders.length - 1))}`}
              cy={`${100 - (order / maxOrders) * 80}`}
              r="1.5"
              fill="white"
              stroke="rgb(34, 197, 94)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
      
      {/* X轴标签 */}
      <div className="flex justify-between px-2 mt-2">
        {chartData.labels.map((label, index) => (
          <div key={index} className="text-xs text-gray-500">{label}</div>
        ))}
      </div>
    </div>
  )
} 