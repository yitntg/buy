'use client'

// 直接导出服务器配置
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductImage } from '@/src/app/(shared)/types/product';
import { formatCurrency, formatDate } from '@/src/app/(shared)/utils/formatters';
import Link from 'next/link';
import { PlusCircle, Search, Filter, Trash2, Edit, ChevronDown } from 'lucide-react';

// 扩展产品类型以包含管理端需要的额外字段
interface AdminProduct extends Product {
  brand?: string;
  model?: string;
  free_shipping?: boolean;
  returnable?: boolean;
  warranty?: boolean;
  images?: ProductImage[];
  primary_image?: string;
  inventory: number;  // 库存数量
  status: 'active' | 'draft' | 'out-of-stock';  // 产品状态
  category: string;  // 分类名称
}

// 分页参数接口
interface PaginationParams {
  page: number;
  limit: number;
}

// 筛选参数接口
interface FilterParams {
  category_id?: string;
  search?: string;
  sort_by?: string;
  min_price?: number;
  max_price?: number;
}

// 模拟产品数据
const MOCK_PRODUCTS: AdminProduct[] = [
  { id: 1, name: '智能手表Pro', description: '智能手表Pro描述', price: 1299, category: '智能穿戴', inventory: 35, sku: 'WT-001', status: 'active' },
  { id: 2, name: '无线蓝牙耳机', description: '无线蓝牙耳机描述', price: 499, category: '音频设备', inventory: 42, sku: 'HE-002', status: 'active' },
  { id: 3, name: '4K高清投影仪', description: '4K高清投影仪描述', price: 3999, category: '家用电器', inventory: 8, sku: 'PR-003', status: 'active' },
  { id: 4, name: '便携式移动电源', description: '便携式移动电源描述', price: 199, category: '配件', inventory: 56, sku: 'PB-004', status: 'active' },
  { id: 5, name: '机械键盘', description: '机械键盘描述', price: 599, category: '电脑配件', inventory: 23, sku: 'KB-005', status: 'active' },
  { id: 6, name: '电竞鼠标', description: '电竞鼠标描述', price: 329, category: '电脑配件', inventory: 0, sku: 'MS-006', status: 'out-of-stock' },
  { id: 7, name: '高清摄像头', description: '高清摄像头描述', price: 269, category: '电脑配件', inventory: 15, sku: 'CM-007', status: 'active' },
  { id: 8, name: '智能体重秤', description: '智能体重秤描述', price: 129, category: '智能穿戴', inventory: 31, sku: 'SC-008', status: 'active' },
  { id: 9, name: '新品测试产品', description: '新品测试产品描述', price: 999, category: '测试分类', inventory: 5, sku: 'TS-009', status: 'draft' },
  { id: 10, name: '蓝牙音箱', description: '蓝牙音箱描述', price: 399, category: '音频设备', inventory: 27, sku: 'SP-010', status: 'active' },
];

// 获取状态标签样式
const getStatusStyle = (status: AdminProduct['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'out-of-stock':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 获取状态标签文本
const getStatusText = (status: AdminProduct['status']) => {
  switch (status) {
    case 'active':
      return '上架中';
    case 'draft':
      return '草稿';
    case 'out-of-stock':
      return '缺货';
    default:
      return '未知';
  }
};

// 判断产品库存状态
const getInventoryStatusStyle = (inventory: number) => {
  if (inventory === 0) {
    return 'text-red-600';
  } else if (inventory <= 5) {
    return 'text-yellow-600';
  } else {
    return 'text-gray-900';
  }
};

// 产品管理页面组件
export function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  
  // 分页状态
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });
  
  // 筛选状态
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    sort_by: 'newest'
  });
  
  // 加载产品数据
  useEffect(() => {
    fetchProducts(pagination, filters);
  }, [pagination.page, pagination.limit, filters]);
  
  // 从API获取产品数据
  const fetchProducts = async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ) => {
    setIsLoading(true);
    
    try {
      // 构建请求参数
      const queryParams = new URLSearchParams({
        page: paginationParams.page.toString(),
        limit: paginationParams.limit.toString(),
      });
      
      // 添加筛选条件
      if (filterParams.search) {
        queryParams.append('search', filterParams.search);
      }
      
      if (filterParams.category_id) {
        queryParams.append('category_id', filterParams.category_id);
      }
      
      if (filterParams.min_price !== undefined) {
        queryParams.append('min_price', filterParams.min_price.toString());
      }
      
      if (filterParams.max_price !== undefined) {
        queryParams.append('max_price', filterParams.max_price.toString());
      }
      
      if (filterParams.sort_by) {
        queryParams.append('sort_by', filterParams.sort_by);
      }
      
      // 发起API请求
      const response = await fetch(`/api/admin/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('获取产品数据失败:', error);
      // 显示错误信息
      alert('获取产品数据失败，请重试');
      // 重置为空列表
      setProducts([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // 处理筛选条件变更
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // 重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // 处理分页
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  // 处理每页显示数量变更
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setPagination({ page: 1, limit: newLimit });
  };
  
  // 计算总页数
  const totalPages = Math.ceil(total / pagination.limit);
  
  // 处理查看产品详情
  const handleViewProduct = (productId: string | number) => {
    router.push(`/admin/products/${productId}`);
  };
  
  // 处理编辑产品
  const handleEditProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  
  // 处理删除产品
  const handleDeleteProduct = async (productId: string | number) => {
    if (window.confirm('确定要删除此产品吗？此操作不可撤销。')) {
      try {
        // 调用API删除产品
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '删除产品失败');
        }
        
        // 从列表中移除已删除的产品
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        setTotal(prevTotal => prevTotal - 1);
        
        // 显示成功消息
        alert('产品已成功删除');
      } catch (error) {
        console.error('删除产品失败:', error);
        alert('删除产品失败，请重试');
      }
    }
  };
  
  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search?.toLowerCase() || '') || 
                        product.sku.toLowerCase().includes(filters.search?.toLowerCase() || '');
    const matchesCategory = filters.category_id ? product.category === filters.category_id : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // 获取所有分类列表（去重）
  const categories = [...new Set(products.map(p => p.category))];
  
  // 批量删除所选产品
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // 全选/取消全选
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };
  
  // 单选
  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">产品管理</h1>
        <div className="flex space-x-2">
          <Link 
            href="/admin/products/new" 
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            <PlusCircle size={18} className="mr-2" />
            <span>添加新产品</span>
          </Link>
          
          <div className="relative">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter size={18} className="mr-2 text-gray-600" />
              <span>筛选</span>
              <ChevronDown size={16} className="ml-2 text-gray-600" />
            </button>
            
            {/* 分类筛选下拉菜单 */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 hidden">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-600 border-b">按分类筛选</div>
                <div className="mt-2 max-h-60 overflow-auto">
                  <div className="px-3 py-1">
                    <label className="flex items-center space-x-2 text-sm">
                      <input 
                        type="radio" 
                        name="category_id" 
                        checked={filters.category_id === ''} 
                        onChange={(e) => setFilters(prev => ({ ...prev, category_id: '' }))} 
                      />
                      <span>全部分类</span>
                    </label>
                  </div>
                  {categories.map(category => (
                    <div key={category} className="px-3 py-1">
                      <label className="flex items-center space-x-2 text-sm">
                        <input 
                          type="radio" 
                          name="category_id" 
                          checked={filters.category_id === category} 
                          onChange={(e) => setFilters(prev => ({ ...prev, category_id: category }))} 
                        />
                        <span>{category}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜索产品名称或描述..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select
              name="sort_by"
              value={filters.sort_by}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="newest">最新添加</option>
              <option value="price_asc">价格低到高</option>
              <option value="price_desc">价格高到低</option>
              <option value="name_asc">名称 A-Z</option>
              <option value="name_desc">名称 Z-A</option>
              <option value="inventory_asc">库存少到多</option>
              <option value="inventory_desc">库存多到少</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            搜索
          </button>
        </form>
      </div>
      
      {/* 产品表格 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: pagination.limit }, (_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              {/* 表头 */}
              <div className="border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="w-12 px-4 py-3 text-left">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        产品信息
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        分类
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        库存
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        价格
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map(product => (
                      <tr key={String(product.id)} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={selectedIds.includes(product.id)}
                            onChange={(e) => handleSelectItem(product.id, e.target.checked)}
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                src={product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image_url : 'https://via.placeholder.com/300')}
                                alt={product.name}
                                className="w-12 h-12 object-cover object-center rounded-md"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                onClick={() => handleViewProduct(product.id)}>
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.brand ?? '未知品牌'} • {product.model ?? '未知型号'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.category}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className={`text-sm ${getInventoryStatusStyle(product.inventory)}`}>
                            {product.inventory}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">¥{product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(product.status)}`}>
                            {getStatusText(product.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-900">
                              <Edit size={18} />
                            </Link>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 分页 */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      pagination.page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
                    disabled={pagination.page === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      pagination.page === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    下一页
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      显示第 <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> 至 
                      <span className="font-medium">{Math.min(pagination.page * pagination.limit, total)}</span> 条结果，
                      共 <span className="font-medium">{total}</span> 条
                    </p>
                  </div>
                  <div className="flex items-center">
                    <select
                      value={pagination.limit}
                      onChange={handleLimitChange}
                      className="mr-4 px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value={10}>10条/页</option>
                      <option value={20}>20条/页</option>
                      <option value={50}>50条/页</option>
                      <option value={100}>100条/页</option>
                    </select>
                    
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.page === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">首页</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* 页码 */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // 显示当前页附近的页码
                        let pageToShow = pagination.page;
                        
                        if (totalPages <= 5) {
                          // 如果总页数小于等于5，直接显示所有页码
                          pageToShow = i + 1;
                        } else if (pagination.page <= 3) {
                          // 当前页靠近开始
                          pageToShow = i + 1;
                        } else if (pagination.page >= totalPages - 2) {
                          // 当前页靠近结束
                          pageToShow = totalPages - 4 + i;
                        } else {
                          // 当前页在中间
                          pageToShow = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageToShow}
                            onClick={() => handlePageChange(pageToShow)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              pageToShow === pagination.page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } text-sm font-medium`}
                          >
                            {pageToShow}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={pagination.page === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.page === totalPages 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">尾页</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-gray-500">
              未找到符合条件的产品
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage; 