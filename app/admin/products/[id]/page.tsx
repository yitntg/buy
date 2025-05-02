'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// 商品接口
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: number
  inventory: number
  rating: number
  reviews: number
}

// 分类接口
interface Category {
  id: number
  name: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inventory: '',
    image: ''
  })
  
  // 错误信息
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // 加载商品数据
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      
      try {
        // 在实际应用中，这里应该调用API获取商品数据
        const res = await fetch(`/api/products/${params.id}`)
        
        if (!res.ok) {
          throw new Error('获取商品信息失败')
        }
        
        const product: Product = await res.json()
        
        // 填充表单数据
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category.toString(),
          inventory: product.inventory.toString(),
          image: product.image
        })
        
        // 设置图片预览
        setImagePreview(product.image)
      } catch (err) {
        console.error('获取商品信息失败:', err)
        alert('获取商品信息失败，请重试')
        router.push('/admin/products')
      } finally {
        setIsLoading(false)
      }
    }
    
    // 加载分类数据
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
      } catch (err) {
        console.error('获取分类失败:', err)
      }
    }
    
    fetchProduct()
    fetchCategories()
  }, [params.id, router])
  
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
  
  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入商品名称'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '请输入商品描述'
    }
    
    if (!formData.price) {
      newErrors.price = '请输入商品价格'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = '价格必须是大于0的数字'
    }
    
    if (!formData.inventory) {
      newErrors.inventory = '请输入库存数量'
    } else if (isNaN(Number(formData.inventory)) || Number(formData.inventory) < 0) {
      newErrors.inventory = '库存必须是不小于0的整数'
    }
    
    if (!formData.category) {
      newErrors.category = '请选择商品分类'
    }
    
    if (!formData.image.trim()) {
      newErrors.image = '请输入商品图片URL'
    } else if (!isValidUrl(formData.image)) {
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
    
    setIsSaving(true)
    
    try {
      // 构建商品数据
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        inventory: parseInt(formData.inventory),
        category: parseInt(formData.category),
        image: formData.image
      }
      
      // 在实际应用中，这里应该调用API更新商品
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })
      
      if (!res.ok) {
        throw new Error('更新商品失败')
      }
      
      // 更新成功，重定向到商品列表
      alert('更新商品成功！')
      router.push('/admin/products')
    } catch (err) {
      console.error('保存商品失败:', err)
      alert('保存商品失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }
  
  // 处理删除商品
  const handleDeleteProduct = async () => {
    if (!confirm('确定要删除这个商品吗？此操作不可逆！')) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // 在实际应用中，这里应该调用API删除商品
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        throw new Error('删除商品失败')
      }
      
      // 删除成功，重定向到商品列表
      alert('删除商品成功！')
      router.push('/admin/products')
    } catch (err) {
      console.error('删除商品失败:', err)
      alert('删除商品失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-4 text-gray-600">加载商品信息...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">编辑商品</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDeleteProduct}
            disabled={isSaving}
            className="text-red-500 hover:text-red-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            删除商品
          </button>
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
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 disabled:opacity-70"
            >
              {isSaving ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 