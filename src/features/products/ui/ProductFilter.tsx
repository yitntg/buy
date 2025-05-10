import React from 'react';

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';

interface ProductFilterProps {
  onSortChange: (sortOption: SortOption) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  selectedSort: SortOption;
  minPrice: number;
  maxPrice: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  onSortChange,
  onPriceRangeChange,
  selectedSort,
  minPrice,
  maxPrice
}) => {
  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    onPriceRangeChange(value, maxPrice);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    onPriceRangeChange(minPrice, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">排序方式</h3>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="price_asc">价格从低到高</option>
          <option value="price_desc">价格从高到低</option>
          <option value="name_asc">名称 A-Z</option>
          <option value="name_desc">名称 Z-A</option>
          <option value="newest">最新上架</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">价格范围</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="最低价"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span>-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="最高价"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}; 