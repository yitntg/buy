import { NextResponse } from 'next/server'

// 模拟的商品数据
const products = [
  {
    id: 1,
    name: '高品质蓝牙耳机',
    description: '无线降噪耳机，长续航，高音质',
    price: 299,
    image: 'https://picsum.photos/id/1/400/300',
    category: 1,
    inventory: 100,
    rating: 4.8,
    reviews: 120,
    specifications: {
      brand: 'AudioTech',
      model: 'AT-200',
      color: '黑色',
      battery: '20小时续航',
      connectivity: '蓝牙5.0'
    }
  },
  {
    id: 2,
    name: '智能手表',
    description: '全面健康监测，多功能运动模式',
    price: 599,
    image: 'https://picsum.photos/id/2/400/300',
    category: 1,
    inventory: 50,
    rating: 4.5,
    reviews: 85,
    specifications: {
      brand: 'SmartLife',
      model: 'SL-Watch Pro',
      color: '银色',
      battery: '7天续航',
      waterproof: 'IP68级防水'
    }
  },
  {
    id: 3,
    name: '轻薄笔记本电脑',
    description: '高性能处理器，长达12小时续航',
    price: 4999,
    image: 'https://picsum.photos/id/3/400/300',
    category: 1,
    inventory: 30,
    rating: 4.7,
    reviews: 64,
    specifications: {
      brand: 'TechBook',
      model: 'Air 14',
      processor: 'Intel i7 12代',
      memory: '16GB',
      storage: '512GB SSD',
      display: '14英寸 2K屏幕'
    }
  },
  {
    id: 4,
    name: '专业摄影相机',
    description: '2400万像素，4K视频录制',
    price: 3299,
    image: 'https://picsum.photos/id/4/400/300',
    category: 1,
    inventory: 15,
    rating: 4.9,
    reviews: 42,
    specifications: {
      brand: 'PhotoMaster',
      model: 'PM-D800',
      sensorType: 'CMOS',
      resolution: '2400万像素',
      videoResolution: '4K/60fps',
      weight: '680g'
    }
  },
  {
    id: 5,
    name: '时尚双肩包',
    description: '大容量，防水材质，适合旅行和日常使用',
    price: 199,
    image: 'https://picsum.photos/id/5/400/300',
    category: 3,
    inventory: 200,
    rating: 4.3,
    reviews: 156,
    specifications: {
      brand: 'TravelGo',
      material: '防水尼龙',
      capacity: '30L',
      color: '灰色',
      dimensions: '45 x 30 x 15 cm'
    }
  },
  {
    id: 6,
    name: '多功能厨房料理机',
    description: '一机多用，轻松处理各类食材',
    price: 599,
    image: 'https://picsum.photos/id/6/400/300',
    category: 2,
    inventory: 75,
    rating: 4.6,
    reviews: 89,
    specifications: {
      brand: 'KitchenPro',
      power: '800W',
      capacity: '2L',
      functions: '切碎、搅拌、榨汁、研磨',
      color: '白色'
    }
  },
  {
    id: 7,
    name: '天然有机护肤套装',
    description: '不含化学添加剂，适合敏感肌肤',
    price: 329,
    image: 'https://picsum.photos/id/7/400/300',
    category: 4,
    inventory: 120,
    rating: 4.7,
    reviews: 113,
    specifications: {
      brand: 'NatureSkin',
      skinType: '所有肤质',
      ingredients: '有机植物提取物',
      contents: '洁面乳、爽肤水、精华液、面霜',
      volume: '多种规格'
    }
  },
  {
    id: 8,
    name: '专业瑜伽垫',
    description: '环保材质，防滑设计，舒适缓冲',
    price: 159,
    image: 'https://picsum.photos/id/8/400/300',
    category: 6,
    inventory: 180,
    rating: 4.8,
    reviews: 95,
    specifications: {
      brand: 'YogaLife',
      material: 'TPE环保材质',
      thickness: '6mm',
      size: '183 x 61 cm',
      color: '紫色'
    }
  }
]

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 在实际应用中，这里应该有数据验证和处理逻辑
    // 然后将商品保存到数据库
    
    // 模拟新增商品
    const newProduct = {
      id: products.length + 1,
      ...body,
      rating: 0,
      reviews: 0
    }
    
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '提交失败，请检查输入内容' }, 
      { status: 400 }
    )
  }
} 