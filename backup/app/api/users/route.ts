import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'
import bcrypt from 'bcrypt'

// 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const role = url.searchParams.get('role') || ''
    const search = url.searchParams.get('search') || ''
    
    console.log('获取用户列表，参数:', { page, limit, role, search })
    
    // 构建查询
    let query = supabase.from('users').select('*', { count: 'exact' })
    
    // 角色筛选
    if (role && role !== 'all') {
      query = query.eq('role', role)
    }
    
    // 搜索
    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`)
    }
    
    // 计算分页
    const startIndex = (page - 1) * limit
    
    // 执行分页查询
    const { data: users, error, count } = await query
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1)
    
    if (error) {
      console.error('获取用户列表失败:', error)
      
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '用户表不存在，请在Supabase中创建必要的表', details: error.message },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ 
        error: '获取用户列表失败', 
        details: error.message 
      }, { status: 500 })
    }
    
    console.log(`成功获取${users?.length || 0}个用户，总数:${count || 0}`)
    
    // 返回数据，确保敏感信息不被返回
    const safeUsers = users?.map(user => {
      // 明确省略密码哈希字段
      const { password_hash, ...safeUser } = user
      return safeUser
    }) || []
    
    return NextResponse.json({
      users: safeUsers,
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    })
  } catch (error: any) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json({ 
      error: '获取用户列表失败', 
      details: error.message
    }, { status: 500 })
  }
}

// 创建用户
export async function POST(request: NextRequest) {
  try {
    console.log('接收到创建用户请求');
    
    // 使用text方法获取原始请求内容，避免Body重复读取问题
    const bodyText = await request.text();
    let userData;
    
    try {
      userData = JSON.parse(bodyText);
      console.log('解析后的用户数据:', JSON.stringify({...userData, password_hash: '******'}, null, 2));
    } catch (jsonError) {
      console.error('JSON解析失败:', jsonError);
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 });
    }

    // 验证必填字段
    if (!userData.username || !userData.email) {
      return NextResponse.json(
        { error: '用户名和邮箱是必填字段' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single();
      
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 } // Conflict
      );
    }

    // 构建用户数据
    const newUser = {
      username: userData.username,
      email: userData.email,
      role: userData.role || 'user',
      status: userData.status || 'active',
      avatar: userData.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${Date.now()}`,
      password_hash: userData.password ? await bcrypt.hash(userData.password, 10) : null,
      join_date: new Date().toISOString(),
      last_login: null
    };

    // 创建用户
    const { data: newUserData, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      console.error('创建用户失败:', error);
      
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return NextResponse.json(
          { error: '用户表不存在，请在Supabase中创建必要的表', details: error.message },
          { status: 404 }
        );
      } else if (error.code === '23505') {
        return NextResponse.json(
          { error: '用户名或邮箱已存在', details: error.message },
          { status: 409 } // Conflict
        );
      }
      
      return NextResponse.json(
        { error: '创建用户失败', details: error.message },
        { status: 500 }
      );
    }

    // 移除密码哈希
    const { password_hash, ...safeUser } = newUserData;
    
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    console.error('创建用户失败:', error);
    return NextResponse.json(
      { error: `创建用户失败: ${error.message}` },
      { status: 500 }
    );
  }
}

// 更新用户
export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少用户ID参数' },
        { status: 400 }
      );
    }
    
    // 使用text方法获取原始请求内容
    const bodyText = await request.text();
    let updateData;
    
    try {
      updateData = JSON.parse(bodyText);
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 });
    }
    
    // 验证更新数据
    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: '没有提供要更新的数据' },
        { status: 400 }
      );
    }
    
    // 如果要更新邮箱，检查是否已存在
    if (updateData.email) {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', updateData.email)
        .neq('id', id) // 排除当前用户
        .single();
        
      if (existingUser) {
        return NextResponse.json(
          { error: '该邮箱已被其他用户注册' },
          { status: 409 } // Conflict
        );
      }
    }
    
    // 构建更新数据
    const updates: any = {};
    
    // 只允许更新特定字段
    const allowedFields = ['username', 'email', 'role', 'status', 'avatar', 'password_hash'];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });
    
    // 添加更新时间
    updates.updated_at = new Date().toISOString();
    
    // 如果更新状态，且状态为active，更新最后登录时间
    if (updateData.status === 'active' && updateData.last_login) {
      updates.last_login = new Date().toISOString();
    }
    
    console.log('更新用户数据:', JSON.stringify({...updates, password_hash: updates.password_hash ? '******' : undefined}, null, 2));
    
    // 更新数据库
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('更新用户失败:', error);
      return NextResponse.json({ 
        error: '更新用户失败', 
        details: error.message 
      }, { status: 500 });
    }
    
    // 移除敏感信息
    if (updatedUser && updatedUser.password_hash) {
      delete updatedUser.password_hash;
    }
    
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('更新用户失败:', error);
    return NextResponse.json({ 
      error: '更新用户失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
}

// 批量更新用户状态
export async function PUT(request: NextRequest) {
  try {
    // 使用text方法获取原始请求内容
    const bodyText = await request.text();
    let updateData;
    
    try {
      updateData = JSON.parse(bodyText);
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 });
    }
    
    // 验证必填字段
    if (!updateData.ids || !Array.isArray(updateData.ids) || updateData.ids.length === 0) {
      return NextResponse.json(
        { error: '缺少要更新的用户ID列表' },
        { status: 400 }
      );
    }
    
    if (!updateData.status) {
      return NextResponse.json(
        { error: '缺少要更新的状态' },
        { status: 400 }
      );
    }
    
    // 批量更新
    const { data: updatedUsers, error } = await supabase
      .from('users')
      .update({ 
        status: updateData.status,
        updated_at: new Date().toISOString()
      })
      .in('id', updateData.ids)
      .select();
      
    if (error) {
      console.error('批量更新用户状态失败:', error);
      return NextResponse.json({ 
        error: '批量更新用户状态失败', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      updated: updatedUsers?.length || 0,
      message: `成功更新${updatedUsers?.length || 0}个用户的状态为"${updateData.status}"`
    });
  } catch (error: any) {
    console.error('批量更新用户状态失败:', error);
    return NextResponse.json({ 
      error: '批量更新用户状态失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少用户ID参数' },
        { status: 400 }
      );
    }
    
    // 删除用户
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('删除用户失败:', error);
      
      // 检查是否因为外键约束导致删除失败
      if (error.code === '23503') {
        return NextResponse.json({ 
          error: '删除用户失败，该用户可能有关联的订单数据', 
          details: error.message,
          suggestion: '考虑将用户状态设置为"banned"，而不是删除用户'
        }, { status: 409 });
      }
      
      return NextResponse.json({ 
        error: '删除用户失败', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: '用户已成功删除'
    });
  } catch (error: any) {
    console.error('删除用户失败:', error);
    return NextResponse.json({ 
      error: '删除用户失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
} 