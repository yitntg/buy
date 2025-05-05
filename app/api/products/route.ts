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
    
    console.log('收到商品创建请求数据:', data)
    
    // 创建新商品，使用默认值处理空字段
    const newProduct: Omit<Product, 'id'> = {
      name: data.name || '未命名商品',
      description: data.description || '该商品暂无描述',
      price: parseFloat(data.price || '0'),
      image: data.image || 'https://picsum.photos/id/1/500/500', // 默认图片
      category: parseInt(data.category || '1'),
      inventory: parseInt(data.inventory || '0'),
      rating: 0,
      reviews: 0
    }
    
    // 添加其他可选字段
    if (data.brand) newProduct.brand = data.brand
    if (data.model) newProduct.model = data.model
    if (data.specifications) newProduct.specifications = data.specifications
    if (data.free_shipping !== undefined) newProduct.free_shipping = data.free_shipping
    if (data.returnable !== undefined) newProduct.returnable = data.returnable
    if (data.warranty !== undefined) newProduct.warranty = data.warranty
    
    console.log('尝试插入商品数据:', newProduct)
    
    // 添加到数据库
    const { data: createdProduct, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single()
    
    if (error) {
      console.error('创建商品失败:', error)
      return NextResponse.json({ 
        error: '创建商品失败', 
        details: error.message,
        code: error.code,
        hint: error.hint || '可能是数据库结构与提交的数据不匹配'
      }, { status: 500 })
    }
    
    console.log('商品创建成功:', createdProduct)
    
    // 返回新创建的商品
    return NextResponse.json(createdProduct, { status: 201 })
  } catch (error: any) {
    console.error('创建商品失败:', error)
    return NextResponse.json({ 
      error: '创建商品失败', 
      details: error instanceof Error ? error.message : '未知错误',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
} 