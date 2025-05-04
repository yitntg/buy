'use client'

import Link from 'next/link'

export default function AdminToolsPage() {
  const tools = [
    {
      id: 'env-debug',
      name: '环境变量调试',
      description: '检查和验证Supabase环境变量配置是否正确',
      path: '/admin/tools/env-debug',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'db-check',
      name: '数据库连接诊断',
      description: '测试与Supabase数据库的连接和验证数据表',
      path: '/admin/tools/db-check',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'setup',
      name: '数据库初始化工具',
      description: '创建数据库表和添加示例数据',
      path: '/admin/tools/setup',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'admin-setup',
      name: '管理员设置工具',
      description: '高级数据库配置和SQL执行工具',
      path: '/admin/setup',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-red-100 text-red-600'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">开发工具</h1>
        <p className="text-gray-600">
          以下是一些帮助开发和调试的工具，这些工具只应在开发或故障排除时使用。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <Link 
            key={tool.id}
            href={tool.path}
            className="block border rounded-lg hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <div className={`p-6 ${tool.color} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">{tool.name}</div>
                {tool.icon}
              </div>
            </div>
            <div className="p-6 bg-white rounded-b-lg">
              <p className="text-gray-600">{tool.description}</p>
              <div className="mt-4 text-right">
                <span className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium">
                  打开工具
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-yellow-800">⚠️ 注意</h2>
        <p className="text-yellow-700">
          这些开发工具可能直接修改数据库或系统配置。请在生产环境中谨慎使用这些工具，以免造成数据丢失或系统不稳定。
        </p>
      </div>
    </div>
  )
} 