import { supabase } from '@/src/app/(shared)/utils/supabase/client';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '@/src/app/shared/types/product';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/src/app/shared/types/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

// 查询类型定义辅助类型
type ProductsQuery = ReturnType<SupabaseClient<Database>['from']> extends {
  select: (...args: any[]) => infer R;
} ? R : never;

// 分页参数接口
interface PaginationParams {
  page?: number;
  limit?: number;
}

// 筛选参数接口
interface FilterParams {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'stock_asc' | 'stock_desc';
}

// 产品API返回结果接口
interface ProductsResponse {
  data: Product[];
  count: number;
  error: string | null;
}

/**
 * 获取所有产品（管理员用）
 * @param paginationParams 分页参数
 * @param filterParams 筛选参数
 * @returns 产品列表和总数
 */
export async function getProducts(
  paginationParams: PaginationParams = {},
  filterParams: FilterParams = {}
): Promise<ProductsResponse> {
  try {
    const {
      page = 1,
      limit = 20
    } = paginationParams;
    
    const {
      category_id,
      min_price,
      max_price,
      search,
      sort_by
    } = filterParams;
    
    // 计算分页偏移量
    const offset = (page - 1) * limit;
    
    // 构建查询
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    // 应用分类筛选
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    
    // 应用价格区间筛选
    if (min_price !== undefined) {
      query = query.gte('price', min_price);
    }
    
    if (max_price !== undefined) {
      query = query.lte('price', max_price);
    }
    
    // 应用搜索筛选
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,model.ilike.%${search}%,brand.ilike.%${search}%`);
    }
    
    // 应用排序
    switch (sort_by) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'stock_asc':
        query = query.order('stock', { ascending: true });
        break;
      case 'stock_desc':
        query = query.order('stock', { ascending: false });
        break;
      case 'popular':
        // 假设有一个销量字段 'sales_count'
        query = query.order('sales_count', { ascending: false });
        break;
      default: // newest
        query = query.order('created_at', { ascending: false });
    }
    
    // 应用分页
    query = query.range(offset, offset + limit - 1);
    
    // 执行查询
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Product[],
      count: count || 0,
      error: null
    };
  } catch (error) {
    console.error('获取产品列表失败:', error);
    return {
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 获取单个产品
 * @param productId 产品ID
 * @returns 产品详情
 */
export async function getProductById(productId: string): Promise<{ data: Product | null, error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Product,
      error: null
    };
  } catch (error) {
    console.error('获取产品详情失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 创建新产品
 * @param productData 产品数据
 * @returns 创建的产品
 */
export async function createProduct(
  productData: ProductCreateRequest
): Promise<{ data: Product | null, error: string | null }> {
  try {
    // 添加创建时间
    const newProduct = {
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Product,
      error: null
    };
  } catch (error) {
    console.error('创建产品失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 更新产品
 * @param productId 产品ID
 * @param productData 更新的产品数据
 * @returns 更新后的产品
 */
export async function updateProduct(
  productId: string,
  productData: ProductUpdateRequest
): Promise<{ data: Product | null, error: string | null }> {
  try {
    // 添加更新时间
    const updatePayload = {
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Product,
      error: null
    };
  } catch (error) {
    console.error('更新产品失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 删除产品
 * @param productId 产品ID
 * @returns 操作结果
 */
export async function deleteProduct(
  productId: string
): Promise<{ success: boolean, error: string | null }> {
  try {
    // 验证产品是否存在
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();
    
    if (checkError) {
      throw new Error('产品不存在');
    }
    
    // 删除产品
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('删除产品失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 更新产品库存
 * @param productId 产品ID
 * @param quantity 库存数量变化（正数增加，负数减少）
 * @returns 更新后的产品
 */
export async function updateProductStock(
  productId: string,
  quantity: number
): Promise<{ data: Product | null, error: string | null }> {
  try {
    // 先获取当前产品信息
    const { data: currentProduct, error: getError } = await supabase
      .from('products')
      .select('stock, inventory')
      .eq('id', productId)
      .single();
    
    if (getError || !currentProduct) {
      throw getError || new Error('产品不存在');
    }
    
    // 确定库存字段名
    const stockField = currentProduct.stock !== undefined ? 'stock' : 'inventory';
    const currentStock = currentProduct[stockField] || 0;
    
    // 计算新库存，不能小于0
    const newStock = Math.max(0, currentStock + quantity);
    
    // 更新库存
    const updateData = {
      [stockField]: newStock,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Product,
      error: null
    };
  } catch (error) {
    console.error('更新产品库存失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 批量操作产品
 * @param productIds 产品ID数组
 * @param action 操作类型 ('delete' | 'publish' | 'unpublish' | 'feature' | 'unfeature')
 * @returns 操作结果
 */
export async function bulkProductAction(
  productIds: string[],
  action: 'delete' | 'publish' | 'unpublish' | 'feature' | 'unfeature'
): Promise<{ success: boolean, error: string | null }> {
  try {
    if (!productIds.length) {
      throw new Error('未选择任何产品');
    }
    
    switch (action) {
      case 'delete':
        // 批量删除
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .in('id', productIds);
        
        if (deleteError) {
          throw deleteError;
        }
        break;
        
      case 'publish':
      case 'unpublish':
        // 批量发布/取消发布
        const { error: publishError } = await supabase
          .from('products')
          .update({ 
            is_published: action === 'publish',
            updated_at: new Date().toISOString()
          })
          .in('id', productIds);
        
        if (publishError) {
          throw publishError;
        }
        break;
        
      case 'feature':
      case 'unfeature':
        // 批量设为精选/取消精选
        const { error: featureError } = await supabase
          .from('products')
          .update({ 
            is_featured: action === 'feature',
            updated_at: new Date().toISOString()
          })
          .in('id', productIds);
        
        if (featureError) {
          throw featureError;
        }
        break;
        
      default:
        throw new Error('不支持的操作类型');
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('批量操作产品失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 处理产品API请求
 * @param req 请求对象
 * @param res 响应对象
 */
export async function handleProductsRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        // 解析查询参数
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        // 构建筛选参数
        const filterParams: FilterParams = {};
        
        if (req.query.category_id) {
          filterParams.category_id = req.query.category_id as string;
        }
        
        if (req.query.min_price) {
          filterParams.min_price = parseFloat(req.query.min_price as string);
        }
        
        if (req.query.max_price) {
          filterParams.max_price = parseFloat(req.query.max_price as string);
        }
        
        if (req.query.search) {
          filterParams.search = req.query.search as string;
        }
        
        if (req.query.sort_by) {
          filterParams.sort_by = req.query.sort_by as any;
        }
        
        // 获取产品列表
        const { data, count, error } = await getProducts(
          { page, limit },
          filterParams
        );
        
        if (error) {
          return res.status(500).json({ error });
        }
        
        return res.status(200).json({
          products: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        });
      }
      
      case 'POST': {
        // 创建新产品
        // 实现略
        return res.status(501).json({ error: '创建产品功能尚未实现' });
      }
      
      default:
        return res.status(405).json({ error: '方法不允许' });
    }
  } catch (error) {
    console.error('产品API错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 
