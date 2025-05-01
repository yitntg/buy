import { NextResponse } from 'next/server'

// 模拟的商品数据 (这些数据在实际应用中应该来自数据库)
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
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  
  const product = products.find(p => p.id === id)
  
  if (!product) {
    return NextResponse.json(
      { error: '商品不存在' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(product)
} 