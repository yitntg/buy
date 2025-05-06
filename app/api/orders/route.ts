import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 创建订单表（如果不存在）
async function ensureOrdersTableExists() {
  try {
    // 先检查表是否存在
    const { error: checkError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    if (checkError && (checkError.code === 'PGRST116' || checkError.code === '42P01' || checkError.message.includes('does not exist'))) {
      console.log('订单表不存在，尝试创建...')
      
      // 创建订单表
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT '待付款',
          total DECIMAL(10,2) NOT NULL,
          items_count INTEGER NOT NULL,
          customer_name VARCHAR(100) NOT NULL,
          customer_email VARCHAR(100) NOT NULL,
          payment_method VARCHAR(50),
          payment_status VARCHAR(50) DEFAULT '待支付',
          shipping_address TEXT,
          shipping_method VARCHAR(50),
          tracking_number VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { query: createTableSQL })
      
      if (createError) {
        console.error('创建订单表失败:', createError)
        
        // 尝试通过插入测试判断表是否存在
        if (createError.message.includes('function') && createError.message.includes('does not exist')) {
          console.log('exec_sql函数不存在，尝试使用其他方法初始化...')
          
          const { error: insertError } = await supabase
            .from('orders')
            .insert([
              {
                user_id: 1,
                status: '待付款',
                total: 99.99,
                items_count: 1,
                customer_name: '测试用户',
                customer_email: 'test@example.com',
                payment_method: '支付宝',
                payment_status: '待支付',
                shipping_address: '测试地址',
                shipping_method: '快递',
                tracking_number: ''
              }
            ])
          
          if (insertError && !insertError.message.includes('already exists')) {
            console.error('尝试插入测试数据失败:', insertError)
            throw new Error('无法确认订单表是否存在')
          }
        } else {
          throw createError
        }
      }
      
      console.log('订单表创建成功')
      
      // 创建订单明细表
      const createOrderItemsTableSQL = `
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          quantity INTEGER NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT fk_order FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
        );
      `
      
      const { error: createItemsError } = await supabase.rpc('exec_sql', { query: createOrderItemsTableSQL })
      
      if (createItemsError && !createItemsError.message.includes('already exists')) {
        console.error('创建订单明细表失败:', createItemsError)
      } else {
        console.log('订单明细表创建成功或已存在')
      }
      
      // 插入示例订单数据
      const sampleOrders = [
        {
          user_id: 1,
          status: '已完成',
          total: 1299.00,
          items_count: 2,
          customer_name: '张三',
          customer_email: 'zhangsan@example.com',
          payment_method: '支付宝',
          payment_status: '已支付',
          shipping_address: '北京市朝阳区某街道1号',
          shipping_method: '快递',
          tracking_number: 'SF1234567890'
        },
        {
          user_id: 2,
          status: '待发货',
          total: 499.50,
          items_count: 1,
          customer_name: '李四',
          customer_email: 'lisi@example.com',
          payment_method: '微信支付',
          payment_status: '已支付',
          shipping_address: '上海市浦东新区某路2号',
          shipping_method: '快递',
          tracking_number: ''
        },
        {
          user_id: 3,
          status: '待付款',
          total: 899.00,
          items_count: 3,
          customer_name: '王五',
          customer_email: 'wangwu@example.com',
          payment_method: '',
          payment_status: '待支付',
          shipping_address: '广州市天河区某街3号',
          shipping_method: '快递',
          tracking_number: ''
        }
      ]
      
      const { error: insertError } = await supabase
        .from('orders')
        .upsert(sampleOrders)
      
      if (insertError) {
        console.error('插入示例订单失败:', insertError)
      } else {
        console.log('示例订单数据已插入')
      }
    }
    
    return true
  } catch (error) {
    console.error('检查/创建订单表失败:', error)
    return false
  }
}

// 订单明细项接口
interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  price: number
}

// 获取订单列表
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const status = url.searchParams.get('status') || ''
  const search = url.searchParams.get('search') || ''
  
  console.log('获取订单列表，参数:', { page, limit, status, search })
  
  try {
    // 确保订单表存在
    await ensureOrdersTableExists()
    
    // 构建查询
    let query = supabase.from('orders').select('*', { count: 'exact' })
    
    // 状态筛选
    if (status && status !== '全部') {
      query = query.eq('status', status)
    }
    
    // 搜索筛选
    if (search) {
      query = query.or(`id.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`)
    }
    
    // 计算分页
    const startIndex = (page - 1) * limit
    
    // 默认按创建时间降序排序
    query = query.order('created_at', { ascending: false })
    
    // 执行分页查询
    const { data: orders, error, count } = await query
      .range(startIndex, startIndex + limit - 1)
    
    if (error) {
      console.error('获取订单列表失败:', error)
      
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '订单表不存在，请初始化数据库', details: error.message, code: error.code },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ 
        error: '获取订单列表失败', 
        details: error.message, 
        code: error.code 
      }, { status: 500 })
    }
    
    console.log(`成功获取${orders?.length || 0}条订单记录，总数:${count || 0}`)
    
    // 返回结果
    return NextResponse.json({
      orders: orders || [],
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    })
  } catch (error: any) {
    console.error('获取订单列表失败:', error)
    return NextResponse.json({
      error: '获取订单列表失败',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

// 创建订单
export async function POST(request: NextRequest) {
  try {
    console.log('接收到创建订单请求');
    
    // 使用text方法获取原始请求内容，避免Body重复读取问题
    const bodyText = await request.text();
    let orderData;
    
    try {
      orderData = JSON.parse(bodyText);
      console.log('解析后的订单数据:', JSON.stringify(orderData, null, 2));
    } catch (jsonError) {
      console.error('JSON解析失败:', jsonError);
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 });
    }
    
    // 确保订单表存在
    const tableExists = await ensureOrdersTableExists();
    if (!tableExists) {
      return NextResponse.json(
        { error: '订单表初始化失败' },
        { status: 500 }
      );
    }

    // 验证必填字段
    if (!orderData.user_id || !orderData.total || !orderData.customer_name) {
      return NextResponse.json(
        { error: '用户ID、订单金额和客户名称是必填字段' },
        { status: 400 }
      );
    }

    // 构建订单数据
    const newOrder = {
      user_id: orderData.user_id,
      status: orderData.status || '待付款',
      total: parseFloat(orderData.total),
      items_count: orderData.items_count || 0,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email || '',
      payment_method: orderData.payment_method || '',
      payment_status: orderData.payment_status || '待支付',
      shipping_address: orderData.shipping_address || '',
      shipping_method: orderData.shipping_method || '',
      tracking_number: orderData.tracking_number || ''
    };

    console.log('准备插入的订单数据:', JSON.stringify(newOrder, null, 2));

    // 插入数据库
    const { data: createdOrder, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) {
      console.error('数据库插入失败:', error);
      
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '订单表不存在，请初始化数据库', details: error.message, code: error.code },
          { status: 404 }
        );
      } else if (error.code === '23503') {
        return NextResponse.json(
          { error: '外键约束失败，请确认用户ID是否存在', details: error.message, code: error.code },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ 
        error: '创建订单失败', 
        details: error.message,
        code: error.code
      }, { status: 500 });
    }
    
    // 如果有订单明细，插入订单明细
    if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: OrderItem) => ({
        order_id: createdOrder.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) {
        console.error('插入订单明细失败:', itemsError);
        // 虽然明细插入失败，但订单已创建，所以仍返回成功，但带有警告
        return NextResponse.json({
          ...createdOrder,
          warning: '订单已创建，但订单明细保存失败'
        }, { status: 201 });
      }
    }
    
    console.log('订单创建成功:', createdOrder);
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error: any) {
    console.error('创建订单失败:', error);
    
    return NextResponse.json({ 
      error: '创建订单失败', 
      details: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// 更新订单状态
export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少订单ID参数' },
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
    
    // 构建更新数据
    const updates: any = {};
    if (updateData.status) updates.status = updateData.status;
    if (updateData.payment_status) updates.payment_status = updateData.payment_status;
    if (updateData.tracking_number) updates.tracking_number = updateData.tracking_number;
    if (updateData.shipping_method) updates.shipping_method = updateData.shipping_method;
    
    // 添加更新时间
    updates.updated_at = new Date().toISOString();
    
    // 更新数据库
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('更新订单失败:', error);
      return NextResponse.json({ 
        error: '更新订单失败', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('更新订单失败:', error);
    return NextResponse.json({ 
      error: '更新订单失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
}

// 批量更新订单状态
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
        { error: '缺少要更新的订单ID列表' },
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
    const { data: updatedOrders, error } = await supabase
      .from('orders')
      .update({ 
        status: updateData.status,
        updated_at: new Date().toISOString()
      })
      .in('id', updateData.ids)
      .select();
      
    if (error) {
      console.error('批量更新订单状态失败:', error);
      return NextResponse.json({ 
        error: '批量更新订单状态失败', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      updated: updatedOrders?.length || 0,
      message: `成功更新${updatedOrders?.length || 0}个订单的状态`
    });
  } catch (error: any) {
    console.error('批量更新订单状态失败:', error);
    return NextResponse.json({ 
      error: '批量更新订单状态失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
}

// 删除订单
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少订单ID参数' },
        { status: 400 }
      );
    }
    
    // 删除订单
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('删除订单失败:', error);
      return NextResponse.json({ 
        error: '删除订单失败', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: '订单已成功删除'
    });
  } catch (error: any) {
    console.error('删除订单失败:', error);
    return NextResponse.json({ 
      error: '删除订单失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
} 