import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取单个分类
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log(`获取分类ID: ${id}`)
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '分类不存在' },
          { status: 404 }
        )
      }
      
      console.error('获取分类失败:', error)
      return NextResponse.json(
        { error: '获取分类失败', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('获取分类失败:', error)
    return NextResponse.json(
      { error: `获取分类失败: ${error.message}` },
      { status: 500 }
    )
  }
}

// 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await request.json()
    console.log(`更新分类ID: ${id}，数据:`, data)
    
    // 验证必填字段
    if (!data.name) {
      return NextResponse.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }
    
    // 检查分类是否存在
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single()
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: '分类不存在' },
          { status: 404 }
        )
      }
      
      console.error('检查分类失败:', checkError)
      return NextResponse.json(
        { error: '检查分类失败', details: checkError.message },
        { status: 500 }
      )
    }
    
    // 更新分类
    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update({
        name: data.name,
        description: data.description || ''
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新分类失败:', error)
      return NextResponse.json(
        { error: '更新分类失败', details: error.message },
        { status: 500 }
      )
    }
    
    console.log('分类更新成功:', updatedCategory)
    return NextResponse.json(updatedCategory)
  } catch (error: any) {
    console.error('更新分类失败:', error)
    return NextResponse.json(
      { error: `更新分类失败: ${error.message}` },
      { status: 500 }
    )
  }
}

// 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log(`删除分类ID: ${id}`)
    
    // 检查分类是否存在
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single()
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: '分类不存在' },
          { status: 404 }
        )
      }
      
      console.error('检查分类失败:', checkError)
      return NextResponse.json(
        { error: '检查分类失败', details: checkError.message },
        { status: 500 }
      )
    }
    
    // 删除分类
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除分类失败:', error)
      return NextResponse.json(
        { error: '删除分类失败', details: error.message },
        { status: 500 }
      )
    }
    
    console.log('分类删除成功')
    return NextResponse.json({ success: true, message: '分类已成功删除' })
  } catch (error: any) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: `删除分类失败: ${error.message}` },
      { status: 500 }
    )
  }
} 