'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/src/app/(shared)/contexts/FavoritesContext';
import { useAuth } from '@/src/app/(shared)/contexts/AuthContext';
import { formatCurrency } from '@/src/app/(shared)/utils/formatters';


export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 简单延迟以模拟加载
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveItem = (productId: string | number) => {
    removeFromFavorites(productId);
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空收藏夹吗？')) {
      clearFavorites();
    }
  };

  const handleGoToProduct = (productId: string | number) => {
    router.push(`/products/${productId}`);
  };

  // 渲染收藏夹为空的状态
  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-700 mb-2">您的收藏夹是空的</h3>
      <p className="text-gray-500 mb-6">浏览商品并点击收藏图标添加到您的收藏夹</p>
      <button 
        onClick={() => router.push('/products')}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        浏览商品
      </button>
    </div>
  );

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-40 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">我的收藏</h1>
          {favorites.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-800"
            >
              清空收藏夹
            </button>
          )}
        </div>
        
        {favorites.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <p className="text-gray-600">
                您的收藏夹中有 <span className="font-semibold">{favorites.length}</span> 件商品
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image_url : 'https://via.placeholder.com/300')} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                      onClick={() => handleGoToProduct(product.id)}
                    />
                    <button 
                      onClick={() => handleRemoveItem(product.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer truncate"
                      onClick={() => handleGoToProduct(product.id)}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'} 
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">
                        ({product.reviews || 0} 评价)
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</span>
                      <div className="text-xs text-gray-500">
                        {product.addedAt && new Date(product.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button 
                        onClick={() => handleGoToProduct(product.id)}
                        className="flex-1 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
  );
} 