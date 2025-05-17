'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到控制台
    console.error('页面发生错误:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          页面加载失败
        </h1>
        <div className="mb-4 text-gray-700">
          <p className="mb-3">
            抱歉，页面加载过程中发生错误。这可能是由于以下原因：
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>数据获取失败</li>
            <li>页面组件错误</li>
            <li>服务器暂时不可用</li>
          </ul>
        </div>
        
        <div className="mb-6 p-3 bg-gray-100 rounded text-sm text-gray-800">
          <p className="font-semibold">错误信息：</p>
          <p className="overflow-auto">{error.message || '未知错误'}</p>
          {error.digest && (
            <p className="text-xs text-gray-500 mt-1">ID: {error.digest}</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-center"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 