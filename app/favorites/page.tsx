'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

// 收藏商品类型
interface FavoriteProduct {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: number
  rating: number
  reviews: number
  addedAt: string
}

export default function FavoritesPage() {
  const { isAuthenticated, user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  
  // 模拟获取收藏夹数据
  useEffect(() => {
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      // 如果用户已登录，获取服务器端数据
      // 如果未登录，从本地存储中获取数据
      const demoFavorites = [
        {
          id: 1,
          name: '无线蓝牙耳机',
          description: '高音质立体声，续航持久',
          price: 299,
          image: 'https://picsum.photos/id/1/400/400',
          category: 1,
          rating: 4.5,
          reviews: 125,
          addedAt: '2023-11-12',
        },
        {
          id: 2,
          name: '智能手表',
          description: '健康监测，多功能运动',
          price: 799,
          image: 'https://picsum.photos/id/2/400/400',
          category: 1,
          rating: 4.2,
          reviews: 98,
          addedAt: '2023-11-10',
        },
        {
          id: 3,
          name: '时尚休闲衬衫',
          description: '舒适面料，经典款式',
          price: 199,
          image: 'https://picsum.photos/id/3/400/400',
          category: 3,
          rating: 4.8,
          reviews: 205,
          addedAt: '2023-11-05',
        },
      ]
      
      setFavorites(demoFavorites)
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated])
  
  // 模拟移除收藏
  const removeFromFavorites = (productId: number) => {
    setFavorites(favorites.filter(product => product.id !== productId))
  }
  
  // 渲染收藏商品卡片
  const renderProductCard = (product: FavoriteProduct) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill
              className="object-cover hover:opacity-90 transition-opacity" 
            />
          </div>
        </Link>
        <button 
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-red-500 hover:text-red-700"
          onClick={() => removeFromFavorites(product.id)}
          title="移除收藏"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-gray-800 mb-1 hover:text-primary truncate">{product.name}</h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-primary">
            ¥{product.price}
          </div>
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full bg-primary text-white hover:bg-blue-600 shadow-sm"
              title="加入购物车"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                我的收藏
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {favorites.length > 0 
                  ? `共${favorites.length}件商品` 
                  : '收藏心仪商品，方便后续购买'}
              </p>
            </div>
            
            {favorites.length > 0 && (
              <Link href="/products" className="text-primary hover:underline text-sm">
                继续购物
              </Link>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-600">正在加载您的收藏...</p>
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-8xl text-red-100 mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-4">您的收藏夹是空的</h2>
              <p className="text-gray-500 mb-8">
                浏览商品并点击"收藏"图标，将您喜欢的商品添加到收藏夹
              </p>
              <Link 
                href="/products"
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 inline-block"
              >
                开始购物
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map(product => renderProductCard(product))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 