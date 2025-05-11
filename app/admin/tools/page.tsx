'use client'

// 移除对配置文件的导入，统一从layout继承配置
// import '../revalidate-config.js';

import { useState } from 'react'
import Link from 'next/link'

export default function AdminToolsPage() {
  const tools = [
    {
      id: 'env-debug',
      name: '环境变量调试',
      description: '检查和验证Supabase环境变量配置是否正确，确保系统能够正常连接数据库',
      path: '/admin/tools/env-debug',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'sql-executor',
      name: 'SQL执行器',
      description: '直接执行SQL语句并查看结果，用于高级数据操作和调试',
      path: '/admin/tools/sql-executor',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'db-check',
      name: '数据库连接诊断',
      description: '测试与Supabase数据库的连接和验证数据表结构是否正确',
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
      description: '创建数据库表结构和添加示例数据，用于系统初始设置',
      path: '/admin/tools/setup',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'function-manager',
      name: 'SQL函数管理',
      description: '创建和管理数据库函数，如exec_sql和query_sql等高级功能',
      path: '/admin/tools/function-manager',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'data-backup',
      name: '数据备份工具',
      description: '导出和导入数据，用于系统迁移和数据备份',
      path: '/admin/tools/data-backup',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      ),
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'system-logs',
      name: '系统日志查看器',
      description: '查看系统操作日志，用于问题排查和性能监控',
      path: '/admin/tools/system-logs',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-gray-100 text-gray-600'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">开发工具</h1>
        <p className="text-gray-600">
          以下是一些帮助开发和调试的技术工具，这些工具只应在开发或故障排除时使用，不建议在生产环境中操作。
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-yellow-800">开发人员指南</h2>
        <p className="text-yellow-700 mb-4">
          这些工具专为技术人员设计，提供对系统底层的直接操作能力。如果您不是开发人员或数据库管理员，建议在操作前咨询技术支持。
        </p>
        <p className="text-yellow-700">
          一般管理任务（如商品管理、订单处理等）请使用<Link href="/admin" className="text-blue-600 hover:underline">管理后台</Link>的相应功能。
          系统配置请使用<Link href="/admin/settings" className="text-blue-600 hover:underline">系统设置</Link>页面。
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

      <div className="mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-red-800">⚠️ 安全警告</h2>
        <p className="text-red-700">
          这些开发工具可能直接修改数据库或系统配置。在生产环境中使用这些工具可能会导致数据丢失或系统不稳定。
          请确保在操作前进行数据备份，并理解所有操作的潜在风险。
        </p>
      </div>
    </div>
  )
} 