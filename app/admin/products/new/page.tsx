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
        // 从API获取真实分类数据
        const response = await fetch('/api/categories', {
          method: 'GET',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });

        if (!response.ok) {
          throw new Error(`获取分类失败: ${response.status}`);
        }

        // 尝试解析响应
        const data = await response.json();
        console.log('获取到的分类数据:', data);
        
        // 处理不同的响应格式
        let categoriesData = data;
        
        // 如果API返回的是包含categories属性的对象，则使用categories属性
        if (data && data.categories) {
          categoriesData = data.categories;
        }
        
        // 如果获取失败或没有数据，使用默认分类
        if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
          console.log('使用默认分类数据');
          categoriesData = [
            { id: 1, name: '电子产品' },
            { id: 2, name: '家居家具' },
            { id: 3, name: '服装服饰' },
            { id: 4, name: '美妆个护' },
            { id: 5, name: '食品饮料' },
            { id: 6, name: '运动户外' }
          ];
        }
        
        console.log('设置分类数据:', categoriesData);
        setCategories(categoriesData);
        
        // 默认选择第一个分类
        if (categoriesData.length > 0) {
          setFormData(prev => ({ ...prev, category: categoriesData[0].id.toString() }));
        }
      } catch (err) {
        console.error('获取分类失败:', err);
        // 出错时使用默认分类数据
        const defaultCategories = [
          { id: 1, name: '电子产品' },
          { id: 2, name: '家居家具' },
          { id: 3, name: '服装服饰' },
          { id: 4, name: '美妆个护' },
          { id: 5, name: '食品饮料' },
          { id: 6, name: '运动户外' }
        ];
        console.log('使用默认分类数据');
        setCategories(defaultCategories);
        
        // 默认选择第一个分类
        setFormData(prev => ({ ...prev, category: '1' }));
      }
    };
    
    fetchCategories();
  }, []);
  
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
  
  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    setErrors({})
    
    // 表单验证
    const validationErrors: Record<string, string> = {}
    
    // 必填字段验证
    if (!formData.name.trim()) validationErrors.name = '商品名称不能为空'
    if (!formData.price || parseFloat(formData.price) <= 0) validationErrors.price = '请输入有效价格'
    if (!formData.category) validationErrors.category = '请选择商品分类'
    
    // 添加库存验证
    if (formData.inventory === '' || parseInt(formData.inventory) < 0) {
      validationErrors.inventory = '库存数量不能为空且不能为负数'
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsLoading(false)
      return
    }
    
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
        name: formData.name.trim(),
        description: formData.description.trim() || `该商品暂无描述`,
        price: parseFloat(formData.price || '0'),
        inventory: parseInt(formData.inventory || '0'),
        category: parseInt(formData.category || '1'),
        image: imageUrl,
        brand: formData.brand?.trim() || '',
        model: formData.model?.trim() || '',
        specifications: formData.specifications?.trim() || '',
        free_shipping: formData.free_shipping,
        returnable: formData.returnable,
        warranty: formData.warranty,
      }
      
      console.log('正在提交商品数据:', productData)
      
      // 发送API请求
      try {
        // 使用更可靠的fetch请求方式
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData),
          cache: 'no-store'
        })
        
        // 先获取响应文本
        const responseText = await response.text()
        
        if (!response.ok) {
          // 尝试解析错误响应
          let errorMessage = `创建商品失败，服务器返回错误：${response.status}`
          let errorData = null
          
          try {
            // 尝试将响应文本解析为JSON
            if (responseText) {
              errorData = JSON.parse(responseText)
              console.error('API返回错误:', {
                status: response.status,
                statusText: response.statusText,
                data: errorData
              })
              
              if (errorData.error) {
                errorMessage = errorData.error
                if (errorData.details) {
                  errorMessage += `: ${errorData.details}`
                }
              }
            }
          } catch (parseError) {
            console.error('解析错误响应失败:', parseError)
            console.error('原始响应文本:', responseText)
          }
          
          throw new Error(errorMessage)
        }
        
        // 解析成功响应
        let createdProduct = null
        try {
          if (responseText) {
            createdProduct = JSON.parse(responseText)
            console.log('商品创建成功:', createdProduct)
          }
        } catch (parseError) {
          console.error('解析成功响应失败:', parseError)
          throw new Error('解析服务器响应失败')
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
      } catch (err: any) {
        console.error('保存商品失败:', err)
        
        // 显示具体错误信息
        const errorMessage = err.message || '保存商品失败，请重试'
        alert(errorMessage)
        
        // 在控制台记录更多调试信息
        if (err instanceof Error) {
          console.error('错误详情:', err)
        }
        
        setSubmitSuccess(false)
      } finally {
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('保存商品失败:', err)
      
      // 显示具体错误信息
      const errorMessage = err.message || '保存商品失败，请重试'
      alert(errorMessage)
      
      // 在控制台记录更多调试信息
      if (err instanceof Error) {
        console.error('错误详情:', err)
      }
      
      setSubmitSuccess(false)
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
      
      {submitSuccess ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl text-green-500 mb-4">✓</div>
          <h2 className="text-2xl font-medium mb-4">商品添加成功！</h2>
          <p className="text-gray-600 mb-8">您的商品已成功添加，将立即显示在商城中。</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
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
              }}
              className="px-4 py-2 border border-primary rounded-md text-primary hover:bg-blue-50"
            >
              继续添加商品
            </button>
            <button
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
            >
              返回商品列表
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* 基本信息区域 */}
              <div>
                <h2 className="text-xl font-medium mb-4">基本信息</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      商品名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:outline-none`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      商品分类 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:outline-none`}
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
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      价格 (¥) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:outline-none`}
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                      库存数量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="inventory"
                      name="inventory"
                      min="0"
                      value={formData.inventory}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.inventory ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:outline-none`}
                    />
                    {errors.inventory && <p className="mt-1 text-sm text-red-500">{errors.inventory}</p>}
                  </div>
                </div>
              </div>
              
              {/* 商品描述 */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  商品描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:outline-none`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              
              {/* 商品规格 */}
              <div>
                <h2 className="text-xl font-medium mb-4">商品规格</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                      品牌
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                      型号
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
                      规格参数
                    </label>
                    <textarea
                      id="specifications"
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="例如：尺寸、重量、材质、颜色等"
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
              
              {/* 商品图片部分 */}
              <div>
                <h2 className="text-xl font-medium mb-4">商品图片</h2>
                
                {/* 图片上传区域 */}
                <div 
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4"
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
                
                {/* 图片预览区域 */}
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
                
                {/* URL输入区域 */}
                <div className="mt-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    商品图片URL（可选）
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleImageChange}
                    placeholder="https://example.com/image.jpg"
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${errors.image ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:outline-none`}
                  />
                  {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                  
                  {/* URL图片预览 */}
                  {imagePreview && !imagePreviewUrls.includes(imagePreview) && (
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
              
              {/* 配送与售后 */}
              <div>
                <h2 className="text-xl font-medium mb-4">配送与售后</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="free_shipping"
                      name="free_shipping"
                      checked={formData.free_shipping}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="free_shipping" className="ml-2 text-sm text-gray-700">
                      免运费
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="returnable"
                      name="returnable"
                      checked={formData.returnable}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="returnable" className="ml-2 text-sm text-gray-700">
                      支持7天无理由退换
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="warranty"
                      name="warranty"
                      checked={formData.warranty}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="warranty" className="ml-2 text-sm text-gray-700">
                      提供保修服务
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 disabled:opacity-70 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    保存中...
                  </>
                ) : '保存商品'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
} 