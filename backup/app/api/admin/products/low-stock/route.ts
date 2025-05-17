import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/src/app/shared/infrastructure/lib/supabase'

// 防止路由被静态生成
export const dynamic = 'force-dynamic';

// 获取库存不足的商品
export async function GET(request: NextRequest) {
  try {
    // 获取URL参数
    const url = new URL(request.url)
    const threshold = parseInt(url.searchParams.get('threshold') || '10')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    
    // 获取库存低于指定阈值的商品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, inventory, image')
      .lt('inventory', threshold)
      .order('inventory', { ascending: true })
      .limit(limit)
    
    if (error) {
      console.error('获取库存不足商品失败:', error)
      return NextResponse.json(
        { error: '获取库存不足商品失败' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('获取库存不足商品失败:', error)
    return NextResponse.json(
      { error: `获取库存不足商品失败: ${error.message}` },
      { status: 500 }
    )
  }
} 