'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ErrorAlert from '@/src/app/(shared)/components/ErrorAlert'

// 仪表盘页面
export default function AdminDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // 检查用户是否是管理员，如果不是则重定向
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 获取当前登录用户信息
        const response = await fetch('/api/admin/auth/me')
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '认证失败')
        }
        
        const data = await response.json()
        
        if (!data.user || data.user.role !== 'admin') {
          // 不是管理员，重定向到登录页面
          router.push('/auth/login?redirect=/admin/dashboard')
          return
        }
        
        setUser(data.user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('认证检查失败:', error)
        setError(error instanceof Error ? error.message : '认证服务暂时不可用')
        // 不立即重定向，显示错误消息并提供重试选项
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router])
  
  // 重试登录检查
  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    // 刷新页面
    window.location.reload()
  }
  
  // 强制退出
  const handleForceLogout = () => {
    router.push('/auth/login?redirect=/admin/dashboard')
  }
  
  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            正在加载管理面板
          </h2>
          <p className="text-gray-500">请稍候...</p>
        </div>
      </div>
    )
  }
  
  // 错误状态显示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert 
          title="访问管理面板失败" 
          message={error}
          actions={[
            { label: '重新尝试', onClick: handleRetry, primary: true },
            { label: '返回登录', onClick: handleForceLogout, primary: false }
          ]}
        />
      </div>
    )
  }
  
  // 已认证才显示仪表盘内容
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">总销售额</h3>
          <p className="text-3xl font-bold">¥24,780</p>
          <span className="text-green-500 text-sm flex items-center mt-2">
            <span>↑ 24%</span>
            <span className="ml-1">vs 上月</span>
          </span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">新订单</h3>
          <p className="text-3xl font-bold">43</p>
          <span className="text-green-500 text-sm flex items-center mt-2">
            <span>↑ 12%</span>
            <span className="ml-1">vs 上周</span>
          </span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">总客户数</h3>
          <p className="text-3xl font-bold">529</p>
          <span className="text-green-500 text-sm flex items-center mt-2">
            <span>↑ 9%</span>
            <span className="ml-1">vs 上月</span>
          </span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">库存预警</h3>
          <p className="text-3xl font-bold">5</p>
          <span className="text-red-500 text-sm flex items-center mt-2">
            <span>需要处理</span>
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">销售趋势</h2>
          <div className="bg-gray-100 rounded h-64 flex items-center justify-center">
            <p className="text-gray-500">销售图表将在此显示</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">热门产品</h2>
          <div className="space-y-4">
            {[
              { name: '智能手表', sales: 28 },
              { name: '无线耳机', sales: 24 },
              { name: '蓝牙音箱', sales: 19 },
              { name: '便携充电宝', sales: 16 },
              { name: '运动相机', sales: 12 }
            ].map((product, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <span>{product.name}</span>
                <span className="text-blue-600 font-medium">{product.sales}件</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 