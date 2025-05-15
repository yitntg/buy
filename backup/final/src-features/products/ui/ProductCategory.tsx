import React from 'react';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ProductCategoryProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
}

export const ProductCategory: React.FC<ProductCategoryProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">商品分类</h2>
      <div className="space-y-2">
        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            !selectedCategoryId
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => onCategorySelect('')}
        >
          全部商品
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategoryId === category.id
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}; 