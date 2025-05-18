'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { MFAType, MFAStatus } from '@/types/auth'
import Image from 'next/image'

export default function MFASetupPage() {
  const { user, setupMFA, verifyMFA, disableMFA, isMFAEnabled, getMFAStatus } = useAuth()
  const [activeTab, setActiveTab] = useState<MFAType>(MFAType.APP)
  const [setupStep, setSetupStep] = useState(1)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // 获取用户MFA状态
  const mfaStatus = getMFAStatus()
  const enabled = isMFAEnabled()
  
  // 清理消息显示
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [error, success])
  
  // 初始化设置
  const handleInitSetup = async (type: MFAType) => {
    setActiveTab(type)
    setSetupStep(1)
    setError(null)
    setSuccess(null)
    setQrCode(null)
    setSecret(null)
    setVerificationCode('')
    
    try {
      setLoading(true)
      const result = await setupMFA(type)
      
      if (type === MFAType.APP && result.qrCode && result.secret) {
        setQrCode(result.qrCode)
        setSecret(result.secret)
        setSetupStep(2)
      } else if (type === MFAType.SMS || type === MFAType.EMAIL) {
        setSuccess(`验证码已发送到您的${type === MFAType.SMS ? '手机' : '邮箱'}`)
        setSetupStep(2)
      }
    } catch (err: any) {
      console.error('设置MFA失败:', err)
      setError(err.message || '设置失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 验证MFA
  const handleVerify = async () => {
    if (!verificationCode) {
      setError('请输入验证码')
      return
    }
    
    try {
      setLoading(true)
      const result = await verifyMFA(verificationCode, activeTab)
      
      if (result) {
        setSuccess(`${activeTab === MFAType.APP ? '认证应用' : activeTab === MFAType.SMS ? '短信验证' : '邮箱验证'}设置成功！`)
        setSetupStep(3)
      } else {
        setError('验证码无效，请重试')
      }
    } catch (err: any) {
      console.error('验证失败:', err)
      setError(err.message || '验证失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 禁用MFA
  const handleDisable = async (type: MFAType) => {
    if (!confirm(`确定要禁用${type === MFAType.APP ? '认证应用' : type === MFAType.SMS ? '短信验证' : '邮箱验证'}吗？`)) {
      return
    }
    
    try {
      setLoading(true)
      await disableMFA(type)
      setSuccess(`${type === MFAType.APP ? '认证应用' : type === MFAType.SMS ? '短信验证' : '邮箱验证'}已禁用`)
      
      // 重置状态
      setSetupStep(1)
      setQrCode(null)
      setSecret(null)
    } catch (err: any) {
      console.error('禁用MFA失败:', err)
      setError(err.message || '禁用失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">双重认证</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <p className="text-gray-700">
            双重认证为您的账户增加了额外的安全层，除了密码外，还需要使用第二种验证方式登录。
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
            <span>状态: {enabled ? '已启用' : '未启用'}</span>
          </div>
        </div>
      </div>
      
      {/* 选项卡 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab(MFAType.APP)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === MFAType.APP
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              认证应用
            </button>
            <button
              onClick={() => setActiveTab(MFAType.SMS)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === MFAType.SMS
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              短信验证
            </button>
            <button
              onClick={() => setActiveTab(MFAType.EMAIL)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === MFAType.EMAIL
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              邮箱验证
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          {/* 认证应用设置 */}
          {activeTab === MFAType.APP && (
            <div>
              {/* 检查用户是否已启用此方法 */}
              {user?.mfa?.methods?.[MFAType.APP]?.enabled ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">认证应用已启用</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    您已成功设置认证应用作为双重验证方式。
                  </p>
                  <button
                    onClick={() => handleDisable(MFAType.APP)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={loading}
                  >
                    禁用认证应用
                  </button>
                </div>
              ) : (
                <>
                  {setupStep === 1 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">使用认证应用</h3>
                      <p className="text-gray-600 mb-4">
                        认证应用（如Google Authenticator、Microsoft Authenticator或Authy）会生成临时验证码，用于登录时的额外验证。
                      </p>
                      <button
                        onClick={() => handleInitSetup(MFAType.APP)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={loading}
                      >
                        {loading ? '加载中...' : '设置认证应用'}
                      </button>
                    </div>
                  )}
                  
                  {setupStep === 2 && qrCode && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">扫描二维码</h3>
                      <p className="text-gray-600 mb-4">
                        使用您的认证应用扫描以下二维码，或手动输入密钥。
                      </p>
                      
                      <div className="mb-4 flex justify-center">
                        <div className="border border-gray-300 p-2 rounded-md inline-block">
                          <img src={qrCode} alt="QR Code" width={200} height={200} />
                        </div>
                      </div>
                      
                      {secret && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">手动输入密钥:</p>
                          <div className="flex items-center justify-center">
                            <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono break-all">
                              {secret}
                            </code>
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label htmlFor="code" className="block text-gray-700 mb-1">
                          输入认证应用中显示的验证码
                        </label>
                        <input
                          type="text"
                          id="code"
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="6位验证码"
                          maxLength={6}
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSetupStep(1)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          disabled={loading}
                        >
                          返回
                        </button>
                        <button
                          onClick={handleVerify}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={loading}
                        >
                          {loading ? '验证中...' : '验证'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {setupStep === 3 && (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium">设置成功</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        您的认证应用已成功设置为双重验证方式。下次登录时，系统将要求您输入应用中的验证码。
                      </p>
                      <button
                        onClick={() => setSetupStep(1)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        完成
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* 短信验证设置 */}
          {activeTab === MFAType.SMS && (
            <div>
              {user?.mfa?.methods?.[MFAType.SMS]?.enabled ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">短信验证已启用</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    登录时，系统将向您的手机号发送验证码。
                  </p>
                  <button
                    onClick={() => handleDisable(MFAType.SMS)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={loading}
                  >
                    禁用短信验证
                  </button>
                </div>
              ) : (
                <>
                  {setupStep === 1 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">使用短信验证</h3>
                      <p className="text-gray-600 mb-4">
                        登录时，系统将向您的手机号发送一个一次性验证码。
                      </p>
                      {!user?.phone ? (
                        <div className="bg-yellow-100 p-3 rounded-md text-yellow-700 mb-4">
                          您需要先在个人资料中设置手机号才能使用短信验证。
                        </div>
                      ) : (
                        <button
                          onClick={() => handleInitSetup(MFAType.SMS)}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={loading}
                        >
                          {loading ? '发送验证码...' : '设置短信验证'}
                        </button>
                      )}
                    </div>
                  )}
                  
                  {setupStep === 2 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">验证短信验证码</h3>
                      <p className="text-gray-600 mb-4">
                        已向您的手机号发送验证码，请输入以完成设置。
                      </p>
                      
                      <div className="mb-4">
                        <label htmlFor="smsCode" className="block text-gray-700 mb-1">
                          验证码
                        </label>
                        <input
                          type="text"
                          id="smsCode"
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="6位验证码"
                          maxLength={6}
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSetupStep(1)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          disabled={loading}
                        >
                          返回
                        </button>
                        <button
                          onClick={handleVerify}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={loading}
                        >
                          {loading ? '验证中...' : '验证'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {setupStep === 3 && (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium">设置成功</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        您的短信验证已成功设置为双重验证方式。下次登录时，系统将向您发送短信验证码。
                      </p>
                      <button
                        onClick={() => setSetupStep(1)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        完成
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* 邮箱验证设置 */}
          {activeTab === MFAType.EMAIL && (
            <div>
              {user?.mfa?.methods?.[MFAType.EMAIL]?.enabled ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">邮箱验证已启用</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    登录时，系统将向您的邮箱发送验证码。
                  </p>
                  <button
                    onClick={() => handleDisable(MFAType.EMAIL)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={loading}
                  >
                    禁用邮箱验证
                  </button>
                </div>
              ) : (
                <>
                  {setupStep === 1 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">使用邮箱验证</h3>
                      <p className="text-gray-600 mb-4">
                        登录时，系统将向您的邮箱 ({user?.email}) 发送一个一次性验证码。
                      </p>
                      <button
                        onClick={() => handleInitSetup(MFAType.EMAIL)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={loading}
                      >
                        {loading ? '发送验证码...' : '设置邮箱验证'}
                      </button>
                    </div>
                  )}
                  
                  {setupStep === 2 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">验证邮箱验证码</h3>
                      <p className="text-gray-600 mb-4">
                        已向您的邮箱发送验证码，请输入以完成设置。
                      </p>
                      
                      <div className="mb-4">
                        <label htmlFor="emailCode" className="block text-gray-700 mb-1">
                          验证码
                        </label>
                        <input
                          type="text"
                          id="emailCode"
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="6位验证码"
                          maxLength={6}
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSetupStep(1)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          disabled={loading}
                        >
                          返回
                        </button>
                        <button
                          onClick={handleVerify}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={loading}
                        >
                          {loading ? '验证中...' : '验证'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {setupStep === 3 && (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium">设置成功</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        您的邮箱验证已成功设置为双重验证方式。下次登录时，系统将向您发送邮箱验证码。
                      </p>
                      <button
                        onClick={() => setSetupStep(1)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        完成
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 