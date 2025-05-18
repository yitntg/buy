'use client'

import { useState, useEffect } from 'react';
import { Product } from '@/src/app/shared/types/product';
import { formatCurrency, formatDate } from '@/src/app/shared/utils/formatters';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  isLoading?: boolean;
}

// 辅助函数：将产品ID转换为字符串
const getProductIdAsString = (id: string | number): string => {
  return id.toString();
};

// 安全格式化日期函数
const formatDateSafe = (date?: string): string => {
  return date ? formatDate(date) : '未知';
};

export function ProductsTable({ products, onEdit, onDelete, isLoading = false }: ProductsTableProps) {
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  // 更新筛选和排序后的产品列表
  useEffect(() => {
    let result = [...products];
    
    // 应用搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        (typeof product.id === 'string' && product.id.toLowerCase().includes(term)) ||
        (typeof product.id === 'number' && product.id.toString().includes(term))
      );
    }
    
    // 应用排序
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, sortField, sortDirection]);
  
  // 处理排序
  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      // 如果点击当前排序字段，则切换排序方向
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // 如果点击新字段，则设置为升序
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // 切换选择所有产品
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      const productIds = filteredProducts.map(p => getProductIdAsString(p.id));
      setSelectedProducts(productIds);
    }
  };
  
  // 切换选择单个产品
  const toggleSelectProduct = (productId: string | number) => {
    const idString = getProductIdAsString(productId);
    if (selectedProducts.includes(idString)) {
      setSelectedProducts(selectedProducts.filter(id => id !== idString));
    } else {
      setSelectedProducts([...selectedProducts, idString]);
    }
  };
  
  // 批量删除选中产品
  const handleBulkDelete = () => {
    if (window.confirm(`确认删除选中的 ${selectedProducts.length} 个产品吗？`)) {
      // 依次删除选中产品
      selectedProducts.forEach(id => onDelete(id));
      setSelectedProducts([]);
    }
  };
  
  // 获取排序图标
  const getSortIcon = (field: keyof Product) => {
    if (field !== sortField) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  // 检查并获取产品图片
  const getProductImage = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return 'https://via.placeholder.com/40';
  };
  
  // 检查产品库存
  const getProductStock = (product: Product): number => {
    if (typeof product.stock === 'number') {
      return product.stock;
    }
    if (typeof product.inventory === 'number') {
      return product.inventory;
    }
    return 0;
  };
  
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="搜索产品..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500">
            显示 {filteredProducts.length} / {products.length} 个产品
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedProducts.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              删除 ({selectedProducts.length})
            </button>
          )}
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            新增产品
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input 
                  type="checkbox" 
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                产品名称 {getSortIcon('name')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                价格 {getSortIcon('price')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('stock')}
              >
                库存 {getSortIcon('stock')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                创建时间 {getSortIcon('created_at')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                  没有找到产品
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={getProductIdAsString(product.id)} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(getProductIdAsString(product.id))}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 object-cover rounded" 
                          src={getProductImage(product)}
                          alt={product.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-600">{formatCurrency(product.price)}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {/* 使用辅助函数获取库存 */}
                    {(() => {
                      const stock = getProductStock(product);
                      return (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          stock > 10 ? 'bg-green-100 text-green-800' : 
                          stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {stock}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDateSafe(product.created_at || product.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(`确认删除产品"${product.name}"吗？`)) {
                          onDelete(getProductIdAsString(product.id));
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
