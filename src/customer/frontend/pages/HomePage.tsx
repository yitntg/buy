'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { ProductCard } from '@/customer/frontend/components/ProductCard';
import { Product } from '@/shared/types/product';
import { formatCurrency } from '@/shared/utils/formatters';

export default function HomePage() {
  const { theme } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // 实际项目中这里会调用后端API
        const response = await fetch('/api/products/featured');
        
        if (!response.ok) {
          throw new Error('获取产品数据失败');
        }
        
        const data = await response.json();
        setFeaturedProducts(data.featured);
        setNewArrivals(data.newArrivals);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误');
        console.error('获取产品失败:', err);
        
        // 使用模拟数据作为后备
        setFeaturedProducts(getMockProducts(theme.featuredCount || 4));
        setNewArrivals(getMockProducts(6));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [theme.featuredCount]);

  // 渲染特色产品部分
  const renderFeaturedProducts = () => {
    if (isLoading) {
      return <div className="text-center py-12">加载中...</div>;
    }

    if (error && featuredProducts.length === 0) {
      return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    return (
      <div className={`grid gap-6 grid-cols-1 sm:grid-cols-${theme.gridColumns.sm} md:grid-cols-${theme.gridColumns.md} lg:grid-cols-${theme.gridColumns.lg}`}>
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  // 渲染新品部分
  const renderNewArrivals = () => {
    if (isLoading) {
      return <div className="text-center py-8">加载中...</div>;
    }

    if (error && newArrivals.length === 0) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {newArrivals.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
            <img
              src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-40 object-cover object-center rounded-md mb-3"
            />
            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
            <p className="text-blue-600 font-bold mt-1">{formatCurrency(product.price)}</p>
          </div>
        ))}
      </div>
    );
  };

  // 渲染促销横幅
  const renderPromoBanner = () => {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 my-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-2">限时促销活动</h2>
            <p className="mb-4">全场商品满200元立减30元，新用户首单额外95折！</p>
            <button className="bg-white text-blue-600 font-bold px-6 py-2 rounded-full hover:bg-blue-50 transition-colors">
              立即查看
            </button>
          </div>
          <div className="mt-6 md:mt-0 md:w-1/3">
            <div className="text-center">
              <span className="block text-5xl font-extrabold">30%</span>
              <span className="block text-xl">OFF</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      <main className="container mx-auto px-4 py-8">
        {/* 英雄区域 */}
        {theme.showHeroSection && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 mb-12 shadow-lg">
            <div className="md:flex md:items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h1 className="text-4xl font-bold mb-4">发现精选好物，丰富你的生活</h1>
                <p className="text-xl mb-6">汇聚全球优质商品，满足你的一切购物需求</p>
                <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors">
                  开始选购
                </button>
              </div>
              <div className="md:w-1/2 md:pl-10">
                <img 
                  src="https://via.placeholder.com/600x400" 
                  alt="精选商品" 
                  className="rounded-lg shadow-md" 
                />
              </div>
            </div>
          </div>
        )}
        
        {/* 特色产品 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">精选推荐</h2>
          {renderFeaturedProducts()}
        </section>
        
        {/* 促销横幅 */}
        {renderPromoBanner()}
        
        {/* 新品上市 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">新品上市</h2>
          {renderNewArrivals()}
        </section>
        
        {/* 分类快捷入口 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">热门分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['电子产品', '家居日用', '服饰鞋包', '美妆个护'].map(category => (
              <div key={category} className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🛒</span>
                </div>
                <h3 className="font-medium">{category}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// 辅助函数：生成模拟产品数据
function getMockProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-product-${i}`,
    name: `Mock Product ${i}`,
    description: 'This is a mock product for display purposes.',
    price: 99.99,
    images: ['/images/placeholder.jpg'],
    category: `mock-category-${i % 3}`,
    stock: 100,
    created_at: new Date().toISOString(),
  }));
}
