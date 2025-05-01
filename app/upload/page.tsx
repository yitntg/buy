'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

export default function UploadProduct() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    inventory: '',
    description: '',
    brand: '',
    model: '',
    specifications: '',
    free_shipping: false,
    returnable: false,
    warranty: false
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 检查认证状态，如未登录，则重定向到登录页面
  useEffect(() => {
    if (isBrowser && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])
  
  // 处理表单变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }
  
  // 处理复选框变化
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: checked
    }))
  }
  
  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isBrowser) return;
    
    const fileList = e.target.files
    
    if (!fileList) return
    
    const newImages: File[] = []
    const newImageUrls: string[] = []
    
    // 限制最多上传5张图片
    const maxImages = 5
    const totalImages = images.length + fileList.length
    const imagesToProcess = totalImages > maxImages ? maxImages - images.length : fileList.length
    
    // 处理选择的图片
    for (let i = 0; i < imagesToProcess; i++) {
      const file = fileList[i]
      newImages.push(file)
      
      // 创建预览URL
      const url = URL.createObjectURL(file)
      newImageUrls.push(url)
    }
    
    // 更新状态
    setImages(prev => [...prev, ...newImages])
    setImagePreviewUrls(prev => [...prev, ...newImageUrls])
    
    // 如果超过5张图片，显示提示
    if (totalImages > maxImages) {
      alert(`最多只能上传5张图片，已选择前${maxImages}张。`)
    }
  }
  
  // 移除图片
  const removeImage = (index: number) => {
    if (!isBrowser) return;
    
    // 从数组中移除图片
    const newImages = [...images]
    const newImageUrls = [...imagePreviewUrls]
    
    // 释放预览URL的内存
    URL.revokeObjectURL(newImageUrls[index])
    
    newImages.splice(index, 1)
    newImageUrls.splice(index, 1)
    
    setImages(newImages)
    setImagePreviewUrls(newImageUrls)
  }
  
  // 触发图片选择对话框
  const handleSelectImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证必填字段
    if (!formData.name || !formData.category || !formData.price || !formData.inventory || !formData.description) {
      alert('请填写所有必填字段')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 在真实应用中，这里会上传图片和表单数据到后端API
      console.log('表单数据:', formData)
      console.log('图片:', images)
      
      // 提交成功
      setSubmitSuccess(true)
      
      // 重置表单
      setTimeout(() => {
        setSubmitSuccess(false)
        setFormData({
          name: '',
          category: '',
          price: '',
          inventory: '',
          description: '',
          brand: '',
          model: '',
          specifications: '',
          free_shipping: false,
          returnable: false,
          warranty: false
        })
        setImages([])
        setImagePreviewUrls([])
      }, 2000)
      
    } catch (error) {
      console.error('上传失败:', error)
      alert('上传失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // 在尚未加载完成时显示加载指示器
  if (isBrowser && !isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p>正在检查登录状态...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">上传商品</h1>
              <Link href="/" className="text-primary hover:underline">
                返回首页
              </Link>
            </div>

            {submitSuccess ? (
              <div className="text-center py-16">
                <div className="text-6xl text-green-500 mb-4">✓</div>
                <h2 className="text-2xl font-medium mb-4">商品上传成功！</h2>
                <p className="text-gray-600 mb-8">您的商品已成功上传，将在审核后显示。</p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 inline-block"
                >
                  继续上传
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* 基本信息 */}
                <div>
                  <h2 className="text-xl font-medium mb-4">基本信息</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        商品名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        商品分类 <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">选择分类</option>
                        <option value="1">电子产品</option>
                        <option value="2">家居用品</option>
                        <option value="3">服装鞋帽</option>
                        <option value="4">美妆护肤</option>
                        <option value="5">食品饮料</option>
                        <option value="6">运动户外</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        商品价格 (¥) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-1">
                        库存数量 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="inventory"
                        value={formData.inventory}
                        onChange={handleChange}
                        min="0"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* 商品描述 */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    商品描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>

                {/* 商品规格 */}
                <div>
                  <h2 className="text-xl font-medium mb-4">商品规格</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                        品牌
                      </label>
                      <input
                        type="text"
                        id="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                        型号
                      </label>
                      <input
                        type="text"
                        id="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">
                        规格参数
                      </label>
                      <textarea
                        id="specifications"
                        value={formData.specifications}
                        onChange={handleChange}
                        rows={3}
                        placeholder="例如：尺寸、重量、材质、颜色等"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* 图片上传 */}
                <div>
                  <h2 className="text-xl font-medium mb-4">商品图片</h2>
                  <div 
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (e.dataTransfer.files.length > 0) {
                        const fileList = e.dataTransfer.files
                        const changeEvent = {
                          target: { files: fileList }
                        } as unknown as React.ChangeEvent<HTMLInputElement>
                        handleImageUpload(changeEvent)
                      }
                    }}
                  >
                    <div className="space-y-2">
                      <div className="text-4xl text-gray-400">📸</div>
                      <p className="text-gray-500">点击上传或拖拽图片至此处</p>
                      <p className="text-xs text-gray-400">支持 JPG, PNG 格式，最多可上传 5 张图片</p>
                      <input
                        type="file"
                        id="images"
                        ref={fileInputRef}
                        accept="image/jpeg, image/png"
                        multiple
                        onChange={handleImageUpload}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={handleSelectImageClick}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-primary text-primary rounded-full hover:bg-blue-50 focus:outline-none"
                      >
                        选择图片
                      </button>
                    </div>
                  </div>
                  {imagePreviewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="relative h-24 w-full rounded-md overflow-hidden border border-gray-200">
                            <Image 
                              src={url}
                              alt={`Preview ${index}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 配送与售后 */}
                <div>
                  <h2 className="text-xl font-medium mb-4">配送与售后</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="free_shipping"
                        checked={formData.free_shipping}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-primary"
                      />
                      <label htmlFor="free_shipping" className="ml-2 text-sm text-gray-700">
                        免运费
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="returnable"
                        checked={formData.returnable}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-primary"
                      />
                      <label htmlFor="returnable" className="ml-2 text-sm text-gray-700">
                        支持7天无理由退换
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="warranty"
                        checked={formData.warranty}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-primary"
                      />
                      <label htmlFor="warranty" className="ml-2 text-sm text-gray-700">
                        提供保修服务
                      </label>
                    </div>
                  </div>
                </div>

                {/* 提交按钮 */}
                <div className="pt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    保存为草稿
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        上传中...
                      </>
                    ) : '上传商品'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 