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
  
  // 如果已登录，重定向到指定页面
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, router, redirect])
  
  // 显示从URL中传递的错误信息
  useEffect(() => {
    const reason = searchParams.get('reason')
    if (reason === 'invalid_token') {
      setErrorMessage('您的登录已过期，请重新登录')
    } else if (reason === 'session_expired') {
      setErrorMessage('会话已过期，请重新登录')
    }
  }, [searchParams])
  
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
    
    try {
      await signIn(formData.email, formData.password, formData.rememberMe)
      // 登录成功将在useEffect中处理重定向
    } catch (err: any) {
      // 显示错误消息
      setErrorMessage(err.message || error || '登录失败，请检查账号密码')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
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
              
              <div className="mt-6">
                <p className="text-center text-sm text-gray-500 mb-3">或使用第三方账号登录</p>
                <div className="flex justify-center space-x-4">
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.84 9.49.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.39.2 2.42.1 2.67.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48C19.14 20.16 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.35 11.3c-.24 1.14-.87 2.15-1.67 2.91-.79.76-1.78 1.28-2.8 1.5-1.01.22-2.08.13-3.04-.24-.96-.37-1.82-1.01-2.47-1.84-.65-.83-1.07-1.84-1.21-2.89-.14-1.06.01-2.14.44-3.11.43-.96 1.13-1.81 1.98-2.43.86-.62 1.88-1 2.92-1.08 1.32-.1 2.64.29 3.71 1.1a5.8 5.8 0 12.1 2.99c.11.34.17.69.17 1.04h-6.38c.08 1.09.63 2.13 1.53 2.72.6.39 1.31.56 2 .46.68-.1 1.31-.44 1.79-.93.38-.39.69-.86.89-1.37h-2.43c-.11.11-.25.2-.41.3-.37.22-.81.33-1.25.33-.58 0-1.14-.19-1.59-.53-.45-.35-.76-.84-.89-1.39h5.81c.05-.28.08-.56.08-.85-.01-.14-.01-.28-.03-.42z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  )
} 