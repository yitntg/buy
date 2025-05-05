'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminSettings() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [statusMessage, setStatusMessage] = useState<{success?: boolean; message?: string}>({})
  const [systemSettings, setSystemSettings] = useState({
    siteName: '电子商务系统',
    contactEmail: 'admin@example.com',
    currency: 'CNY',
    itemsPerPage: 10,
    allowGuestCheckout: true,
    enableReviews: true
  })
  
  // 检查用户是否已登录并且是管理员
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin/settings')
    } else if (user?.role !== 'admin') {
      router.push('/') // 如果不是管理员，重定向到首页
    } else {
      // 获取系统设置（实际应用中从API获取）
      loadSystemSettings()
    }
  }, [isAuthenticated, user, router])
  
  // 加载系统设置
  const loadSystemSettings = async () => {
    // 在实际应用中，这里应该从API获取设置
    // 现在使用模拟数据
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      // 模拟从API获取设置
      setSystemSettings({
        siteName: '电子商务系统',
        contactEmail: 'admin@example.com',
        currency: 'CNY',
        itemsPerPage: 10,
        allowGuestCheckout: true,
        enableReviews: true
      })
    } catch (error) {
      console.error('加载系统设置失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 保存系统设置
  const saveSystemSettings = async () => {
    setLoading(true)
    setStatusMessage({})
    
    try {
      // 在实际应用中，这里应该调用API保存设置
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setStatusMessage({
        success: true,
        message: '系统设置保存成功！'
      })
    } catch (error: any) {
      console.error('保存系统设置失败:', error)
      setStatusMessage({
        success: false,
        message: error.message || '保存系统设置失败'
      })
    } finally {
      setLoading(false)
    }
  }
  
  // 初始化系统
  const handleInitializeSystem = async () => {
    if (!confirm('确定要初始化系统吗？这将重置部分系统配置。')) {
      return
    }
    
    setLoading(true)
    setStatusMessage({})
    
    try {
      // 跳转到开发工具中的数据库初始化工具
      router.push('/admin/tools/setup')
    } catch (error: any) {
      console.error('初始化系统失败:', error)
      setStatusMessage({
        success: false,
        message: error.message || '初始化系统失败'
      })
    } finally {
      setLoading(false)
    }
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null // 未授权时返回空
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">系统设置</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* 选项卡切换 */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'general' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              基本设置
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'payment' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              支付设置
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'notifications' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              通知设置
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'advanced' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              高级设置
            </button>
          </div>
        </div>

        {/* 状态消息 */}
        {statusMessage.message && (
          <div className={`mb-6 p-4 rounded ${statusMessage.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {statusMessage.message}
          </div>
        )}

        {/* 基本设置 */}
        {activeTab === 'general' && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">基本设置</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                    网站名称
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    联系邮箱
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={systemSettings.contactEmail}
                    onChange={(e) => setSystemSettings({...systemSettings, contactEmail: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    货币单位
                  </label>
                  <select
                    id="currency"
                    value={systemSettings.currency}
                    onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="CNY">人民币 (CNY)</option>
                    <option value="USD">美元 (USD)</option>
                    <option value="EUR">欧元 (EUR)</option>
                    <option value="GBP">英镑 (GBP)</option>
                    <option value="JPY">日元 (JPY)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
                    每页显示商品数
                  </label>
                  <input
                    type="number"
                    id="itemsPerPage"
                    value={systemSettings.itemsPerPage}
                    onChange={(e) => setSystemSettings({...systemSettings, itemsPerPage: parseInt(e.target.value)})}
                    min="5"
                    max="100"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowGuestCheckout"
                    checked={systemSettings.allowGuestCheckout}
                    onChange={(e) => setSystemSettings({...systemSettings, allowGuestCheckout: e.target.checked})}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="allowGuestCheckout" className="ml-2 block text-sm text-gray-700">
                    允许游客结账
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableReviews"
                    checked={systemSettings.enableReviews}
                    onChange={(e) => setSystemSettings({...systemSettings, enableReviews: e.target.checked})}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="enableReviews" className="ml-2 block text-sm text-gray-700">
                    启用商品评论功能
                  </label>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={saveSystemSettings}
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {loading ? '保存中...' : '保存设置'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 支付设置 */}
        {activeTab === 'payment' && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">支付设置</h2>
              
              <div className="space-y-6">
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">支付宝设置</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        应用ID (APPID)
                      </label>
                      <input
                        type="text"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="例如：2021000000000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        商户私钥
                      </label>
                      <textarea
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        rows={3}
                        placeholder="以MII开头的私钥内容"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        支付宝公钥
                      </label>
                      <textarea
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        rows={3}
                        placeholder="以MII开头的公钥内容"
                      ></textarea>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableAlipay"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="enableAlipay" className="ml-2 block text-sm text-gray-700">
                        启用支付宝支付
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">微信支付设置</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        商户号 (Mch ID)
                      </label>
                      <input
                        type="text"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="例如：1900000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API密钥
                      </label>
                      <input
                        type="password"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AppID
                      </label>
                      <input
                        type="text"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="例如：wx8888888888888888"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableWechatPay"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="enableWechatPay" className="ml-2 block text-sm text-gray-700">
                        启用微信支付
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={saveSystemSettings}
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {loading ? '保存中...' : '保存支付设置'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 通知设置 */}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">通知设置</h2>
              
              <div className="space-y-6">
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">邮件通知</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP服务器
                      </label>
                      <input
                        type="text"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="例如：smtp.example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP端口
                      </label>
                      <input
                        type="number"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="例如：587"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱账号
                      </label>
                      <input
                        type="email"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="例如：notification@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱密码
                      </label>
                      <input
                        type="password"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableEmailNotifications"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="enableEmailNotifications" className="ml-2 block text-sm text-gray-700">
                        启用邮件通知
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">通知事件</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifyNewOrder"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="notifyNewOrder" className="ml-2 block text-sm text-gray-700">
                        新订单通知
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifyLowStock"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="notifyLowStock" className="ml-2 block text-sm text-gray-700">
                        库存不足通知
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifyNewReview"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="notifyNewReview" className="ml-2 block text-sm text-gray-700">
                        新评论通知
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifyNewUser"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="notifyNewUser" className="ml-2 block text-sm text-gray-700">
                        新用户注册通知
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={saveSystemSettings}
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {loading ? '保存中...' : '保存通知设置'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 高级设置 */}
        {activeTab === 'advanced' && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">高级设置</h2>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        注意：以下设置可能会影响系统运行。除非您明确了解这些设置的作用，否则请谨慎修改。
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    缓存时间 (秒)
                  </label>
                  <input
                    type="number"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="3600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    上传文件大小限制 (MB)
                  </label>
                  <input
                    type="number"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    会话超时时间 (分钟)
                  </label>
                  <input
                    type="number"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    日志级别
                  </label>
                  <select
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="info"
                  >
                    <option value="debug">Debug (调试)</option>
                    <option value="info">Info (信息)</option>
                    <option value="warn">Warn (警告)</option>
                    <option value="error">Error (错误)</option>
                  </select>
                </div>
                
                <div className="pt-6">
                  <h3 className="text-lg font-medium mb-3">系统维护</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                        启用维护模式（所有非管理员访问将看到维护页面）
                      </label>
                    </div>
                    
                    <div className="space-x-4">
                      <Link 
                        href="/admin/tools"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        开发工具
                      </Link>
                      
                      <button
                        onClick={handleInitializeSystem}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        初始化系统
                      </button>
                      
                      <button
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        清理缓存
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={saveSystemSettings}
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {loading ? '保存中...' : '保存高级设置'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 