import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 使用与根路由相同的模拟商品数据
// 这在真实应用中应该使用数据库
const productsData = [
  {
    id: 1,
    name: '智能手表',
    description: '高级智能手表，支持多种运动模式和健康监测功能',
    price: 1299,
    image: 'https://picsum.photos/id/1/500/500',
    category: 1,
    inventory: 50,
    rating: 4.8,
    reviews: 120
  },
  {
    id: 2,
    name: '蓝牙耳机',
    description: '无线蓝牙耳机，支持降噪功能，续航时间长',
    price: 399,
    image: 'https://picsum.photos/id/3/500/500',
    category: 1,
    inventory: 200,
    rating: 4.5,
    reviews: 85
  },
  {
    id: 3,
    name: '真皮沙发',
    description: '进口真皮沙发，舒适耐用，适合家庭使用',
    price: 4999,
    image: 'https://picsum.photos/id/20/500/500',
    category: 2,
    inventory: 10,
    rating: 4.9,
    reviews: 32
  },
  {
    id: 4,
    name: '纯棉T恤',
    description: '100%纯棉材质，透气舒适，多色可选',
    price: 99,
    image: 'https://picsum.photos/id/25/500/500',
    category: 3,
    inventory: 500,
    rating: 4.3,
    reviews: 210
  },
  {
    id: 5,
    name: '保湿面霜',
    description: '深层保湿面霜，适合干性肌肤，改善肌肤干燥问题',
    price: 159,
    image: 'https://picsum.photos/id/30/500/500',
    category: 4,
    inventory: 80,
    rating: 4.6,
    reviews: 65
  },
  {
    id: 6,
    name: '有机坚果礼盒',
    description: '精选有机坚果礼盒，包含多种坚果，营养丰富',
    price: 169,
    image: 'https://picsum.photos/id/40/500/500',
    category: 5,
    inventory: 100,
    rating: 4.7,
    reviews: 48
  },
  {
    id: 7,
    name: '瑜伽垫',
    description: '专业瑜伽垫，防滑耐磨，厚度适中，适合各种瑜伽动作',
    price: 128,
    image: 'https://picsum.photos/id/50/500/500',
    category: 6,
    inventory: 60,
    rating: 4.4,
    reviews: 72
  }
]

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