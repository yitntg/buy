'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'
  const { signIn, isAuthenticated, error, status } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({})
  const [isMounted, setIsMounted] = useState(false)
  
  // 组件挂载标记，防止服务端渲染不匹配
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // 如果已登录，重定向到指定页面
  useEffect(() => {
    if (!isMounted) return; // 防止服务端执行
    
    console.log('登录状态检查:', { isAuthenticated, status, redirect })
    if (isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, router, redirect, isMounted])
  
  // 显示从URL中传递的错误信息
  useEffect(() => {
    if (!isMounted) return; // 防止服务端执行
    
    const reason = searchParams.get('reason')
    if (reason === 'invalid_token') {
      setErrorMessage('您的登录已过期，请重新登录')
    } else if (reason === 'session_expired') {
      setErrorMessage('会话已过期，请重新登录')
    }
  }, [searchParams, isMounted])
  
  // 处理表单字段变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // 清除之前的错误
    setErrorMessage('')
    setIsLoading(true)
    setDebugInfo({})
    
    console.log('开始登录流程:', { email: formData.email, rememberMe: formData.rememberMe })
    
    try {
      await signIn(formData.email, formData.password, formData.rememberMe)
      console.log('登录成功，等待重定向...')
      // 登录成功将在useEffect中处理重定向
    } catch (err: any) {
      // 记录错误详情
      console.error('登录失败详情:', err)
      const errorDetails = {
        message: err.message || '未知错误',
        code: err.code || 'UNKNOWN',
        status: err.status || null,
        name: err.name || typeof err
      }
      setDebugInfo(prev => ({ ...prev, error: errorDetails }))
      
      // 显示错误消息
      setErrorMessage(err.message || error || '登录失败，请检查账号密码')
    } finally {
      setIsLoading(false)
    }
  }
  
  // 如果组件尚未挂载，显示简单的加载界面，防止水合不匹配
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="py-6 px-8">
              <h2 className="text-2xl font-bold mb-6 text-center">登录账户</h2>
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-6 px-8">
            <h2 className="text-2xl font-bold mb-6 text-center">登录账户</h2>
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="password" className="block text-gray-700">
                    密码
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary">
                    忘记密码?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入密码"
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  记住我
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
                disabled={isLoading || status === 'loading'}
              >
                {isLoading || status === 'loading' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在登录...
                  </>
                ) : '登录'}
              </button>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              还没有账户? {' '}
              <Link href="/auth/register" className="text-primary font-medium">
                立即注册
              </Link>
            </p>
            
            {Object.keys(debugInfo).length > 0 && (
              <div className="mt-6 p-3 bg-gray-100 rounded-md text-xs text-gray-600">
                <details>
                  <summary className="cursor-pointer">调试信息</summary>
                  <pre className="mt-2 overflow-auto max-h-40">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 