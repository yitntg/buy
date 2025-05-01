'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useCart } from '../../context/CartContext'

// 模拟获取商品数据的函数
async function getProduct(id: string) {
  // 在实际应用中，这里应该调用API获取数据
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`, { cache: 'no-store' })
  
  if (!res.ok) {
    throw new Error('获取商品信息失败')
  }
  
  return res.json()
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // 获取商品数据
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        
        if (!res.ok) {
          throw new Error('获取商品信息失败')
        }
        
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        setError('获取商品信息失败，请稍后重试')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.id])
  
  // 处理加入购物车
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      alert('已成功加入购物车！')
    }
  }
  
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">加载商品信息...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  if (error || !product) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-red-500 mb-4">⚠️</div>
              <h2 className="text-xl font-medium mb-4">{error || '商品不存在'}</h2>
              <p className="text-gray-500 mb-8">请返回首页查看其他商品</p>
              <Link 
                href="/" 
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 inline-block"
              >
                返回首页
              </Link>
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
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 返回按钮 */}
            <div className="p-4 border-b">
              <Link href="/" className="text-primary hover:underline flex items-center">
                ← 返回首页
              </Link>
            </div>
            
            {/* 商品信息 */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 商品图片 */}
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* 商品详情 */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <span className="text-yellow-400 text-lg mr-1">★</span>
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-gray-500">{product.reviews} 条评价</span>
                </div>
                
                <div className="text-3xl font-bold text-primary mb-6">
                  ¥{product.price}
                </div>
                
                <p className="text-gray-600 mb-6">{product.description}</p>
                
                <div className="border-t border-b py-4 mb-6">
                  <h3 className="font-medium mb-2">商品库存</h3>
                  <p className="text-green-600">{product.inventory > 0 ? `有货 (${product.inventory})` : '无货'}</p>
                </div>
                
                <div className="flex space-x-4 mb-6">
                  <div className="w-32">
                    <label htmlFor="quantity" className="block text-sm text-gray-600 mb-1">
                      数量
                    </label>
                    <select
                      id="quantity"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    className="flex-1 bg-primary hover:bg-blue-600 text-white py-3 rounded-md"
                    onClick={handleAddToCart}
                  >
                    加入购物车
                  </button>
                  <button className="flex-1 border border-primary text-primary hover:bg-blue-50 py-3 rounded-md">
                    立即购买
                  </button>
                </div>
              </div>
            </div>
            
            {/* 商品规格 */}
            <div className="p-6 border-t">
              <h2 className="text-xl font-bold mb-4">商品规格</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <div className="w-24 text-gray-500">{key}:</div>
                    <div>{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 商品评价 */}
            <div className="p-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">用户评价 ({product.reviews})</h2>
                <Link href={`/product/${product.id}/reviews`} className="text-primary hover:underline">
                  查看全部 →
                </Link>
              </div>
              
              {product.reviews > 0 ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 mr-3">
                        用户
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="text-yellow-400 mr-2">★★★★★</div>
                          <div className="text-sm text-gray-500">2023-10-15</div>
                        </div>
                        <p>这个商品非常好用，质量很好，外观也很漂亮，强烈推荐！</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 更多评论... */}
                </div>
              ) : (
                <p className="text-gray-500">暂无评价</p>
              )}
            </div>
            
            {/* 推荐商品 */}
            <div className="p-6 border-t">
              <h2 className="text-xl font-bold mb-4">相关推荐</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 这里可以展示相关商品，实际项目中可以根据相同分类或标签来推荐 */}
                <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-400">
                  相关商品1
                </div>
                <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-400">
                  相关商品2
                </div>
                <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-400">
                  相关商品3
                </div>
                <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-400">
                  相关商品4
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 