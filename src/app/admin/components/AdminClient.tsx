'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/(shared)/contexts/AuthContext'

export default function AdminClient() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'admin') {
        router.push('/')
      } else {
        setIsAdmin(true)
      }
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            欢迎使用管理后台
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>在这里您可以管理商品、订单和用户。</p>
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <div className="flex-1 min-w-0">
                  <a href="/admin/products" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">商品管理</p>
                    <p className="text-sm text-gray-500">管理商品信息、库存和分类</p>
                  </a>
                </div>
              </div>
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <div className="flex-1 min-w-0">
                  <a href="/admin/orders" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">订单管理</p>
                    <p className="text-sm text-gray-500">查看和处理订单</p>
                  </a>
                </div>
              </div>
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <div className="flex-1 min-w-0">
                  <a href="/admin/users" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">用户管理</p>
                    <p className="text-sm text-gray-500">管理用户账户和权限</p>
                  </a>
                </div>
              </div>
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <div className="flex-1 min-w-0">
                  <a href="/admin/settings" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">系统设置</p>
                    <p className="text-sm text-gray-500">配置系统参数和选项</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 