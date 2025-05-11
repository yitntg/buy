'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DeploymentInfoPage() {
  const [isClient, setIsClient] = useState(false)
  const [serverTime, setServerTime] = useState(new Date().toISOString())
  
  // 只在客户端更新状态
  useEffect(() => {
    setIsClient(true)
    
    // 更新服务器时间
    const timer = setInterval(() => {
      setServerTime(new Date().toISOString())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // 获取环境变量信息（只包括安全可展示的信息）
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercelRegion: process.env.VERCEL_REGION,
    vercelUrl: process.env.VERCEL_URL,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold mb-4">Vercel 部署信息</h1>
            <p className="text-gray-600 mb-8">
              此页面显示当前Vercel部署的基本信息，帮助排查部署问题
            </p>
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <h2 className="font-semibold text-lg mb-2 text-blue-800">部署环境</h2>
                <ul className="space-y-2">
                  <li><span className="font-medium">渲染方式:</span> {isClient ? '客户端' : '服务端'}</li>
                  <li><span className="font-medium">Node环境:</span> {envInfo.nodeEnv || '未知'}</li>
                  <li><span className="font-medium">Vercel环境:</span> {envInfo.vercelEnv || '未知'}</li>
                  <li><span className="font-medium">Vercel地区:</span> {envInfo.vercelRegion || '未知'}</li>
                  <li><span className="font-medium">部署URL:</span> {envInfo.vercelUrl || '未知'}</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h2 className="font-semibold text-lg mb-2 text-green-800">服务状态</h2>
                <ul className="space-y-2">
                  <li><span className="font-medium">客户端时间:</span> {new Date().toLocaleString()}</li>
                  <li><span className="font-medium">服务器时间:</span> {new Date(serverTime).toLocaleString()}</li>
                  <li>
                    <span className="font-medium">Supabase URL:</span> 
                    {envInfo.hasSupabaseUrl ? 
                      <span className="text-green-600 ml-1">已配置</span> : 
                      <span className="text-red-600 ml-1">未配置</span>
                    }
                  </li>
                  <li>
                    <span className="font-medium">Supabase Key:</span> 
                    {envInfo.hasSupabaseKey ? 
                      <span className="text-green-600 ml-1">已配置</span> : 
                      <span className="text-red-600 ml-1">未配置</span>
                    }
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h2 className="font-semibold text-lg mb-2">渲染测试</h2>
              <p className="text-sm text-gray-600 mb-4">
                下面的内容显示静态内容是否正确渲染，这可以帮助判断网站问题的来源。
              </p>
              <div className="grid grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                    <p className="text-xl">{i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 mb-8">
              <h2 className="font-semibold text-lg mb-2 text-yellow-800">可能的问题</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Supabase环境变量配置错误</li>
                <li>服务器响应超时</li>
                <li>Prisma数据库连接问题</li>
                <li>Vercel区域与Supabase之间的网络延迟</li>
                <li>服务端渲染方式错误</li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <Link 
                href="/"
                className="text-blue-600 hover:underline"
              >
                返回首页
              </Link>
              <Link 
                href="/env-debug"
                className="text-blue-600 hover:underline"
              >
                查看环境变量调试
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 