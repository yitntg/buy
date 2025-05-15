import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'

// 获取所有分类
export async function GET(request: NextRequest) {
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
        return NextResponse.json(
          { error: '分类表不存在，请在Supabase中创建必要的表', details: error.message, code: error.code },
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
          { error: '分类表不存在，请在Supabase中创建必要的表', details: error.message, code: error.code },
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