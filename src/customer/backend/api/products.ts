import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

// 定义Product接口
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: number
  inventory: number
  rating: number
  reviews: number
  created_at?: string
  brand?: string
  model?: string
  specifications?: string
  free_shipping?: boolean
  returnable?: boolean
  warranty?: boolean
}

// 获取产品列表
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const category = url.searchParams.get('category') || ''
    const search = url.searchParams.get('search') || ''
    const sortBy = url.searchParams.get('sortBy') || 'created_at'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'
    
    // 构建查询
    let query = supabase.from('products').select('*', { count: 'exact' })
    
    // 应用搜索过滤
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    // 应用分类过滤
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    // 计算分页
    const startIndex = (page - 1) * limit
    
    // 排序
    const sortColumn = ['name', 'price', 'created_at', 'inventory', 'rating'].includes(sortBy) 
      ? sortBy 
      : 'created_at'
    
    const order = sortOrder === 'asc' ? true : false
    
    // 执行查询
    const { data: products, error, count } = await query
      .order(sortColumn, { ascending: order })
      .range(startIndex, startIndex + limit - 1)
    
    if (error) {
      console.error('获取产品列表失败:', error)
      
      // 表不存在
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '产品表不存在，请在Supabase中创建必要的表', details: error.message },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ 
        error: '获取产品列表失败', 
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      products: products || [],
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    })
  } catch (error: any) {
    console.error('获取产品列表失败:', error)
    return NextResponse.json({ 
      error: '获取产品列表失败', 
      details: error.message 
    }, { status: 500 })
  }
}

// 创建产品
export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    let productData;
    try {
      productData = await request.json();
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 });
    }
    
    // 验证必填字段
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: '名称、描述、价格和分类是必填字段' },
        { status: 400 }
      );
    }
    
    // 准备产品数据
    const newProduct = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      image: productData.image || 'https://picsum.photos/id/1/500/500',
      category: parseInt(productData.category),
      inventory: productData.inventory ? parseInt(productData.inventory) : 0,
      rating: productData.rating ? parseFloat(productData.rating) : 0,
      reviews: productData.reviews ? parseInt(productData.reviews) : 0
    };
    
    // 创建产品
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();
    
    if (error) {
      console.error('创建产品失败:', error);
      
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return NextResponse.json(
          { error: '产品表不存在，请在Supabase中创建必要的表', details: error.message },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: '创建产品失败', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('创建产品失败:', error);
    return NextResponse.json(
      { error: `创建产品失败: ${error.message}` },
      { status: 500 }
    );
  }
}

interface CategoryCount {
  category_id: number;
  count: string;
}

interface RatingCount {
  rating: number;
  count: string;
}

interface PriceData {
  price: number;
}

interface FilterCounts {
  categories: Record<number, number>;
  priceRanges: Record<string, number>;
  ratings: Record<number, number>;
}

/**
 * 处理商品列表请求
 */
export async function handleProductsRequest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '不支持的请求方法' })
  }

  try {
    const {
      page = '1',
      limit = '12',
      keyword,
      category,
      minPrice,
      maxPrice,
      minRating,
      sortBy
    } = req.query

    // 构建基础查询
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', 'active')

    // 关键词搜索
    if (keyword) {
      query = query.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    }

    // 分类筛选
    if (category) {
      const categories = Array.isArray(category) ? category : [category]
      query = query.in('category_id', categories)
    }

    // 价格范围筛选
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice as string))
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice as string))
    }

    // 评分筛选
    if (minRating) {
      query = query.gte('rating', parseFloat(minRating as string))
    }

    // 排序
    switch (sortBy) {
      case 'price-asc':
        query = query.order('price', { ascending: true })
        break
      case 'price-desc':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      default:
        // 默认按推荐排序（可以根据需求修改）
        query = query.order('rating', { ascending: false })
    }

    // 分页
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const start = (pageNum - 1) * limitNum
    
    // 执行查询
    const { data: products, error, count } = await query
      .range(start, start + limitNum - 1)

    if (error) {
      console.error('获取商品列表失败:', error)
      return res.status(500).json({ error: '获取商品列表失败' })
    }

    // 获取筛选计数
    const filterCounts = await getFilterCounts()

    // 返回结果
    return res.status(200).json({
      products: products || [],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limitNum),
      filterCounts
    })

  } catch (error) {
    console.error('处理商品列表请求失败:', error)
    return res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 获取筛选条件的计数
 */
async function getFilterCounts(): Promise<FilterCounts> {
  try {
    // 获取分类计数
    const { data: categoryData } = await supabase
      .rpc('get_category_counts') as { data: CategoryCount[] }

    // 获取价格区间计数
    const { data: priceData } = await supabase
      .from('products')
      .select('price')
      .eq('status', 'active') as { data: PriceData[] }

    // 获取评分计数
    const { data: ratingData } = await supabase
      .rpc('get_rating_counts') as { data: RatingCount[] }

    // 处理价格区间计数
    const priceRanges: Record<string, number> = {
      '0-100': 0,
      '100-300': 0,
      '300-500': 0,
      '500-1000': 0,
      '1000-999999': 0
    }

    priceData?.forEach(item => {
      const price = item.price
      if (price <= 100) priceRanges['0-100']++
      else if (price <= 300) priceRanges['100-300']++
      else if (price <= 500) priceRanges['300-500']++
      else if (price <= 1000) priceRanges['500-1000']++
      else priceRanges['1000-999999']++
    })

    return {
      categories: categoryData?.reduce((acc: Record<number, number>, curr: CategoryCount) => {
        acc[curr.category_id] = parseInt(curr.count)
        return acc
      }, {}),
      priceRanges,
      ratings: ratingData?.reduce((acc: Record<number, number>, curr: RatingCount) => {
        acc[curr.rating] = parseInt(curr.count)
        return acc
      }, {})
    }

  } catch (error) {
    console.error('获取筛选计数失败:', error)
    return {
      categories: {},
      priceRanges: {},
      ratings: {}
    }
  }
} 
