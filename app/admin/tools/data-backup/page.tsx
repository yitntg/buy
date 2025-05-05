'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function DataBackupPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [availableTables, setAvailableTables] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: 'info' | 'success' | 'error', text: string } | null>(null)
  const [exportedData, setExportedData] = useState<string>('')
  const [importData, setImportData] = useState<string>('')

  // 获取所有表
  const fetchTables = async () => {
    try {
      setMessage({ type: 'info', text: '正在获取数据库表列表...' })
      
      // 尝试使用query_sql函数
      try {
        const { data, error } = await supabase.rpc('query_sql', { 
          sql: `SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name` 
        })
        
        if (error) {
          throw error
        }
        
        if (Array.isArray(data)) {
          const tables = data.map((row: any) => row.table_name)
          setAvailableTables(tables)
          setMessage({ type: 'success', text: `获取到 ${tables.length} 个表` })
        } else {
          // 处理非数组结果
          console.log('查询返回的数据不是数组格式:', data)
          setMessage({ type: 'error', text: '获取表失败: 返回结果格式不正确' })
        }
      } catch (queryError: any) {
        console.error('使用query_sql失败:', queryError)
        
        // 备用方法：直接获取所有已知表
        const knownTables = ['products', 'categories', 'orders', 'order_items', 'users', 'reviews']
        setAvailableTables(knownTables)
        setMessage({ type: 'success', text: `使用备用方法获取表列表，找到 ${knownTables.length} 个表` })
      }
    } catch (error: any) {
      console.error('获取表失败:', error)
      setMessage({ type: 'error', text: `获取表失败: ${error.message}` })
    }
  }

  // 导出表数据
  const exportTableData = async () => {
    if (selectedTables.length === 0) {
      setMessage({ type: 'error', text: '请至少选择一个表进行导出' })
      return
    }
    
    setIsExporting(true)
    setMessage({ type: 'info', text: '正在导出数据...' })
    setExportedData('')
    
    try {
      const exportData: { [key: string]: any[] } = {}
      
      for (const table of selectedTables) {
        setMessage({ type: 'info', text: `正在导出表 ${table}...` })
        
        // 获取表数据
        const { data, error } = await supabase
          .from(table)
          .select('*')
        
        if (error) {
          throw new Error(`导出表 ${table} 失败: ${error.message}`)
        }
        
        exportData[table] = data
      }
      
      // 转换为JSON
      const exportJson = JSON.stringify(exportData, null, 2)
      setExportedData(exportJson)
      
      // 创建下载链接
      const blob = new Blob([exportJson], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup_${new Date().toISOString().replace(/:/g, '-')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      setMessage({ type: 'success', text: `成功导出 ${selectedTables.length} 个表的数据` })
    } catch (error: any) {
      console.error('导出数据失败:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsExporting(false)
    }
  }
  
  // 导入数据
  const importTableData = async () => {
    if (!importData) {
      setMessage({ type: 'error', text: '请输入要导入的JSON数据' })
      return
    }
    
    setIsImporting(true)
    setMessage({ type: 'info', text: '正在解析导入数据...' })
    
    try {
      let dataToImport: { [key: string]: any[] }
      
      try {
        dataToImport = JSON.parse(importData)
      } catch (e) {
        throw new Error('解析JSON数据失败，请确保输入的是有效的JSON格式')
      }
      
      const tables = Object.keys(dataToImport)
      
      if (tables.length === 0) {
        throw new Error('导入数据中没有找到任何表')
      }
      
      // 创建导入函数
      for (const table of tables) {
        const rows = dataToImport[table]
        
        if (!rows || !Array.isArray(rows) || rows.length === 0) {
          continue
        }
        
        setMessage({ type: 'info', text: `正在导入表 ${table}，共 ${rows.length} 条数据...` })
        
        // 使用exec_sql处理
        // 先清空表（可选）
        // const { error: clearError } = await supabase.rpc('exec_sql', { 
        //   sql: `DELETE FROM ${table}` 
        // })
        
        // if (clearError) {
        //   throw new Error(`清空表 ${table} 失败: ${clearError.message}`)
        // }
        
        // 使用upsert插入数据
        const { error: insertError } = await supabase
          .from(table)
          .upsert(rows)
        
        if (insertError) {
          throw new Error(`导入表 ${table} 失败: ${insertError.message}`)
        }
      }
      
      setMessage({ type: 'success', text: `成功导入 ${tables.length} 个表的数据` })
      setImportData('')
    } catch (error: any) {
      console.error('导入数据失败:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsImporting(false)
    }
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

      <h1 className="text-2xl font-bold mb-6">数据备份工具</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>警告：</strong> 此工具允许导出和导入数据库数据。导入操作可能会覆盖或修改现有数据，请确保在操作前备份重要数据。
            </p>
          </div>
        </div>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'error' ? 'bg-red-50 text-red-700' : 
          message.type === 'success' ? 'bg-green-50 text-green-700' : 
          'bg-blue-50 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 导出数据 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              导出数据
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              选择要导出的表并下载备份文件
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <button 
                onClick={fetchTables} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                获取可用表
              </button>
            </div>
            
            {availableTables.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择要导出的表
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {availableTables.map(table => (
                    <div key={table} className="flex items-center">
                      <input
                        id={`table-${table}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedTables.includes(table)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTables([...selectedTables, table])
                          } else {
                            setSelectedTables(selectedTables.filter(t => t !== table))
                          }
                        }}
                      />
                      <label htmlFor={`table-${table}`} className="ml-2 block text-sm text-gray-700">
                        {table}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              onClick={exportTableData} 
              disabled={isExporting || selectedTables.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isExporting ? '导出中...' : '导出选中表'}
            </button>
            
            {exportedData && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  导出的数据
                </label>
                <div className="bg-gray-50 p-2 rounded-md">
                  <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                    {exportedData.length > 500 ? exportedData.substring(0, 500) + '...' : exportedData}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 导入数据 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              导入数据
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              从备份文件导入数据到数据库
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <label htmlFor="import-data" className="block text-sm font-medium text-gray-700 mb-2">
                粘贴要导入的JSON数据
              </label>
              <textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md h-40 font-mono"
                placeholder='{"table_name": [{"id": 1, "name": "示例"}]}'
              />
            </div>
            
            <button 
              onClick={importTableData} 
              disabled={isImporting || !importData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isImporting ? '导入中...' : '导入数据'}
            </button>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>提示: 导入将使用upsert操作，如果数据主键匹配则更新记录，否则插入新记录。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 