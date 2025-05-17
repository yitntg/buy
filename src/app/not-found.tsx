import Link from 'next/link'

// 符合Next.js约定的全局404页面
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">页面不存在</h2>
        <p className="text-gray-600 mb-8">
          您请求的页面不存在或已被移除。
        </p>
        <Link 
          href="/"
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors inline-block"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
} 