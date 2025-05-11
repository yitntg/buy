'use client'

// 移除导入动态配置，依赖layout中的全局配置
// import '../revalidate-config.js';

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 分类数据类型
interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function CategoriesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  // 表单状态
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  
  // 检查用户是否已登录并且是管理员
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin/categories')
    } else if (user?.role !== 'admin') {
      router.push('/') // 如果不是管理员，重定向到首页
    } else {
      fetchCategories() // 获取分类数据
    }
  }, [isAuthenticated, user, router])
  
  // 获取所有分类
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/categories')
      
      if (!response.ok) {
        throw new Error('获取分类数据失败')
      }
      
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('获取分类失败:', err)
      setError(err instanceof Error ? err.message : '获取分类数据时发生未知错误')
    } finally {
      setLoading(false)
    }
  }
  
  // 添加新分类
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('分类名称不能为空')
      return
    }
    
    try {
      // 确保只发送名称和描述，不指定id
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          description 
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '添加分类失败')
      }
      
      // 重置表单
      setName('')
      setDescription('')
      setShowAddForm(false)
      
      // 重新获取分类列表
      fetchCategories()
    } catch (err) {
      console.error('添加分类失败:', err)
      setError(err instanceof Error ? err.message : '添加分类时发生未知错误')
    }
  }
  
  // 更新分类
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingCategory) return
    if (!name.trim()) {
      setError('分类名称不能为空')
      return
    }
    
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新分类失败')
      }
      
      // 重置表单
      setName('')
      setDescription('')
      setEditingCategory(null)
      
      // 重新获取分类列表
      fetchCategories()
    } catch (err) {
      console.error('更新分类失败:', err)
      setError(err instanceof Error ? err.message : '更新分类时发生未知错误')
    }
  }
  
  // 删除分类
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('确定要删除此分类吗？删除分类可能会影响相关产品。')) {
      return
    }
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '删除分类失败')
      }
      
      // 重新获取分类列表
      fetchCategories()
    } catch (err) {
      console.error('删除分类失败:', err)
      setError(err instanceof Error ? err.message : '删除分类时发生未知错误')
    }
  }
  
  // 设置编辑状态
  const startEditing = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setDescription(category.description || '')
    setShowAddForm(false)
  }
  
  // 取消编辑/添加
  const cancelEdit = () => {
    setEditingCategory(null)
    setName('')
    setDescription('')
    setShowAddForm(false)
  }
  
  // 开始添加
  const startAdding = () => {
    setEditingCategory(null)
    setName('')
    setDescription('')
    setShowAddForm(true)
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null // 未授权时返回空
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">分类管理</h1>
          {!showAddForm && !editingCategory && (
            <button 
              onClick={startAdding}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              添加分类
            </button>
          )}
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* 添加分类表单 */}
        {showAddForm && (
          <div className="mb-6 bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">添加新分类</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-gray-700">分类名称</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1 text-gray-700">分类描述</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  添加
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* 编辑分类表单 */}
        {editingCategory && (
          <div className="mb-6 bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">编辑分类</h2>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block mb-1 text-gray-700">分类名称</label>
                <input
                  type="text"
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="block mb-1 text-gray-700">分类描述</label>
                <textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  更新
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* 分类列表 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">加载分类数据...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-500">暂无分类数据</p>
            {!showAddForm && (
              <button 
                onClick={startAdding}
                className="mt-4 text-primary hover:underline"
              >
                添加第一个分类
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEditing(category)}
                        className="text-primary hover:text-blue-700 mr-4"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 