import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端，使用服务器端环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 这个API端点用于创建数据库表
export async function POST(request: NextRequest) {
  try {
    const { table } = await request.json()
    
    if (!table) {
      return NextResponse.json({ error: '缺少表名参数' }, { status: 400 })
    }
    
    // 创建具有更高权限的Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // 根据表名创建对应的表
    if (table === 'products') {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: 'test-product',
          description: 'Test product for table creation',
          price: 0,
          image: 'https://example.com/test.jpg',
          category: 1,
          inventory: 0,
          rating: 0,
          reviews: 0
        })
        .select()
      
      if (error && error.code !== '23505') { // 忽略主键冲突错误
        if (error.code === '42P01') { // 表不存在错误
          // 尝试创建表
          const createResult = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey
            },
            body: JSON.stringify({
              command: `
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
            })
          })
          
          if (!createResult.ok) {
            return NextResponse.json(
              { error: '创建产品表失败' },
              { status: 500 }
            )
          }
        } else {
          return NextResponse.json(
            { error: `创建产品表出错: ${error.message}` },
            { status: 500 }
          )
        }
      }
      
      return NextResponse.json({ success: true, message: '产品表已创建或已存在' })
    } 
    else if (table === 'categories') {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: 'test-category',
          description: 'Test category for table creation'
        })
        .select()
      
      if (error && error.code !== '23505') { // 忽略主键冲突错误
        if (error.code === '42P01') { // 表不存在错误
          // 尝试创建表
          const createResult = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey
            },
            body: JSON.stringify({
              command: `
                CREATE TABLE IF NOT EXISTS categories (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(100) NOT NULL,
                  description TEXT,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
              `
            })
          })
          
          if (!createResult.ok) {
            return NextResponse.json(
              { error: '创建分类表失败' },
              { status: 500 }
            )
          }
        } else {
          return NextResponse.json(
            { error: `创建分类表出错: ${error.message}` },
            { status: 500 }
          )
        }
      }
      
      return NextResponse.json({ success: true, message: '分类表已创建或已存在' })
    }
    else {
      return NextResponse.json(
        { error: `不支持的表类型: ${table}` },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('创建表出错:', error)
    return NextResponse.json(
      { error: `创建表时发生错误: ${error.message}` },
      { status: 500 }
    )
  }
} 