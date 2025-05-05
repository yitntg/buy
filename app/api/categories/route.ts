import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取所有分类
export async function GET(request: NextRequest) {
  try {
    console.log('正在获取分类数据...')

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('获取分类失败:', error)
      return NextResponse.json(
        { error: '获取分类失败', details: error.message },
        { status: 500 }
      )
    }
    
    console.log('成功获取分类数据:', data?.length || 0, '条记录')
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('获取分类失败:', error)
    return NextResponse.json(
      { error: `获取分类失败: ${error.message}` },
      { status: 500 }
    )
  }
}

// 创建新分类
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('创建分类请求数据:', data)
    
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
      return NextResponse.json(
        { error: '创建分类失败', details: error.message },
        { status: 500 }
      )
    }
    
    console.log('分类创建成功:', newCategory)
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error('创建分类失败:', error)
    return NextResponse.json(
      { error: `创建分类失败: ${error.message}` },
      { status: 500 }
    )
  }
} 