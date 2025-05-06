import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 检查分类表是否存在，如果不存在则创建
async function ensureCategoriesTableExists() {
  try {
    // 先检查表是否存在
    const { count, error: checkError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
    
    if (checkError && (checkError.code === 'PGRST116' || checkError.code === '42P01' || checkError.message.includes('does not exist'))) {
      console.log('分类表不存在，尝试创建...')
      
      // 创建分类表
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { query: createTableSQL })
      
      if (createError) {
        console.error('创建分类表失败:', createError)
        
        // 尝试创建exec_sql函数
        if (createError.message.includes('function') && createError.message.includes('does not exist')) {
          console.log('exec_sql函数不存在，尝试使用其他方法初始化...')
          
          // 使用插入测试判断表是否存在
          const { error: insertError } = await supabase
            .from('categories')
            .insert([
              { name: '测试分类', description: '测试分类，初始化用' }
            ])
          
          if (insertError && !insertError.message.includes('already exists')) {
            console.error('尝试插入测试数据失败:', insertError)
            throw new Error('无法确认分类表是否存在')
          }
        } else {
          throw createError
        }
      }
      
      console.log('分类表创建成功')
      
      // 插入默认分类
      const defaultCategories = [
        { id: 1, name: '电子产品', description: '各类电子产品、数码设备' },
        { id: 2, name: '家居家具', description: '家具、家居用品' },
        { id: 3, name: '服装服饰', description: '各类衣物、服装、鞋帽' },
        { id: 4, name: '美妆个护', description: '美妆、个人护理用品' },
        { id: 5, name: '食品饮料', description: '零食、饮品、生鲜食品' },
        { id: 6, name: '运动户外', description: '运动器材、户外装备' }
      ]
      
      const { error: insertError } = await supabase
        .from('categories')
        .upsert(defaultCategories, { onConflict: 'id' })
      
      if (insertError) {
        console.error('插入默认分类失败:', insertError)
      } else {
        console.log('默认分类数据已插入')
      }
    }
    
    return true
  } catch (error) {
    console.error('检查/创建分类表失败:', error)
    return false
  }
}

// 获取所有分类
export async function GET(request: NextRequest) {
  try {
    // 注意：不要尝试读取request.body，这是导致错误的原因
    console.log('正在获取分类数据...')
    
    // 确保分类表存在
    await ensureCategoriesTableExists()

    // 查询所有分类
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('获取分类失败:', error)
      
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: '分类表不存在，请初始化数据库', details: error.message, code: error.code },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: '获取分类失败', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    
    console.log('成功获取分类数据:', data?.length || 0, '条记录')
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('获取分类失败:', error)
    return NextResponse.json(
      { error: `获取分类失败: ${error.message}`, stack: error.stack },
      { status: 500 }
    )
  }
}

// 创建新分类
export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: '无法解析请求数据', details: parseError instanceof Error ? parseError.message : '解析错误' },
        { status: 400 }
      );
    }
    
    // 确保分类表存在
    await ensureCategoriesTableExists()
    
    // 验证必填字段
    if (!data.name) {
      return NextResponse.json(
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
        return NextResponse.json(
          { error: '分类表不存在，请初始化数据库', details: error.message, code: error.code },
          { status: 404 }
        )
      } else if (error.code === '23505') {
        return NextResponse.json(
          { error: '分类名称已存在', details: error.message, code: error.code },
          { status: 409 }  // Conflict
        )
      }
      
      return NextResponse.json(
        { error: '创建分类失败', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    
    console.log('分类创建成功:', newCategory)
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error('创建分类失败:', error)
    return NextResponse.json(
      { error: `创建分类失败: ${error.message}`, stack: error.stack },
      { status: 500 }
    )
  }
} 