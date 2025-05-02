import { NextRequest, NextResponse } from 'next/server'

// 模拟商品数据 - 使用全局变量存储，不再导出
// 在真实应用中，应该使用数据库存储
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

// 导出一个函数用于其他文件获取商品数据
export function getProducts() {
  return productsData
}

// 获取商品列表
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const keyword = url.searchParams.get('keyword') || ''
  const category = url.searchParams.get('category')
  const sortBy = url.searchParams.get('sortBy') || 'relevance'
  
  // 筛选
  let filteredProducts = [...productsData]
  
  // 关键词搜索
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(lowerKeyword) || 
           p.description.toLowerCase().includes(lowerKeyword)
    )
  }
  
  // 分类筛选
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === parseInt(category))
  }
  
  // 排序
  switch (sortBy) {
    case 'priceAsc':
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case 'priceDesc':
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case 'latest':
      // 在真实场景中，这里应该按照创建时间排序
      // 这里简单地按id倒序排列，模拟最新添加的在前面
      filteredProducts.sort((a, b) => b.id - a.id)
      break
    case 'relevance':
    default:
      // 默认排序，保持原有顺序
      break
  }
  
  // 计算总数
  const total = filteredProducts.length
  
  // 分页
  const startIndex = (page - 1) * limit
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)
  
  // 返回结果
  return NextResponse.json({
    products: paginatedProducts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  })
}

// 新增商品
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const data = await request.json()
    
    // 验证必填字段
    if (!data.name || !data.description || !data.price || !data.image || !data.category) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    
    // 生成新ID（在真实场景中，这应该由数据库自动生成）
    const maxId = Math.max(...productsData.map(p => p.id), 0)
    const newId = maxId + 1
    
    // 创建新商品
    const newProduct = {
      id: newId,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: parseInt(data.category),
      inventory: parseInt(data.inventory) || 0,
      rating: 0,
      reviews: 0
    }
    
    // 添加到商品列表
    productsData.push(newProduct)
    
    // 返回新创建的商品
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('创建商品失败:', error)
    return NextResponse.json({ error: '创建商品失败' }, { status: 500 })
  }
} 