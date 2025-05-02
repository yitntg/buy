import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/products'

// 获取商品列表
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const keyword = url.searchParams.get('keyword') || ''
  const category = url.searchParams.get('category')
  const sortBy = url.searchParams.get('sortBy') || 'relevance'
  
  // 构建查询
  let query = supabase.from('products').select('*', { count: 'exact' })
  
  // 关键词搜索
  if (keyword) {
    query = query.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
  }
  
  // 分类筛选
  if (category) {
    query = query.eq('category', parseInt(category))
  }
  
  // 计算分页
  const startIndex = (page - 1) * limit
  
  // 排序
  switch (sortBy) {
    case 'priceAsc':
      query = query.order('price', { ascending: true })
      break
    case 'priceDesc':
      query = query.order('price', { ascending: false })
      break
    case 'latest':
      query = query.order('created_at', { ascending: false })
      break
    case 'relevance':
    default:
      query = query.order('id', { ascending: true })
      break
  }
  
  // 执行分页查询
  const { data: products, error, count } = await query
    .range(startIndex, startIndex + limit - 1)
  
  if (error) {
    console.error('获取商品列表失败:', error)
    return NextResponse.json({ error: '获取商品列表失败' }, { status: 500 })
  }
  
  // 返回结果
  return NextResponse.json({
    products,
    total: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0
  })
}

// 新增商品
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const data = await request.json()
    
    // 验证必填字段
    if (!data.name || !data.description || !data.price || !data.image || !data.category) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    
    // 创建新商品
    const newProduct: Omit<Product, 'id'> = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: parseInt(data.category),
      inventory: parseInt(data.inventory) || 0,
      rating: 0,
      reviews: 0
    }
    
    // 添加到数据库
    const { data: createdProduct, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single()
    
    if (error) {
      console.error('创建商品失败:', error)
      return NextResponse.json({ error: '创建商品失败' }, { status: 500 })
    }
    
    // 返回新创建的商品
    return NextResponse.json(createdProduct, { status: 201 })
  } catch (error) {
    console.error('创建商品失败:', error)
    return NextResponse.json({ error: '创建商品失败' }, { status: 500 })
  }
} 