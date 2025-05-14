import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'

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

// 检查产品表是否存在，如果不存在则创建
async function ensureProductsTableExists() {
  try {
    // 先检查表是否存在
    const { count, error: checkError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    
    if (checkError && (checkError.code === 'PGRST116' || checkError.code === '42P01' || checkError.message.includes('does not exist'))) {
      console.log('产品表不存在，尝试创建...')
      
      // 创建产品表
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          image VARCHAR(255) NOT NULL,
          category INTEGER NOT NULL,
          inventory INTEGER NOT NULL DEFAULT 0,
          rating DECIMAL(3,1) NOT NULL DEFAULT 0,
          reviews INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { query: createTableSQL })
      
      if (createError) {
        console.error('创建产品表失败:', createError)
        
        // 尝试通过插入测试判断表是否存在
        if (createError.message.includes('function') && createError.message.includes('does not exist')) {
          console.log('exec_sql函数不存在，尝试使用其他方法初始化...')
          
          const { error: insertError } = await supabase
            .from('products')
            .insert([
              {
                name: '测试产品',
                description: '测试产品，初始化用',
                price: 0,
                image: 'https://picsum.photos/id/1/500/500',
                category: 1,
                inventory: 0,
                rating: 0,
                reviews: 0
              }
            ])
          
          if (insertError && !insertError.message.includes('already exists')) {
            console.error('尝试插入测试数据失败:', insertError)
            throw new Error('无法确认产品表是否存在')
          }
        } else {
          throw createError
        }
      }
      
      console.log('产品表创建成功')
      
      // 插入示例产品
      const sampleProducts = [
        { name: '智能手表', description: '高级智能手表，支持多种运动模式和健康监测功能', price: 1299, image: 'https://picsum.photos/id/1/500/500', category: 1, inventory: 50, rating: 4.8, reviews: 120 },
        { name: '蓝牙耳机', description: '无线蓝牙耳机，支持降噪功能，续航时间长', price: 399, image: 'https://picsum.photos/id/3/500/500', category: 1, inventory: 200, rating: 4.5, reviews: 85 },
        { name: '真皮沙发', description: '进口真皮沙发，舒适耐用，适合家庭使用', price: 4999, image: 'https://picsum.photos/id/20/500/500', category: 2, inventory: 10, rating: 4.9, reviews: 32 },
        { name: '纯棉T恤', description: '100%纯棉材质，透气舒适，多色可选', price: 99, image: 'https://picsum.photos/id/25/500/500', category: 3, inventory: 500, rating: 4.3, reviews: 210 },
        { name: '保湿面霜', description: '深层保湿面霜，适合干性肌肤，改善肌肤干燥问题', price: 159, image: 'https://picsum.photos/id/30/500/500', category: 4, inventory: 80, rating: 4.6, reviews: 65 }
      ]
      
      const { error: insertError } = await supabase
        .from('products')
        .upsert(sampleProducts)
      
      if (insertError) {
        console.error('插入示例产品失败:', insertError)
      } else {
        console.log('示例产品数据已插入')
      }
    }
    
    return true
  } catch (error) {
    console.error('检查/创建产品表失败:', error)
    return false
  }
}

// 获取商品列表
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '12') // 默认为12个商品每页
    const keyword = url.searchParams.get('keyword') || ''
    const categoryParam = url.searchParams.getAll('category')
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')
    const sortBy = url.searchParams.get('sortBy') || 'newest'
    const minRating = url.searchParams.get('minRating')
    
    console.log('获取商品列表，参数:', { 
      page, 
      limit, 
      keyword, 
      category: categoryParam, 
      minPrice, 
      maxPrice, 
      sortBy,
      minRating
    })
    
    // 确保产品表存在
    await ensureProductsTableExists()
    
    // 构建查询
    let query = supabase.from('products').select('*', { count: 'exact' })
    
    // 关键词搜索
    if (keyword) {
      query = query.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    }
    
    // 分类筛选 - 支持多选
    if (categoryParam && categoryParam.length > 0) {
      const categories = categoryParam.map(c => parseInt(c)).filter(c => !isNaN(c))
      if (categories.length > 0) {
        query = query.in('category', categories)
      }
    }
    
    // 价格范围筛选
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }
    
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }
    
    // 评分筛选
    if (minRating) {
      query = query.gte('rating', parseFloat(minRating))
    }
    
    // 计算分页
    const startIndex = (page - 1) * limit
    
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
      case 'recommend':
      default:
        // 推荐排序: 先按评分、然后按销量(这里用评价数替代)、最后按创建时间
        query = query.order('rating', { ascending: false })
               .order('reviews', { ascending: false })
               .order('created_at', { ascending: false })
        break
    }
    
    // 执行分页查询
    const { data: products, error, count } = await query
      .range(startIndex, startIndex + limit - 1)
    
    if (error) {
      console.error('获取商品列表失败:', error)
      
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '产品表不存在，请初始化数据库', details: error.message, code: error.code },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ 
        error: '获取商品列表失败', 
        details: error.message, 
        code: error.code 
      }, { status: 500 })
    }
    
    const totalProducts = count || 0
    const totalPages = Math.max(1, Math.ceil(totalProducts / limit))
    
    console.log(`成功获取${products?.length || 0}件商品，总数:${totalProducts}，总页数:${totalPages}`)
    
    // 返回增强的结果
    return NextResponse.json({
      products: products || [],
      total: totalProducts,
      page: page,
      limit: limit,
      totalPages: totalPages,
      hasMore: page < totalPages,
      sort: sortBy
    })
  } catch (error: any) {
    console.error('获取商品列表失败:', error)
    return NextResponse.json({
      error: '获取商品列表失败',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

// 新增商品
export async function POST(request: NextRequest) {
  try {
    console.log('接收到商品创建请求');
    
    // 克隆请求以避免Body已被读取的错误
    const clonedRequest = request.clone();
    
    // 使用formData()解析请求，而不是json()
    let productData: any = {};
    try {
      // 尝试直接从请求头中获取内容类型
      const contentType = clonedRequest.headers.get('content-type') || '';
      console.log('请求Content-Type:', contentType);
      
      if (contentType.includes('application/json')) {
        // 直接获取请求的文本内容
        const bodyText = await clonedRequest.text();
        console.log('原始请求体文本:', bodyText.substring(0, 500)); // 只打印前500个字符
        
        try {
          productData = JSON.parse(bodyText);
          console.log('解析后的商品数据:', JSON.stringify(productData, null, 2));
        } catch (jsonError) {
          console.error('JSON解析失败:', jsonError);
          return NextResponse.json({
            error: '无效的JSON数据',
            details: '请求体不是有效的JSON格式',
            originalText: bodyText.substring(0, 100) // 包含错误文本的前100个字符
          }, { status: 400 });
        }
      } else {
        // 对于非JSON请求，尝试使用formData
        console.log('非JSON请求，尝试作为表单数据处理');
        const formData = await clonedRequest.formData();
        // 转换formData为普通对象
        formData.forEach((value, key) => {
          productData[key] = value;
        });
        console.log('从表单解析的商品数据:', JSON.stringify(productData, null, 2));
      }
    } catch (parseError: any) {
      console.error('请求体解析失败:', parseError);
      return NextResponse.json({
        error: '无法解析请求数据',
        details: parseError instanceof Error ? parseError.message : '未知解析错误'
      }, { status: 400 });
    }
    
    // 确保产品表存在
    const tableExists = await ensureProductsTableExists();
    if (!tableExists) {
      return NextResponse.json(
        { error: '产品表初始化失败' },
        { status: 500 }
      );
    }

    // 验证必填字段
    if (!productData.name || !productData.price || productData.category === undefined || productData.inventory === undefined) {
      const missingFields = [];
      
      if (!productData.name) missingFields.push('名称');
      if (!productData.price) missingFields.push('价格');
      if (productData.category === undefined) missingFields.push('分类');
      if (productData.inventory === undefined) missingFields.push('库存');
      
      return NextResponse.json(
        { 
          error: '请填写所有必填字段', 
          details: `缺少以下必填字段: ${missingFields.join(', ')}`,
          missingFields
        },
        { status: 400 }
      );
    }

    // 确保description和image字段不为null
    const description = typeof productData.description === 'string' ? productData.description.trim() : '该商品暂无描述';
    const image = productData.image || 'https://picsum.photos/id/1/500/500';

    // 创建新商品
    const newProduct: Omit<Product, 'id'> = {
      name: typeof productData.name === 'string' ? productData.name.trim() : String(productData.name),
      description: description,
      price: typeof productData.price === 'number' ? productData.price : parseFloat(String(productData.price)),
      image: image,
      category: typeof productData.category === 'number' ? productData.category : parseInt(String(productData.category || '1')),
      inventory: typeof productData.inventory === 'number' ? productData.inventory : parseInt(String(productData.inventory || '0')),
      rating: 0,
      reviews: 0
    };

    // 添加其他可选字段
    if (productData.brand) newProduct.brand = typeof productData.brand === 'string' ? productData.brand.trim() : String(productData.brand);
    if (productData.model) newProduct.model = typeof productData.model === 'string' ? productData.model.trim() : String(productData.model);
    if (productData.specifications) newProduct.specifications = typeof productData.specifications === 'string' ? productData.specifications.trim() : String(productData.specifications);
    
    // 处理布尔值
    if (productData.free_shipping !== undefined) {
      newProduct.free_shipping = productData.free_shipping === true || productData.free_shipping === 'true';
    }
    if (productData.returnable !== undefined) {
      newProduct.returnable = productData.returnable === true || productData.returnable === 'true';
    }
    if (productData.warranty !== undefined) {
      newProduct.warranty = productData.warranty === true || productData.warranty === 'true';
    }

    console.log('准备插入的商品数据:', JSON.stringify(newProduct, null, 2));

    // 在插入数据库前记录完整的商品数据
    console.log('准备插入的商品数据详情:');
    console.log('- 名称:', typeof newProduct.name, newProduct.name);
    console.log('- 价格:', typeof newProduct.price, newProduct.price);
    console.log('- 分类:', typeof newProduct.category, newProduct.category);
    console.log('- 库存:', typeof newProduct.inventory, newProduct.inventory);
    console.log('- 图片URL:', typeof newProduct.image, newProduct.image.substring(0, 100));
    console.log('- 可选字段数量:', 
      Object.keys(newProduct).filter(key => !['name', 'description', 'price', 'image', 'category', 'inventory', 'rating', 'reviews'].includes(key)).length);

    // 插入数据库
    const { data: createdProduct, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error('数据库插入失败:', error);
      console.error('错误代码:', error.code);
      console.error('错误详情:', error.message);
      console.error('SQL错误:', error.details || 'None');
      
      // 根据错误类型提供更详细的错误信息
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '产品表不存在，请初始化数据库', details: error.message, code: error.code },
          { status: 404 }
        );
      } else if (error.code === '23503') {
        return NextResponse.json(
          { error: '外键约束失败，请确认分类ID是否存在', details: error.message, code: error.code },
          { status: 400 }
        );
      } else if (error.code === '23502') {
        // NOT NULL 约束错误
        return NextResponse.json({
          error: '缺少必填字段',
          details: error.message,
          code: error.code,
          hint: '请确保提供了所有必填字段: 名称、价格、分类、库存'
        }, { status: 400 });
      } else if (error.code === '22P02') {
        // 无效的输入语法
        return NextResponse.json({
          error: '数据格式错误',
          details: error.message,
          code: error.code,
          hint: '请检查数字字段的格式是否正确'
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: '创建商品失败', 
        details: error.message,
        code: error.code,
        hint: '可能是数据库结构与提交的数据不匹配'
      }, { status: 500 });
    }
    
    console.log('商品创建成功:', createdProduct);
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: any) {
    console.error('创建商品失败:', error);
    
    return NextResponse.json({ 
      error: '创建商品失败', 
      details: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 