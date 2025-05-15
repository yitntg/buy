import { supabase } from '@/shared/utils/supabase/client';
import { Order, OrderStatus, OrderHistory } from '@/shared/types/order';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/supabase';

// 查询类型定义辅助类型
type OrdersQuery = ReturnType<SupabaseClient<Database>['from']> extends {
  select: (...args: any[]) => infer R;
} ? R : never;

// 分页参数接口
interface PaginationParams {
  page?: number;
  limit?: number;
}

// 筛选参数接口
interface FilterParams {
  status?: OrderStatus;
  user_id?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  min_total?: number;
  max_total?: number;
}

// 订单API返回结果接口
interface OrdersResponse {
  data: Order[];
  count: number;
  error: string | null;
}

/**
 * 获取所有订单（管理员用）
 * @param paginationParams 分页参数
 * @param filterParams 筛选参数
 * @returns 订单列表和总数
 */
export async function getOrders(
  paginationParams: PaginationParams = {},
  filterParams: FilterParams = {}
): Promise<OrdersResponse> {
  try {
    const {
      page = 1,
      limit = 20
    } = paginationParams;
    
    const {
      status,
      user_id,
      search,
      date_from,
      date_to,
      sort_by,
      min_total,
      max_total
    } = filterParams;
    
    // 计算分页偏移量
    const offset = (page - 1) * limit;
    
    // 构建查询
    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          id,
          product_id,
          quantity,
          price,
          product:products(
            id,
            name,
            image
          )
        ),
        user:users(
          id,
          email,
          first_name,
          last_name,
          username
        ),
        shipping_address:shipping_addresses(*)
      `, { count: 'exact' });
    
    // 应用状态筛选
    if (status) {
      query = query.eq('status', status);
    }
    
    // 应用用户筛选
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    // 应用日期筛选
    if (date_from) {
      query = query.gte('created_at', date_from);
    }
    
    if (date_to) {
      query = query.lte('created_at', date_to);
    }
    
    // 应用金额筛选
    if (min_total !== undefined) {
      query = query.gte('total', min_total);
    }
    
    if (max_total !== undefined) {
      query = query.lte('total', max_total);
    }
    
    // 应用搜索筛选
    if (search) {
      // 在订单ID和追踪号中搜索
      query = query.or(`id.ilike.%${search}%,tracking_number.ilike.%${search}%`);
    }
    
    // 应用排序
    switch (sort_by) {
      case 'total_asc':
        query = query.order('total', { ascending: true });
        break;
      case 'total_desc':
        query = query.order('total', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
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
      data: data as unknown as Order[],
      count: count || 0,
      error: null
    };
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return {
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 获取单个订单详情
 * @param orderId 订单ID
 * @returns 订单详情
 */
export async function getOrderById(orderId: string): Promise<{ data: Order | null, error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          id,
          product_id,
          quantity,
          price,
          product:products(
            id,
            name,
            image,
            description
          )
        ),
        user:users(
          id,
          email,
          first_name,
          last_name,
          username,
          phone
        ),
        shipping_address:shipping_addresses(*)
      `)
      .eq('id', orderId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // 获取订单历史记录
    const { data: historyData, error: historyError } = await supabase
      .from('order_history')
      .select('*')
      .eq('order_id', orderId)
      .order('timestamp', { ascending: true });
    
    if (historyError) {
      console.warn('获取订单历史记录失败:', historyError);
      // 不阻止主流程
    }
    
    // 将历史记录添加到订单数据中
    const orderWithHistory = {
      ...data,
      history: historyData || []
    };
    
    return {
      data: orderWithHistory as unknown as Order,
      error: null
    };
  } catch (error) {
    console.error('获取订单详情失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 更新订单状态
 * @param orderId 订单ID
 * @param status 新状态
 * @param comment 状态变更备注
 * @returns 更新后的订单
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  comment?: string
): Promise<{ data: Order | null, error: string | null }> {
  try {
    // 开始数据库事务
    // 注意：实际项目中，应该使用更健壮的事务处理机制
    
    // 1. 更新订单状态
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select(`
        *,
        items:order_items(
          id,
          product_id,
          quantity,
          price,
          product:products(
            id,
            name,
            image
          )
        )
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    // 2. 添加订单历史记录
    const historyEntry: Omit<OrderHistory, 'id'> = {
      order_id: orderId,
      status,
      timestamp: new Date().toISOString(),
      comment: comment || `订单状态变更为 ${status}`,
      created_by: 'admin' // 实际项目中应使用当前管理员ID
    };
    
    const { error: historyError } = await supabase
      .from('order_history')
      .insert([historyEntry]);
    
    if (historyError) {
      console.warn('添加订单历史记录失败:', historyError);
      // 不阻止主流程
    }
    
    return {
      data: data as unknown as Order,
      error: null
    };
  } catch (error) {
    console.error('更新订单状态失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 更新订单追踪信息
 * @param orderId 订单ID
 * @param trackingNumber 追踪号
 * @param estimatedDelivery 预计送达时间
 * @returns 更新后的订单
 */
export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string,
  estimatedDelivery?: string
): Promise<{ data: Order | null, error: string | null }> {
  try {
    const updateData: any = {
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString()
    };
    
    if (estimatedDelivery) {
      updateData.estimated_delivery = estimatedDelivery;
    }
    
    // 如果订单当前状态为已支付，自动更新为已发货
    const { data: currentOrder, error: getError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();
    
    if (getError) {
      throw getError;
    }
    
    if (currentOrder && currentOrder.status === OrderStatus.PAID) {
      updateData.status = OrderStatus.SHIPPED;
    }
    
    // 更新订单
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // 添加订单历史记录
    if (currentOrder && currentOrder.status === OrderStatus.PAID) {
      const historyEntry = {
        order_id: orderId,
        status: OrderStatus.SHIPPED,
        timestamp: new Date().toISOString(),
        comment: `订单已发货，追踪号: ${trackingNumber}`,
        created_by: 'admin' // 实际项目中应使用当前管理员ID
      };
      
      await supabase
        .from('order_history')
        .insert([historyEntry]);
    }
    
    return {
      data: data as Order,
      error: null
    };
  } catch (error) {
    console.error('更新订单追踪信息失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 添加订单备注
 * @param orderId 订单ID
 * @param notes 备注内容
 * @returns 更新后的订单
 */
export async function addOrderNotes(
  orderId: string,
  notes: string
): Promise<{ data: Order | null, error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Order,
      error: null
    };
  } catch (error) {
    console.error('添加订单备注失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 获取订单统计信息
 * @returns 订单统计信息
 */
export async function getOrderStats(): Promise<{
  data: {
    total_orders: number;
    total_revenue: number;
    avg_order_value: number;
    status_counts: Record<OrderStatus, number>;
    monthly_orders: { month: string; count: number; revenue: number }[];
  } | null;
  error: string | null;
}> {
  try {
    // 获取所有订单
    const { data: allOrders, error } = await supabase
      .from('orders')
      .select('id, status, total, created_at');
    
    if (error) {
      throw error;
    }
    
    // 计算总订单数
    const total_orders = allOrders?.length || 0;
    
    // 计算总收入
    const total_revenue = allOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    
    // 计算平均订单金额
    const avg_order_value = total_orders > 0 ? total_revenue / total_orders : 0;
    
    // 计算各状态订单数量
    const status_counts = allOrders?.reduce((acc, order) => {
      const status = order.status as OrderStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>) || {};
    
    // 定义月度数据接口
    interface MonthlyData {
      month: string;
      count: number;
      revenue: number;
    }
    
    // 计算月度订单统计
    const monthlyDataMap: Record<string, MonthlyData> = {};
    
    if (allOrders) {
      for (const order of allOrders) {
        const date = new Date(order.created_at);
        const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!monthlyDataMap[month]) {
          monthlyDataMap[month] = { month, count: 0, revenue: 0 };
        }
        
        monthlyDataMap[month].count += 1;
        monthlyDataMap[month].revenue += (order.total || 0);
      }
    }
    
    // 转换为数组并排序
    const monthly_orders = Object.values(monthlyDataMap)
      .sort((a: MonthlyData, b: MonthlyData) => a.month.localeCompare(b.month));
    
    return {
      data: {
        total_orders,
        total_revenue,
        avg_order_value,
        status_counts,
        monthly_orders
      },
      error: null
    };
  } catch (error) {
    console.error('获取订单统计失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}
