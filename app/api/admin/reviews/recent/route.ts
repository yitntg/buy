import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'

// 获取最近评论
export async function GET(request: NextRequest) {
  try {
    // 获取最近的10条评论
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, product_id, user_id, username, rating, comment, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('获取最近评论失败:', error)
      return NextResponse.json(
        { error: '获取最近评论失败' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ reviews })
  } catch (error: any) {
    console.error('获取最近评论失败:', error)
    return NextResponse.json(
      { error: `获取最近评论失败: ${error.message}` },
      { status: 500 }
    )
  }
} 