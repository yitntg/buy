import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 防止路由被静态生成
export const dynamic = 'force-dynamic'

// 获取所有评论（支持分页和过滤）
export async function GET(request: NextRequest) {
  try {
    // 获取URL参数
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const rating = url.searchParams.get('rating')
    
    const startIndex = (page - 1) * limit
    
    // 构建查询
    let query = supabase
      .from('reviews')
      .select('*, products!inner(name)', { count: 'exact' })
    
    // 添加搜索条件
    if (search) {
      query = query.or(`username.ilike.%${search}%,comment.ilike.%${search}%`)
    }
    
    // 添加评分筛选
    if (rating && rating !== 'all') {
      query = query.eq('rating', parseInt(rating))
    }
    
    // 分页并按创建时间倒序排序
    const { data: reviews, error, count } = await query
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1)
    
    if (error) {
      console.error('获取评论列表失败:', error)
      return NextResponse.json(
        { error: '获取评论列表失败' },
        { status: 500 }
      )
    }
    
    // 处理返回的评论数据，添加product_name字段
    const formattedReviews = reviews.map(review => ({
      ...review,
      product_name: review.products?.name || null,
      products: undefined // 移除products对象
    }))
    
    return NextResponse.json({
      reviews: formattedReviews,
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    })
  } catch (error: any) {
    console.error('获取评论列表失败:', error)
    return NextResponse.json(
      { error: `获取评论列表失败: ${error.message}` },
      { status: 500 }
    )
  }
} 