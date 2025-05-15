import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/shared/utils/supabase/client'

// 获取所有分类
export async function GET(request: NextApiRequest) {
  try {
    console.log('正在获取分类数据...')

    // 查询所有分类
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('获取分类失败:', error)
      
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextApiResponse.json(
          { error: '分类表不存在，请在Supabase中创建必要的表', details: error.message, code: error.code },
          { status: 404 }
        )
      }
      
      return NextApiResponse.json(
        { error: '获取分类失败', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    
    console.log('成功获取分类数据:', data?.length || 0, '条记录')
    return NextApiResponse.json(data || [])
  } catch (error: any) {
    console.error('获取分类失败:', error)
    return NextApiResponse.json(
      { error: `获取分类失败: ${error.message}`, stack: error.stack },
      { status: 500 }
    )
  }
}

// 创建新分类
export async function POST(request: NextApiRequest) {
  try {
    // 克隆请求以避免Body has already been read错误
    const clonedRequest = request.clone();
    
    let data;
    try {
      // 使用clonedRequest读取请求体
      data = await clonedRequest.json();
      console.log('创建分类请求数据:', data);
    } catch (parseError) {
      console.error('解析请求数据失败:', parseError);
      return NextApiResponse.json(
        { error: '无法解析请求数据', details: parseError instanceof Error ? parseError.message : '解析错误' },
        { status: 400 }
      );
    }
    
    // 验证必填字段
    if (!data.name) {
      return NextApiResponse.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }
    
    // 创建新分类
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({
        name: data.name,
        description: data.description || ''
      })
      .select()
      .single()
    
    if (error) {
      console.error('创建分类失败:', error)
      
      // 更详细的错误处理
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return NextApiResponse.json(
          { error: '分类表不存在，请在Supabase中创建必要的表', details: error.message, code: error.code },
          { status: 404 }
        )
      } else if (error.code === '23505') {
        return NextApiResponse.json(
          { error: '分类名称已存在', details: error.message, code: error.code },
          { status: 409 }  // Conflict
        )
      }
      
      return NextApiResponse.json(
        { error: '创建分类失败', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    
    console.log('分类创建成功:', newCategory)
    return NextApiResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error('创建分类失败:', error)
    return NextApiResponse.json(
      { error: `创建分类失败: ${error.message}`, stack: error.stack },
      { status: 500 }
    )
  }
}

// 分类项接口
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image?: string;
  products_count?: number;
  created_at: string;
}

/**
 * 获取所有分类
 * @returns 分类列表
 */
export async function getCategories(): Promise<{ data: Category[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Category[],
      error: null
    };
  } catch (error) {
    console.error('获取分类失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 获取单个分类信息
 * @param categoryId 分类ID
 * @returns 分类信息
 */
export async function getCategoryById(categoryId: string): Promise<{ data: Category | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Category,
      error: null
    };
  } catch (error) {
    console.error('获取分类详情失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 根据slug获取分类
 * @param slug 分类别名
 * @returns 分类信息
 */
export async function getCategoryBySlug(slug: string): Promise<{ data: Category | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Category,
      error: null
    };
  } catch (error) {
    console.error('获取分类详情失败:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : '发生未知错误'
    };
  }
}

/**
 * 处理分类API请求
 * @param req 请求对象
 * @param res 响应对象
 */
export async function handleCategoriesRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          // 获取单个分类
          const { data, error } = await getCategoryById(req.query.id as string);
          if (error) return res.status(500).json({ error });
          return res.status(200).json(data);
        } else if (req.query.slug) {
          // 根据slug获取分类
          const { data, error } = await getCategoryBySlug(req.query.slug as string);
          if (error) return res.status(500).json({ error });
          return res.status(200).json(data);
        } else {
          // 获取所有分类
          const { data, error } = await getCategories();
          if (error) return res.status(500).json({ error });
          return res.status(200).json(data);
        }
      default:
        return res.status(405).json({ error: '方法不允许' });
    }
  } catch (error) {
    console.error('分类API错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 
