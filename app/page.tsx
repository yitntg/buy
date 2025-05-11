export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">乐购商城</h1>
      <p className="text-xl mb-8">网站维护中，请稍后再试</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        <a href="/static-page" className="border border-blue-500 rounded-lg p-4 hover:bg-blue-50 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">维护页面</h2>
          <p className="text-gray-600">查看详细的维护信息和服务状态</p>
        </a>
        
        <a href="/deployment-info" className="border border-green-500 rounded-lg p-4 hover:bg-green-50 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-green-700">部署信息</h2>
          <p className="text-gray-600">检查服务器状态和环境配置</p>
        </a>
      </div>
    </div>
  )
} 