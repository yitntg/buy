import React, { useEffect, useState, useCallback } from 'react';
import { Product } from '../domain/Product';
import { SearchProductsUseCase } from '../domain/use-cases/SearchProducts';
import { ProductApi } from '../api/ProductApi';
import { ProductSearchParams, ProductSearchResult } from '../domain/ProductRepository';
import { SortOption } from './ProductFilter';

interface ProductListProps {
  onProductClick?: (product: Product) => void;
  searchQuery?: string;
  categoryId?: string;
  sortOption?: SortOption;
  minPrice?: number;
  maxPrice?: number;
}

export const ProductList: React.FC<ProductListProps> = ({
  onProductClick,
  searchQuery,
  categoryId,
  sortOption,
  minPrice,
  maxPrice
}) => {
  const [searchResult, setSearchResult] = useState<ProductSearchResult>({
    products: [],
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productRepository = new ProductApi();
      const searchProductsUseCase = new SearchProductsUseCase(productRepository);
      
      const params: ProductSearchParams = {
        query: searchQuery,
        categoryId,
        sortBy: sortOption,
        minPrice,
        maxPrice,
        page: searchResult.page,
        pageSize: searchResult.pageSize
      };

      const result = await searchProductsUseCase.execute(params);
      setSearchResult(result);
    } catch (err) {
      setError('加载产品列表失败');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryId, sortOption, minPrice, maxPrice, searchResult.page, searchResult.pageSize]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePageChange = (page: number) => {
    setSearchResult(prev => ({ ...prev, page }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResult.products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onProductClick?.(product)}
          >
            {product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">
                  {product.price.getFormattedAmount()}
                </span>
                <span className="text-sm text-gray-500">
                  库存: {product.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      {searchResult.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(searchResult.page - 1)}
            disabled={searchResult.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            上一页
          </button>
          <span className="px-4 py-2">
            第 {searchResult.page} 页，共 {searchResult.totalPages} 页
          </span>
          <button
            onClick={() => handlePageChange(searchResult.page + 1)}
            disabled={searchResult.page === searchResult.totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}; 