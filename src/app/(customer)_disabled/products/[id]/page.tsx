'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/src/app/(shared)/contexts/CartContext';
import { formatCurrency } from '@/src/app/(shared)/utils/formatters';
import { Product } from '@/src/app/(shared)/types/product';
import { Loader2, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/src/app/(shared)/hooks/useToast';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const productId = params?.id as string;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        // 获取产品详情
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('获取产品数据失败');
        }
        
        const data = await response.json();
        setProductData(data);
        
        // 获取相关产品
        if (data.category) {
          const relatedResponse = await fetch(`/api/products?category=${data.category}&limit=4&exclude=${productId}`);
          
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedProducts(relatedData.products || []);
          }
        }
      } catch (err) {
        console.error('加载产品数据时出错:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  // 处理数量变更
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // 增减数量
  const adjustQuantity = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  // 添加到购物车
  const handleAddToCart = () => {
    if (!productData) return;
    
    setIsAddingToCart(true);
    
    setTimeout(() => {
      addItem(productData, quantity);
      showToast(`已将 ${quantity} 件 ${productData.name} 添加到购物车`);
      setIsAddingToCart(false);
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '无法加载产品信息'}</p>
          <Link href="/products" className="text-primary hover:underline">
            返回商品列表
          </Link>
        </div>
      </div>
    );
  }
  
  // 准备显示的图片
  const productImages = productData.images && productData.images.length > 0 
    ? productData.images.map(img => img.image_url)
    : [productData.primary_image || 'https://via.placeholder.com/500'];
  
  const displayImage = productImages[selectedImageIndex] || productImages[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/products" className="inline-flex items-center text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回商品列表
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 产品图片 */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4 aspect-square relative">
            <Image 
              src={displayImage}
              alt={productData.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* 缩略图 */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`aspect-square relative cursor-pointer border-2 rounded overflow-hidden ${
                    index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image 
                    src={image}
                    alt={`${productData.name} - 图片 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 产品信息 */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
          
          {/* 价格 */}
          <div className="mb-4">
            <span className="text-xl font-bold text-primary">{formatCurrency(productData.price)}</span>
            {productData.original_price && productData.original_price > productData.price && (
              <span className="ml-2 text-gray-500 line-through">
                {formatCurrency(productData.original_price)}
              </span>
            )}
          </div>
          
          {/* 库存情况 */}
          <div className="mb-6">
            <span className={`text-sm ${productData.inventory > 10 ? 'text-green-500' : 'text-orange-500'}`}>
              {productData.inventory > 0 
                ? `有库存 (${productData.inventory > 10 ? '库存充足' : `仅剩 ${productData.inventory} 件`})` 
                : '缺货'
              }
            </span>
          </div>
          
          {/* 描述 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">商品描述</h2>
            <p className="text-gray-700 whitespace-pre-line">{productData.description}</p>
          </div>
          
          {/* 数量选择 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">数量</h2>
            <div className="flex items-center">
              <button 
                onClick={() => adjustQuantity(-1)}
                className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center bg-gray-50"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="h-10 w-16 border-t border-b border-gray-300 text-center"
              />
              <button 
                onClick={() => adjustQuantity(1)}
                className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || productData.inventory === 0}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-primary-dark transition-colors disabled:bg-gray-400"
            >
              {isAddingToCart ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              添加到购物车
            </button>
            
            <button className="w-12 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50">
              <Heart className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* 相关产品 */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">相关商品</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(product => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square relative">
                    <Image 
                      src={product.primary_image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-primary font-bold mt-1">{formatCurrency(product.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
