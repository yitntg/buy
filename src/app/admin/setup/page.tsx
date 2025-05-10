'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 重定向组件
export default function RedirectToToolsSetup() {
  const router = useRouter()
  
  useEffect(() => {
    // 重定向到新的数据库初始化工具页面
    router.push('/admin/tools/setup')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">页面已移动</h1>
        <p className="text-gray-600 mb-4">此页面已重新整合到开发工具模块中</p>
        <p>正在重定向，请稍候...</p>
      </div>
    </div>
  )
} 