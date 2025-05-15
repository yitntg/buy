'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
// Header import removed
// Footer import removed

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('请输入电子邮箱')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 成功后显示提示信息
      setSubmitSuccess(true)
    } catch (err) {
      setError('发送重置邮件失败，请稍后重试')
      console.error('忘记密码请求失败:', err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-6">找回密码</h1>
            
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-6xl text-green-500 mb-4">✓</div>
                <h2 className="text-xl font-medium mb-4">重置密码邮件已发送！</h2>
                <p className="text-gray-600 mb-8">
                  我们已向您的邮箱发送了一封密码重置邮件，请查收并按照邮件中的说明操作。
                </p>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 inline-block"
                  >
                    重新发送
                  </button>
                  <Link href="/auth/login" className="text-primary hover:underline">
                    返回登录
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6 text-center">
                  请输入您注册时使用的电子邮箱，我们将向您发送密码重置链接。
                </p>
                
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      电子邮箱
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          发送中...
                        </>
                      ) : '发送重置链接'}
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <Link href="/auth/login" className="text-primary text-sm hover:underline">
                      返回登录
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
  )
} 