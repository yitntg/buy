import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'

// 定义Product接口
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: number
  inventory: number
  rating: number
  reviews: number
  created_at?: string
  brand?: string
  model?: string
  specifications?: string
  free_shipping?: boolean
  returnable?: boolean
  warranty?: boolean
}

// 获取产品列表
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const category = url.searchParams.get('category') || ''
    const search = url.searchParams.get('search') || ''
    const sortBy = url.searchParams.get('sortBy') || 'created_at'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'
    
    // 构建查询
    let query = supabase.from('products').select('*', { count: 'exact' })
    
    // 应用搜索过滤
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    // 应用分类过滤
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    // 计算分页
    const startIndex = (page - 1) * limit
    
    // 排序
    const sortColumn = ['name', 'price', 'created_at', 'inventory', 'rating'].includes(sortBy) 
      ? sortBy 
      : 'created_at'
    
    const order = sortOrder === 'asc' ? true : false
    
    // 执行查询
    const { data: products, error, count } = await query
      .order(sortColumn, { ascending: order })
      .range(startIndex, startIndex + limit - 1)
    
    if (error) {
      console.error('获取产品列表失败:', error)
      
      // 表不存在
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '产品表不存在，请在Supabase中创建必要的表', details: error.message },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ 
        error: '获取产品列表失败', 
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      products: products || [],
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    })
  } catch (error: any) {
    console.error('获取产品列表失败:', error)
    return NextResponse.json({ 
      error: '获取产品列表失败', 
      details: error.message 
    }, { status: 500 })
  }
}

// 创建产品
export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    let productData;
    try {
      productData = await request.json();
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 });
    }
    
    // 验证必填字段
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: '名称、描述、价格和分类是必填字段' },
        { status: 400 }
      );
    }
    
    // 准备产品数据
    const newProduct = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      image: productData.image || 'https://picsum.photos/id/1/500/500',
      category: parseInt(productData.category),
      inventory: productData.inventory ? parseInt(productData.inventory) : 0,
      rating: productData.rating ? parseFloat(productData.rating) : 0,
      reviews: productData.reviews ? parseInt(productData.reviews) : 0
    };
    
    // 创建产品
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();
    
    if (error) {
      console.error('创建产品失败:', error);
      
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return NextResponse.json(
          { error: '产品表不存在，请在Supabase中创建必要的表', details: error.message },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: '创建产品失败', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('创建产品失败:', error);
    return NextResponse.json(
      { error: `创建产品失败: ${error.message}` },
      { status: 500 }
    );
  }
} 
