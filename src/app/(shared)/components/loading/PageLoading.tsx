'use client'

export default function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700 mb-2">页面加载中</h2>
        <p className="text-gray-500">请稍候...</p>
      </div>
    </div>
  )
} 