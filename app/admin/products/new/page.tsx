'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 分类接口
interface Category {
  id: number
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 图片上传状态
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inventory: '10',
    image: '',
    brand: '',
    model: '',
    specifications: '',
    free_shipping: false,
    returnable: false,
    warranty: false
  })
  
  // 错误信息
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // 加载分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 在实际应用中，这里应该调用API获取分类数据
        // 这里使用模拟数据
        const mockCategories = [
          { id: 1, name: '电子产品' },
          { id: 2, name: '家居用品' },
          { id: 3, name: '服装鞋帽' },
          { id: 4, name: '美妆护肤' },
          { id: 5, name: '食品饮料' },
          { id: 6, name: '运动户外' }
        ]
        setCategories(mockCategories)
        
        // 默认选择第一个分类
        if (mockCategories.length > 0) {
          setFormData(prev => ({ ...prev, category: mockCategories[0].id.toString() }))
        }
      } catch (err) {
        console.error('获取分类失败:', err)
      }
    }
    
    fetchCategories()
  }, [])
  
  // 表单字段变化处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // 清除对应的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // 处理复选框变化
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  // 处理图片URL变化
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, image: value }))
    
    // 预览图片
    if (value) {
      setImagePreview(value)
    } else {
      setImagePreview(null)
    }
    
    // 清除错误
    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.image
        return newErrors
      })
    }
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
    
    // 如果是第一张图片且没有设置主图URL，则自动设置
    if (imagePreviewUrls.length === 0 && newImageUrls.length > 0 && !formData.image) {
      setFormData(prev => ({ ...prev, image: newImageUrls[0] }))
      setImagePreview(newImageUrls[0])
    }
  }
  
  // 移除图片
  const removeImage = (index: number) => {
    if (!isBrowser) return;
    
    // 从数组中移除图片
    const newImages = [...images]
    const newImageUrls = [...imagePreviewUrls]
    
    // 检查是否移除的是作为主图的图片
    const removedUrl = newImageUrls[index]
    if (removedUrl === formData.image) {
      // 如果还有其他图片，选择第一张作为主图
      if (newImageUrls.length > 1) {
        const newMainImage = index === 0 ? newImageUrls[1] : newImageUrls[0]
        setFormData(prev => ({ ...prev, image: newMainImage }))
        setImagePreview(newMainImage)
      } else {
        // 没有其他图片了，清除主图
        setFormData(prev => ({ ...prev, image: '' }))
        setImagePreview(null)
      }
    }
    
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
  
  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入商品名称'
    }
    
    if (!formData.price) {
      newErrors.price = '请输入商品价格'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = '价格必须是大于0的数字'
    }
    
    if (!formData.category) {
      newErrors.category = '请选择商品分类'
    }
    
    // 图片URL可选，但如果提供了则需要验证
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = '请输入有效的图片URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // 检查URL是否有效
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }
  
  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // 使用上传的图片或URL图片
      let imageUrl = formData.image
      
      // 如果有上传的图片但没有设置URL，使用第一张上传的图片
      if (!imageUrl && imagePreviewUrls.length > 0) {
        imageUrl = imagePreviewUrls[0]
      }
      
      // 如果仍然没有图片，使用默认图片
      if (!imageUrl) {
        imageUrl = 'https://picsum.photos/id/1/500/500'
      }
      
      // 构建商品数据
      const productData = {
        name: formData.name,
        description: formData.description || `${formData.name}是一款优质商品`,
        price: parseFloat(formData.price),
        inventory: parseInt(formData.inventory || '0'),
        category: parseInt(formData.category),
        image: imageUrl,
        brand: formData.brand || '',
        model: formData.model || '',
        specifications: formData.specifications || '',
        free_shipping: formData.free_shipping,
        returnable: formData.returnable,
        warranty: formData.warranty,
        rating: 0,
        reviews: 0
      }
      
      // 发送API请求
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })
      
      if (!res.ok) {
        throw new Error('创建商品失败')
      }
      
      // 创建成功
      setSubmitSuccess(true)
      
      // 2秒后重置表单或跳转
      setTimeout(() => {
        if (confirm('商品添加成功！是否继续添加新商品？')) {
          // 重置表单
          setFormData({
            name: '',
            description: '',
            price: '',
            category: categories.length > 0 ? categories[0].id.toString() : '',
            inventory: '10',
            image: '',
            brand: '',
            model: '',
            specifications: '',
            free_shipping: false,
            returnable: false,
            warranty: false
          })
          setImages([])
          setImagePreviewUrls([])
          setImagePreview(null)
          setSubmitSuccess(false)
        } else {
          // 跳转到商品列表
          router.push('/admin/products')
        }
      }, 2000)
    } catch (err) {
      console.error('保存商品失败:', err)
      alert('保存商品失败，请重试')
      setSubmitSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">添加新商品</h1>
        <Link 
          href="/admin/products" 
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回商品列表
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                商品名称
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                商品描述
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                价格 (¥)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
            
            <div>
              <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                库存数量
              </label>
              <input
                type="number"
                id="inventory"
                name="inventory"
                value={formData.inventory}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.inventory ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.inventory && <p className="mt-1 text-sm text-red-500">{errors.inventory}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                商品分类
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">请选择分类</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                商品图片URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
              
              {/* 图片预览 */}
              {imagePreview && (
                <div className="mt-2 relative h-40 w-40 border rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="商品图片预览"
                    fill
                    className="object-cover"
                    onError={() => {
                      setErrors(prev => ({ ...prev, image: '图片加载失败，请检查URL' }))
                      setImagePreview(null)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end">
            <Link
              href="/admin/products"
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 disabled:opacity-70"
            >
              {isLoading ? '保存中...' : '保存商品'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 