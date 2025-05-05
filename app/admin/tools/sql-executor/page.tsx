'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function SQLExecutorPage() {
  const { user, isAuthenticated } = useAuth()
  const [sql, setSql] = useState('')
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [executeTime, setExecuteTime] = useState<number | null>(null)
  const [showAllColumns, setShowAllColumns] = useState(false)
  const [logMessages, setLogMessages] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isDangerousSQL, setIsDangerousSQL] = useState(false)

  const addLog = (message: string) => {
    setLogMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const executeSQL = async () => {
    if (!sql.trim()) {
      setError('请输入SQL语句')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)
    setExecuteTime(null)
    addLog(`执行SQL: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`)

    const startTime = performance.now()

    try {
      // 尝试使用exec_sql RPC函数执行SQL语句
      const { data, error } = await supabase.rpc('exec_sql', { sql: sql })

      if (error) {
        throw error
      }

      // 如果是SELECT语句，尝试获取结果
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const queryResult = await supabase.rpc('query_sql', { sql: sql })
        
        if (queryResult.error) {
          // 如果query_sql函数不存在，提示需要创建它
          setError(`获取查询结果失败: ${queryResult.error.message}。您可能需要创建query_sql函数。`)
          addLog(`错误: ${queryResult.error.message}`)
        } else {
          // 处理查询结果，确保结果是数组形式
          let formattedData = queryResult.data
          
          // 如果数据是JSON字符串，尝试解析
          if (typeof formattedData === 'string') {
            try {
              formattedData = JSON.parse(formattedData)
            } catch (e) {
              // 如果解析失败，使用原始数据
              console.log('无法解析JSON字符串结果')
            }
          }
          
          // 处理不同格式的查询结果
          if (formattedData && !Array.isArray(formattedData)) {
            if (typeof formattedData === 'object') {
              // 如果是单个对象，转换为数组
              if (Object.keys(formattedData).length > 0) {
                formattedData = [formattedData]
              } else {
                formattedData = []
              }
            } else {
              // 如果是其他类型，创建包含单个值的数组
              formattedData = [{ value: formattedData }]
            }
          }
          
          setResults(formattedData || [])
          addLog(`查询成功: 返回 ${formattedData?.length || 0} 行数据`)
        }
      } else {
        // 对于非SELECT语句，显示成功消息
        setResults({ message: 'SQL语句执行成功' })
        addLog('非查询SQL执行成功')
      }
    } catch (err: any) {
      console.error('执行SQL失败:', err)
      // 提供更详细的错误信息
      let errorMessage = err.message || '未知错误'
      
      // 添加常见错误的帮助提示
      if (errorMessage.includes('function') && errorMessage.includes('does not exist')) {
        errorMessage += '。您可能需要先创建相应的SQL函数。'
      } else if (errorMessage.includes('permission denied')) {
        errorMessage += '。您可能没有执行该操作的权限。'
      } else if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        errorMessage += '。请检查表名是否正确。'
      }
      
      setError(`执行SQL失败: ${errorMessage}`)
      addLog(`错误: ${errorMessage}`)
    } finally {
      const endTime = performance.now()
      setExecuteTime(endTime - startTime)
      setLoading(false)
    }
  }

  const handleCreateQueryFunction = async () => {
    if (!confirm('确定要创建query_sql函数吗？这将允许您执行SELECT查询并获取结果。')) {
      return
    }

    setLoading(true)
    addLog('正在创建query_sql函数...')

    try {
      // 先检查函数是否已存在
      try {
        const checkResult = await supabase.rpc('query_sql', { 
          sql: 'SELECT 1 as test' 
        })
        
        if (!checkResult.error) {
          addLog('query_sql函数已存在且工作正常')
          alert('query_sql函数已存在且工作正常！')
          setLoading(false)
          return
        }
      } catch (err) {
        // 函数不存在或无法正常工作，继续创建
        console.log('query_sql函数不存在或无法正常工作，尝试创建...')
      }

      // 尝试创建函数
      const response = await fetch('/api/admin/setup/create-query-sql', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '创建query_sql函数失败')
      }
      
      // 创建成功后进行验证测试
      try {
        const testResult = await supabase.rpc('query_sql', { 
          sql: 'SELECT 1 as test' 
        })
        
        if (testResult.error) {
          throw new Error(`函数创建成功但测试失败: ${testResult.error.message}`)
        }
        
        addLog('query_sql函数创建并测试成功')
        alert('query_sql函数已成功创建并测试通过！现在您可以执行SELECT查询并查看结果了。')
      } catch (testErr: any) {
        addLog(`函数创建后测试失败: ${testErr.message}`)
        alert(`query_sql函数已创建，但测试失败。错误: ${testErr.message}`)
      }
    } catch (err: any) {
      console.error('创建query_sql函数失败:', err)
      addLog(`错误: ${err.message}`)
      alert(`创建query_sql函数失败: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 判断SQL是否是危险操作
  const checkDangerousSQL = (sqlText: string) => {
    const upperSQL = sqlText.trim().toUpperCase()
    // 检查是否包含数据修改或结构修改关键字
    return (
      upperSQL.includes('DROP TABLE') || 
      upperSQL.includes('DROP DATABASE') ||
      upperSQL.includes('TRUNCATE TABLE') ||
      upperSQL.includes('DELETE FROM') ||
      upperSQL.includes('ALTER TABLE') && upperSQL.includes('DROP')
    )
  }

  const handleSQLExecution = () => {
    const trimmedSQL = sql.trim()
    if (!trimmedSQL) {
      setError('请输入SQL语句')
      return
    }
    
    // 检查SQL是否危险
    const dangerous = checkDangerousSQL(trimmedSQL)
    setIsDangerousSQL(dangerous)
    
    // 危险SQL或影响数据的SQL需要确认
    if (dangerous || 
        !trimmedSQL.toUpperCase().startsWith('SELECT') && 
        !trimmedSQL.toUpperCase().startsWith('SHOW') && 
        !trimmedSQL.toUpperCase().startsWith('EXPLAIN')) {
      setShowConfirmation(true)
    } else {
      // 安全的查询SQL可直接执行
      executeSQL()
    }
  }
  
  // 确认框
  const SQLConfirmationDialog = () => {
    if (!showConfirmation) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-bold mb-2">
            {isDangerousSQL ? '⚠️ 危险操作确认' : '操作确认'}
          </h3>
          <div className={`p-3 rounded-md mb-4 ${isDangerousSQL ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
            <p>您将执行以下SQL语句:</p>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-sm">
              {sql}
            </pre>
            {isDangerousSQL && (
              <p className="mt-2 font-bold">此操作可能会删除或破坏数据，且不可恢复！</p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={() => {
                setShowConfirmation(false)
                executeSQL()
              }}
              className={`px-4 py-2 rounded text-white ${
                isDangerousSQL 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              确认执行
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 渲染结果表格
  const renderResultsTable = () => {
    if (!results || !Array.isArray(results) || results.length === 0) {
      return <div className="text-center py-4">查询未返回任何数据</div>
    }

    // 获取所有列
    const allColumns = Object.keys(results[0])
    
    // 如果不显示所有列且列数超过5个，则只显示前5列
    const columns = showAllColumns ? allColumns : allColumns.slice(0, 5)
    const hasMoreColumns = allColumns.length > 5

    return (
      <div className="overflow-x-auto">
        {hasMoreColumns && (
          <div className="mb-2 flex justify-end">
            <button
              onClick={() => setShowAllColumns(!showAllColumns)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showAllColumns ? '只显示前5列' : `显示所有${allColumns.length}列`}
            </button>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof row[column] === 'object' 
                      ? JSON.stringify(row[column]) 
                      : String(row[column] !== null ? row[column] : 'NULL')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/tools" className="text-blue-600 hover:underline">
          ← 返回工具列表
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">SQL执行器</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>警告：</strong> 此工具允许直接执行SQL语句，不当的SQL语句可能会对数据库造成不可逆的损害。
              请确保您了解您正在执行的SQL语句的作用。
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="sql" className="block text-sm font-medium text-gray-700 mb-2">
          SQL语句
        </label>
        <textarea
          id="sql"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md h-40 font-mono"
          placeholder="输入要执行的SQL语句，例如: SELECT * FROM products LIMIT 10;"
        />
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleSQLExecution}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? '执行中...' : '执行SQL'}
        </button>
        <button
          onClick={handleCreateQueryFunction}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          创建query_sql函数
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {executeTime !== null && (
        <div className="mb-4 text-sm text-gray-500">
          查询用时: {executeTime.toFixed(2)} ms
        </div>
      )}

      {results && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              执行结果
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {Array.isArray(results) ? (
              renderResultsTable()
            ) : (
              <div className="text-green-600">
                {results.message || 'SQL执行成功'}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm mb-6 h-60 overflow-y-auto">
        <div className="mb-2 font-bold text-white">执行日志:</div>
        {logMessages.length === 0 ? (
          <div className="text-gray-500">尚无日志...</div>
        ) : (
          logMessages.map((message, index) => (
            <div key={index} className="mb-1">&gt; {message}</div>
          ))
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-medium mb-2">帮助信息</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>1. 要查询数据，请使用 <code className="bg-gray-100 px-1 rounded">SELECT</code> 语句</p>
          <p>2. 如果执行了 <code className="bg-gray-100 px-1 rounded">SELECT</code> 语句但没有返回数据，请创建 query_sql 函数</p>
          <p>3. 常用SQL操作:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code className="bg-gray-100 px-1 rounded">SELECT * FROM table_name LIMIT 10;</code> - 查询前10条数据</li>
            <li><code className="bg-gray-100 px-1 rounded">SELECT column1, column2 FROM table_name WHERE condition;</code> - 条件查询</li>
            <li><code className="bg-gray-100 px-1 rounded">UPDATE table_name SET column1 = value1 WHERE condition;</code> - 更新数据</li>
            <li><code className="bg-gray-100 px-1 rounded">DELETE FROM table_name WHERE condition;</code> - 删除数据</li>
          </ul>
        </div>
      </div>

      {/* 确认对话框 */}
      <SQLConfirmationDialog />
    </div>
  )
} 