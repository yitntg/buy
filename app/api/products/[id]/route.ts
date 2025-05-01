import { NextResponse } from 'next/server'

// 模拟商品数据库
const products = [
  {
    id: '1',
    name: '高品质蓝牙耳机',
    description: '无线降噪耳机，长续航，高音质，适合运动和日常使用。配备先进的降噪技术，让您沉浸在音乐世界中。',
    price: 299,
    image: 'https://picsum.photos/id/1/800/600',
    rating: 4.8,
    reviews: 128,
    inventory: 50,
    specifications: {
      '品牌': 'SoundMaster',
      '型号': 'BT-500',
      '连接方式': '蓝牙5.0',
      '电池续航': '30小时',
      '防水等级': 'IPX5',
      '重量': '58g',
      '颜色': '黑色/白色/蓝色'
    }
  },
  {
    id: '2',
    name: '智能手表',
    description: '全面健康监测，多功能运动模式，支持心率、血氧、睡眠监测，50米防水。',
    price: 599,
    image: 'https://picsum.photos/id/2/800/600',
    rating: 4.6,
    reviews: 89,
    inventory: 35,
    specifications: {
      '品牌': 'TechFit',
      '型号': 'SmartWatch Pro',
      '屏幕': '1.4英寸AMOLED',
      '电池续航': '14天',
      '防水等级': '5ATM',
      '重量': '32g',
      '兼容系统': 'iOS/Android'
    }
  },
  {
    id: '3',
    name: '轻薄笔记本电脑',
    description: '高性能处理器，长达12小时续航，轻薄设计，适合办公和轻度游戏。',
    price: 4999,
    image: 'https://picsum.photos/id/3/800/600',
    rating: 4.7,
    reviews: 56,
    inventory: 15,
    specifications: {
      '品牌': 'LightBook',
      '型号': 'Air 14',
      '处理器': 'Intel i7-1165G7',
      '内存': '16GB',
      '存储': '512GB SSD',
      '显卡': 'Intel Iris Xe',
      '屏幕': '14英寸 2.2K'
    }
  },
  {
    id: '4',
    name: '专业摄影相机',
    description: '2400万像素，4K视频录制，专业级图像处理器，适合风景和人像摄影。',
    price: 3299,
    image: 'https://picsum.photos/id/4/800/600',
    rating: 4.9,
    reviews: 42,
    inventory: 8,
    specifications: {
      '品牌': 'PhotoMaster',
      '型号': 'PM-D750',
      '感光元件': 'CMOS',
      '像素': '2400万',
      '视频录制': '4K 30fps',
      '防抖': '5轴防抖',
      '重量': '685g'
    }
  }
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 确保参数id存在，并尝试查找对应的产品
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: '商品ID不能为空' }, { status: 400 });
    }
    
    // 查找产品，同时支持数字和字符串格式的id
    const product = products.find(p => p.id === id || p.id === String(id));
    
    if (!product) {
      return NextResponse.json({ message: '商品不存在' }, { status: 404 });
    }
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('获取商品详情出错:', error);
    return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
  }
} 