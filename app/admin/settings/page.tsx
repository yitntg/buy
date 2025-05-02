'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminSettings() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initStatus, setInitStatus] = useState<{success?: boolean; message?: string}>({})
  
  // 检查用户是否已登录并且是管理员
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin/settings')
    } else if (user?.role !== 'admin') {
      router.push('/') // 如果不是管理员，重定向到首页
    }
  }, [isAuthenticated, user, router])
  
  // 创建exec_sql函数
  const handleCreateExecSQL = async () => {
    if (!confirm('确定要在Supabase中创建执行SQL的函数吗？这是初始化数据库的前提。')) {
      return
    }
    
    setLoading(true)
    setInitStatus({})
    
    try {
      const response = await fetch('/api/admin/setup/create-exec-sql', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '创建exec_sql函数失败')
      }
      
      setInitStatus({
        success: true,
        message: data.message || 'exec_sql函数已成功创建！'
      })
    } catch (error: any) {
      console.error('创建exec_sql函数失败:', error)
      setInitStatus({
        success: false,
        message: error.message || '创建exec_sql函数失败，请查看控制台获取详细信息'
      })
    } finally {
      setLoading(false)
    }
  }
  
  // 初始化数据库
  const handleInitDatabase = async () => {
    if (!confirm('确定要初始化数据库吗？如果表不存在，将会创建新表。')) {
      return
    }
    
    setLoading(true)
    setInitStatus({})
    
    try {
      const response = await fetch('/api/admin/setup/init', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '初始化数据库失败')
      }
      
      setInitStatus({
        success: true,
        message: data.message || '数据库初始化成功！'
      })
    } catch (error: any) {
      console.error('初始化数据库失败:', error)
      setInitStatus({
        success: false,
        message: error.message || '初始化数据库失败，请查看控制台获取详细信息'
      })
    } finally {
      setLoading(false)
    }
  }
  
  // 重置数据库
  const handleResetDatabase = async () => {
    if (!confirm('确定要重置数据库吗？这将删除所有现有数据并重新创建表！此操作不可撤销。')) {
      return
    }
    
    setLoading(true)
    setInitStatus({})
    
    try {
      const response = await fetch('/api/admin/setup/reset', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '重置数据库失败')
      }
      
      setInitStatus({
        success: true,
        message: data.message || '数据库重置成功！'
      })
    } catch (error: any) {
      console.error('重置数据库失败:', error)
      setInitStatus({
        success: false,
        message: error.message || '重置数据库失败，请查看控制台获取详细信息'
      })
    } finally {
      setLoading(false)
    }
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null // 未授权时返回空
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">系统设置</h1>
          <Link href="/admin/dashboard" className="text-primary hover:underline">
            返回仪表盘
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4">数据库管理</h2>
            
            {initStatus.message && (
              <div className={`mb-6 p-4 rounded ${initStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {initStatus.message}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">第1步：创建SQL执行函数</h3>
                <p className="text-gray-600 mb-4">
                  首先需要在Supabase中创建exec_sql函数，此函数用于执行SQL语句初始化数据库。这个步骤只需要执行一次。
                </p>
                <button
                  onClick={handleCreateExecSQL}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? '处理中...' : '创建exec_sql函数'}
                </button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">第2步：数据库初始化</h3>
                <p className="text-gray-600 mb-4">
                  如果您是首次使用系统，或者数据库表尚未创建，请点击此按钮初始化数据库。此操作将创建所需的数据库表。
                </p>
                <button
                  onClick={handleInitDatabase}
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? '处理中...' : '初始化数据库'}
                </button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2 text-red-600">重置数据库</h3>
                <p className="text-gray-600 mb-4">
                  <strong className="text-red-600">警告：</strong> 此操作将删除所有现有数据并重新创建表结构。此操作不可撤销。
                </p>
                <button
                  onClick={handleResetDatabase}
                  disabled={loading}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? '处理中...' : '重置数据库'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">系统信息</h2>
            <div className="bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">应用环境</div>
                  <div>{process.env.NODE_ENV || '开发'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">版本</div>
                  <div>1.0.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 