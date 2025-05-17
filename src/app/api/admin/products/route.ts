import { NextResponse } from 'next/server';
import { createClient } from '@/src/app/(shared)/infrastructure/supabase/server';
import { apiRouteConfig } from '@/src/app/api/config';

// 配置为静态路由，但设置合理的revalidate时间
export const revalidate = apiRouteConfig.revalidate;

// GET处理函数 - 获取产品列表(管理员)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // 解析分页参数
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const category_id = searchParams.get('category_id');
  const sort_by = searchParams.get('sort_by') || 'newest';
  
  try {
    // 创建Supabase客户端
    const supabase = createClient();
    
    // 构建查询
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // 添加过滤条件
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    
    // 添加排序
    if (sort_by) {
      switch(sort_by) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    }
    
    // 添加分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // 执行查询
    const { data: products, count, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      products: products || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('获取管理端产品列表时出错:', error);
    return NextResponse.json(
      { error: '获取产品列表失败' },
      { status: 500 }
    );
  }
}

// POST处理函数 - 创建产品
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 创建Supabase客户端
    const supabase = createClient();
    
    // 插入产品数据
    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('创建产品时出错:', error);
    return NextResponse.json(
      { error: '创建产品失败' },
      { status: 500 }
    );
  }
}

// DELETE处理函数 - 删除产品
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: '缺少产品ID' },
      { status: 400 }
    );
  }
  
  try {
    // 创建Supabase客户端
    const supabase = createClient();
    
    // 删除产品
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除产品时出错:', error);
    return NextResponse.json(
      { error: '删除产品失败' },
      { status: 500 }
    );
  }
} 