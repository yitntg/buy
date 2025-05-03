import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PostgrestError } from '@supabase/supabase-js'

// 从环境变量中获取Supabase凭据
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 确保有可用的密钥
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少Supabase URL或密钥')
}

export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json()
    const { table, sql } = body
    
    // 验证参数
    if (!table || !sql) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }
    
    // 使用服务角色密钥创建Supabase客户端
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    let success = false;
    
    // 尝试方法1: 分析SQL并使用Supabase API创建表
    if (table === 'categories') {
      // 创建分类表
      const { error } = await supabaseAdmin.from('_tables').insert({
        name: 'categories',
        schema: {
          id: { type: 'serial', primaryKey: true },
          name: { type: 'varchar', length: 100, notNull: true },
          description: { type: 'text' },
          created_at: { type: 'timestamp with time zone', default: 'now()' }
        }
      });
      
      if (!error) {
        success = true;
      }
    } else if (table === 'products') {
      // 创建产品表
      const { error } = await supabaseAdmin.from('_tables').insert({
        name: 'products',
        schema: {
          id: { type: 'serial', primaryKey: true },
          name: { type: 'varchar', length: 255, notNull: true },
          description: { type: 'text', notNull: true },
          price: { type: 'decimal', precision: 10, scale: 2, notNull: true },
          image: { type: 'varchar', length: 255, notNull: true },
          category: { type: 'integer', notNull: true },
          inventory: { type: 'integer', notNull: true, default: 0 },
          rating: { type: 'decimal', precision: 3, scale: 1, notNull: true, default: 0 },
          reviews: { type: 'integer', notNull: true, default: 0 },
          created_at: { type: 'timestamp with time zone', default: 'now()' }
        }
      });
      
      if (!error) {
        success = true;
      }
    } else if (table === 'reviews') {
      // 创建评论表
      const { error } = await supabaseAdmin.from('_tables').insert({
        name: 'reviews',
        schema: {
          id: { type: 'serial', primaryKey: true },
          product_id: { type: 'integer', notNull: true, references: 'products(id)', onDelete: 'cascade' },
          user_id: { type: 'varchar', length: 255, notNull: true },
          username: { type: 'varchar', length: 255, notNull: true },
          rating: { type: 'integer', notNull: true, check: 'rating >= 1 AND rating <= 5' },
          comment: { type: 'text' },
          created_at: { type: 'timestamp with time zone', default: 'now()' }
        },
        constraints: [
          { type: 'unique', name: 'unique_user_product_review', columns: ['product_id', 'user_id'] }
        ]
      });
      
      if (!error) {
        success = true;
      }
    }
    
    // 如果上面的方法失败，尝试方法2：使用REST API直接执行SQL
    if (!success) {
      try {
        // 使用REST请求直接在Supabase中执行SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ query: sql })
        });
        
        if (response.ok) {
          success = true;
        } else {
          const errorText = await response.text();
          console.error('REST API执行SQL失败:', errorText);
        }
      } catch (err) {
        console.error('REST请求失败:', err);
      }
    }
    
    if (success) {
      return NextResponse.json({ success: true, message: `${table}表创建成功` });
    } else {
      // 如果所有尝试都失败，则通知用户尝试命令行方式
      return NextResponse.json({ 
        error: `无法创建表，请使用终端命令 npm run init-db`, 
        command: 'npm run init-db' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请尝试使用命令 npm run init-db' },
      { status: 500 }
    );
  }
} 