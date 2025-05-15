import { supabase } from '@/shared/utils/supabase/client';
import { OrderStatus } from '@/shared/types/order';

// 销售数据按日接口
interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

// 销售数据按月接口
interface MonthlySales {
  month: string;
  revenue: number;
  orders: number;
}

// 订单状态统计接口
interface OrderStatusStats {
  status: OrderStatus;
  count: number;
  percentage: number;
}

// 仪表盘统计数据接口
export interface DashboardStats {
  // 概览数据
  overview: {
    total_revenue: number;
    revenue_trend: number;
    total_orders: number;
    orders_trend: number;
    total_users: number;
    users_trend: number;
    total_products: number;
    products_trend: number;
  };
  
  // 销售数据
  sales: {
    daily: DailySales[];
    monthly: MonthlySales[];
  };
  
  // 订单状态分布
  order_status: OrderStatusStats[];
  
  // 最近订单
  recent_orders: {
    id: string;
    user_name: string;
    date: string;
    status: OrderStatus;
    total: number;
    items_count: number;
  }[];
  
  // 热门产品
  top_products: {
    id: string;
    name: string;
    sold: number;
    revenue: number;
    stock: number;
  }[];
  
  // 用户活动
  user_activity: {
    daily_active: number;
    weekly_active: number;
    monthly_active: number;
    new_registrations: number;
  };
}

// 时间范围类型
export type TimeRange = 'day' | 'week' | 'month' | 'year';

/**
 * 获取仪表盘统计数据
 * @param timeRange 时间范围 
 * @returns 仪表盘统计数据
 */
export async function getDashboardStats(
  timeRange: TimeRange = 'week'
): Promise<{ data: DashboardStats | null; error: string | null }> {
  try {
    // 计算日期范围
    const now = new Date();
    let startDate: Date;
    let compareStartDate: Date;
    
    // 确定当前时间范围的开始日期
    switch (timeRange) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        compareStartDate = new Date(startDate);
        compareStartDate.setDate(compareStartDate.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        compareStartDate = new Date(startDate);
        compareStartDate.setDate(compareStartDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        compareStartDate = new Date(startDate);
        compareStartDate.setMonth(compareStartDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        compareStartDate = new Date(startDate);
        compareStartDate.setFullYear(compareStartDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        compareStartDate = new Date(startDate);
        compareStartDate.setDate(compareStartDate.getDate() - 7);
    }
    
    // 格式化日期为ISO字符串
    const startDateStr = startDate.toISOString();
    const compareStartDateStr = compareStartDate.toISOString();
    
    // 1. 获取订单数据
    const { data: currentOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, user_id, status, total, created_at, items(count)')
      .gte('created_at', startDateStr);
    
    if (ordersError) {
      throw ordersError;
    }
    
    // 获取对比时间段的订单数据
    const { data: compareOrders, error: compareOrdersError } = await supabase
      .from('orders')
      .select('id, total')
      .gte('created_at', compareStartDateStr)
      .lt('created_at', startDateStr);
    
    if (compareOrdersError) {
      throw compareOrdersError;
    }
    
    // 2. 获取用户数据
    const { data: currentUsers, error: usersError } = await supabase
      .from('users')
      .select('id, created_at, last_login')
      .gte('created_at', startDateStr);
    
    if (usersError) {
      throw usersError;
    }
    
    // 获取对比时间段的用户数据
    const { data: compareUsers, error: compareUsersError } = await supabase
      .from('users')
      .select('id')
      .gte('created_at', compareStartDateStr)
      .lt('created_at', startDateStr);
    
    if (compareUsersError) {
      throw compareUsersError;
    }
    
    // 3. 获取产品数据
    const { data: currentProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock, created_at')
      .gte('created_at', startDateStr);
    
    if (productsError) {
      throw productsError;
    }
    
    // 获取对比时间段的产品数据
    const { data: compareProducts, error: compareProductsError } = await supabase
      .from('products')
      .select('id')
      .gte('created_at', compareStartDateStr)
      .lt('created_at', startDateStr);
    
    if (compareProductsError) {
      throw compareProductsError;
    }
    
    // 4. 获取活跃用户数据
    const dayAgo = new Date(now);
    dayAgo.setDate(now.getDate() - 1);
    
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    
    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);
    
    const { data: activeUsers, error: activeUsersError } = await supabase
      .from('users')
      .select('id, last_login');
    
    if (activeUsersError) {
      throw activeUsersError;
    }
    
    // 5. 获取最近订单和订单项
    const { data: recentOrdersData, error: recentOrdersError } = await supabase
      .from('orders')
      .select(`
        id, 
        user_id, 
        status, 
        total, 
        created_at,
        items:order_items (count),
        user:user_id (username, email, first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentOrdersError) {
      throw recentOrdersError;
    }
    
    // 6. 获取热门产品
    // 在真实环境中，你可能需要基于销售数据或其他指标来获取热门产品
    // 这里我们使用模拟数据
    const { data: topProductsData } = await supabase
      .from('products')
      .select('id, name, stock')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // =====================================
    // 计算统计数据
    // =====================================
    
    // 当前周期的统计数据
    const total_revenue = currentOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const total_orders = currentOrders?.length || 0;
    const total_users = currentUsers?.length || 0;
    const total_products = currentProducts?.length || 0;
    
    // 对比周期的统计数据
    const compare_revenue = compareOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const compare_orders = compareOrders?.length || 0;
    const compare_users = compareUsers?.length || 0;
    const compare_products = compareProducts?.length || 0;
    
    // 计算趋势百分比变化（当前值减去对比值，再除以对比值）
    const revenue_trend = compare_revenue === 0 ? 100 : ((total_revenue - compare_revenue) / compare_revenue) * 100;
    const orders_trend = compare_orders === 0 ? 100 : ((total_orders - compare_orders) / compare_orders) * 100;
    const users_trend = compare_users === 0 ? 100 : ((total_users - compare_users) / compare_users) * 100;
    const products_trend = compare_products === 0 ? 100 : ((total_products - compare_products) / compare_products) * 100;
    
    // 计算订单状态分布
    const statusCounts = currentOrders?.reduce((acc, order) => {
      const status = order.status as OrderStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>) || {};
    
    const order_status: OrderStatusStats[] = Object.entries(statusCounts).map(([status, count]) => ({
      status: status as OrderStatus,
      count: count as number,
      percentage: total_orders > 0 ? (count as number / total_orders) * 100 : 0
    }));
    
    // 计算每日销售数据
    const salesByDay: Record<string, DailySales> = {};
    
    if (currentOrders && currentOrders.length > 0) {
      for (const order of currentOrders) {
        if (order.created_at) {
          const date = new Date(order.created_at).toISOString().split('T')[0];
          if (!salesByDay[date]) {
            salesByDay[date] = { date, revenue: 0, orders: 0 };
          }
          salesByDay[date].revenue += (order.total || 0);
          salesByDay[date].orders += 1;
        }
      }
    }
    
    const daily: DailySales[] = Object.values(salesByDay)
      .sort((a: DailySales, b: DailySales) => a.date.localeCompare(b.date));
    
    // 计算月度销售数据
    const salesByMonth: Record<string, MonthlySales> = {};
    
    if (currentOrders && currentOrders.length > 0) {
      for (const order of currentOrders) {
        if (order.created_at) {
          const date = new Date(order.created_at);
          const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          if (!salesByMonth[month]) {
            salesByMonth[month] = { month, revenue: 0, orders: 0 };
          }
          salesByMonth[month].revenue += (order.total || 0);
          salesByMonth[month].orders += 1;
        }
      }
    }
    
    const monthly: MonthlySales[] = Object.values(salesByMonth)
      .sort((a: MonthlySales, b: MonthlySales) => a.month.localeCompare(b.month));
    
    // 计算活跃用户
    const daily_active = activeUsers?.filter(user => 
      user.last_login && new Date(user.last_login) >= dayAgo
    ).length || 0;
    
    const weekly_active = activeUsers?.filter(user => 
      user.last_login && new Date(user.last_login) >= weekAgo
    ).length || 0;
    
    const monthly_active = activeUsers?.filter(user => 
      user.last_login && new Date(user.last_login) >= monthAgo
    ).length || 0;
    
    // 格式化最近订单
    const recent_orders = recentOrdersData?.map(order => ({
      id: order.id,
      user_name: order.user?.first_name && order.user?.last_name
        ? `${order.user.first_name} ${order.user.last_name}`
        : order.user?.username || order.user?.email || '未知用户',
      date: order.created_at,
      status: order.status as OrderStatus,
      total: order.total || 0,
      items_count: order.items?.length || 0
    })) || [];
    
    // 模拟热门产品数据
    // 在实际应用中，这些数据应该从销售记录中计算得出
    const top_products = topProductsData?.map((product, index) => ({
      id: product.id,
      name: product.name,
      sold: Math.floor(Math.random() * 100) + 10,
      revenue: Math.floor(Math.random() * 10000) + 1000,
      stock: product.stock || 0
    })).sort((a, b) => b.sold - a.sold) || [];
    
    // 构建完整的仪表盘统计数据
    const dashboardStats: DashboardStats = {
      overview: {
        total_revenue,
        revenue_trend: Number(revenue_trend.toFixed(2)),
        total_orders,
        orders_trend: Number(orders_trend.toFixed(2)),
        total_users,
        users_trend: Number(users_trend.toFixed(2)),
        total_products,
        products_trend: Number(products_trend.toFixed(2))
      },
      sales: {
        daily,
        monthly
      },
      order_status,
      recent_orders,
      top_products,
      user_activity: {
        daily_active,
        weekly_active,
        monthly_active,
        new_registrations: total_users
      }
    };
    
    return {
      data: dashboardStats,
      error: null
    };
  } catch (error) {
    console.error('获取仪表盘统计数据失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
} 
