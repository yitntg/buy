'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'failed'
  duration?: number
  data?: any
  error?: {
    message: string
    stack?: string
  }
}

interface TestResponse {
  environment: string
  timestamp: string
  tests: TestResult[]
  summary: {
    status: 'pending' | 'success' | 'failed' | 'error'
    message: string
    firstError?: string
    error?: string
  }
  diagnostics: {
    url: any
    anonKey: any
    serviceKey: any
  }
}

export default function DbCheckPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [results, setResults] = useState<TestResponse | null>(null)
  const [showRawData, setShowRawData] = useState(false)

  useEffect(() => {
    const runTest = async () => {
      try {
        setLoading(true)
        
        const response = await fetch('/api/db-test', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setResults(data)
      } catch (err) {
        console.error('测试时出错:', err)
        setError(err instanceof Error ? err : new Error('未知错误'))
      } finally {
        setLoading(false)
      }
    }
    
    runTest()
  }, [])
  
  const retryTest = () => {
    setLoading(true)
    setError(null)
    setResults(null)
    // 重新触发useEffect
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">数据库连接诊断</h1>
            <p className="text-gray-600 mb-4">
              此页面执行一系列测试，以诊断Supabase数据库连接问题
            </p>
            <div className="flex space-x-4 mb-6">
              <Link href="/admin" className="text-primary hover:underline">
                ← 返回管理面板
              </Link>
              <button
                onClick={retryTest}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {loading ? '测试中...' : '重新测试'}
              </button>
            </div>
            
            {/* 测试状态摘要 */}
            {loading ? (
              <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3 animate-pulse">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <p>正在测试数据库连接，请稍候...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-700 mb-2">测试失败</h3>
                <p className="text-red-600">{error.message}</p>
                <button 
                  onClick={retryTest}
                  className="mt-3 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                  重试
                </button>
              </div>
            ) : results ? (
              <div className={`p-5 rounded-lg border ${
                results.summary.status === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  results.summary.status === 'success' 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>
                  {results.summary.status === 'success' ? '连接成功' : '连接失败'}
                </h3>
                <p className={`${
                  results.summary.status === 'success' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {results.summary.message}
                </p>
                {results.summary.firstError && (
                  <p className="mt-1 text-red-600">
                    错误: {results.summary.firstError}
                  </p>
                )}
              </div>
            ) : null}
          </div>
          
          {/* 环境变量诊断 */}
          {results && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">环境变量诊断</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b">
                    NEXT_PUBLIC_SUPABASE_URL
                  </div>
                  <div className="p-4">
                    {results.diagnostics.url.exists ? (
                      <div className="text-green-600">
                        已设置: {results.diagnostics.url.value}
                      </div>
                    ) : (
                      <div className="text-red-600">未设置</div>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </div>
                  <div className="p-4">
                    {results.diagnostics.anonKey.exists ? (
                      <div className="text-green-600">
                        已设置 ({results.diagnostics.anonKey.length} 字符)
                        {results.diagnostics.anonKey.mask && (
                          <span className="ml-2 text-gray-600">
                            掩码值: {results.diagnostics.anonKey.mask}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-600">未设置</div>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b">
                    SUPABASE_SERVICE_ROLE_KEY
                  </div>
                  <div className="p-4">
                    {results.diagnostics.serviceKey.exists ? (
                      <div className="text-green-600">
                        已设置 ({results.diagnostics.serviceKey.length} 字符)
                        {results.diagnostics.serviceKey.mask && (
                          <span className="ml-2 text-gray-600">
                            掩码值: {results.diagnostics.serviceKey.mask}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-yellow-600">
                        未设置 (推荐但不是必需的)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 测试详情 */}
          {results && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">测试详情</h2>
              
              <div className="space-y-4">
                {results.tests.map((test, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className={`px-4 py-2 font-medium border-b flex justify-between items-center ${
                      test.status === 'success' 
                        ? 'bg-green-50 text-green-700' 
                        : test.status === 'failed'
                          ? 'bg-red-50 text-red-700' 
                          : 'bg-gray-100'
                    }`}>
                      <span>{test.name}</span>
                      <span className="text-sm">
                        {test.status === 'success' ? '✓ 通过' : '✗ 失败'}
                        {test.duration && (
                          <span className="ml-2 text-gray-500">
                            ({test.duration}ms)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="p-4">
                      {test.error ? (
                        <div className="text-red-600">
                          <p className="font-medium">错误:</p>
                          <p className="mt-1">{test.error.message}</p>
                          {test.error.stack && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm">
                                查看堆栈
                              </summary>
                              <pre className="mt-2 p-2 bg-red-50 rounded text-xs whitespace-pre-wrap">
                                {test.error.stack}
                              </pre>
                            </details>
                          )}
                        </div>
                      ) : test.data ? (
                        <div>
                          <p className="font-medium text-gray-700">结果:</p>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs whitespace-pre-wrap">
                            {JSON.stringify(test.data, null, 2)}
                          </pre>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 原始数据查看 */}
          {results && !loading && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">调试信息</h2>
                <button
                  onClick={() => setShowRawData(!showRawData)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {showRawData ? '隐藏' : '显示'} 原始数据
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>测试环境: {results.environment}</p>
                <p>测试时间: {results.timestamp}</p>
              </div>
              
              {showRawData && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700 mb-2">原始测试数据:</p>
                  <pre className="bg-gray-50 p-4 rounded text-xs whitespace-pre-wrap overflow-auto h-60">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="mt-6 text-sm">
                <h3 className="font-medium mb-2">添加新的表后测试注意事项:</h3>
                <p className="mb-2">
                  如果您刚刚添加了新的数据库表并遇到问题，请检查:
                </p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>表是否已创建成功 (可通过Supabase控制台检查)</li>
                  <li>是否添加了正确的RLS策略 (默认情况下新表拒绝所有操作)</li>
                  <li>模型定义和表结构是否匹配</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* 解决方案建议 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">常见问题解决方案</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium mb-1">环境变量缺失</h3>
                <p className="text-gray-600">
                  确保在.env.local文件或部署平台上设置了正确的环境变量。
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium mb-1">RLS策略问题</h3>
                <p className="text-gray-600">
                  检查在Supabase控制台中表的Row Level Security策略是否正确配置。
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium mb-1">网络问题</h3>
                <p className="text-gray-600">
                  如果在本地开发中遇到问题，请确认您的网络可以访问Supabase服务器。
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium mb-1">服务限制</h3>
                <p className="text-gray-600">
                  如果您使用的是免费计划，请检查是否达到了API请求限制或数据库连接数限制。
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium mb-1">查看完整日志</h3>
                <p className="text-gray-600">
                  在项目根目录运行 <code>npm run dev</code> 可以查看更详细的错误日志。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 