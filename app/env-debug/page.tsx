'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// 定义类型
interface SupabaseData {
  count: number | null;
}

interface ErrorWithMessage {
  message: string;
  details?: string;
}

export default function EnvDebugPage() {
  const [serverData, setServerData] = useState<SupabaseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorWithMessage | null>(null)
  const [testProgress, setTestProgress] = useState<string[]>([])

  // 获取环境变量信息
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      '已设置(前6位:' + (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 6) + '...)') : 
      '未设置',
    NODE_ENV: process.env.NODE_ENV || '未知'
  }

  // 添加调试日志
  const addLog = (message: string) => {
    setTestProgress(prev => [...prev, message])
  }

  // 测试Supabase连接
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        setIsLoading(true)
        addLog('开始测试Supabase连接...')
        addLog(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置'}`)
        
        // 验证URL格式
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL || 
          !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://') ||
          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('.supabase.co')
        ) {
          addLog('警告: Supabase URL格式可能不正确')
        } else {
          addLog('Supabase URL格式有效')
        }
        
        // 验证ANON_KEY格式 
        if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          addLog('警告: Supabase匿名密钥未设置')
        } else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length < 30) {
          addLog('警告: Supabase匿名密钥长度异常')
        } else {
          addLog('Supabase匿名密钥格式似乎有效')
        }
        
        // 尝试创建连接
        addLog('尝试创建Supabase客户端并测试连接...')
        
        // 尝试从Supabase获取一些数据
        const { data, error } = await supabase
          .from('products')
          .select('count')
          .limit(1)

        if (error) {
          addLog(`获取数据失败: ${error.message}`)
          throw error
        }

        addLog('成功从Supabase获取数据!')
        setServerData({ count: data?.length || 0 })
      } catch (err) {
        console.error('Supabase连接测试失败:', err)
        addLog(`连接测试失败: ${err instanceof Error ? err.message : '未知错误'}`)
        
        // 尝试网络诊断
        addLog('尝试诊断网络问题...')
        
        try {
          // 检查是否可以访问Supabase域名
          const pingUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://app.supabase.com'
          const pingResponse = await fetch(pingUrl, { 
            method: 'HEAD',
            cache: 'no-store'
          })
          
          addLog(`Supabase域名连通性: ${pingResponse.ok ? '正常' : '异常'} (状态码: ${pingResponse.status})`)
        } catch (pingErr) {
          addLog(`无法连接到Supabase域名: ${pingErr instanceof Error ? pingErr.message : '未知错误'}`)
        }
        
        setError({
          message: err instanceof Error ? err.message : '未知错误',
          details: err instanceof Error && err.stack ? err.stack : undefined
        })
      } finally {
        setIsLoading(false)
      }
    }

    testSupabaseConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">环境变量调试页面</h1>
            <p className="text-gray-600 mb-4">
              此页面用于测试环境变量配置和Supabase连接是否正常
            </p>
            <div className="mt-4 mb-6">
              <Link href="/" className="text-primary hover:underline">
                ← 返回首页
              </Link>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">诊断结果摘要</h2>
              {isLoading ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p>正在诊断中...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-700">连接失败</h3>
                  <p className="text-red-600 mt-1">{error.message}</p>
                  <p className="text-red-600 mt-1 text-sm">可能的原因:</p>
                  <ul className="list-disc ml-5 mt-1 text-sm text-red-600">
                    <li>环境变量配置错误</li>
                    <li>Supabase项目未创建或已暂停</li>
                    <li>网络连接问题</li>
                    <li>RLS策略限制访问</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-700">连接成功</h3>
                  <p className="text-green-600">Supabase连接正常工作</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">客户端环境变量</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(clientEnvVars, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">诊断过程</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              {testProgress.length > 0 ? (
                <ol className="list-decimal ml-5 space-y-1">
                  {testProgress.map((log, index) => (
                    <li key={index} className="text-gray-700">{log}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500">暂无诊断信息</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Supabase连接测试</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-opacity-50 mx-auto"></div>
                <p className="mt-4 text-gray-600">正在测试Supabase连接...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                <h3 className="font-medium mb-2">连接失败</h3>
                <p>{error.message || '连接测试失败，请检查控制台获取详细错误信息'}</p>
                {error.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm">查看详细错误</summary>
                    <pre className="mt-2 text-xs whitespace-pre-wrap overflow-auto bg-red-100 p-2 rounded">
                      {error.details}
                    </pre>
                  </details>
                )}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg">
                <h3 className="font-medium mb-2">连接成功</h3>
                <p className="mb-2">成功连接到Supabase并获取数据</p>
                <pre className="bg-white p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(serverData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">解决方案</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">步骤1: 检查环境变量</h3>
                <p>
                  确保在Vercel项目设置中添加了以下环境变量，并且值正确无误：
                </p>
                <ul className="list-disc list-inside mt-2 ml-4">
                  <li>NEXT_PUBLIC_SUPABASE_URL - 应为https://xxxx.supabase.co格式</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY - 应为较长的密钥字符串</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY - 管理密钥(可选但推荐)</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">步骤2: 直接初始化数据库</h3>
                <p>
                  使用我们刚刚添加的直接初始化脚本：
                </p>
                <pre className="bg-white p-3 rounded text-sm mt-2">
                  {`# 本地运行
node scripts/direct-init.js --url YOUR_SUPABASE_URL --key YOUR_KEY

# 或在Vercel部署环境中
npm run direct-init`}
                </pre>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">步骤3: 检查Supabase项目设置</h3>
                <p>
                  登录Supabase控制面板检查：
                </p>
                <ul className="list-disc list-inside mt-2 ml-4">
                  <li>项目是否活跃且正常运行</li>
                  <li>数据库是否已暂停或处于维护模式</li>
                  <li>Row Level Security (RLS)策略是否允许所需操作</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 