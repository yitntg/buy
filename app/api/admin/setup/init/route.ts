import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: NextRequest) {
  try {
    console.log('开始数据库初始化流程')
    
    // 创建管理员客户端
    const adminKey = supabaseServiceKey || supabaseAnonKey
    if (!supabaseUrl || !adminKey) {
      throw new Error('缺少Supabase URL或密钥')
    }
    
    console.log('使用的Supabase URL:', supabaseUrl)
    console.log('是否有服务密钥:', !!supabaseServiceKey)
    
    const supabaseAdmin = createClient(supabaseUrl, adminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // 读取初始化SQL文件
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'init-db.sql')
    let sqlContent: string
    
    try {
      console.log('尝试读取SQL文件:', sqlFilePath)
      sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
    } catch (error) {
      console.error('无法读取SQL文件:', error)
      // 使用内存中的SQL语句
      sqlContent = `
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
      
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      INSERT INTO categories (id, name, description)
      VALUES
        (1, '电子产品', '各类电子产品、数码设备'),
        (2, '家居家具', '家具、家居用品'),
        (3, '服装服饰', '各类衣物、服装、鞋帽'),
        (4, '美妆个护', '美妆、个人护理用品'),
        (5, '食品饮料', '零食、饮品、生鲜食品'),
        (6, '运动户外', '运动器材、户外装备');
      
      INSERT INTO products (name, description, price, image, category, inventory, rating, reviews)
      VALUES
        ('智能手表', '高级智能手表，支持多种运动模式和健康监测功能', 1299, 'https://picsum.photos/id/1/500/500', 1, 50, 4.8, 120),
        ('蓝牙耳机', '无线蓝牙耳机，支持降噪功能，续航时间长', 399, 'https://picsum.photos/id/3/500/500', 1, 200, 4.5, 85),
        ('真皮沙发', '进口真皮沙发，舒适耐用，适合家庭使用', 4999, 'https://picsum.photos/id/20/500/500', 2, 10, 4.9, 32),
        ('纯棉T恤', '100%纯棉材质，透气舒适，多色可选', 99, 'https://picsum.photos/id/25/500/500', 3, 500, 4.3, 210);
      `
      console.log('已使用内存中的SQL语句作为备用方案')
    }
    
    // 将SQL拆分为单独的语句
    const sqlStatements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0)
    
    console.log(`找到 ${sqlStatements.length} 条SQL语句需要执行`)
    
    // 首先尝试使用exec_sql函数执行
    let execSqlSuccess = false;
    
    try {
      // 执行SQL语句
      let successCount = 0
      for (const statement of sqlStatements) {
        try {
          // 跳过空语句
          if (!statement.trim()) continue
          
          console.log('使用exec_sql执行SQL语句:', statement.substring(0, 50) + '...')
          const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement })
          
          if (error) {
            // 如果是表已存在等非严重错误，则继续执行
            if (error.message.includes('already exists') || 
                error.message.includes('duplicate key')) {
              console.log('对象已存在，继续执行...')
              successCount++
              continue
            }
            throw error;
          }
          successCount++
        } catch (statementError) {
          console.error('执行语句时出错:', statementError)
          // 继续尝试执行其他语句
        }
      }
      
      if (successCount > 0) {
        execSqlSuccess = true;
        return NextResponse.json({
          success: true,
          message: `数据库初始化成功，${successCount}/${sqlStatements.length} 条语句执行成功`
        })
      }
    } catch (execSqlError) {
      console.error('使用exec_sql函数执行SQL失败，尝试备用方法:', execSqlError)
    }
    
    // 如果exec_sql方法失败，则尝试直接使用REST API执行SQL
    if (!execSqlSuccess) {
      console.log('尝试使用REST API直接执行SQL')
      
      // 尝试直接创建表和数据
      let successCount = 0;
      let failedStatements = 0;
      
      for (const statement of sqlStatements) {
        if (!statement.trim()) continue;
        
        try {
          console.log('直接执行SQL:', statement.substring(0, 50) + '...')
          
          // 尝试多种可能的API端点
          const endpoints = [
            '/rest/v1/sql',
            '/rest/v1/query',
            '/rest/v1/',
            '/rest/v1'
          ];
          
          let statementSuccess = false;
          
          for (const endpoint of endpoints) {
            if (statementSuccess) break;
            
            try {
              const response = await fetch(`${supabaseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': adminKey,
                  'Authorization': `Bearer ${adminKey}`,
                  'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({
                  query: statement,
                  command: statement,
                  sql: statement
                })
              });
              
              // 先检查状态码而不是读取响应体
              if (response.status >= 200 && response.status < 300) {
                console.log(`成功执行SQL (endpoint: ${endpoint})`);
                statementSuccess = true;
                successCount++;
                break;
              } else {
                // 保存响应的克隆用于读取文本
                const statusCode = response.status;
                const responseClone = response.clone();
                
                // 尝试读取错误详情
                let errorText = '';
                try {
                  errorText = await responseClone.text();
                } catch (textError) {
                  console.error('无法读取响应文本:', textError);
                  errorText = '无法读取错误详情';
                }
                
                console.log(`执行SQL失败 (endpoint: ${endpoint}, status: ${statusCode}): ${errorText.substring(0, 100)}`);
                
                // 如果是表已存在错误，则视为成功
                if (errorText.includes('already exists') || 
                    errorText.includes('duplicate key')) {
                  console.log('对象已存在，视为成功...');
                  statementSuccess = true;
                  successCount++;
                  break;
                }
              }
            } catch (endpointError) {
              console.error(`尝试endpoint ${endpoint} 出错:`, endpointError);
            }
          }
          
          if (!statementSuccess) {
            failedStatements++;
          }
        } catch (statementError) {
          console.error('执行语句时出错:', statementError);
          failedStatements++;
        }
      }
      
      // 如果至少有一些语句执行成功，则返回成功
      if (successCount > 0) {
        return NextResponse.json({
          success: true,
          message: `数据库初始化完成，${successCount}/${sqlStatements.length} 条语句执行成功 (${failedStatements} 条失败)`
        });
      } else {
        throw new Error(`所有 ${sqlStatements.length} 条SQL语句执行失败`);
      }
    }
  } catch (error: any) {
    console.error('数据库初始化过程中出错:', error)
    return NextResponse.json(
      { error: `数据库初始化失败: ${error.message}` },
      { status: 500 }
    )
  }
} 