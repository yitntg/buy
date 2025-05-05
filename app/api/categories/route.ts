import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// 备用的Supabase客户端，确保服务器端API能正常工作
const backupSupabaseUrl = 'https://pzjhupjfojvlbthnsgqt.supabase.co'
const backupSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6amh1cGpmb2p2bGJ0aG5zZ3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2ODAxOTIsImV4cCI6MjAzMTI1NjE5Mn0.COXs_t1-J5XhZXu7X0W3DlsgI1UByhgA-hezLhWALN0'
const backupClient = createClient(backupSupabaseUrl, backupSupabaseKey)

// 使用可用的客户端
const db = supabase || backupClient

// 获取所有分类
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await db
      .from('categories')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
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

// 创建新分类
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // 验证必填字段
    if (!data.name) {
      return NextResponse.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }
    
    // 创建新分类
    const { data: newCategory, error } = await db
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
        { error: '创建分类失败' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error('创建分类失败:', error)
    return NextResponse.json(
      { error: `创建分类失败: ${error.message}` },
      { status: 500 }
    )
  }
} 