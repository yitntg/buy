import { supabase } from '@/shared/utils/supabase/client';
import { User } from '@/shared/types/auth';
import { ShippingAddress } from '@/shared/types/order';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

// 查询类型定义辅助类型
type UsersQuery = ReturnType<SupabaseClient<Database>['from']> extends {
  select: (...args: any[]) => infer R;
} ? R : never;

/**
 * 获取用户信息
 * @param userId 用户ID
 * @returns 用户信息
 */
export async function getUserProfile(userId: string): Promise<{ data: User | null, error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as User,
      error: null
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param userData 用户数据
 * @returns 更新后的用户信息
 */
export async function updateUserProfile(
  userId: string,
  userData: Partial<User>
): Promise<{ data: User | null, error: string | null }> {
  try {
    // 防止更新敏感字段
    const { id, email, created_at, ...updateData } = userData;
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
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
    console.error('更新用户信息失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 获取用户收货地址列表
 * @param userId 用户ID
 * @returns 地址列表
 */
export async function getUserAddresses(
  userId: string
): Promise<{ data: ShippingAddress[], error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return {
      data: (data || []) as ShippingAddress[],
      error: null
    };
  } catch (error) {
    console.error('获取用户地址列表失败:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 获取用户单个地址
 * @param addressId 地址ID
 * @param userId 用户ID(用于权限验证)
 * @returns 地址信息
 */
export async function getUserAddressById(
  addressId: string,
  userId: string
): Promise<{ data: ShippingAddress | null, error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('id', addressId)
      .eq('user_id', userId) // 确保只能查看自己的地址
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as ShippingAddress,
      error: null
    };
  } catch (error) {
    console.error('获取地址详情失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 创建新地址
 * @param userId 用户ID
 * @param addressData 地址数据
 * @returns 创建的地址
 */
export async function createUserAddress(
  userId: string,
  addressData: Omit<ShippingAddress, 'id' | 'user_id' | 'created_at'>
): Promise<{ data: ShippingAddress | null, error: string | null }> {
  try {
    // 如果设置为默认地址，先将所有其他地址设为非默认
    if (addressData.is_default) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }
    
    // 创建新地址
    const { data, error } = await supabase
      .from('shipping_addresses')
      .insert([{
        ...addressData,
        user_id: userId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as ShippingAddress,
      error: null
    };
  } catch (error) {
    console.error('创建地址失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 更新地址
 * @param addressId 地址ID
 * @param userId 用户ID(用于权限验证)
 * @param addressData 地址数据
 * @returns 更新后的地址
 */
export async function updateUserAddress(
  addressId: string,
  userId: string,
  addressData: Partial<ShippingAddress>
): Promise<{ data: ShippingAddress | null, error: string | null }> {
  try {
    // 验证地址所有权
    const { data: existingAddress, error: checkError } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('id', addressId)
      .eq('user_id', userId)
      .single();
    
    if (checkError || !existingAddress) {
      throw new Error('地址不存在或无权限修改');
    }
    
    // 如果设置为默认地址，先将所有其他地址设为非默认
    if (addressData.is_default) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }
    
    // 防止更新敏感字段
    const { id, user_id, created_at, ...updateData } = addressData;
    
    // 更新地址
    const { data, error } = await supabase
      .from('shipping_addresses')
      .update(updateData)
      .eq('id', addressId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as ShippingAddress,
      error: null
    };
  } catch (error) {
    console.error('更新地址失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 删除地址
 * @param addressId 地址ID
 * @param userId 用户ID(用于权限验证)
 * @returns 操作结果
 */
export async function deleteUserAddress(
  addressId: string,
  userId: string
): Promise<{ success: boolean, error: string | null }> {
  try {
    // 验证地址所有权
    const { data: existingAddress, error: checkError } = await supabase
      .from('shipping_addresses')
      .select('is_default')
      .eq('id', addressId)
      .eq('user_id', userId)
      .single();
    
    if (checkError || !existingAddress) {
      throw new Error('地址不存在或无权限删除');
    }
    
    // 删除地址
    const { error } = await supabase
      .from('shipping_addresses')
      .delete()
      .eq('id', addressId);
    
    if (error) {
      throw error;
    }
    
    // 如果删除的是默认地址，将最新的地址设为默认
    if (existingAddress.is_default) {
      const { data: addresses } = await supabase
        .from('shipping_addresses')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (addresses && addresses.length > 0) {
        await supabase
          .from('shipping_addresses')
          .update({ is_default: true })
          .eq('id', addresses[0].id);
      }
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('删除地址失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 处理客户用户API请求
 * @param req 请求对象
 * @param res 响应对象
 */
export async function handleUserRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 这里应该根据请求方法和查询参数调用相应的客户用户管理函数
    // 目前返回一个临时响应
    return res.status(200).json({ message: '客户用户API功能正在开发中' });
  } catch (error) {
    console.error('客户用户API错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 
