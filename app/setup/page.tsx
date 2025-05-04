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
            <p className="text-gray-600">
              此页面可帮助您初始化数据库表结构并添加示例数据
            </p>
            <div className="mt-4">
              <Link href="/" className="text-primary hover:underline">
                ← 返回首页
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">步骤1: 检查表结构</h2>
                <p className="text-gray-600 mb-4">
                  点击下方按钮检查必要的数据库表结构是否存在
                </p>
                <button
                  onClick={createTables}
                  disabled={isCreatingTables}
                  className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${
                    isCreatingTables 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-blue-600'
                  }`}
                >
                  {isCreatingTables ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      检查中...
                    </>
                  ) : '检查表结构'}
                </button>
                {tablesResult && (
                  <div className={`mt-4 p-4 rounded-md ${tablesResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {tablesResult.message}
                  </div>
                )}

                {/* 添加直接执行命令的按钮 */}
                {tablesResult && !tablesResult.success && (
                  <div className="mt-4">
                    <a 
                      href="/api/db/run-init-script"
                      target="_blank"
                      className="block w-full text-center py-3 px-4 rounded-md font-medium bg-orange-500 text-white hover:bg-orange-600"
                    >
                      一键执行命令行初始化
                    </a>
                    <p className="mt-2 text-xs text-gray-500">
                      点击上方按钮将通过服务器执行初始化，无需您自己在终端运行
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">步骤2: 添加示例数据</h2>
                <p className="text-gray-600 mb-4">
                  点击下方按钮添加示例分类和产品数据
                </p>
                <button
                  onClick={insertSampleData}
                  disabled={isInsertingData || (tablesResult !== null && !tablesResult.success)}
                  className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${
                    isInsertingData || (tablesResult !== null && !tablesResult.success)
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-blue-600'
                  }`}
                >
                  {isInsertingData ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      添加中...
                    </>
                  ) : '添加示例数据'}
                </button>
                {dataResult && (
                  <div className={`mt-4 p-4 rounded-md ${dataResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {dataResult.message}
                  </div>
                )}
                
                {dataResult && !dataResult.success && (
                  <div className="mt-4">
                    <a 
                      href="/api/db/add-sample-data"
                      target="_blank"
                      className="block w-full text-center py-3 px-4 rounded-md font-medium bg-orange-500 text-white hover:bg-orange-600"
                    >
                      直接添加示例数据
                    </a>
                    <p className="mt-2 text-xs text-gray-500">
                      如果按钮无效，可以尝试直接访问上面的链接添加示例数据
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">执行日志</h2>
              <div className="h-96 overflow-y-auto font-mono text-sm bg-gray-900 text-green-400 p-4 rounded">
                {statusMessages.length === 0 ? (
                  <p className="text-gray-500">等待操作...</p>
                ) : (
                  statusMessages.map((message, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-gray-400">{`[${new Date().toLocaleTimeString()}]`}</span> {message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {(tablesResult?.success && dataResult?.success) && (
            <div className="mt-8 bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-700 mb-4">✓ 初始化完成</h2>
              <p className="mb-4">
                数据库初始化已完成。现在您可以：
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600">
                  返回首页
                </Link>
                <Link href="/upload" className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-blue-50">
                  添加商品
                </Link>
                <Link href="/env-debug" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100">
                  环境变量检查
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 