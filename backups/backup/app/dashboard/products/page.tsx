'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
// Header import removed
// Footer import removed
import { useAuth } from '../../context/AuthContext'

// 商品类型定义
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inventory: number;
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all, active, draft, out_of_stock
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('createdAt') // name, price, inventory, createdAt
  const [sortOrder, setSortOrder] = useState('desc') // asc, desc

  // 检查用户是否是管理员，如果不是则重定向
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    } else if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      router.push('/account')
    } else {
      // 加载商品数据
      fetchProducts()
    }
  }, [isLoading, isAuthenticated, user, router])

  // 模拟从API获取商品数据
  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟商品数据
      const mockProducts: Product[] = [
        {
          id: '1',
          name: '高品质蓝牙耳机',
          description: '无线蓝牙5.0，降噪技术，长效续航',
          price: 299,
          image: 'https://picsum.photos/id/1/200/200',
          category: '电子产品',
          inventory: 42,
          status: 'active',
          createdAt: '2023-10-15'
        },
        {
          id: '2',
          name: '智能手表',
          description: '多功能运动智能手表，支持心率监测',
          price: 699,
          image: 'https://picsum.photos/id/2/200/200',
          category: '电子产品',
          inventory: 18,
          status: 'active',
          createdAt: '2023-10-20'
        },
        {
          id: '3',
          name: '轻薄笔记本电脑',
          description: '超薄轻便，高性能处理器，长效电池',
          price: 4999,
          image: 'https://picsum.photos/id/3/200/200',
          category: '电子产品',
          inventory: 12,
          status: 'active',
          createdAt: '2023-10-25'
        },
        {
          id: '4',
          name: '专业摄影相机',
          description: '高像素，专业镜头，完美捕捉每一刻',
          price: 3299,
          image: 'https://picsum.photos/id/4/200/200',
          category: '电子产品',
          inventory: 8,
          status: 'active',
          createdAt: '2023-10-30'
        },
        {
          id: '5',
          name: '时尚双肩包',
          description: '大容量，多隔层，适合旅行和日常使用',
          price: 199,
          image: 'https://picsum.photos/id/5/200/200',
          category: '服装配饰',
          inventory: 35,
          status: 'active',
          createdAt: '2023-11-05'
        },
        {
          id: '6',
          name: '多功能厨房料理机',
          description: '强劲动力，多种配件，满足各种烹饪需求',
          price: 599,
          image: 'https://picsum.photos/id/6/200/200',
          category: '家居用品',
          inventory: 0,
          status: 'out_of_stock',
          createdAt: '2023-11-10'
        },
        {
          id: '7',
          name: '人体工学办公椅',
          description: '舒适支撑，缓解疲劳，提高工作效率',
          price: 899,
          image: 'https://picsum.photos/id/7/200/200',
          category: '家居用品',
          inventory: 14,
          status: 'active',
          createdAt: '2023-11-15'
        },
        {
          id: '8',
          name: '智能家庭安防系统',
          description: '远程监控，移动提醒，保障家庭安全',
          price: 1299,
          image: 'https://picsum.photos/id/8/200/200',
          category: '电子产品',
          inventory: 5,
          status: 'draft',
          createdAt: '2023-11-20'
        }
      ]
      
      setProducts(mockProducts)
    } catch (error) {
      console.error('获取商品失败:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // 筛选和排序商品
  const filteredAndSortedProducts = () => {
    // 先筛选商品
    let result = [...products]
    
    // 根据状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(product => product.status === statusFilter)
    }
    
    // 根据搜索关键字筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      )
    }
    
    // 排序
    result.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number
      
      // 根据排序字段获取值
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'inventory':
          aValue = a.inventory
          bValue = b.inventory
          break
        case 'createdAt':
        default:
          aValue = a.createdAt
          bValue = b.createdAt
          break
      }
      
      // 根据排序方向比较
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return result
  }

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(product => product.id))
    }
  }

  // 选择/取消选择单个商品
  const handleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  // 处理排序
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // 如果已经按这个字段排序，则切换排序方向
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // 否则，设置新的排序字段，默认降序
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 搜索逻辑已经在筛选函数中实现
  }

  // 更新商品状态
  const updateProductStatus = (id: string, status: 'active' | 'draft' | 'out_of_stock') => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, status } 
          : product
      )
    )
  }

  // 批量删除选中的商品
  const handleDeleteSelected = () => {
    if (window.confirm(`确定要删除选中的 ${selectedProducts.length} 个商品吗？`)) {
      setProducts(prev => 
        prev.filter(product => !selectedProducts.includes(product.id))
      )
      setSelectedProducts([])
    }
  }

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">上架中</span>
      case 'draft':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">草稿</span>
      case 'out_of_stock':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">缺货</span>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          </div>
        </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* 面包屑导航 */}
          <div className="mb-6 flex items-center text-sm">
            <Link href="/dashboard" className="text-gray-500 hover:text-primary">
              管理后台
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-700">商品管理</span>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">商品管理</h1>
              <Link 
                href="/dashboard/products/new" 
                className="mt-3 md:mt-0 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                添加新商品
              </Link>
            </div>
            
            {/* 搜索和筛选栏 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                <button
                  className={`px-3 py-1 rounded ${
                    statusFilter === 'all'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => setStatusFilter('all')}
                >
                  全部
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    statusFilter === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => setStatusFilter('active')}
                >
                  上架中
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    statusFilter === 'draft'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => setStatusFilter('draft')}
                >
                  草稿
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    statusFilter === 'out_of_stock'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  onClick={() => setStatusFilter('out_of_stock')}
                >
                  缺货
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="搜索商品名称、描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            {/* 批量操作 */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={handleSelectAll}
                  className="mr-2 h-4 w-4"
                />
                <span className="text-sm">全选</span>
                
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedProducts.length === 0}
                  className="ml-4 text-sm text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  删除所选
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                共 {products.length} 个商品，已选择 {selectedProducts.length} 个
              </div>
            </div>
            
            {/* 商品表格 */}
            {isLoadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left"></th>
                        <th className="px-4 py-2 text-left">商品</th>
                        <th className="px-4 py-2 text-left">
                          <button 
                            className="flex items-center font-medium text-gray-700"
                            onClick={() => handleSort('price')}
                          >
                            价格
                            {sortBy === 'price' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ml-1 transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-left">分类</th>
                        <th className="px-4 py-2 text-left">
                          <button 
                            className="flex items-center font-medium text-gray-700"
                            onClick={() => handleSort('inventory')}
                          >
                            库存
                            {sortBy === 'inventory' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 ml-1 transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-left">状态</th>
                        <th className="px-4 py-2 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedProducts().length > 0 ? (
                        filteredAndSortedProducts().map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-2 py-4">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleSelectProduct(product.id)}
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-xs text-gray-500 truncate max-w-xs">{product.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-medium">¥{product.price.toFixed(2)}</td>
                            <td className="px-4 py-4">{product.category}</td>
                            <td className="px-4 py-4">
                              {product.inventory > 0 ? product.inventory : (
                                <span className="text-red-500">缺货</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {getStatusBadge(product.status)}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex justify-center space-x-2">
                                <Link 
                                  href={`/dashboard/products/${product.id}`}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="查看详情"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </Link>
                                <Link 
                                  href={`/dashboard/products/edit/${product.id}`}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="编辑"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Link>
                                {product.status === 'active' ? (
                                  <button 
                                    onClick={() => updateProductStatus(product.id, 'draft')}
                                    className="p-1 text-yellow-600 hover:text-yellow-800"
                                    title="下架"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => updateProductStatus(product.id, 'active')}
                                    className="p-1 text-blue-600 hover:text-blue-800"
                                    title="上架"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                            没有找到符合条件的商品
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
  )
} 