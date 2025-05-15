import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { ProductCard } from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
}

const CategoryDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!id) return;
    
    // 模拟加载分类详情
    const fetchCategoryDetails = async () => {
      setLoading(true);
      try {
        // 这里应该是实际API调用，现在用模拟数据代替
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟分类数据
        const mockCategory = {
          id: id as string,
          name: `分类 ${id}`,
          description: '这是一个产品分类的详细描述，展示该分类下的所有产品。',
          image: 'https://picsum.photos/seed/category1/800/400'
        };
        
        // 模拟产品数据
        const mockProducts = Array.from({ length: 8 }, (_, i) => ({
          id: `product-${id}-${i}`,
          name: `产品 ${i+1} (分类 ${id})`,
          description: '这是一个示例产品描述，展示产品的主要特点和卖点。',
          price: 99.99 + i * 10,
          images: [`https://picsum.photos/seed/product${id}${i}/400/400`],
          category: id as string,
          stock: 100 - i * 5,
          created_at: new Date().toISOString()
        }));
        
        setCategory(mockCategory);
        setProducts(mockProducts);
      } catch (err) {
        console.error('加载分类详情失败:', err);
        setError('无法加载分类详情，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryDetails();
  }, [id]);
  
  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : category ? (
          <>
            <div className="mb-8">
              {category.image && (
                <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
            
            {products.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">该分类下的产品</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">该分类下暂无产品</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">分类不存在</p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CategoryDetailPage; 