import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 批量删除评论
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json()
    
    // 验证IDs是否有效
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: '无效的评论ID列表' },
        { status: 400 }
      )
    }
    
    // 执行批量删除
    const { error } = await supabase
      .from('reviews')
      .delete()
      .in('id', ids)
    
    if (error) {
      console.error('批量删除评论失败:', error)
      return NextResponse.json(
        { error: '批量删除评论失败' },
        { status: 500 }
      )
    }
    
    // 更新相关产品的评分和评论数
    // 这里我们需要为每个受影响的产品更新评分
    for (const productId of await getAffectedProductIds(ids)) {
      await updateProductRating(productId)
    }
    
    return NextResponse.json({
      success: true,
      message: `成功删除 ${ids.length} 条评论`
    })
  } catch (error: any) {
    console.error('批量删除评论失败:', error)
    return NextResponse.json(
      { error: `批量删除评论失败: ${error.message}` },
      { status: 500 }
    )
  }
}

// 获取受影响的产品ID列表
async function getAffectedProductIds(reviewIds: number[]): Promise<number[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('product_id')
    .in('id', reviewIds)
  
  if (error || !data) {
    console.error('获取受影响产品ID失败:', error)
    return []
  }
  
  // 提取唯一的产品ID
  return Array.from(new Set(data.map(review => review.product_id)))
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