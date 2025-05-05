import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// 备用的Supabase客户端，确保服务器端API能正常工作
const backupSupabaseUrl = 'https://pzjhupjfojvlbthnsgqt.supabase.co'
const backupSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6amh1cGpmb2p2bGJ0aG5zZ3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2ODAxOTIsImV4cCI6MjAzMTI1NjE5Mn0.COXs_t1-J5XhZXu7X0W3DlsgI1UByhgA-hezLhWALN0'
const backupClient = createClient(backupSupabaseUrl, backupSupabaseKey)

// 使用可用的客户端
const db = supabase || backupClient

// 获取单个分类
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const { data, error } = await db
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
        { error: '获取分类失败' },
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
    
    // 验证必填字段
    if (!data.name) {
      return NextResponse.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }
    
    // 检查分类是否存在
    const { data: existingCategory, error: checkError } = await db
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
        { error: '检查分类失败' },
        { status: 500 }
      )
    }
    
    // 更新分类
    const { data: updatedCategory, error } = await db
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
        { error: '更新分类失败' },
        { status: 500 }
      )
    }
    
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
    
    // 检查分类是否存在
    const { data: existingCategory, error: checkError } = await db
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
        { error: '检查分类失败' },
        { status: 500 }
      )
    }
    
    // 删除分类
    const { error } = await db
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除分类失败:', error)
      return NextResponse.json(
        { error: '删除分类失败' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: '分类已成功删除' })
  } catch (error: any) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: `删除分类失败: ${error.message}` },
      { status: 500 }
    )
  }
} 