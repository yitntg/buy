import { NextRequest, NextResponse } from 'next/server'

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
  try {
    const id = parseInt(params.id)
    
    // 查找商品
    const product = productsData.find(p => p.id === id)
    
    if (!product) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('获取商品详情失败:', error)
    return NextResponse.json(
      { error: '获取商品详情失败' },
      { status: 500 }
    )
  }
}

// 更新商品
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    // 查找商品索引
    const productIndex = productsData.findIndex(p => p.id === id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      )
    }
    
    // 获取更新数据
    const data = await request.json()
    
    // 更新商品
    const updatedProduct = {
      ...productsData[productIndex],
      name: data.name || productsData[productIndex].name,
      description: data.description || productsData[productIndex].description,
      price: parseFloat(data.price) || productsData[productIndex].price,
      image: data.image || productsData[productIndex].image,
      category: parseInt(data.category) || productsData[productIndex].category,
      inventory: parseInt(data.inventory) || productsData[productIndex].inventory
    }
    
    // 替换原商品
    productsData[productIndex] = updatedProduct
    
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('更新商品失败:', error)
    return NextResponse.json(
      { error: '更新商品失败' },
      { status: 500 }
    )
  }
}

// 删除商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    // 查找商品索引
    const productIndex = productsData.findIndex(p => p.id === id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      )
    }
    
    // 删除商品
    const removedProduct = productsData.splice(productIndex, 1)[0]
    
    return NextResponse.json({ 
      message: '商品删除成功',
      deletedProduct: removedProduct
    })
  } catch (error) {
    console.error('删除商品失败:', error)
    return NextResponse.json(
      { error: '删除商品失败' },
      { status: 500 }
    )
  }
} 