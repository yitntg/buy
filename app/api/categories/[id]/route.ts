import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 确保请求的分类ID存在
async function ensureCategoryExists(id: string) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { exists: false, reason: 'not_found', error }
      } else if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { exists: false, reason: 'table_not_exist', error }
      }
      return { exists: false, reason: 'error', error }
    }
    
    return { exists: true, data }
  } catch (error) {
    console.error('检查分类ID存在性失败:', error)
    return { exists: false, reason: 'exception', error }
  }
}

// 获取单个分类
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log(`获取分类ID: ${id}`)
    
    // 检查分类是否存在
    const check = await ensureCategoryExists(id)
    if (!check.exists) {
      if (check.reason === 'table_not_exist') {
        return NextResponse.json(
          { error: '分类表不存在，请初始化数据库', details: check.error.message, code: check.error.code },
          { status: 404 }
        )
      } else if (check.reason === 'not_found') {
        return NextResponse.json(
          { error: '分类不存在', details: check.error.message, code: check.error.code },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: '获取分类失败', details: check.error.message, code: check.error.code },
        { status: 500 }
      )
    }
    
    // 获取完整分类信息
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('获取分类详情失败:', error)
      return NextResponse.json(
        { error: '获取分类详情失败', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('获取分类失败:', error)
    return NextResponse.json(
      { error: `获取分类失败: ${error.message}`, stack: error.stack },
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
    const check = await ensureCategoryExists(id)
    if (!check.exists) {
      if (check.reason === 'table_not_exist') {
        return NextResponse.json(
          { error: '分类表不存在，请初始化数据库', details: check.error.message, code: check.error.code },
          { status: 404 }
        )
      } else if (check.reason === 'not_found') {
        return NextResponse.json(
          { error: '分类不存在', details: check.error.message, code: check.error.code },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: '更新分类失败', details: check.error.message, code: check.error.code },
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
        { error: '更新分类失败', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    
    console.log('分类更新成功:', updatedCategory)
    return NextResponse.json(updatedCategory)
  } catch (error: any) {
    console.error('更新分类失败:', error)
    return NextResponse.json(
      { error: `更新分类失败: ${error.message}`, stack: error.stack },
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
    const check = await ensureCategoryExists(id)
    if (!check.exists) {
      if (check.reason === 'table_not_exist') {
        return NextResponse.json(
          { error: '分类表不存在，请初始化数据库', details: check.error.message, code: check.error.code },
          { status: 404 }
        )
      } else if (check.reason === 'not_found') {
        return NextResponse.json(
          { error: '分类不存在', details: check.error.message, code: check.error.code },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: '删除分类失败', details: check.error.message, code: check.error.code },
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
        { error: '删除分类失败', details: error.message, code: error.code },
        { status: 500 }
      )
    }
    
    console.log('分类删除成功')
    return NextResponse.json({ success: true, message: '分类已成功删除' })
  } catch (error: any) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: `删除分类失败: ${error.message}`, stack: error.stack },
      { status: 500 }
    )
  }
} 