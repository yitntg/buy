import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取商品评论
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id
  
  // 获取分页参数
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const startIndex = (page - 1) * limit
  
  try {
    // 查询评论总数
    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', productId)
    
    if (countError) {
      return NextResponse.json(
        { error: '获取评论数量失败' },
        { status: 500 }
      )
    }
    
    // 获取分页的评论数据
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1)
    
    if (error) {
      return NextResponse.json(
        { error: '获取评论失败' },
        { status: 500 }
      )
    }
    
    // 返回评论列表和分页信息
    return NextResponse.json({
      reviews,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `获取评论失败: ${error.message}` },
      { status: 500 }
    )
  }
}

// 添加商品评论
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id
  
  try {
    const { userId, username, rating, comment } = await request.json()
    
    // 验证必填字段
    if (!userId || !username || !rating) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }
    
    // 验证评分范围
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '评分必须在1-5之间' },
        { status: 400 }
      )
    }
    
    // 检查用户是否已评论过该商品
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle()
    
    if (checkError) {
      return NextResponse.json(
        { error: '检查用户评论失败' },
        { status: 500 }
      )
    }
    
    let reviewId
    
    // 如果用户已评论过，则更新评论
    if (existingReview) {
      const { data, error: updateError } = await supabase
        .from('reviews')
        .update({
          rating,
          comment,
          created_at: new Date().toISOString()
        })
        .eq('id', existingReview.id)
        .select()
      
      if (updateError) {
        return NextResponse.json(
          { error: '更新评论失败' },
          { status: 500 }
        )
      }
      
      reviewId = existingReview.id
    } 
    // 否则创建新评论
    else {
      const { data, error: insertError } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: userId,
          username,
          rating,
          comment
        })
        .select()
      
      if (insertError) {
        return NextResponse.json(
          { error: '添加评论失败' },
          { status: 500 }
        )
      }
      
      if (data && data.length > 0) {
        reviewId = data[0].id
      }
    }
    
    // 更新商品的评分和评论数
    await updateProductRating(productId)
    
    return NextResponse.json({
      success: true,
      message: existingReview ? '评论已更新' : '评论已添加',
      reviewId
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `添加评论失败: ${error.message}` },
      { status: 500 }
    )
  }
}

// 辅助函数：更新商品的平均评分和评论数
async function updateProductRating(productId: string) {
  try {
    // 获取该商品的所有评论
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
    
    if (fetchError) {
      console.error('获取评论失败:', fetchError)
      return
    }
    
    // 如果没有评论，则将评分设为0
    if (!reviews || reviews.length === 0) {
      await supabase
        .from('products')
        .update({
          rating: 0,
          reviews: 0
        })
        .eq('id', productId)
      return
    }
    
    // 计算平均评分
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1))
    
    // 更新商品的评分和评论数
    await supabase
      .from('products')
      .update({
        rating: averageRating,
        reviews: reviews.length
      })
      .eq('id', productId)
  } catch (error) {
    console.error('更新商品评分失败:', error)
  }
} 