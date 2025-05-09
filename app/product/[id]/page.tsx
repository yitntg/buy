'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useCart } from '../../context/CartContext'
import ProductGallery from '../../components/ProductGallery'
import ProductActions from '../../components/ProductActions'
import ProductDescription from '../../components/ProductDescription'
import ProductRecommendations from '../../components/ProductRecommendations'
import ProductVariants from '../../components/ProductVariants'
import StarRating from '../../components/StarRating'
import { Share2, Heart } from 'lucide-react'

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
  images?: string[]
  variants?: {
    id: string
    name: string
    options: {
      id: string
      name: string
      value: string
      imageUrl?: string
    }[]
  }[]
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addItem } = useCart()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({})
  
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
        
        // 添加处理商品图片的逻辑
        // 如果没有images数组，则使用主图片创建一个单一图片的数组
        if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
          data.images = [data.image];
        }
        
        // 确保主图片在图片数组中
        if (data.image && !data.images.includes(data.image)) {
          data.images.unshift(data.image);
        }
        
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
        
        // 初始化变体选择
        if (data.variants && data.variants.length > 0) {
          const initialSelections: Record<string, string> = {};
          data.variants.forEach((variant: any) => {
            if (variant.options && variant.options.length > 0) {
              initialSelections[variant.id] = variant.options[0].id;
            }
          });
          setVariantSelections(initialSelections);
        }
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
      const res = await fetch('/api/products?limit=8');
      if (res.ok) {
        const data = await res.json();
        // 过滤掉当前产品
        setRelatedProducts(data.products.filter((p: Product) => p.id !== params.id));
      }
    } catch (err) {
      console.error('获取相关产品出错:', err);
    }
  };
  
  // 处理加入购物车
  const handleAddToCart = async (quantity: number) => {
    if (product) {
      try {
        // 添加到购物车，包含变体选择
        addItem({
          ...product,
          variantSelections
        }, quantity);
        
        return Promise.resolve();
      } catch (err) {
        console.error('加入购物车失败:', err);
        return Promise.reject(err);
      }
    }
    return Promise.reject('商品不存在');
  };
  
  // 处理立即购买
  const handleBuyNow = async (quantity: number) => {
    if (product) {
      try {
        // 添加到购物车
        addItem({
          ...product,
          variantSelections
        }, quantity);
        
        // 导航到结账页面
        router.push('/cart');
        return Promise.resolve();
      } catch (err) {
        console.error('立即购买失败:', err);
        return Promise.reject(err);
      }
    }
    return Promise.reject('商品不存在');
  };
  
  // 处理添加到收藏夹
  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    // 这里可以添加实际的收藏功能逻辑
  };
  
  // 处理变体选择变化
  const handleVariantChange = (selections: Record<string, string>) => {
    setVariantSelections(selections);
    // 在实际应用中，这里可能需要根据选择的变体更新价格、库存或图片
  };
  
  // 加载状态
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="animate-pulse w-full max-w-6xl">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <div className="h-96 bg-gray-300 rounded-lg"></div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
                    <div className="h-12 bg-gray-300 rounded mb-6"></div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                    </div>
                    <div className="mt-8 flex space-x-4">
                      <div className="h-12 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-12 bg-gray-300 rounded w-1/2"></div>
                    </div>
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
  
  // 错误状态
  if (error || !product) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
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
      <main className="min-h-screen py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* 面包屑导航 */}
          <div className="mb-6">
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
          
          {/* 商品主要信息区 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 左侧：商品图片 */}
              <div>
                <ProductGallery 
                  images={product.images || [product.image]} 
                  productName={product.name} 
                />
              </div>
              
              {/* 右侧：商品信息和操作 */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <StarRating 
                    rating={product.rating} 
                    size="md" 
                    showNumber={true} 
                    reviewCount={product.reviews}
                    className="mr-2"
                  />
                  
                  {/* 社交分享和收藏按钮 */}
                  <div className="ml-auto flex space-x-2">
                    <button 
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isInWishlist ? 'bg-red-50 text-red-500 border-red-200' : 'text-gray-400 border-gray-200 hover:text-gray-600'}`}
                      onClick={handleAddToWishlist}
                      title="收藏商品"
                    >
                      <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
                    </button>
                    <button 
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600"
                      title="分享商品"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 mb-4">
                  <p className="text-gray-600">{product.description}</p>
                </div>
                
                {/* 变体选择 */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6">
                    <ProductVariants 
                      variants={product.variants} 
                      onChange={handleVariantChange}
                      defaultSelections={variantSelections}
                      disabled={product.inventory <= 0}
                    />
                  </div>
                )}
                
                {/* 购买操作区 */}
                <ProductActions 
                  price={product.price}
                  originalPrice={product.price * 1.2} // 示例：原价为现价的1.2倍
                  inventory={product.inventory}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onAddToWishlist={handleAddToWishlist}
                  disablePurchase={product.inventory <= 0}
                />
              </div>
            </div>
          </div>
          
          {/* 商品详情区 */}
          <ProductDescription 
            description={product.description}
            specifications={product.specifications}
            reviewsSection={
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          {review.userAvatar ? (
                            <img 
                              src={review.userAvatar} 
                              alt={review.userName} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500">{review.userName.slice(0, 1)}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{review.userName}</div>
                              <StarRating rating={review.rating} size="sm" className="mt-1" />
                            </div>
                            <div className="text-gray-500 text-sm">{review.date}</div>
                          </div>
                          <p className="text-gray-700 mt-2">{review.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无评价，快来发表第一条评价吧！
                  </div>
                )}
                
                {reviews.length > 0 && (
                  <div className="mt-6 text-center">
                    <Link href={`/product/${product.id}/reviews`} className="text-primary hover:underline">
                      查看全部评价 →
                    </Link>
                  </div>
                )}
              </div>
            }
            additionalInfo={
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">售后保障</h3>
                  <p className="text-sm text-gray-600">本商品支持7天无理由退换，15天质量问题换货，1年保修服务。</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">温馨提示</h3>
                  <p className="text-sm text-gray-600">商品实际颜色以实物为准，因拍摄灯光及显示器色差等问题可能造成商品图片与实物有些许差异。</p>
                </div>
              </div>
            }
          />
          
          {/* 相关商品推荐 */}
          <ProductRecommendations 
            title="猜你喜欢"
            products={relatedProducts}
            currentProductId={product.id}
          />
          
          {/* 最近浏览 */}
          <ProductRecommendations 
            title="同类热卖"
            products={relatedProducts.slice().reverse()} // 示例：使用相同数据但反转顺序
            currentProductId={product.id}
          />
        </div>
      </main>
      <Footer />
    </>
  )
} 