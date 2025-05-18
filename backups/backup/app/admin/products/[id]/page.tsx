'use client'

// 移除对配置文件的导入，统一从layout继承配置
// import '../../revalidate-config.js';

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'
import { supabase } from '@/src/app/shared/infrastructure/lib/supabase'
import Image from 'next/image'

// 产品数据类型
interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category_id: number
  stock: number
  created_at: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { user, status } = useAuth()
  const isAuthenticated = status === 'authenticated'
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<{id: number, name: string}[]>([])
  
  // 表单字段
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  
  // 获取产品详情
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin/products')
      return
    }
    
    const productId = params?.id
    if (!productId) return
    
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details')
        }
        
        const data = await response.json()
        setProduct(data)
        
        // 初始化表单值
        setName(data.name)
        setDescription(data.description || '')
        setPrice(data.price.toString())
        setStock(data.stock.toString())
        setCategoryId(data.category_id.toString())
        
        // 如果有图片则设置预览
        if (data.image_url) {
          setImagePreview(data.image_url)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('无法加载产品详情')
      } finally {
        setLoading(false)
      }
    }
    
    // 获取分类列表
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    fetchProduct()
    fetchCategories()
  }, [params?.id, isAuthenticated, router])
  
  // 处理图片选择
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      
      // 创建预览URL
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // 更新产品信息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!product) return
    
    // 验证表单
    if (!name.trim() || !price || !stock) {
      setError('请填写所有必填字段')
      return
    }
    
    try {
      setSaving(true)
      
      let imageUrl = product.image_url
      
      // 如果选择了新图片，先上传
      if (selectedImage) {
        const filename = `${Date.now()}-${selectedImage.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filename, selectedImage)
        
        if (uploadError) {
          throw new Error(`图片上传失败: ${uploadError.message}`)
        }
        
        // 获取公共URL
        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filename)
        
        imageUrl = urlData.publicUrl
      }
      
      // 更新产品信息
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          category_id: parseInt(categoryId),
          image_url: imageUrl,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新产品失败')
      }
      
      // 使用 alert 替代 toast
      alert('产品更新成功')
      // 更新成功后返回产品列表
      router.push('/admin/products')
    } catch (err) {
      console.error('更新产品失败:', err)
      setError(err instanceof Error ? err.message : '更新产品时发生未知错误')
    } finally {
      setSaving(false)
    }
  }
  
  // 删除产品
  const handleDelete = async () => {
    if (!product || !confirm('确定要删除该产品吗？此操作不可撤销。')) return
    
    try {
      setSaving(true)
      
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '删除产品失败')
      }
      
      alert('产品已删除')
      router.push('/admin/products')
    } catch (err) {
      console.error('删除产品失败:', err)
      setError(err instanceof Error ? err.message : '删除产品时发生未知错误')
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">编辑产品</h1>
          <Link 
            href="/admin/products"
            className="text-gray-600 hover:text-primary flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回产品列表
          </Link>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">产品名称 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">分类 *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">选择分类</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">价格 (元) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">库存数量 *</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded h-32"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">产品图片</label>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative h-40 w-40 border rounded overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="产品预览"
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-40 bg-gray-100 flex items-center justify-center border rounded">
                    <span className="text-gray-400">无图片</span>
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="text-sm text-gray-600"
                  accept="image/*"
                />
                <p className="mt-2 text-xs text-gray-500">
                  支持 JPG, PNG, GIF 格式，最大 2MB。
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={saving}
            >
              删除产品
            </button>
            
            <div className="space-x-2">
              <Link
                href="/admin/products"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                取消
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? '保存中...' : '保存更改'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 