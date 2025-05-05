'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

export default function SQLFunctionManager() {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [statusMessages, setStatusMessages] = useState<string[]>([])
  const [functionStatus, setFunctionStatus] = useState<{[key: string]: {success?: boolean; message?: string}}>({
    execSql: {},
    querySql: {},
    createTable: {},
    dropTable: {}
  })

  // 添加日志
  const addLog = (message: string) => {
    setStatusMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // 创建exec_sql函数
  const handleCreateExecSQL = async () => {
    if (!confirm('确定要在Supabase中创建执行SQL的函数吗？这是执行SQL语句的前提。')) {
      return
    }
    
    setLoading(true)
    setFunctionStatus(prev => ({ ...prev, execSql: {} }))
    addLog('正在创建exec_sql函数...')
    
    try {
      const response = await fetch('/api/admin/setup/create-exec-sql', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '创建exec_sql函数失败')
      }
      
      setFunctionStatus(prev => ({ 
        ...prev, 
        execSql: {
          success: true,
          message: data.message || 'exec_sql函数已成功创建！'
        }
      }))
      addLog('exec_sql函数创建成功')
    } catch (error: any) {
      console.error('创建exec_sql函数失败:', error)
      setFunctionStatus(prev => ({ 
        ...prev, 
        execSql: {
          success: false,
          message: error.message || '创建exec_sql函数失败，请查看控制台获取详细信息'
        }
      }))
      addLog(`错误: ${error.message || '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  // 创建query_sql函数
  const handleCreateQuerySQL = async () => {
    if (!confirm('确定要创建query_sql函数吗？这将允许您执行SELECT查询并获取结果。')) {
      return
    }

    setLoading(true)
    setFunctionStatus(prev => ({ ...prev, querySql: {} }))
    addLog('正在创建query_sql函数...')

    try {
      const response = await fetch('/api/admin/setup/create-query-sql', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '创建query_sql函数失败')
      }
      
      setFunctionStatus(prev => ({ 
        ...prev, 
        querySql: {
          success: true,
          message: data.message || 'query_sql函数已成功创建！'
        }
      }))
      addLog('query_sql函数创建成功')
    } catch (error: any) {
      console.error('创建query_sql函数失败:', error)
      setFunctionStatus(prev => ({ 
        ...prev, 
        querySql: {
          success: false,
          message: error.message || '创建query_sql函数失败，请查看控制台获取详细信息'
        }
      }))
      addLog(`错误: ${error.message || '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  // 创建create_table函数
  const handleCreateTableFunction = async () => {
    if (!confirm('确定要创建create_table函数吗？这将允许您动态创建数据表。')) {
      return
    }

    setLoading(true)
    setFunctionStatus(prev => ({ ...prev, createTable: {} }))
    addLog('正在创建create_table函数...')

    try {
      const response = await fetch('/api/admin/setup/create-table-function', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '创建create_table函数失败')
      }
      
      setFunctionStatus(prev => ({ 
        ...prev, 
        createTable: {
          success: true,
          message: data.message || 'create_table函数已成功创建！'
        }
      }))
      addLog('create_table函数创建成功')
    } catch (error: any) {
      console.error('创建create_table函数失败:', error)
      setFunctionStatus(prev => ({ 
        ...prev, 
        createTable: {
          success: false,
          message: error.message || '创建create_table函数失败，请查看控制台获取详细信息'
        }
      }))
      addLog(`错误: ${error.message || '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  // 创建drop_table函数
  const handleDropTableFunction = async () => {
    if (!confirm('确定要创建drop_table函数吗？这将允许您删除数据表，请谨慎使用！')) {
      return
    }

    setLoading(true)
    setFunctionStatus(prev => ({ ...prev, dropTable: {} }))
    addLog('正在创建drop_table函数...')

    try {
      const response = await fetch('/api/admin/setup/create-drop-table-function', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '创建drop_table函数失败')
      }
      
      setFunctionStatus(prev => ({ 
        ...prev, 
        dropTable: {
          success: true,
          message: data.message || 'drop_table函数已成功创建！'
        }
      }))
      addLog('drop_table函数创建成功')
    } catch (error: any) {
      console.error('创建drop_table函数失败:', error)
      setFunctionStatus(prev => ({ 
        ...prev, 
        dropTable: {
          success: false,
          message: error.message || '创建drop_table函数失败，请查看控制台获取详细信息'
        }
      }))
      addLog(`错误: ${error.message || '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/tools" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回工具列表
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">SQL函数管理</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>注意：</strong> 这些SQL函数是系统的核心功能，它们允许执行SQL语句和管理数据库。
              只有在了解这些函数作用的情况下才应创建它们。创建这些函数后，它们将拥有对数据库的高权限操作能力。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* exec_sql函数 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">exec_sql 函数</h2>
            <p className="text-gray-600 mt-1">
              用于执行非查询类SQL语句，如CREATE、INSERT、UPDATE、DELETE等
            </p>
          </div>
          <div className="p-6">
            {functionStatus.execSql.message && (
              <div className={`mb-4 p-3 rounded text-sm ${
                functionStatus.execSql.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {functionStatus.execSql.message}
              </div>
            )}
            <button
              onClick={handleCreateExecSQL}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建exec_sql函数'}
            </button>
          </div>
        </div>

        {/* query_sql函数 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">query_sql 函数</h2>
            <p className="text-gray-600 mt-1">
              用于执行SELECT查询语句，并返回查询结果
            </p>
          </div>
          <div className="p-6">
            {functionStatus.querySql.message && (
              <div className={`mb-4 p-3 rounded text-sm ${
                functionStatus.querySql.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {functionStatus.querySql.message}
              </div>
            )}
            <button
              onClick={handleCreateQuerySQL}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建query_sql函数'}
            </button>
          </div>
        </div>

        {/* create_table函数 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">create_table 函数</h2>
            <p className="text-gray-600 mt-1">
              用于动态创建数据表结构
            </p>
          </div>
          <div className="p-6">
            {functionStatus.createTable.message && (
              <div className={`mb-4 p-3 rounded text-sm ${
                functionStatus.createTable.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {functionStatus.createTable.message}
              </div>
            )}
            <button
              onClick={handleCreateTableFunction}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建create_table函数'}
            </button>
          </div>
        </div>

        {/* drop_table函数 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">drop_table 函数</h2>
            <p className="text-gray-600 mt-1">
              用于删除数据表（危险操作）
            </p>
          </div>
          <div className="p-6">
            {functionStatus.dropTable.message && (
              <div className={`mb-4 p-3 rounded text-sm ${
                functionStatus.dropTable.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {functionStatus.dropTable.message}
              </div>
            )}
            <button
              onClick={handleDropTableFunction}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建drop_table函数'}
            </button>
          </div>
        </div>
      </div>

      {/* 操作日志 */}
      {statusMessages.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">操作日志</h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-md h-60 overflow-y-auto">
              {statusMessages.map((message, index) => (
                <div key={index} className="text-sm mb-1">
                  {message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">函数使用说明</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">exec_sql 函数用法</h3>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-auto">
              {`-- 示例：创建新表
const { data, error } = await supabase.rpc('exec_sql', { 
  sql: 'CREATE TABLE IF NOT EXISTS test_table (id serial primary key, name text)' 
})`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">query_sql 函数用法</h3>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-auto">
              {`-- 示例：查询数据
const { data, error } = await supabase.rpc('query_sql', { 
  sql: 'SELECT * FROM products LIMIT 10' 
})`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 