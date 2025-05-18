import React, { useState, useCallback } from 'react';
import { ProductList } from './ProductList';
import { ProductCategory, Category } from './ProductCategory';
import { ProductSearch } from './ProductSearch';
import { ProductFilter, SortOption } from './ProductFilter';
import { Product } from '../domain/Product';

// 模拟分类数据，实际应该从API获取
const mockCategories: Category[] = [
  { id: '1', name: '手机数码' },
  { id: '2', name: '电脑办公' },
  { id: '3', name: '家用电器' },
  { id: '4', name: '服装鞋包' }
];

export const ProductPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortChange = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    setPriceRange({ min, max });
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    // 处理产品点击，例如导航到详情页
    console.log('Product clicked:', product);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 左侧边栏 */}
        <div className="space-y-6">
          <ProductCategory
            categories={mockCategories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
          />
          <ProductFilter
            selectedSort={sortOption}
            onSortChange={handleSortChange}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            onPriceRangeChange={handlePriceRangeChange}
          />
        </div>

        {/* 主要内容区 */}
        <div className="md:col-span-3 space-y-6">
          <ProductSearch onSearch={handleSearch} />
          <ProductList onProductClick={handleProductClick} />
        </div>
      </div>
    </div>
  );
}; 