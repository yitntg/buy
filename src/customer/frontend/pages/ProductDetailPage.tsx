import { useState, useEffect } from 'react';
import { useTheme } from '@/shared/contexts/ThemeContext';
import StarRating from '@/customer/frontend/components/StarRating';
import { ProductCard } from '@/customer/frontend/components/ProductCard';
import { Product, FavoriteProduct } from '@/shared/types/product';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { useCart } from '@/shared/contexts/CartContext';
import { useFavorites } from '@/shared/contexts/FavoritesContext';

interface ProductDetailPageProps {
  productId: string;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
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
        
        // 实际项目中这里会调用API
        // const response = await fetch(`/api/products/${productId}`);
        
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 使用模拟数据
        const mockProduct = getMockProduct(productId);
        setProduct(mockProduct);
        if (mockProduct.images && mockProduct.images.length > 0) {
          setSelectedImage(mockProduct.images[0]);
        } else if (mockProduct.image) {
          setSelectedImage(mockProduct.image);
        }
        
        // 加载相关产品
        setRelatedProducts(getMockRelatedProducts(productId, 4));
        
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
        image: product.image,
        images: product.images,
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
        inventory: product.inventory || product.stock || 0
      };
      addToFavorites(favoriteProduct);
    }
  };

  // 处理数量变更
  const handleQuantityChange = (newQuantity: number) => {
    // 确保数量在有效范围内
    const validQuantity = Math.max(1, Math.min(newQuantity, product?.stock || 99));
    setQuantity(validQuantity);
  };

  // 如果正在加载，显示骨架屏
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
        <main className="container mx-auto px-4 py-8">
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
        </main>
      </div>
    );
  }

  // 如果出错，显示错误信息
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
        <main className="container mx-auto px-4 py-8">
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
        </main>
      </div>
    );
  }

  // 获取产品图片列表，确保它存在
  const productImages = product.images || [product.image || ''];

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      <main className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-6 text-sm">
          <a href="/" className="text-gray-500 hover:text-blue-600">首页</a>
          <span className="mx-2 text-gray-500">/</span>
          <a href="/products" className="text-gray-500 hover:text-blue-600">全部商品</a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700 font-medium">{product.name}</span>
        </nav>
        
        {/* 产品详情主体 */}
        <div className="md:flex md:gap-8 mb-12">
          {/* 产品图片区域 */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <img 
                src={selectedImage || (product.image || '')} 
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
                (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' : 
                (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {(product.stock || 0) > 10 ? '库存充足' : 
                 (product.stock || 0) > 0 ? `仅剩 ${product.stock} 件` : 
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
                  max={product.stock || 99} 
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-12 text-center focus:outline-none"
                />
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.stock || 99)}
                  className="px-3 py-1 border-l border-gray-300 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <span className="ml-4 text-sm text-gray-500">
                可购买数量: {product.stock || 0}
              </span>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={(product.stock || 0) === 0}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                加入购物车
              </button>
              <button 
                onClick={toggleFavorite}
                className={`px-6 py-3 rounded-lg border font-bold ${
                  isInFavorites(product.id)
                    ? 'bg-pink-50 text-pink-600 border-pink-300 hover:bg-pink-100'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {isInFavorites(product.id) ? '已收藏' : '收藏'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 产品详细信息标签页 */}
        <div className="bg-white rounded-lg shadow-sm mb-12 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className="px-6 py-4 border-b-2 border-blue-500 text-blue-600 font-medium">
                商品详情
              </button>
              <button className="px-6 py-4 text-gray-500 hover:text-gray-700">
                规格参数
              </button>
              <button className="px-6 py-4 text-gray-500 hover:text-gray-700">
                用户评价 (125)
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4">商品详情</h3>
            <div className="space-y-4">
              <p>这是一段示例的商品详情描述，实际商品描述会更加详细丰富。</p>
              <p>商品可能包含多个部分的详细说明，如材质、用途、使用方法等。</p>
              <p>还可能包含一些商品的亮点特性和卖点，以及商品使用注意事项。</p>
              
              {/* 示例：详情图片 */}
              <div className="my-6">
                <img 
                  src="https://via.placeholder.com/800x400?text=Detail+Image" 
                  alt="产品详情图" 
                  className="w-full rounded-lg"
                />
              </div>
              
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 bg-gray-50 font-medium w-1/4">品牌</td>
                    <td className="py-2 px-4">示例品牌</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 bg-gray-50 font-medium">产地</td>
                    <td className="py-2 px-4">中国</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 bg-gray-50 font-medium">材质</td>
                    <td className="py-2 px-4">优质材料</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 bg-gray-50 font-medium">保修期</td>
                    <td className="py-2 px-4">一年</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* 相关商品推荐 */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">相关商品推荐</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// 辅助函数：生成模拟产品数据
function getMockProduct(productId: string): Product {
  return {
    id: productId,
    name: `模拟商品 ${productId}`,
    description: '这是一个详细的模拟商品描述，用于测试产品详情页面的展示效果。该商品具有多种功能和特性，适合多种场景使用。',
    price: Math.floor(Math.random() * 1000) + 50,
    images: [
      `https://via.placeholder.com/600x600?text=Product+${productId}+Main`,
      `https://via.placeholder.com/600x600?text=Product+${productId}+View+1`,
      `https://via.placeholder.com/600x600?text=Product+${productId}+View+2`,
      `https://via.placeholder.com/600x600?text=Product+${productId}+View+3`,
    ],
    image: `https://via.placeholder.com/600x600?text=Product+${productId}+Main`,
    category: 'mock-category',
    stock: Math.floor(Math.random() * 100) + 1,
    created_at: new Date().toISOString(),
    rating: 4.5,
    reviews: 125
  };
}

// 辅助函数：生成模拟相关产品数据
function getMockRelatedProducts(excludeId: string, count: number): Product[] {
  const categories = ['electronics', 'clothing', 'home', 'beauty', 'food'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `related-${i + 1}`,
    name: `相关商品 ${i + 1}`,
    description: '这是一个相关商品的简短描述',
    price: Math.floor(Math.random() * 1000) + 50,
    images: [`https://via.placeholder.com/400?text=Related+${i + 1}`],
    image: `https://via.placeholder.com/400?text=Related+${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    stock: Math.floor(Math.random() * 100) + 1,
    created_at: new Date().toISOString(),
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 50) + 5
  }));
} 
