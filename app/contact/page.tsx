'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // 简单验证
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitError('请填写所有必填字段')
      return
    }
    
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('提交的数据:', formData)
      
      // 重置表单
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
      // 显示成功消息
      setSubmitSuccess(true)
      
    } catch (error) {
      console.error('提交失败:', error)
      setSubmitError('提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">联系我们</h1>
              <Link href="/" className="text-primary hover:underline">
                返回首页
              </Link>
            </div>
            
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-6xl text-green-500 mb-4">✓</div>
                <h2 className="text-2xl font-medium mb-4">消息已发送！</h2>
                <p className="text-gray-600 mb-6">感谢您的留言，我们会尽快回复您。</p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 inline-block"
                >
                  发送新消息
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="text-xl font-medium mb-4">发送消息</h2>
                    <p className="text-gray-600 mb-6">
                      有任何问题或建议？请填写以下表单联系我们，我们会尽快回复您。
                    </p>
                    
                    {submitError && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                        {submitError}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          您的姓名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          autoComplete="name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          电子邮箱 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          主题
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">请选择主题</option>
                          <option value="customer-service">客户服务</option>
                          <option value="product-inquiry">商品咨询</option>
                          <option value="order-issue">订单问题</option>
                          <option value="website-feedback">网站反馈</option>
                          <option value="other">其他</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          您的留言 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              发送中...
                            </>
                          ) : '发送消息'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-medium mb-4">联系方式</h2>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="text-primary text-xl mr-3">📍</div>
                        <div>
                          <h3 className="font-medium">地址</h3>
                          <p className="text-gray-600">上海市浦东新区张江高科技园区博云路2号</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="text-primary text-xl mr-3">📞</div>
                        <div>
                          <h3 className="font-medium">电话</h3>
                          <p className="text-gray-600">400-123-4567</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="text-primary text-xl mr-3">✉️</div>
                        <div>
                          <h3 className="font-medium">电子邮箱</h3>
                          <p className="text-gray-600">contact@legou.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="text-primary text-xl mr-3">⏰</div>
                        <div>
                          <h3 className="font-medium">工作时间</h3>
                          <p className="text-gray-600">周一至周五 9:00-18:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 