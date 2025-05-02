import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取单个评论
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const { data: review, error } = await supabase
      .from('reviews')
      .select('*, products!inner(name)')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '评论不存在' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: '获取评论失败' },
        { status: 500 }
      )
    }
    
    // 处理返回的数据，添加product_name字段
    const formattedReview = {
      ...review,
      product_name: review.products?.name || null,
      products: undefined // 移除products对象
    }
    
    return NextResponse.json(formattedReview)
  } catch (error: any) {
    console.error('获取评论详情失败:', error)
    return NextResponse.json(
      { error: `获取评论详情失败: ${error.message}` },
      { status: 500 }
    )
  }
}

// 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // 首先获取评论信息，以便后续更新产品评分
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      return NextResponse.json(
        { error: '评论不存在或已被删除' },
        { status: fetchError.code === 'PGRST116' ? 404 : 500 }
      )
    }
    
    // 删除评论
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json(
        { error: '删除评论失败' },
        { status: 500 }
      )
    }
    
    // 更新商品的评分和评论数
    if (review && review.product_id) {
      await updateProductRating(review.product_id)
    }
    
    return NextResponse.json({
      success: true,
      message: '评论已删除'
    })
  } catch (error: any) {
    console.error('删除评论失败:', error)
    return NextResponse.json(
      { error: `删除评论失败: ${error.message}` },
      { status: 500 }
    )
  }
}

// 更新产品评分和评论数
async function updateProductRating(productId: number) {
  try {
    // 获取该商品的所有评论
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
    
    if (fetchError) {
      console.error('获取产品评论失败:', fetchError)
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