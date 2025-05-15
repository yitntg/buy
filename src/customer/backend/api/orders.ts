import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

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
          { error: '订单表不存在，请在Supabase中创建必要的表', details: error.message, code: error.code },
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
    
    // 验证必填字段
    if (!orderData.user_id || !orderData.total || !orderData.items || !orderData.items.length) {
      return NextResponse.json(
        { error: '缺少必要的订单信息' },
        { status: 400 }
      );
    }
    
    // 准备订单数据
    const newOrder = {
      user_id: orderData.user_id,
      total: orderData.total,
      items_count: orderData.items.length,
      status: orderData.status || '待付款',
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      payment_method: orderData.payment_method || '',
      payment_status: orderData.payment_status || '待支付',
      shipping_address: orderData.shipping_address || '',
      shipping_method: orderData.shipping_method || '',
      tracking_number: orderData.tracking_number || ''
    };
    
    // 创建订单
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();
    
    if (orderError) {
      console.error('创建订单失败:', orderError);
      return NextResponse.json(
        { error: '创建订单失败', details: orderError.message },
        { status: 500 }
      );
    }
    
    // 创建订单项
    const orderItems = orderData.items.map((item: OrderItem) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('创建订单项失败:', itemsError);
      // 如果创建订单项失败，尝试回滚订单
      await supabase.from('orders').delete().eq('id', order.id);
      
      return NextResponse.json(
        { error: '创建订单项失败', details: itemsError.message },
        { status: 500 }
      );
    }
    
    console.log('订单创建成功:', order.id);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('创建订单过程中发生错误:', error);
    return NextResponse.json(
      { error: `创建订单失败: ${error.message}` },
      { status: 500 }
    );
  }
}

// 更新订单状态
export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少订单ID' },
        { status: 400 }
      );
    }
    
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
    
    // 只允许更新状态字段
    if (!updateData.status) {
      return NextResponse.json(
        { error: '缺少状态信息' },
        { status: 400 }
      );
    }
    
    // 更新订单状态
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: updateData.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('更新订单状态失败:', error);
      return NextResponse.json(
        { error: '更新订单状态失败', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('更新订单状态失败:', error);
    return NextResponse.json(
      { error: `更新订单状态失败: ${error.message}` },
      { status: 500 }
    );
  }
}

// 完整更新订单
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少订单ID' },
        { status: 400 }
      );
    }
    
    const bodyText = await request.text();
    let orderData;
    
    try {
      orderData = JSON.parse(bodyText);
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 });
    }
    
    // 更新订单
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: orderData.status,
        payment_status: orderData.payment_status,
        payment_method: orderData.payment_method,
        shipping_address: orderData.shipping_address,
        shipping_method: orderData.shipping_method,
        tracking_number: orderData.tracking_number,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('更新订单失败:', error);
      return NextResponse.json(
        { error: '更新订单失败', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('更新订单失败:', error);
    return NextResponse.json(
      { error: `更新订单失败: ${error.message}` },
      { status: 500 }
    );
  }
}

// 删除订单
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少订单ID' },
        { status: 400 }
      );
    }
    
    // 删除订单 (关联的订单项会通过外键约束自动删除)
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('删除订单失败:', error);
      return NextResponse.json(
        { error: '删除订单失败', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, message: '订单已删除' });
  } catch (error: any) {
    console.error('删除订单失败:', error);
    return NextResponse.json(
      { error: `删除订单失败: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * 处理客户订单API请求
 * @param req 请求对象
 * @param res 响应对象
 */
export async function handleOrdersRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 这里应该根据请求方法和查询参数调用相应的客户订单管理函数
    // 目前返回一个临时响应
    return res.status(200).json({ message: '客户订单API功能正在开发中' });
  } catch (error) {
    console.error('客户订单API错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 
