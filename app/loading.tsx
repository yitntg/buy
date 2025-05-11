export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">页面加载中</h2>
        <p className="text-gray-500 mt-2">请稍候...</p>
      </div>
    </div>
  )
} 