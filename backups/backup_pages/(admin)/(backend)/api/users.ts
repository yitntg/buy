import { supabase } from '@/src/app/(shared)/utils/supabase/client';
import { User } from '@/src/app/shared/types/auth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/src/app/shared/types/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

// 查询类型定义辅助类型
type UsersQuery = ReturnType<SupabaseClient<Database>['from']> extends {
  select: (...args: any[]) => infer R;
} ? R : never;

// 用户角色类型
type UserRole = 'admin' | 'user';

// 用户状态类型
type UserStatus = 'active' | 'inactive' | 'blocked';

// 分页参数接口
interface PaginationParams {
  page?: number;
  limit?: number;
}

// 筛选参数接口
interface FilterParams {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  sort_by?: string;
  created_from?: string;
  created_to?: string;
}

// 用户API返回结果接口
interface UsersResponse {
  data: (User & { orders_count?: number; total_spent?: number })[];
  count: number;
  error: string | null;
}

// 用户更新接口
interface UserUpdate {
  role?: UserRole;
  status?: UserStatus;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

/**
 * 获取所有用户（管理员用）
 * @param paginationParams 分页参数
 * @param filterParams 筛选参数
 * @returns 用户列表和总数
 */
export async function getUsers(
  paginationParams: PaginationParams = {},
  filterParams: FilterParams = {}
): Promise<UsersResponse> {
  try {
    const {
      page = 1,
      limit = 20
    } = paginationParams;
    
    const {
      role,
      status,
      search,
      sort_by,
      created_from,
      created_to
    } = filterParams;
    
    // 计算分页偏移量
    const offset = (page - 1) * limit;
    
    // 构建基本查询
    let query = supabase
      .from('users')
      .select(`
        *,
        orders:orders (count)
      `, { count: 'exact' });
    
    // 应用角色筛选
    if (role) {
      query = query.eq('role', role);
    }
    
    // 应用状态筛选
    if (status) {
      query = query.eq('status', status);
    }
    
    // 应用创建日期筛选
    if (created_from) {
      query = query.gte('created_at', created_from);
    }
    
    if (created_to) {
      query = query.lte('created_at', created_to);
    }
    
    // 应用搜索筛选
    if (search) {
      query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }
    
    // 应用排序
    switch (sort_by) {
      case 'email':
        query = query.order('email', { ascending: true });
        break;
      case 'name':
        query = query.order('first_name', { ascending: true });
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
    
    // 计算订单数量和消费总额
    // 注意：这种汇总查询可能在实际应用中需要通过数据库函数或视图来优化
    const usersWithStats = await Promise.all((data || []).map(async (user) => {
      try {
        // 获取用户订单总数
        const orders_count = user.orders?.length || 0;
        
        // 获取用户总消费
        let total_spent = 0;
        if (orders_count > 0) {
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('total')
            .eq('user_id', user.id);
          
          if (!ordersError && ordersData) {
            total_spent = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
          }
        }
        
        return {
          ...user,
          orders_count,
          total_spent
        };
      } catch (error) {
        console.warn(`获取用户 ${user.id} 消费统计失败:`, error);
        return {
          ...user,
          orders_count: 0,
          total_spent: 0
        };
      }
    }));
    
    return {
      data: usersWithStats as (User & { orders_count?: number; total_spent?: number })[],
      count: count || 0,
      error: null
    };
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return {
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 获取用户详情
 * @param userId 用户ID
 * @returns 用户详情
 */
export async function getUserById(
  userId: string
): Promise<{ data: (User & { orders_count?: number; total_spent?: number }) | null, error: string | null }> {
  try {
    // 获取用户基本信息
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // 获取用户订单
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, total, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (ordersError) {
      console.warn('获取用户订单失败:', ordersError);
      // 不阻止主流程
    }
    
    // 计算统计信息
    const orders_count = ordersData?.length || 0;
    const total_spent = ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    
    // 获取用户地址
    const { data: addressesData, error: addressesError } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', userId);
    
    if (addressesError) {
      console.warn('获取用户地址失败:', addressesError);
      // 不阻止主流程
    }
    
    // 构建完整用户信息
    const userWithExtras = {
      ...data,
      orders_count,
      total_spent,
      orders: ordersData || [],
      addresses: addressesData || []
    };
    
    return {
      data: userWithExtras as (User & { orders_count?: number; total_spent?: number }),
      error: null
    };
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param userData 更新的用户数据
 * @returns 更新后的用户
 */
export async function updateUser(
  userId: string,
  userData: UserUpdate
): Promise<{ data: User | null, error: string | null }> {
  try {
    // 添加更新时间
    const updatePayload = {
      ...userData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as User,
      error: null
    };
  } catch (error) {
    console.error('更新用户失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 封禁用户
 * @param userId 用户ID
 * @param reason 封禁原因
 * @returns 操作结果
 */
export async function blockUser(
  userId: string,
  reason: string
): Promise<{ success: boolean, error: string | null }> {
  try {
    // 更新用户状态为已封禁
    const { error } = await supabase
      .from('users')
      .update({ 
        status: 'blocked',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    // 记录封禁日志
    const { error: logError } = await supabase
      .from('user_activity_logs')
      .insert([{
        user_id: userId,
        action: 'user_blocked',
        admin_note: reason || '管理员封禁',
        timestamp: new Date().toISOString()
      }]);
    
    if (logError) {
      console.warn('记录封禁日志失败:', logError);
      // 不阻止主流程
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('封禁用户失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 解封用户
 * @param userId 用户ID
 * @returns 操作结果
 */
export async function unblockUser(
  userId: string
): Promise<{ success: boolean, error: string | null }> {
  try {
    // 更新用户状态为活跃
    const { error } = await supabase
      .from('users')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    // 记录解封日志
    const { error: logError } = await supabase
      .from('user_activity_logs')
      .insert([{
        user_id: userId,
        action: 'user_unblocked',
        admin_note: '管理员解除封禁',
        timestamp: new Date().toISOString()
      }]);
    
    if (logError) {
      console.warn('记录解封日志失败:', logError);
      // 不阻止主流程
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('解封用户失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 重置用户密码
 * @param email 用户邮箱
 * @returns 操作结果
 */
export async function resetUserPassword(
  email: string
): Promise<{ success: boolean, error: string | null }> {
  try {
    // 使用Supabase Auth API发送密码重置邮件
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('重置用户密码失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 获取用户统计信息
 * @returns 用户统计信息
 */
export async function getUserStats(): Promise<{
  data: {
    total_users: number;
    active_users: number;
    new_users_7_days: number;
    new_users_30_days: number;
    blocked_users: number;
    user_growth: { date: string; count: number }[];
  } | null;
  error: string | null;
}> {
  try {
    // 获取所有用户
    const { data: allUsers, error } = await supabase
      .from('users')
      .select('id, status, created_at');
    
    if (error) {
      throw error;
    }
    
    // 计算总用户数
    const total_users = allUsers?.length || 0;
    
    // 计算活跃用户数
    const active_users = allUsers?.filter(user => user.status === 'active').length || 0;
    
    // 计算被封禁用户数
    const blocked_users = allUsers?.filter(user => user.status === 'blocked').length || 0;
    
    // 计算最近7天和30天的新用户
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const new_users_7_days = allUsers?.filter(user => 
      new Date(user.created_at) >= sevenDaysAgo
    ).length || 0;
    
    const new_users_30_days = allUsers?.filter(user => 
      new Date(user.created_at) >= thirtyDaysAgo
    ).length || 0;
    
    // 计算用户增长趋势（最近30天）
    const userGrowthMap = new Map<string, number>();
    
    // 初始化过去30天的日期
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      userGrowthMap.set(dateStr, 0);
    }
    
    // 计算每日新增用户
    allUsers?.forEach(user => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      if (userGrowthMap.has(date)) {
        userGrowthMap.set(date, userGrowthMap.get(date)! + 1);
      }
    });
    
    // 转换为数组并排序
    const user_growth = Array.from(userGrowthMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      data: {
        total_users,
        active_users,
        new_users_7_days,
        new_users_30_days,
        blocked_users,
        user_growth
      },
      error: null
    };
  } catch (error) {
    console.error('获取用户统计失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 处理用户API请求
 * @param req 请求对象
 * @param res 响应对象
 */
export async function handleUsersRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 这里应该根据请求方法和查询参数调用相应的用户管理函数
    // 目前返回一个临时响应
    return res.status(200).json({ message: '用户管理API功能正在开发中' });
  } catch (error) {
    console.error('用户API错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 
