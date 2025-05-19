'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/src/app/(shared)/contexts/CartContext'
import { useFavorites } from '@/src/app/(shared)/contexts/FavoritesContext'
import { formatPrice } from '@/src/app/(shared)/utils/formatters'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  stock: number
  rating: number
  reviews: number
}

interface ProductDetailClientProps {
  productId: string
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // TODO: 实现实际的商品详情获取逻辑
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error('获取商品详情失败')
        }
        const data = await response.json()
        setProduct(data)
        setSelectedImage(data.image)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取商品详情失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      router.push('/cart')
    }
  }

  const handleToggleFavorite = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id)
      } else {
        addToFavorites(product)
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-center text-gray-600">加载中...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">出错了</h1>
        <p className="text-red-600 mb-6">{error || '商品不存在'}</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          返回商品列表
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 商品图片 */}
        <div>
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedImage(product.image)}
              className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500"
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </button>
            {/* TODO: 添加更多商品图片 */}
          </div>
        </div>

        {/* 商品信息 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {product.rating} ({product.reviews} 条评价)
            </span>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-6">
            {formatPrice(product.price)}
          </div>

          <div className="prose prose-sm text-gray-500 mb-6">
            {product.description}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-gray-600 mr-4">数量</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="w-16 text-center border-x border-gray-300 py-1"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="ml-4 text-gray-500">
                库存: {product.stock} 件
              </span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              加入购物车
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isFavorite(product.id)
                  ? 'text-red-500 hover:bg-red-50 focus:ring-red-500'
                  : 'text-gray-400 hover:bg-gray-50 focus:ring-gray-500'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">商品详情</h3>
            <div className="prose prose-sm text-gray-500">
              <p>商品编号: {product.id}</p>
              <p>商品分类: {product.category}</p>
              <p>商品库存: {product.stock} 件</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 