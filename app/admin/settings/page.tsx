'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import { ThemeSettingsPreview, SpecificSettingPreview } from '@/app/components/ThemeSettingsPreview'
import ThemePresetManager from '@/app/components/ThemePresetManager'

export default function AdminSettings() {
  const { user } = useAuth()
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
  const [formData, setFormData] = useState({
    // 基础设置
    siteName: '现代电商',
    siteDescription: '购买您喜欢的产品',
    contactEmail: 'support@example.com',
    phoneNumber: '400-123-4567',
    
    // 支付设置
    enableCashOnDelivery: true,
    enableCreditCard: true,
    enableAlipay: true,
    enableWechatPay: true,
    
    // 邮件设置
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'noreply@example.com',
    smtpPassword: '',
    emailFromName: '现代电商',
    
    // 布局设置
    carouselCount: '3',
    featuredCount: '4',
    productLayout: 'waterfall',
    productsPerPage: '12',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    stickyHeader: true,
    showCategoriesMenu: true,
    cardHoverShadow: true,
    cardHoverTransform: true,
    cardBorderRadius: '8',
    showHeroSection: true,
    showSearchBar: true,
    
    // 网格列数设置
    gridColumnsSm: '1',
    gridColumnsMd: '2',
    gridColumnsLg: '3',
    gridColumnsXl: '4',
    
    // 分类特定布局
    categorySpecificLayouts: false,
    
    // 颜色设置
    textColor: '#111827',
    backgroundColor: '#F9FAFB',
    themeMode: 'light',
    
    // 导航栏
    navbarStyle: 'default',
    
    // 卡片设置
    cardPadding: '16',
    cardTitleSize: '16',
    cardImageAspectRatio: '1:1',
    
    // 动画设置
    enableAnimations: true,
    pageTransitions: true,
    animationSpeed: 'normal',
    reducedMotion: false,
    
    // 其他设置
    imageLoadStrategy: 'lazy',
    textDirection: 'ltr'
  })
  const { theme, updateTheme } = useTheme()
  
  // 检查用户是否已登录并且是管理员
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/admin/settings')
    } else if (user.role !== 'admin') {
      router.push('/') // 如果不是管理员，重定向到首页
    } else {
      // 获取系统设置（实际应用中从API获取）
      loadSystemSettings()
    }
  }, [user, router])
  
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
  
  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }))
  }

  // 处理保存按钮点击
  const handleSave = async () => {
    setLoading(true)
    setStatusMessage({})
    
    try {
      // 模拟保存到API的请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 保存成功
      setStatusMessage({
        success: true,
        message: '设置保存成功！'
      })
    } catch (err) {
      console.error('保存设置失败:', err)
      setStatusMessage({
        success: false,
        message: '保存设置失败，请重试'
      })
    } finally {
      setLoading(false)
    }
  }
  
  // 处理布局设置的保存
  const handleLayoutSettingsSave = async () => {
    setLoading(true)
    setStatusMessage({})
    
    try {
      // 从表单数据中提取主题相关设置
      const themeSettings = {
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        textColor: formData.textColor,
        backgroundColor: formData.backgroundColor,
        productLayout: formData.productLayout as 'grid' | 'waterfall' | 'list',
        productsPerPage: parseInt(formData.productsPerPage),
        stickyHeader: formData.stickyHeader,
        showCategoriesMenu: formData.showCategoriesMenu,
        cardHoverShadow: formData.cardHoverShadow,
        cardHoverTransform: formData.cardHoverTransform,
        cardBorderRadius: parseInt(formData.cardBorderRadius),
        carouselCount: parseInt(formData.carouselCount),
        featuredCount: parseInt(formData.featuredCount),
        showHeroSection: formData.showHeroSection,
        showSearchBar: formData.showSearchBar,
        
        gridColumns: {
          sm: parseInt(formData.gridColumnsSm),
          md: parseInt(formData.gridColumnsMd),
          lg: parseInt(formData.gridColumnsLg),
          xl: parseInt(formData.gridColumnsXl),
        },
        
        categorySpecificLayouts: formData.categorySpecificLayouts,
        themeMode: formData.themeMode as 'light' | 'dark' | 'auto',
        navbarStyle: formData.navbarStyle as 'default' | 'compact' | 'extended',
        cardPadding: parseInt(formData.cardPadding),
        cardTitleSize: parseInt(formData.cardTitleSize),
        cardImageAspectRatio: formData.cardImageAspectRatio as '1:1' | '4:3' | '16:9' | 'auto',
        
        enableAnimations: formData.enableAnimations,
        pageTransitions: formData.pageTransitions,
        animationSpeed: formData.animationSpeed as 'slow' | 'normal' | 'fast',
        reducedMotion: formData.reducedMotion,
        
        imageLoadStrategy: formData.imageLoadStrategy as 'eager' | 'lazy',
        textDirection: formData.textDirection as 'ltr' | 'rtl'
      };
      
      // 更新主题
      updateTheme(themeSettings);
      
      // 保存成功消息
      setStatusMessage({
        success: true,
        message: '布局设置已保存并应用！'
      });
      
      // 也可以同时保存到服务器
      // await fetch('/api/theme-settings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(themeSettings)
      // });
    } catch (err) {
      console.error('保存布局设置失败:', err);
      setStatusMessage({
        success: false,
        message: '保存布局设置失败，请重试'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 初始化表单数据
  useEffect(() => {
    // 如果有主题数据，用它来初始化表单
    setFormData(prev => ({
      ...prev,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      textColor: theme.textColor,
      backgroundColor: theme.backgroundColor,
      productLayout: theme.productLayout,
      productsPerPage: theme.productsPerPage.toString(),
      stickyHeader: theme.stickyHeader,
      showCategoriesMenu: theme.showCategoriesMenu,
      cardHoverShadow: theme.cardHoverShadow,
      cardHoverTransform: theme.cardHoverTransform,
      cardBorderRadius: theme.cardBorderRadius.toString(),
      carouselCount: theme.carouselCount.toString(),
      featuredCount: theme.featuredCount.toString(),
      showHeroSection: theme.showHeroSection,
      showSearchBar: theme.showSearchBar,
      
      gridColumnsSm: theme.gridColumns.sm.toString(),
      gridColumnsMd: theme.gridColumns.md.toString(),
      gridColumnsLg: theme.gridColumns.lg.toString(),
      gridColumnsXl: theme.gridColumns.xl.toString(),
      
      categorySpecificLayouts: theme.categorySpecificLayouts,
      themeMode: theme.themeMode,
      navbarStyle: theme.navbarStyle,
      cardPadding: theme.cardPadding.toString(),
      cardTitleSize: theme.cardTitleSize.toString(),
      cardImageAspectRatio: theme.cardImageAspectRatio,
      
      enableAnimations: theme.enableAnimations,
      pageTransitions: theme.pageTransitions,
      animationSpeed: theme.animationSpeed,
      reducedMotion: theme.reducedMotion,
      
      imageLoadStrategy: theme.imageLoadStrategy,
      textDirection: theme.textDirection
    }));
  }, [theme]);
  
  if (!user || user.role !== 'admin') {
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6 border-b">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('general')}
                className={`pb-3 px-1 ${
                  activeTab === 'general'
                    ? 'text-primary border-b-2 border-primary font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                基本设置
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`pb-3 px-1 ${
                  activeTab === 'payment'
                    ? 'text-primary border-b-2 border-primary font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                支付设置
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`pb-3 px-1 ${
                  activeTab === 'email'
                    ? 'text-primary border-b-2 border-primary font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                邮件设置
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`pb-3 px-1 ${
                  activeTab === 'layout'
                    ? 'text-primary border-b-2 border-primary font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                布局设置
              </button>
            </div>
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

        {/* 邮件设置 */}
        {activeTab === 'email' && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">邮件设置</h2>
              
              <div className="space-y-6">
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">邮件设置</h3>
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
                
                <div className="pt-4">
                  <button
                    onClick={saveSystemSettings}
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {loading ? '保存中...' : '保存邮件设置'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 布局设置 */}
        {activeTab === 'layout' && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">布局设置</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧表单设置 */}
                <div className="space-y-6 lg:col-span-2">
                  {/* 首页布局 */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">首页布局</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          轮播图数量
                        </label>
                        <select
                          name="carouselCount"
                          value={formData.carouselCount || '3'}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          {[3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          特色商品数量
                        </label>
                        <select
                          name="featuredCount"
                          value={formData.featuredCount || '4'}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          {[4, 6, 8, 12].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="show-hero"
                          name="showHeroSection"
                          type="checkbox"
                          checked={formData.showHeroSection}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, showHeroSection: e.target.checked }))
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor="show-hero" className="ml-3 block text-sm font-medium text-gray-700">
                          显示首页大型横幅
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="show-search-bar"
                          name="showSearchBar"
                          type="checkbox"
                          checked={formData.showSearchBar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, showSearchBar: e.target.checked }))
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor="show-search-bar" className="ml-3 block text-sm font-medium text-gray-700">
                          显示搜索框
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* 商品列表布局 */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">商品列表布局</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          商品展示样式
                        </label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center">
                            <input
                              id="layout-grid"
                              name="productLayout"
                              type="radio"
                              value="grid"
                              checked={formData.productLayout === 'grid'}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="layout-grid" className="ml-3 block text-sm font-medium text-gray-700">
                              网格布局
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="layout-waterfall"
                              name="productLayout"
                              type="radio"
                              value="waterfall"
                              checked={formData.productLayout === 'waterfall'}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="layout-waterfall" className="ml-3 block text-sm font-medium text-gray-700">
                              瀑布流布局
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="layout-list"
                              name="productLayout"
                              type="radio"
                              value="list"
                              checked={formData.productLayout === 'list'}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="layout-list" className="ml-3 block text-sm font-medium text-gray-700">
                              列表布局
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          每页商品数量
                        </label>
                        <select
                          name="productsPerPage"
                          value={formData.productsPerPage || '12'}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          {[8, 12, 16, 20, 24, 32].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          列数设置 (网格布局)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">手机</label>
                            <select
                              name="gridColumnsSm"
                              value={formData.gridColumnsSm || '1'}
                              onChange={handleChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-xs"
                            >
                              {[1, 2].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">平板</label>
                            <select
                              name="gridColumnsMd"
                              value={formData.gridColumnsMd || '2'}
                              onChange={handleChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-xs"
                            >
                              {[1, 2, 3].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">桌面</label>
                            <select
                              name="gridColumnsLg"
                              value={formData.gridColumnsLg || '3'}
                              onChange={handleChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-xs"
                            >
                              {[2, 3, 4].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">大屏</label>
                            <select
                              name="gridColumnsXl"
                              value={formData.gridColumnsXl || '4'}
                              onChange={handleChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-xs"
                            >
                              {[3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="category-specific-layouts"
                          name="categorySpecificLayouts"
                          type="checkbox"
                          checked={formData.categorySpecificLayouts}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, categorySpecificLayouts: e.target.checked }))
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor="category-specific-layouts" className="ml-3 block text-sm font-medium text-gray-700">
                          启用分类特定布局 <span className="text-xs text-gray-500">(每个分类可设置不同布局)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* 主题颜色 */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">主题颜色</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          主色调
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            name="primaryColor"
                            value={formData.primaryColor || '#3B82F6'}
                            onChange={handleChange}
                            className="h-8 w-10 border-0 p-0"
                          />
                          <input
                            type="text"
                            name="primaryColorText"
                            value={formData.primaryColor || '#3B82F6'}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, primaryColor: e.target.value }));
                            }}
                            className="w-28 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          辅助色调
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            name="secondaryColor"
                            value={formData.secondaryColor || '#10B981'}
                            onChange={handleChange}
                            className="h-8 w-10 border-0 p-0"
                          />
                          <input
                            type="text"
                            name="secondaryColorText"
                            value={formData.secondaryColor || '#10B981'}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, secondaryColor: e.target.value }));
                            }}
                            className="w-28 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          文本颜色
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            name="textColor"
                            value={formData.textColor || '#111827'}
                            onChange={handleChange}
                            className="h-8 w-10 border-0 p-0"
                          />
                          <input
                            type="text"
                            name="textColorText"
                            value={formData.textColor || '#111827'}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, textColor: e.target.value }));
                            }}
                            className="w-28 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          背景颜色
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            name="backgroundColor"
                            value={formData.backgroundColor || '#F9FAFB'}
                            onChange={handleChange}
                            className="h-8 w-10 border-0 p-0"
                          />
                          <input
                            type="text"
                            name="backgroundColorText"
                            value={formData.backgroundColor || '#F9FAFB'}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, backgroundColor: e.target.value }));
                            }}
                            className="w-28 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">主题模式</label>
                        <div className="mt-1">
                          <select
                            name="themeMode"
                            value={formData.themeMode || 'light'}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          >
                            <option value="light">亮色模式</option>
                            <option value="dark">暗色模式</option>
                            <option value="auto">跟随系统</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 导航栏设置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">导航栏设置</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="sticky-header"
                          name="stickyHeader"
                          type="checkbox"
                          checked={formData.stickyHeader}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, stickyHeader: e.target.checked }))
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor="sticky-header" className="ml-3 block text-sm font-medium text-gray-700">
                          固定导航栏在顶部
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="show-categories-menu"
                          name="showCategoriesMenu"
                          type="checkbox"
                          checked={formData.showCategoriesMenu}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, showCategoriesMenu: e.target.checked }))
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor="show-categories-menu" className="ml-3 block text-sm font-medium text-gray-700">
                          显示分类菜单下拉框
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          导航栏样式
                        </label>
                        <select
                          name="navbarStyle"
                          value={formData.navbarStyle || 'default'}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="default">默认样式</option>
                          <option value="compact">紧凑样式</option>
                          <option value="extended">扩展样式</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* 商品卡片设置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">商品卡片设置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          卡片特效
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input
                              id="card-hover-shadow"
                              name="cardHoverShadow"
                              type="checkbox"
                              checked={formData.cardHoverShadow}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, cardHoverShadow: e.target.checked }))
                              }}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="card-hover-shadow" className="ml-3 block text-sm font-medium text-gray-700">
                              悬停阴影效果
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="card-hover-transform"
                              name="cardHoverTransform"
                              type="checkbox"
                              checked={formData.cardHoverTransform}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, cardHoverTransform: e.target.checked }))
                              }}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="card-hover-transform" className="ml-3 block text-sm font-medium text-gray-700">
                              悬停上移效果
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          卡片圆角大小
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            name="cardBorderRadius"
                            min="0"
                            max="16"
                            value={formData.cardBorderRadius || '8'}
                            onChange={handleChange}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-500">{formData.cardBorderRadius || '8'}px</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          卡片内边距
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            name="cardPadding"
                            min="4"
                            max="24"
                            value={formData.cardPadding || '16'}
                            onChange={handleChange}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-500">{formData.cardPadding || '16'}px</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          标题字体大小
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            name="cardTitleSize"
                            min="12"
                            max="24"
                            step="1"
                            value={formData.cardTitleSize || '16'}
                            onChange={handleChange}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-500">{formData.cardTitleSize || '16'}px</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          图片宽高比
                        </label>
                        <select
                          name="cardImageAspectRatio"
                          value={formData.cardImageAspectRatio || '1:1'}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="1:1">1:1 (正方形)</option>
                          <option value="4:3">4:3 (传统)</option>
                          <option value="16:9">16:9 (宽屏)</option>
                          <option value="auto">自动 (原始比例)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* 动画设置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">动画与过渡效果</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <input
                          id="enable-animations"
                          name="enableAnimations"
                          type="checkbox"
                          checked={formData.enableAnimations}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, enableAnimations: e.target.checked }))
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor="enable-animations" className="ml-3 block text-sm font-medium text-gray-700">
                          启用过渡动画
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="page-transitions"
                          name="pageTransitions"
                          type="checkbox"
                          checked={formData.pageTransitions}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, pageTransitions: e.target.checked }))
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor="page-transitions" className="ml-3 block text-sm font-medium text-gray-700">
                          页面切换动画
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          动画速度
                        </label>
                        <select
                          name="animationSpeed"
                          value={formData.animationSpeed || 'normal'}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="slow">慢速</option>
                          <option value="normal">中速</option>
                          <option value="fast">快速</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="reduced-motion"
                          name="reducedMotion"
                          type="checkbox"
                          checked={formData.reducedMotion}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, reducedMotion: e.target.checked }))
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor="reduced-motion" className="ml-3 block text-sm font-medium text-gray-700">
                          减少动效 <span className="text-xs text-gray-500">(适用于低性能设备)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* 其他设置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">其他设置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          图片加载策略
                        </label>
                        <select
                          name="imageLoadStrategy"
                          value={formData.imageLoadStrategy || 'lazy'}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="eager">立即加载 (更快显示)</option>
                          <option value="lazy">延迟加载 (节省带宽)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          文字方向
                        </label>
                        <select
                          name="textDirection"
                          value={formData.textDirection || 'ltr'}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="ltr">从左到右 (LTR)</option>
                          <option value="rtl">从右到左 (RTL)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleLayoutSettingsSave}
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {loading ? '保存中...' : '保存布局设置'}
                    </button>
                  </div>
                </div>
                
                {/* 右侧预览区域 */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-medium mb-3">实时预览</h3>
                  
                  {/* 引入预览组件 */}
                  <div className="sticky top-4">
                    <ThemeSettingsPreview />
                    
                    <div className="mt-4">
                      <SpecificSettingPreview setting="colors" />
                    </div>
                    
                    <div className="mt-4">
                      <ThemePresetManager />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 