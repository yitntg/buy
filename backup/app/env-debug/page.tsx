'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/src/app/shared/infrastructure/lib/supabase'

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
  const [hasIssues, setHasIssues] = useState(false)
  const [success, setSuccess] = useState(false)

  // 获取环境变量信息
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      '已设置(前6位:' + (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 6) + '...)') : 
      '未设置',
    NODE_ENV: process.env.NODE_ENV || '未知',
    VERCEL_ENV: process.env.VERCEL_ENV || '未知',
    VERCEL_URL: process.env.VERCEL_URL || '未知',
    VERCEL_REGION: process.env.VERCEL_REGION || '未知'
  }

  // 添加调试日志
  const addLog = (message: string) => {
    setTestProgress(prev => [...prev, message])
  }

  // 显示环境变量信息
  useEffect(() => {
    const runCheck = async () => {
      setIsLoading(true)
      setTestProgress([])
      addLog('开始环境变量诊断...')
      
      try {
        // 验证Supabase环境变量
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        addLog('--- Supabase 配置 ---')
        
        // 检查URL是否存在
        if (!supabaseUrl) {
          addLog('错误: Supabase URL不存在')
          setHasIssues(true)
        } else {
          addLog(`Supabase URL: ${supabaseUrl.substring(0, 15)}...`)
          
          // 验证URL格式
          if (!supabaseUrl.startsWith('https://')) {
            addLog('错误: Supabase URL格式不正确，应以https://开头')
            setHasIssues(true)
          } else {
            addLog('Supabase URL协议格式正确')
          }
          
          // 检查是否包含supabase.co
          if (!supabaseUrl.includes('.supabase.co')) {
            addLog('警告: Supabase URL可能不正确，一般应包含.supabase.co')
          } else {
            addLog('Supabase URL域名格式正确')
          }
        }
        
        // 检查密钥是否存在
        if (!supabaseKey) {
          addLog('错误: Supabase匿名密钥不存在')
          setHasIssues(true)
        } else {
          addLog(`Supabase Key: ${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}`)
          
          // 检查密钥长度
          if (supabaseKey.length < 30) {
            addLog('警告: Supabase密钥长度异常，通常应该更长')
            setHasIssues(true)
          } else {
            addLog('Supabase密钥长度正常')
          }
        }
        
        // 显示Vercel环境信息
        addLog('--- Vercel 环境信息 ---')
        addLog(`环境: ${process.env.VERCEL_ENV || '未知'}`)
        addLog(`区域: ${process.env.VERCEL_REGION || '未知'}`)
        addLog(`URL: ${process.env.VERCEL_URL || '未知'}`)
        
        // 尝试网络诊断
        addLog('--- 网络诊断 ---')
        
        try {
          // 检查是否可以访问Supabase域名
          const pingUrl = supabaseUrl || 'https://app.supabase.com'
          addLog(`尝试连接: ${pingUrl}`)
          
          const pingResponse = await fetch(pingUrl, { 
            method: 'HEAD',
            mode: 'no-cors', // 使用no-cors防止CORS错误
            cache: 'no-store'
          }).then(res => {
            addLog(`Supabase服务器连通性: 正常`)
            return res
          }).catch(err => {
            throw new Error(`无法连接到Supabase服务器: ${err.message}`)
          })
        } catch (networkError: any) {
          console.error('网络诊断错误:', networkError)
          addLog(`网络错误: ${networkError.message}`)
          setHasIssues(true)
        }
        
        // 检查Supabase客户端创建是否成功
        addLog('--- Supabase客户端测试 ---')
        
        try {
          // 尝试执行实际的查询
          const { data, error } = await supabase.from('products').select('count').limit(1)
          
          if (error) {
            addLog(`错误: Supabase查询失败 - ${error.message}`)
            setHasIssues(true)
            setError({
              message: `Supabase查询失败: ${error.message}`,
              details: JSON.stringify(error, null, 2)
            })
          } else {
            addLog('Supabase查询成功')
            setServerData({ count: data.length })
            setSuccess(true)
          }
        } catch (apiError: any) {
          console.error('API测试错误:', apiError)
          addLog(`错误: Supabase客户端调用失败 - ${apiError.message}`)
          setHasIssues(true)
          setError({
            message: `Supabase客户端调用失败: ${apiError.message}`,
            details: apiError.stack
          })
        }
        
        // 总结诊断结果
        if (hasIssues) {
          addLog('--- 诊断完成 ---')
          addLog('检测到环境配置问题。请检查上述错误并修复。')
        } else {
          addLog('--- 诊断完成 ---')
          addLog('环境变量配置正常。Supabase连接工作正常。')
          setSuccess(true)
        }
        
      } catch (error: any) {
        console.error('环境变量检查失败:', error)
        addLog(`错误: 诊断过程失败 - ${error.message}`)
        setHasIssues(true)
        setError({
          message: `诊断过程失败: ${error.message}`,
          details: error.stack
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    runCheck()
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
              ) : success ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-700">连接成功</h3>
                  <p className="text-green-600">Supabase连接正常工作</p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-medium text-yellow-700">部分问题</h3>
                  <p className="text-yellow-600">诊断发现一些潜在问题，请查看下方日志</p>
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
            <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto">
              {testProgress.length > 0 ? (
                <ol className="list-decimal ml-5 space-y-1">
                  {testProgress.map((log, index) => (
                    <li key={index} className={`${log.includes('错误') ? 'text-red-600' : log.includes('警告') ? 'text-yellow-600' : 'text-gray-700'}`}>
                      {log}
                    </li>
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
            ) : serverData ? (
              <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg">
                <h3 className="font-medium mb-2">连接成功</h3>
                <p className="mb-2">成功连接到Supabase并获取数据</p>
                <pre className="bg-white p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(serverData, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg">
                <h3 className="font-medium mb-2">连接状态未知</h3>
                <p>未能完成连接测试</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              此调试页用于诊断部署问题。如有问题，请联系技术支持。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 