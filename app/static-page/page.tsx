'use client'

import React from 'react'
import Link from 'next/link'

export default function StaticPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">乐购商城维护页面</h1>
          <p className="text-xl text-gray-600">我们的服务目前正在维护中</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">系统状态</h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              我们的系统正在进行维护和优化，以提供更好的购物体验。
            </p>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span className="text-yellow-700">部分服务暂时不可用</span>
            </div>
            <p className="text-gray-600 text-sm">
              预计恢复时间: 尽快
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="text-xl font-medium mb-3 text-gray-800">临时可用功能</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>产品浏览</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>分类查看</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>用户登录</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>购物车功能</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="text-xl font-medium mb-3 text-gray-800">诊断工具</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Link href="/api/debug" className="text-blue-600 hover:underline">API状态检查</Link>
              </li>
              <li className="flex items-start">
                <Link href="/env-debug" className="text-blue-600 hover:underline">环境变量诊断</Link>
              </li>
              <li className="flex items-start">
                <Link href="/db-check" className="text-blue-600 hover:underline">数据库连接测试</Link>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600">服务器时间: {new Date().toLocaleString()}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            感谢您的耐心等待。如有紧急事项，请联系我们的客服团队。
          </p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 