'use client'

import { useEffect, useState } from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('全局错误捕获:', error)
      setHasError(true)
      setError(error.error)
    }

    // 添加全局错误监听
    window.addEventListener('error', handleError)
    
    // 添加未捕获的Promise错误监听
    window.addEventListener('unhandledrejection', (event) => {
      console.error('未处理的Promise错误:', event.reason)
      setHasError(true)
      setError(new Error(event.reason?.message || '未知异步错误'))
    })

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleError as any)
    }
  }, [])

  // 重置错误状态
  const resetError = () => {
    setHasError(false)
    setError(null)
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="text-6xl mb-4 text-red-500">😞</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">页面出错了</h1>
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
              <p className="text-sm text-red-700 break-words">
                {error?.message || '发生了未知错误'}
              </p>
            </div>
            <button
              onClick={resetError}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              重试
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="ml-4 bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 