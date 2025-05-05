'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// 日志类型定义
type LogEntry = {
  id: number
  timestamp: string
  level: 'info' | 'warning' | 'error'
  module: string
  action: string
  user_id?: string
  details?: any
  created_at: string
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    level: 'all',
    module: 'all',
    dateFrom: '',
    dateTo: '',
    searchText: ''
  })
  const [modules, setModules] = useState<string[]>([])
  const [logsCreated, setLogsCreated] = useState(false)
  const [hasLogTable, setHasLogTable] = useState(true)

  // 加载日志数据
  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 如果没有exec_sql功能，提示创建
      if (!hasLogTable) {
        setError('请先创建日志表')
        setLoading(false)
        return
      }
      
      // 构建SQL查询
      const whereClause = []
      
      // 根据级别筛选
      if (filter.level && filter.level !== 'all') {
        whereClause.push(`level = '${filter.level}'`)
      }
      
      // 根据模块筛选
      if (filter.module && filter.module !== 'all') {
        whereClause.push(`module = '${filter.module}'`)
      }
      
      // 根据日期范围筛选
      if (filter.dateFrom) {
        whereClause.push(`timestamp >= '${filter.dateFrom}'`)
      }
      
      if (filter.dateTo) {
        whereClause.push(`timestamp <= '${filter.dateTo}'`)
      }
      
      // 构建完整查询
      let sql = `
        SELECT 
          id, 
          timestamp, 
          level, 
          module, 
          action, 
          user_id, 
          details
        FROM system_logs
      `
      
      if (whereClause.length > 0) {
        sql += ` WHERE ${whereClause.join(' AND ')}`
      }
      
      sql += ` ORDER BY timestamp DESC LIMIT 100`
      
      console.log('执行查询:', sql)
      
      try {
        // 先尝试使用query_sql函数
        const { data, error: queryError } = await supabase.rpc('query_sql', { sql })
        
        if (queryError) {
          console.error('使用query_sql查询失败:', queryError)
          throw queryError
        }
        
        setLogs(data || [])
        setLoading(false)
        
        // 收集唯一的模块名称
        if (data && data.length > 0) {
          const uniqueModules = Array.from(
            new Set(data.map((log: any) => log.module as string))
          ).filter(Boolean) as string[]
          setModules(uniqueModules)
        }
      } catch (queryError) {
        console.error('查询失败，尝试备用方法:', queryError)
        
        try {
          // 直接查询表作为备用方法
          let query = supabase
            .from('system_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100)
          
          // 添加过滤条件
          if (filter.level && filter.level !== 'all') {
            query = query.eq('level', filter.level)
          }
          
          if (filter.module && filter.module !== 'all') {
            query = query.eq('module', filter.module)
          }
          
          if (filter.dateFrom) {
            query = query.gte('timestamp', filter.dateFrom)
          }
          
          if (filter.dateTo) {
            query = query.lte('timestamp', filter.dateTo)
          }
          
          const { data, error } = await query
          
          if (error) {
            throw error
          }
          
          setLogs(data || [])
        } catch (directError: any) {
          console.error('直接查询也失败:', directError)
          setError(`获取日志失败: ${directError.message}`)
        }
      }
    } catch (error: any) {
      console.error('获取日志错误:', error)
      setError(`获取日志失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // 创建日志表
  const createLogsTable = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 使用exec_sql RPC函数创建日志表
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: `
            CREATE TABLE IF NOT EXISTS system_logs (
              id SERIAL PRIMARY KEY,
              timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              level VARCHAR(10) NOT NULL,
              module VARCHAR(50) NOT NULL,
              action VARCHAR(100) NOT NULL,
              user_id UUID,
              details JSONB,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON system_logs(timestamp);
            CREATE INDEX IF NOT EXISTS idx_logs_level ON system_logs(level);
            CREATE INDEX IF NOT EXISTS idx_logs_module ON system_logs(module);
          `
        })
        
        if (error) {
          throw error
        }
        
        setHasLogTable(true)
        return true
      } catch (execSqlError: any) {
        console.error('使用exec_sql创建日志表失败:', execSqlError)
        
        // 尝试直接执行SQL（备用方法）
        try {
          // 这里可以添加备用方法，例如直接请求特定API端点
          // 或使用其他功能来创建表
          setError('创建日志表失败，需要先创建exec_sql函数')
          setHasLogTable(false)
          return false
        } catch (backupMethodError: any) {
          throw backupMethodError
        }
      }
    } catch (err: any) {
      console.error('创建日志表失败:', err)
      setError(`创建日志表失败: ${err.message}`)
      setHasLogTable(false)
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 添加示例日志
  const addSampleLogs = async () => {
    try {
      // 使用exec_sql RPC函数插入示例日志
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: `
            INSERT INTO system_logs (timestamp, level, module, action, details)
            VALUES 
              (NOW() - INTERVAL '1 hour', 'info', 'auth', '用户登录', '{"ip": "192.168.1.100", "browser": "Chrome"}'),
              (NOW() - INTERVAL '2 hours', 'warning', 'products', '库存不足', '{"product_id": 123, "current_stock": 2, "required": 5}'),
              (NOW() - INTERVAL '1 day', 'error', 'orders', '支付失败', '{"order_id": 456, "error_code": "PAYMENT_DECLINED"}'),
              (NOW() - INTERVAL '2 days', 'info', 'users', '新用户注册', '{"email": "user@example.com"}'),
              (NOW() - INTERVAL '3 days', 'info', 'admin', '系统设置更新', '{"setting": "tax_rate", "old_value": 0.05, "new_value": 0.06}'),
              (NOW() - INTERVAL '4 days', 'warning', 'security', '多次登录失败', '{"ip": "203.0.113.1", "attempts": 5}'),
              (NOW() - INTERVAL '5 days', 'info', 'products', '商品更新', '{"product_id": 789, "fields": ["price", "description"]}'),
              (NOW() - INTERVAL '1 week', 'error', 'database', '备份失败', '{"reason": "disk_full", "available_space": "120MB"}')
          `
        })
        
        if (error) {
          throw error
        }
        
        return true
      } catch (execSqlError: any) {
        console.error('使用exec_sql添加示例日志失败:', execSqlError)
        
        // 尝试使用supabase.from API（备用方法）
        try {
          // 创建单个日志记录作为示例
          const { error: insertError } = await supabase
            .from('system_logs')
            .insert([
              {
                level: 'info',
                module: 'system',
                action: '系统初始化',
                details: { message: '系统日志功能初始化' }
              }
            ])
          
          if (insertError) {
            throw insertError
          }
          
          return true
        } catch (backupMethodError: any) {
          console.error('备用方法添加示例日志失败:', backupMethodError)
          return false
        }
      }
    } catch (err: any) {
      console.error('添加示例日志失败:', err)
      return false
    }
  }
  
  // 清除所有日志
  const clearAllLogs = async () => {
    if (!confirm('确定要清除所有日志记录吗？此操作不可撤销！')) {
      return
    }
    
    try {
      setLoading(true)
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql: 'TRUNCATE TABLE system_logs'
      })
      
      if (error) {
        throw error
      }
      
      setLogs([])
      alert('所有日志已清除')
    } catch (err: any) {
      console.error('清除日志失败:', err)
      setError(`清除日志失败: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // 添加测试日志
  const addTestLog = async () => {
    try {
      setLoading(true)
      
      const testLog = {
        level: 'info',
        module: 'test',
        action: '测试日志记录',
        details: { timestamp: new Date().toISOString(), text: '这是一条测试日志' }
      }
      
      const { error } = await supabase
        .from('system_logs')
        .insert([testLog])
      
      if (error) {
        throw error
      }
      
      alert('测试日志已添加')
      fetchLogs()
    } catch (err: any) {
      console.error('添加测试日志失败:', err)
      setError(`添加测试日志失败: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // 在组件挂载时加载日志
  useEffect(() => {
    fetchLogs()
  }, [])
  
  // 日志颜色配置
  const logLevelColors = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  }
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/tools" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回工具列表
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">系统日志查看器</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {logsCreated && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">日志表已创建并添加示例数据。点击"刷新日志"查看。</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 过滤器 */}
      <div className="mb-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">日志过滤器</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日志级别
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter.level}
                onChange={(e) => setFilter({ ...filter, level: e.target.value })}
              >
                <option value="all">全部级别</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模块
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter.module}
                onChange={(e) => setFilter({ ...filter, module: e.target.value })}
              >
                <option value="all">全部模块</option>
                {modules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                搜索内容
              </label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="搜索操作或详情"
                value={filter.searchText}
                onChange={(e) => setFilter({ ...filter, searchText: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始日期
              </label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filter.dateFrom}
                onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束日期
              </label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filter.dateTo}
                onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
              />
            </div>
            
            <div className="flex items-end">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={fetchLogs}
                disabled={loading}
              >
                {loading ? '加载中...' : '应用过滤器'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="mb-6 flex space-x-4">
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={fetchLogs}
          disabled={loading}
        >
          刷新日志
        </button>
        
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={addTestLog}
          disabled={loading}
        >
          添加测试日志
        </button>
        
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={clearAllLogs}
          disabled={loading}
        >
          清除所有日志
        </button>
      </div>
      
      {/* 日志列表 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center justify-between">
            <span>系统日志 ({logs.length})</span>
            {loading && (
              <span className="text-sm text-gray-500 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中...
              </span>
            )}
          </h3>
        </div>
        
        {logs.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-gray-500">没有找到符合条件的日志记录</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <li key={log.id} className={`p-4 hover:bg-gray-50 ${logLevelColors[log.level] || ''}`}>
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {log.module} - {log.action}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase">
                          {log.level}
                        </p>
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                    {log.details && (
                      <div className="mt-2 text-sm text-gray-500">
                        <pre className="overflow-x-auto">{JSON.stringify(log.details, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 