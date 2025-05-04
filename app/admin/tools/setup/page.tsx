'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SetupPage() {
  const [isCreatingTables, setIsCreatingTables] = useState(false)
  const [isInsertingData, setIsInsertingData] = useState(false)
  const [tablesResult, setTablesResult] = useState<{success: boolean, message: string} | null>(null)
  const [dataResult, setDataResult] = useState<{success: boolean, message: string} | null>(null)
  const [statusMessages, setStatusMessages] = useState<string[]>([])

  // 添加日志
  const addLog = (message: string) => {
    setStatusMessages(prev => [...prev, message])
  }

  // 创建表结构
  const createTables = async () => {
    setIsCreatingTables(true)
    setTablesResult(null)
    addLog('开始创建表结构...')

    try {
      // 1. 检查分类表是否存在
      addLog('正在检查分类表...')
      const { error: catCheckError } = await supabase
        .from('categories')
        .select('count')
        .limit(1)
      
      const categoriesExists = !catCheckError
      if (categoriesExists) {
        addLog('分类表已存在')
      } else {
        addLog('分类表不存在，将创建此表')
      }

      // 2. 检查产品表是否存在
      addLog('正在检查产品表...')
      const { error: prodCheckError } = await supabase
        .from('products')
        .select('count')
        .limit(1)
      
      const productsExists = !prodCheckError
      if (productsExists) {
        addLog('产品表已存在')
      } else {
        addLog('产品表不存在，将创建此表')
      }

      // 3. 检查评论表是否存在
      addLog('正在检查评论表...')
      const { error: reviewCheckError } = await supabase
        .from('reviews')
        .select('count')
        .limit(1)
      
      const reviewsExists = !reviewCheckError
      if (reviewsExists) {
        addLog('评论表已存在')
      } else {
        addLog('评论表不存在，将创建此表')
      }

      // 如果有任何表不存在，尝试直接创建
      if (!categoriesExists || !productsExists || !reviewsExists) {
        addLog('开始创建缺失的表...')

        // 直接调用我们的初始化API来创建表
        addLog('正在调用数据库初始化API...')
        const response = await fetch('/api/db/run-init-script')
        
        if (!response.ok) {
          const errorText = await response.text()
          addLog(`API调用失败: ${response.status} ${response.statusText}`)
          throw new Error(`调用初始化API失败: ${response.status} ${response.statusText}`)
        }
        
        addLog('API调用成功，等待表创建结果验证...')
        
        // 添加延迟，等待数据库操作完成
        addLog('等待数据库操作完成...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 使用重试机制验证表是否创建成功
        let verifySuccess = false
        const maxRetries = 3
        
        for (let i = 0; i < maxRetries; i++) {
          addLog(`正在验证表创建结果 (尝试 ${i+1}/${maxRetries})...`)
          
          const { error: verifyError } = await supabase
            .from('categories')
            .select('count')
            .limit(1)
          
          if (!verifyError) {
            verifySuccess = true
            addLog('表验证成功！')
            break
          }
          
          if (i < maxRetries - 1) {
            addLog(`验证未通过，将在2秒后重试...`)
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        }
        
        if (verifySuccess) {
          setTablesResult({
            success: true,
            message: '所有表都已成功创建！可以继续添加数据。'
          })
          addLog('表创建验证成功，所有表已准备就绪')
        } else {
          // 即使验证失败，表可能也已创建成功，只是验证有问题
          setTablesResult({
            success: false,
            message: '表可能已创建，但验证失败。请查看API返回结果或手动验证。'
          })
          addLog('表创建验证失败，但API报告创建成功')
          addLog('建议：')
          addLog('1. 继续添加数据，可能依然能正常工作')
          addLog('2. 在Supabase仪表板中检查表是否存在')
        }
      } else {
        setTablesResult({
          success: true,
          message: '所有表都已存在！可以继续添加数据。'
        })
      }
    } catch (error) {
      console.error('创建表结构出错:', error)
      setTablesResult({
        success: false,
        message: error instanceof Error ? error.message : '创建表结构时发生未知错误'
      })
      addLog(`错误: ${error instanceof Error ? error.message : '未知错误'}`)
      addLog('建议在终端运行命令: npm run init-db')
    } finally {
      setIsCreatingTables(false)
    }
  }

  // 添加示例数据
  const insertSampleData = async () => {
    setIsInsertingData(true)
    setDataResult(null)
    addLog('开始添加示例数据...')

    try {
      // 调用API端点添加示例数据
      addLog('正在调用API添加示例数据...')
      const response = await fetch('/api/db/add-sample-data')
      
      if (!response.ok) {
        addLog(`API调用失败: ${response.status} ${response.statusText}`)
        throw new Error(`添加示例数据失败: ${response.status} ${response.statusText}`)
      }
      
      addLog('API调用成功，示例数据已添加')
      
      // 检查添加是否成功
      addLog('正在验证数据是否添加成功...')
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(1)
      
      if (categoriesError) {
        addLog('分类数据验证失败，但API报告成功，可能有延迟')
      } else {
        addLog(`分类数据验证成功: 找到${categories.length}条记录`)
      }
      
      setDataResult({
        success: true,
        message: '所有示例数据添加成功！'
      })
    } catch (error) {
      console.error('添加示例数据出错:', error)
      setDataResult({
        success: false,
        message: error instanceof Error ? error.message : '添加示例数据时发生未知错误'
      })
      addLog(`错误: ${error instanceof Error ? error.message : '未知错误'}`)
      addLog('可以尝试直接访问: /api/db/add-sample-data')
    } finally {
      setIsInsertingData(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">数据库初始化工具</h1>
            <p className="text-gray-600 mb-6">
              此页面可帮助您创建必要的数据库表和示例数据
            </p>
            
            <div className="mb-6">
              <Link href="/admin" className="text-primary hover:underline">
                ← 返回管理面板
              </Link>
            </div>

            {/* 当前状态 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">系统状态</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">表结构状态</h3>
                  <p className="text-sm text-gray-600 mb-4">必要的数据库表是否已创建</p>
                  {tablesResult ? (
                    <div className={`text-sm p-3 rounded ${
                      tablesResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {tablesResult.message}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">尚未检查</p>
                  )}
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">示例数据状态</h3>
                  <p className="text-sm text-gray-600 mb-4">初始示例数据是否已添加</p>
                  {dataResult ? (
                    <div className={`text-sm p-3 rounded ${
                      dataResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {dataResult.message}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">尚未检查</p>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">操作</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={createTables}
                  disabled={isCreatingTables}
                >
                  {isCreatingTables ? '创建中...' : '创建数据库表'}
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={insertSampleData}
                  disabled={isInsertingData}
                >
                  {isInsertingData ? '添加中...' : '添加示例数据'}
                </button>
              </div>
            </div>

            {/* 执行日志 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">执行日志</h2>
              <div className="border rounded-lg bg-gray-50 p-4 h-64 overflow-y-auto">
                {statusMessages.length > 0 ? (
                  <ol className="list-decimal ml-6 space-y-1">
                    {statusMessages.map((message, index) => (
                      <li key={index} className="text-sm text-gray-800">{message}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-gray-500 text-center mt-12">执行操作后，日志将显示在这里</p>
                )}
              </div>
            </div>

            {/* 帮助信息 */}
            <div>
              <h2 className="text-xl font-semibold mb-3">帮助信息</h2>
              <div className="space-y-4 text-sm">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">首次运行说明</h3>
                  <p className="text-gray-600">
                    如果您是首次设置应用，请先点击"创建数据库表"，然后再点击"添加示例数据"。
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">问题排查</h3>
                  <p className="text-gray-600 mb-2">
                    如果遇到问题，请尝试以下方法：
                  </p>
                  <ul className="list-disc ml-5 space-y-1 text-gray-600">
                    <li>检查 Supabase 环境变量是否正确设置</li>
                    <li>在开发环境中使用控制台查看详细错误</li>
                    <li>确保 Supabase 项目已创建并处于活跃状态</li>
                    <li>检查数据库权限设置</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">高级用户选项</h3>
                  <p className="text-gray-600 mb-2">
                    高级用户可以直接使用以下 API 端点：
                  </p>
                  <ul className="list-disc ml-5 space-y-1 text-gray-600">
                    <li><code>/api/db/run-init-script</code> - 创建所有必要的表</li>
                    <li><code>/api/db/add-sample-data</code> - 添加示例数据</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 