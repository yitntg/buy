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
}

export default function EnvDebugPage() {
  const [serverData, setServerData] = useState<SupabaseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorWithMessage | null>(null)

  // 获取环境变量信息
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置(隐藏)' : '未设置',
    NODE_ENV: process.env.NODE_ENV || '未知'
  }

  // 测试Supabase连接
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        setIsLoading(true)
        // 尝试从Supabase获取一些数据
        const { data, error } = await supabase
          .from('products')
          .select('count')
          .single()

        if (error) {
          throw error
        }

        setServerData(data as SupabaseData)
      } catch (err) {
        console.error('Supabase连接测试失败:', err)
        setError({
          message: err instanceof Error ? err.message : '未知错误'
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
            <p className="text-gray-600">
              此页面用于测试环境变量配置和Supabase连接是否正常
            </p>
            <div className="mt-4">
              <Link href="/" className="text-primary hover:underline">
                ← 返回首页
              </Link>
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
                  确保在Vercel项目设置中添加了以下环境变量：
                </p>
                <ul className="list-disc list-inside mt-2 ml-4">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">步骤2: 使用dotenv-expand（可选）</h3>
                <p>
                  如果需要在环境变量中引用其他环境变量，可以使用dotenv-expand包：
                </p>
                <pre className="bg-white p-3 rounded text-sm mt-2">
                  {`// next.config.js
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand({ parsed: { ...process.env } });

// 剩余配置...`}
                </pre>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">步骤3: 创建并初始化数据库</h3>
                <p>
                  运行初始化脚本以创建必要的表结构：
                </p>
                <pre className="bg-white p-3 rounded text-sm mt-2">
                  {`npm run init-db`}
                </pre>
                <p className="mt-2 text-sm">
                  （确保先设置好环境变量再运行此命令）
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 