'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminSettings() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initStatus, setInitStatus] = useState<{success?: boolean; message?: string}>({})
  const [activeTab, setActiveTab] = useState('database')
  const [statusMessages, setStatusMessages] = useState<string[]>([])
  const [supabaseStatus, setSupabaseStatus] = useState<{success?: boolean; message?: string; data?: any}>({})
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  
  // 获取环境变量信息
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置(隐藏)' : '未设置',
    NODE_ENV: process.env.NODE_ENV || '未知'
  }

  // 添加日志
  const addLog = (message: string) => {
    setStatusMessages(prev => [...prev, message])
  }
  
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
    addLog('正在创建exec_sql函数...')
    
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
      addLog('exec_sql函数创建成功')
    } catch (error: any) {
      console.error('创建exec_sql函数失败:', error)
      setInitStatus({
        success: false,
        message: error.message || '创建exec_sql函数失败，请查看控制台获取详细信息'
      })
      addLog(`错误: ${error.message || '未知错误'}`)
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
    addLog('开始初始化数据库...')
    
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
      addLog('数据库初始化成功')
    } catch (error: any) {
      console.error('初始化数据库失败:', error)
      setInitStatus({
        success: false,
        message: error.message || '初始化数据库失败，请查看控制台获取详细信息'
      })
      addLog(`错误: ${error.message || '未知错误'}`)
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
    addLog('正在重置数据库...')
    
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
      addLog('数据库重置成功')
    } catch (error: any) {
      console.error('重置数据库失败:', error)
      setInitStatus({
        success: false,
        message: error.message || '重置数据库失败，请查看控制台获取详细信息'
      })
      addLog(`错误: ${error.message || '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  // 测试Supabase连接
  const testSupabaseConnection = async () => {
    setIsTestingConnection(true)
    setSupabaseStatus({})
    
    try {
      // 尝试从Supabase获取一些数据
      const { data, error } = await supabase
        .from('products')
        .select('count')
        .single()

      if (error) {
        throw error
      }

      setSupabaseStatus({
        success: true,
        message: '成功连接到Supabase并获取数据',
        data: data
      })
    } catch (err) {
      console.error('Supabase连接测试失败:', err)
      setSupabaseStatus({
        success: false,
        message: err instanceof Error ? err.message : '未知错误'
      })
    } finally {
      setIsTestingConnection(false)
    }
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null // 未授权时返回空
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">系统设置</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* 选项卡切换 */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('database')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'database' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              数据库管理
            </button>
            <button
              onClick={() => setActiveTab('environment')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'environment' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              环境变量
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'system' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              系统信息
            </button>
          </div>
        </div>

        {/* 数据库管理 */}
        {activeTab === 'database' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
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

              {/* 操作日志 */}
              {statusMessages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">操作日志</h3>
                  <div className="bg-gray-50 p-4 rounded-md h-60 overflow-y-auto">
                    {statusMessages.map((message, index) => (
                      <div key={index} className="text-sm mb-1">
                        <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 环境变量 */}
        {activeTab === 'environment' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">环境变量</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">客户端环境变量</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(clientEnvVars, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Supabase连接测试</h3>
                <button
                  onClick={testSupabaseConnection}
                  disabled={isTestingConnection}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
                >
                  {isTestingConnection ? '测试中...' : '测试Supabase连接'}
                </button>
                
                {isTestingConnection ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-opacity-50 mx-auto"></div>
                    <p className="mt-2 text-gray-600">正在测试Supabase连接...</p>
                  </div>
                ) : supabaseStatus.success === true ? (
                  <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">连接成功</h3>
                    <p className="mb-2">{supabaseStatus.message}</p>
                    {supabaseStatus.data && (
                      <pre className="bg-white p-3 rounded text-sm overflow-auto">
                        {JSON.stringify(supabaseStatus.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ) : supabaseStatus.success === false ? (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">连接失败</h3>
                    <p>{supabaseStatus.message || '连接测试失败，请检查控制台获取详细错误信息'}</p>
                  </div>
                ) : null}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">环境变量设置指南</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">本地开发环境</h4>
                  <p className="mb-2">
                    在项目根目录创建 <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> 文件，包含以下内容：
                  </p>
                  <pre className="bg-white p-3 rounded text-sm overflow-auto">
                    {`# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=您的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=您的Supabase匿名密钥

# PostgreSQL连接（二选一即可）
POSTGRES_URL=postgres://user:password@host:port/database
# POSTGRES_URL_NON_POOLING=postgres://user:password@host:port/database`}
                  </pre>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">生产环境</h4>
                  <p>
                    确保在Vercel或其他部署平台的项目设置中添加了相应的环境变量。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 系统信息 */}
        {activeTab === 'system' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Node.js</div>
                    <div>{process.version || '未知'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">操作系统</div>
                    <div>Web服务器</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 