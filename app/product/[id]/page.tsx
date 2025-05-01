'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useCart } from '../../context/CartContext'

// 定义商品类型接口
interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  rating: number
  reviews: number
  inventory: number
  specifications?: Record<string, string>
}

// 定义评论类型接口
interface Review {
  id: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  content: string
}

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
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  
  // 获取商品数据
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        // 从API获取数据
        const res = await fetch(`/api/products/${params.id}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || '获取商品信息失败');
        }
        
        const data = await res.json();
        setProduct(data);
        
        // 加载模拟评论数据
        const mockReviews: Review[] = [
          {
            id: '1',
            userName: '李小明',
            userAvatar: '',
            rating: 5,
            date: '2023-12-05',
            content: '非常好的产品，质量很好，很满意的购物体验！'
          },
          {
            id: '2',
            userName: '王晓华',
            userAvatar: '',
            rating: 4,
            date: '2023-11-28',
            content: '不错的产品，物流也挺快的，下次还会考虑。'
          }
        ];
        
        setReviews(mockReviews);
        
        // 获取相关产品
        fetchRelatedProducts();
      } catch (err) {
        console.error('获取商品详情出错:', err);
        setError('获取商品信息失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [params.id]);
  
  // 获取相关产品
  const fetchRelatedProducts = async () => {
    try {
      // 实际项目中，这里应该根据当前产品的分类或标签获取相关产品
      const res = await fetch('/api/products?limit=4');
      if (res.ok) {
        const data = await res.json();
        // 过滤掉当前产品
        setRelatedProducts(data.products.filter((p: Product) => p.id !== params.id).slice(0, 3));
      }
    } catch (err) {
      console.error('获取相关产品出错:', err);
    }
  };
  
  // 处理数量变化
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };
  
  // 手动调整数量
  const adjustQuantity = (amount: number) => {
    setQuantity(prev => {
      const newValue = prev + amount;
      return newValue > 0 && newValue <= (product?.inventory || 10) ? newValue : prev;
    });
  };
  
  // 处理加入购物车
  const handleAddToCart = async () => {
    if (product) {
      setAddingToCart(true);
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800));
        addItem(product, quantity);
        
        // 显示成功消息
        window.alert('已成功加入购物车！');
      } catch (err) {
        console.error('加入购物车失败:', err);
      } finally {
        setAddingToCart(false);
      }
    }
  };
  
  // 处理立即购买
  const handleBuyNow = async () => {
    if (product) {
      setAddingToCart(true);
      
      try {
        // 添加到购物车
        addItem(product, quantity);
        
        // 导航到结账页面
        router.push('/cart');
      } catch (err) {
        console.error('立即购买失败:', err);
      } finally {
        setAddingToCart(false);
      }
    }
  };
  
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
                href="/products" 
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 inline-block"
              >
                浏览更多商品
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
            {/* 面包屑导航 */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center text-sm">
                <Link href="/" className="text-gray-500 hover:text-primary">
                  首页
                </Link>
                <span className="mx-2 text-gray-300">/</span>
                <Link href="/products" className="text-gray-500 hover:text-primary">
                  全部商品
                </Link>
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-gray-700">{product.name}</span>
              </div>
            </div>
            
            {/* 商品信息 */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 商品图片 */}
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden border">
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
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(product.rating)
                              ? 'fill-current'
                              : 'text-gray-300'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">{product.reviews} 条评价</span>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 mb-6">
                  <div className="text-3xl font-bold text-primary">
                    ¥{product.price}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    市场价: <span className="line-through">¥{Math.round(product.price * 1.2)}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{product.description}</p>
                
                <div className="border-t border-b py-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-20 text-gray-500">商品库存:</div>
                    <div className={product.inventory > 10 ? 'text-green-600' : product.inventory > 0 ? 'text-orange-500' : 'text-red-500'}>
                      {product.inventory > 0 ? `${product.inventory} 件` : '无货'}
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="w-20 text-gray-500">配送至:</div>
                    <div className="flex items-center">
                      <span>北京市</span>
                      <button className="ml-2 text-primary text-sm">修改</button>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="w-20 text-gray-500">服务:</div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-4">
                        <span className="text-primary">✓</span> 7天无理由退货
                      </span>
                      <span className="text-sm text-gray-600">
                        <span className="text-primary">✓</span> 48小时发货
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <label htmlFor="quantity" className="w-20 text-gray-500">
                      数量:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => adjustQuantity(-1)} 
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <div className="w-14 h-10 border-x border-gray-300 flex items-center justify-center">
                        {quantity}
                      </div>
                      <button 
                        onClick={() => adjustQuantity(1)} 
                        disabled={quantity >= product.inventory}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <span className="ml-3 text-sm text-gray-500">
                      (最多可购买 {product.inventory} 件)
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    className="flex-1 bg-primary hover:bg-blue-600 text-white py-3 rounded-md flex items-center justify-center disabled:opacity-70"
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.inventory <= 0}
                  >
                    {addingToCart ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        处理中...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        加入购物车
                      </>
                    )}
                  </button>
                  <button 
                    className="flex-1 border border-primary text-primary hover:bg-blue-50 py-3 rounded-md disabled:opacity-70"
                    onClick={handleBuyNow}
                    disabled={addingToCart || product.inventory <= 0}
                  >
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
                  <div key={key} className="flex border-b border-gray-100 py-2">
                    <div className="w-24 text-gray-500">{key}:</div>
                    <div className="text-gray-800">{String(value)}</div>
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
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 mr-3">
                          {review.userAvatar ? (
                            <Image
                              src={review.userAvatar}
                              alt={review.userName}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            review.userName.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            <div className="font-medium mr-2">{review.userName}</div>
                            <div className="flex text-yellow-400 text-sm">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'fill-current'
                                      : 'text-gray-300'
                                  }`}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                            <div className="text-sm text-gray-500 ml-2">{review.date}</div>
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">暂无评价</p>
              )}
            </div>
            
            {/* 商品详情 */}
            <div className="p-6 border-t">
              <h2 className="text-xl font-bold mb-4">商品详情</h2>
              <div className="prose max-w-none">
                <p>{product.description}</p>
                {/* 这里可以添加更多详细的产品描述、图片等 */}
                <div className="mt-4 space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Image
                      src={`https://picsum.photos/id/${Number(product.id) + 10}/800/400`}
                      alt="商品详情图片"
                      width={800}
                      height={400}
                      className="w-full"
                    />
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <Image
                      src={`https://picsum.photos/id/${Number(product.id) + 20}/800/400`}
                      alt="商品详情图片"
                      width={800}
                      height={400}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 推荐商品 */}
            <div className="p-6 border-t">
              <h2 className="text-xl font-bold mb-4">相关推荐</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedProducts.length > 0 ? (
                  relatedProducts.map(related => (
                    <Link href={`/product/${related.id}`} key={related.id} className="group">
                      <div className="bg-white border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={related.image}
                            alt={related.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary">{related.name}</h3>
                          <div className="mt-2 text-primary font-medium">¥{related.price}</div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-gray-100 h-60 rounded-lg animate-pulse">
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 