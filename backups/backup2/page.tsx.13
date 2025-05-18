'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'

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

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // 分类名称映射
  const categoryNames: { [key: string]: string } = {
    '1': '电子产品',
    '2': '家居用品',
    '3': '服装鞋帽',
    '4': '美妆护肤',
    '5': '食品饮料',
    '6': '运动户外'
  }
  
  useEffect(() => {
    // 设置分类名称
    setCategoryName(categoryNames[params.id] || '未知分类')
    
    // 加载分类商品数据
    const fetchCategoryProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // 从API获取该分类的商品数据
        const response = await fetch(`/api/products?category=${params.id}&limit=20`, {
          method: 'GET',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        
        if (!response.ok) {
          throw new Error(`获取分类商品失败: ${response.status}`)
        }
        
        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error('获取分类商品失败:', err)
        setError('获取商品数据失败，请刷新页面重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategoryProducts()
  }, [params.id])
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{categoryName}</h1>
              <Link href="/" className="text-primary hover:underline">
                返回首页
              </Link>
            </div>
            <div className="mt-2 text-gray-500">
              <Link href="/" className="hover:text-primary">首页</Link>
              <span className="mx-2">›</span>
              <span>{categoryName}</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-medium mb-2">加载失败</h2>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                点击刷新
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-medium mb-2">暂无相关商品</h2>
              <p className="text-gray-500 mb-4">我们正在积极丰富该分类的商品</p>
              <Link href="/" className="text-primary hover:underline">
                返回首页浏览其他商品
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 