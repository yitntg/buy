'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from '@/src/app/(shared)/contexts/ThemeContext';
import StarRating from '@/src/app/(customer)/components/StarRating';
import { ProductCard } from '@/src/app/(customer)/components/ProductCard';
import { Product, FavoriteProduct } from '@/src/app/(shared)/types/product';
import { formatCurrency, formatDate } from '@/src/app/(shared)/utils/formatters';
import { useCart } from '@/src/app/(shared)/contexts/CartContext';
import { useFavorites } from '@/src/app/(shared)/contexts/FavoritesContext';


export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const { theme } = useTheme();
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 加载产品详情
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!productId) return;

        // 获取产品详情
        const response = await fetch(`/api/customer/products/${productId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `获取产品详情失败: ${response.status}`);
        }
        
        const productData = await response.json();
        setProduct(productData);
        
        if (productData.images && productData.images.length > 0) {
          setSelectedImage(productData.images[0].image_url);
        } else if (productData.primary_image) {
          setSelectedImage(productData.primary_image);
        }
        
        // 获取相关产品
        const relatedResponse = await fetch(`/api/customer/products?category=${productData.category}&limit=4&exclude=${productId}`);
        
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.products || []);
        } else {
          console.error('获取相关产品失败');
          setRelatedProducts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误');
        console.error('获取产品详情失败:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  // 处理添加到购物车
  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image_url : ''),
        quantity
      });
      // 显示一个通知，在实际项目中可能会使用 toast 组件
      alert(`已将 ${quantity} 件 "${product.name}" 添加到购物车`);
    }
  };

  // 处理添加/移除收藏夹
  const toggleFavorite = () => {
    if (!product) return;
    
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
    } else {
      // 转换为FavoriteProduct类型
      const favoriteProduct: FavoriteProduct = {
        ...product,
        addedAt: new Date().toISOString(),
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        inventory: product.inventory || 0
      };
      addToFavorites(favoriteProduct);
    }
  };

  // 处理数量变更
  const handleQuantityChange = (newQuantity: number) => {
    // 确保数量在有效范围内
    const validQuantity = Math.max(1, Math.min(newQuantity, product?.inventory || 99));
    setQuantity(validQuantity);
  };

  // 如果正在加载，显示骨架屏
  if (isLoading) {
    return (
      <div className="animate-pulse">
          <div className="md:flex md:gap-8">
            <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="md:w-1/2 space-y-4 mt-6 md:mt-0">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
    );
  }

  // 如果出错，显示错误信息
  if (error || !product) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">出错了</h2>
          <p className="text-red-500">{error || '找不到产品信息'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            返回上一页
          </button>
        </div>
    );
  }

  // 获取产品图片列表，确保它存在
  const productImages = product.images 
    ? product.images.map(img => img.image_url) 
    : (product.primary_image ? [product.primary_image] : []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 产品详情主体 */}
      <div className="md:flex md:gap-8 mb-12">
        {/* 产品图片区域 */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            <img 
              src={selectedImage || product.primary_image || ''} 
              alt={product.name} 
              className="w-full h-96 object-contain p-4"
            />
          </div>
          
          {/* 缩略图列表 */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`bg-white rounded cursor-pointer border-2 ${
                    selectedImage === image ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-16 object-contain p-1"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 产品信息区域 */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <StarRating 
              rating={product.rating || 4.5}
              size="sm"
            />
            <span className="ml-2 text-sm text-gray-500">4.5 (125 评价)</span>
          </div>
          
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {formatCurrency(product.price)}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          
          {/* 库存信息 */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              (product.inventory || 0) > 10 ? 'bg-green-100 text-green-800' : 
              (product.inventory || 0) > 0 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {(product.inventory || 0) > 10 ? '库存充足' : 
               (product.inventory || 0) > 0 ? `仅剩 ${product.inventory} 件` : 
               '暂时缺货'}
            </span>
            <span className="ml-4 text-sm text-gray-500">
              上架时间: {formatDate(product.created_at || '')}
            </span>
          </div>
          
          {/* 数量选择 */}
          <div className="flex items-center mb-6">
            <span className="mr-4">数量:</span>
            <div className="flex border border-gray-300 rounded">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-3 py-1 border-r border-gray-300 disabled:opacity-50"
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                max={product.inventory || 99} 
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-12 text-center focus:outline-none"
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (product.inventory || 99)}
                className="px-3 py-1 border-l border-gray-300 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-4 mb-8">
            <button 
              onClick={handleAddToCart}
              disabled={!product.inventory || product.inventory <= 0}
              className={`px-6 py-3 rounded flex-1 flex items-center justify-center font-semibold ${
                !product.inventory || product.inventory <= 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              添加到购物车
            </button>
            
            <button 
              onClick={toggleFavorite}
              className={`w-12 h-12 rounded flex items-center justify-center ${
                isInFavorites(product.id)
                  ? 'bg-red-100 text-red-500 border border-red-200' 
                  : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInFavorites(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isInFavorites(product.id) ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 产品详情标签页 */}
      <div className="bg-white rounded-lg shadow-sm mb-12 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button className="px-6 py-3 border-b-2 border-blue-500 text-blue-600 font-medium">
              商品详情
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              规格参数
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              用户评价
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="prose max-w-none">
            <h3>产品介绍</h3>
            <p>
              {product.description}
            </p>
            
            <h3>产品特点</h3>
            <ul>
              <li>高品质材料，精心制作</li>
              <li>符合人体工学设计，舒适耐用</li>
              <li>时尚外观，适合各种场合</li>
              <li>多种颜色可选，满足不同需求</li>
            </ul>
            
            <h3>注意事项</h3>
            <p>
              请按照产品说明书使用和保养产品，避免阳光直射和潮湿环境，定期清洁以保持最佳状态。
            </p>
          </div>
        </div>
      </div>
      
      {/* 相关产品 */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">相关产品</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard 
                key={relatedProduct.id}
                product={relatedProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
