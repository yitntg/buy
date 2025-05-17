'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/src/app/(shared)/contexts/AuthContext'
import { MFAType } from '@/src/app/(shared)/types/auth'

export default function MFAVerificationPage() {
  const { user } = useAuth()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mfaType, setMfaType] = useState<MFAType>(MFAType.APP)
  const [countdown, setCountdown] = useState(0)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'
  
  useEffect(() => {
    // 如果用户未登录，重定向到登录页面
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`)
      return
    }
    
    // 如果用户MFA配置存在，获取首选方式
    if (user.mfa?.preferredMethod) {
      setMfaType(user.mfa.preferredMethod)
    }
  }, [user, router, redirect])
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code) {
      setError('请输入验证码')
      return
    }
    
    if (code.length < 6) {
      setError('验证码长度不足')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/shared/auth/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          type: mfaType,
          userId: user?.id
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '验证失败')
      }
      
      // 验证成功，重定向到目标页面
      router.push(redirect)
    } catch (err: any) {
      console.error('验证失败:', err)
      setError(err.message || '验证失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  const handleResendCode = async () => {
    if (mfaType === MFAType.APP) {
      // APP验证不需要重发
      return
    }
    
    try {
      setLoading(true)
      
      const response = await fetch('/api/shared/auth/mfa/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: mfaType,
          userId: user?.id
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '发送验证码失败')
      }
      
      // 设置倒计时（60秒）
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
    } catch (err: any) {
      console.error('发送验证码失败:', err)
      setError(err.message || '发送验证码失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-6 px-8">
            <h2 className="text-2xl font-bold mb-6 text-center">双重验证</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <p className="text-gray-600 text-center">
                {mfaType === MFAType.APP 
                  ? '请输入您的认证应用程序中显示的验证码'
                  : mfaType === MFAType.SMS
                    ? '请输入发送到您手机的验证码'
                    : '请输入发送到您邮箱的验证码'
                }
              </p>
            </div>
            
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-gray-700 mb-1">
                  验证码
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入6位验证码"
                  maxLength={6}
                  autoComplete="one-time-code"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    验证中...
                  </>
                ) : '验证'}
              </button>
            </form>
            
            {(mfaType === MFAType.SMS || mfaType === MFAType.EMAIL) && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleResendCode}
                  className="text-primary hover:text-blue-700 text-sm"
                  disabled={countdown > 0 || loading}
                >
                  {countdown > 0 ? `重新发送 (${countdown}秒)` : '重新发送验证码'}
                </button>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center">
                如果您无法访问您的验证设备，请联系管理员重置您的账户验证设置。
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
