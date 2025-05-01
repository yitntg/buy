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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const keyword = searchParams.get('keyword')?.toLowerCase();
    const categoryId = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // 筛选产品
    let filteredProducts = [...products];
    
    // 关键字搜索
    if (keyword) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(keyword) || 
        product.description.toLowerCase().includes(keyword)
      );
    }
    
    // 分类过滤
    if (categoryId) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === parseInt(categoryId)
      );
    }
    
    // 价格区间过滤
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= parseInt(minPrice)
      );
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= parseInt(maxPrice)
      );
    }
    
    // 评分过滤
    if (minRating) {
      filteredProducts = filteredProducts.filter(product => 
        product.rating >= parseFloat(minRating)
      );
    }
    
    // 排序
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // 假设id越大的产品越新
          filteredProducts.sort((a, b) => Number(b.id) - Number(a.id));
          break;
        default:
          // 默认排序，不做任何改变
          break;
      }
    }
    
    // 计算总页数
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    
    // 分页
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    // 返回结果
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        total: totalProducts,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('获取产品列表出错:', error);
    return NextResponse.json(
      { error: '获取产品列表失败' }, 
      { status: 500 }
    );
  }
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