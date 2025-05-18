import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/src/app/shared/infrastructure/lib/supabase'

// 获取单个商品
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    return NextResponse.json(
      { error: '商品不存在或获取失败' },
      { status: error.code === '22P02' ? 400 : 404 }
    )
  }
  
  return NextResponse.json(product)
}

// 更新商品
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await request.json()
    
    // 验证数据
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: '无有效更新数据' }, { status: 400 })
    }
    
    // 更新商品
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: '更新失败或商品不存在' }, 
        { status: error.code === '22P02' ? 400 : 404 }
      )
    }
    
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('更新商品失败:', error)
    return NextResponse.json({ error: '更新商品失败' }, { status: 500 })
  }
}

// 删除商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    return NextResponse.json(
      { error: '删除失败或商品不存在' },
      { status: error.code === '22P02' ? 400 : 404 }
    )
  }
  
  return NextResponse.json({ success: true, message: '商品已删除' })
} 