import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'
import bcrypt from 'bcrypt'

// 创建用户表（如果不存在）
async function ensureUsersTableExists() {
  try {
    // 先检查表是否存在
    const { error: checkError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    if (checkError && (checkError.code === 'PGRST116' || checkError.code === '42P01' || checkError.message.includes('does not exist'))) {
      console.log('用户表不存在，尝试创建...')
      
      // 创建用户表
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          role VARCHAR(20) NOT NULL DEFAULT 'user',
          status VARCHAR(20) NOT NULL DEFAULT 'active',
          avatar VARCHAR(255),
          password_hash VARCHAR(255),
          join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { query: createTableSQL })
      
      if (createError) {
        console.error('创建用户表失败:', createError)
        
        // 尝试通过插入测试判断表是否存在
        if (createError.message.includes('function') && createError.message.includes('does not exist')) {
          console.log('exec_sql函数不存在，尝试使用其他方法初始化...')
          
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                username: '管理员',
                email: process.env.ADMIN_EMAIL || 'admin@example.com',
                role: 'admin',
                status: 'active',
              }
            ])
          
          if (insertError && !insertError.message.includes('already exists')) {
            console.error('尝试插入测试数据失败:', insertError)
            throw new Error('无法确认用户表是否存在')
          }
        } else {
          throw createError
        }
      }
      
      console.log('用户表创建成功')
      
      // 生成安全的密码哈希
      const adminPassword = process.env.ADMIN_PASSWORD || generateSecurePassword()
      const passwordHash = await bcrypt.hash(adminPassword, 10)
      
      console.log('已创建管理员账户:')
      console.log(`- 邮箱: ${process.env.ADMIN_EMAIL || 'admin@example.com'}`)
      if (!process.env.ADMIN_PASSWORD) {
        console.log(`- 临时密码: ${adminPassword}`)
        console.log('⚠️ 警告：这是自动生成的临时密码，请立即登录并修改密码！')
      } else {
        console.log('- 密码: 已使用环境变量中的密码')
      }
      
      // 插入示例用户数据
      const sampleUsers = [
        {
          username: '管理员',
          email: process.env.ADMIN_EMAIL || 'admin@example.com',
          role: 'admin',
          status: 'active',
          avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=1',
          password_hash: passwordHash,
          join_date: new Date().toISOString(),
          last_login: new Date().toISOString()
        }
      ]
      
      // 如果是开发环境，可以添加测试用户
      if (process.env.NODE_ENV === 'development') {
        const testUserPasswordHash = await bcrypt.hash('123456', 10)
        const testUsers = [
          {
            username: '张三',
            email: 'zhangsan@example.com',
            role: 'user',
            status: 'active',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=2',
            password_hash: testUserPasswordHash,
            join_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            last_login: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            username: '李四',
            email: 'lisi@example.com',
            role: 'user',
            status: 'active',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=3',
            password_hash: testUserPasswordHash,
            join_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            last_login: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        sampleUsers.push(...testUsers)
      }
      
      const { error: insertError } = await supabase
        .from('users')
        .upsert(sampleUsers, { onConflict: 'email' })
      
      if (insertError) {
        console.error('插入示例用户失败:', insertError)
      } else {
        console.log('示例用户数据已插入')
      }
    }
    
    return true
  } catch (error) {
    console.error('检查/创建用户表失败:', error)
    return false
  }
}

// 生成安全的随机密码
function generateSecurePassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// 获取用户列表
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const role = url.searchParams.get('role') || ''
  const status = url.searchParams.get('status') || ''
  const search = url.searchParams.get('search') || ''
  
  console.log('获取用户列表，参数:', { page, limit, role, status, search })
  
  try {
    // 确保用户表存在
    await ensureUsersTableExists()
    
    // 构建查询
    let query = supabase.from('users').select('*', { count: 'exact' })
    
    // 角色筛选
    if (role && role !== 'all') {
      query = query.eq('role', role)
    }
    
    // 状态筛选
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    // 搜索筛选
    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%,id::text.ilike.%${search}%`)
    }
    
    // 计算分页
    const startIndex = (page - 1) * limit
    
    // 默认按加入时间降序排序
    query = query.order('join_date', { ascending: false })
    
    // 执行分页查询
    const { data: users, error, count } = await query
      .range(startIndex, startIndex + limit - 1)
    
    if (error) {
      console.error('获取用户列表失败:', error)
      
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '用户表不存在，请初始化数据库', details: error.message, code: error.code },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ 
        error: '获取用户列表失败', 
        details: error.message, 
        code: error.code 
      }, { status: 500 })
    }
    
    // 获取每个用户的订单数和消费总额
    if (users && users.length > 0) {
      try {
        const usersWithOrders = await Promise.all(users.map(async (user) => {
          // 获取订单数
          const { count: orderCount, error: orderError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
          
          // 获取订单总额
          const { data: orderTotals, error: totalError } = await supabase
            .from('orders')
            .select('total')
            .eq('user_id', user.id)
          
          let totalSpent = 0
          if (orderTotals && orderTotals.length > 0) {
            totalSpent = orderTotals.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0)
          }
          
          return {
            ...user,
            orders: orderCount || 0,
            totalSpent: totalSpent
          }
        }))
        
        console.log(`成功获取${usersWithOrders.length}个用户记录，总数:${count || 0}`)
        
        // 返回结果
        return NextResponse.json({
          users: usersWithOrders,
          total: count || 0,
          page,
          limit,
          totalPages: count ? Math.ceil(count / limit) : 0
        })
      } catch (orderError) {
        console.error('获取用户订单信息失败:', orderError)
        // 如果获取订单信息失败，仍返回用户列表，但不包含订单信息
      }
    }
    
    console.log(`成功获取${users?.length || 0}个用户记录，总数:${count || 0}`)
    
    // 返回结果（没有订单信息）
    return NextResponse.json({
      users: users || [],
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    })
  } catch (error: any) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json({
      error: '获取用户列表失败',
      details: error.message,
      stack: error.stack
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
    
    // 确保用户表存在
    const tableExists = await ensureUsersTableExists();
    if (!tableExists) {
      return NextResponse.json(
        { error: '用户表初始化失败' },
        { status: 500 }
      );
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
      password_hash: userData.password_hash || null, // 实际应用中应该使用加密的密码
      join_date: new Date().toISOString(),
      last_login: null
    };

    console.log('准备插入的用户数据:', JSON.stringify({...newUser, password_hash: '******'}, null, 2));

    // 插入数据库
    const { data: createdUser, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      console.error('数据库插入失败:', error);
      
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '用户表不存在，请初始化数据库', details: error.message, code: error.code },
          { status: 404 }
        );
      } else if (error.code === '23505') {
        return NextResponse.json(
          { error: '该邮箱已被注册', details: error.message, code: error.code },
          { status: 409 }
        );
      }
      
      return NextResponse.json({ 
        error: '创建用户失败', 
        details: error.message,
        code: error.code
      }, { status: 500 });
    }
    
    // 移除敏感信息
    if (createdUser && createdUser.password_hash) {
      delete createdUser.password_hash;
    }
    
    console.log('用户创建成功:', JSON.stringify(createdUser, null, 2));
    return NextResponse.json(createdUser, { status: 201 });
  } catch (error: any) {
    console.error('创建用户失败:', error);
    
    return NextResponse.json({ 
      error: '创建用户失败', 
      details: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
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