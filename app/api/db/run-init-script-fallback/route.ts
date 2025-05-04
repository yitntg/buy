import { NextResponse } from 'next/server'
import pg from 'pg'

// 备用初始化脚本 - 使用全局SSL禁用
// 警告：这在生产环境中不安全，但可作为最后的备用选项
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 使用Postgres环境变量，而不是依赖npm run init-db
export async function GET() {
  try {
    console.log('备用初始化脚本启动，已全局禁用SSL证书验证')
    
    // 选择连接URL
    const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING
    if (!connectionString) {
      throw new Error('未找到数据库连接URL环境变量')
    }

    // 创建一个PostgreSQL客户端 - 无SSL选项
    const client = new pg.Client(connectionString)
    
    // 连接到数据库
    console.log('尝试连接数据库...')
    await client.connect()
    console.log('数据库连接成功')
    
    // 创建三个表的SQL语句
    const createCategoriesTableSQL = `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    const createProductsTableSQL = `
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
    
    const createReviewsTableSQL = `
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
      );
    `
    
    // 执行创建表的SQL语句
    let results: string[] = []
    try {
      const result1 = await client.query(createCategoriesTableSQL)
      results.push('分类表创建成功')
    } catch (err: any) {
      results.push(`分类表创建失败: ${err.message}`)
    }
    
    try {
      const result2 = await client.query(createProductsTableSQL)
      results.push('产品表创建成功')
    } catch (err: any) {
      results.push(`产品表创建失败: ${err.message}`)
    }
    
    try {
      const result3 = await client.query(createReviewsTableSQL)
      results.push('评论表创建成功')
    } catch (err: any) {
      results.push(`评论表创建失败: ${err.message}`)
    }
    
    // 关闭数据库连接
    await client.end()
    
    const success = results.every(r => !r.includes('失败'))
    
    // 返回成功页面
    return new NextResponse(`
      <html>
        <head>
          <title>数据库初始化</title>
          <meta charset="utf-8">
          <meta http-equiv="refresh" content="3;url=/setup">
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            pre { background: #f0f0f0; padding: 1rem; border-radius: 0.5rem; overflow: auto; max-height: 400px; }
            .success { color: #38a169; }
            .error { color: #e53e3e; }
            .back { margin-top: 1rem; display: inline-block; }
            .warning { background-color: #fff8dc; border-left: 4px solid #f6e05e; padding: 1rem; margin: 1rem 0; }
          </style>
        </head>
        <body>
          <h1 class="${success ? 'success' : 'error'}">${success ? '初始化成功！' : '初始化部分失败'}</h1>
          <p>数据库初始化操作已执行。</p>
          
          <div class="warning">
            <strong>注意：</strong> 本次操作使用了备用连接方式，暂时禁用了SSL验证以解决证书问题。
            这在开发阶段可以接受，但在生产环境中应当使用正确配置的SSL证书。
          </div>
          
          <div>
            <h3>执行结果:</h3>
            <ul>
              ${results.map(result => `<li>${result}</li>`).join('')}
            </ul>
          </div>
          <p>3秒后将自动返回到初始化页面，或者 <a href="/setup" class="back">立即返回</a></p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (error: any) {
    console.error('执行数据库操作时发生错误:', error)
    
    // 返回错误页面
    return new NextResponse(`
      <html>
        <head>
          <title>数据库初始化</title>
          <meta charset="utf-8">
          <meta http-equiv="refresh" content="5;url=/setup">
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            .error { color: #e53e3e; }
            .back { margin-top: 1rem; display: inline-block; }
            pre { background: #f7f7f7; padding: 1rem; border-radius: 0.5rem; overflow: auto; }
          </style>
        </head>
        <body>
          <h1 class="error">备用初始化方式也失败了</h1>
          <p>执行数据库初始化操作时发生错误：</p>
          <pre>${error instanceof Error ? error.message : '未知错误'}</pre>
          
          <div>
            <h3>建议手动创建表：</h3>
            <p>请在Supabase控制台中执行以下SQL语句：</p>
            <pre>
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
);
            </pre>
          </div>
          
          <p>5秒后将自动返回到初始化页面，或者 <a href="/setup" class="back">立即返回</a></p>
          <p><a href="https://app.supabase.com" target="_blank">打开Supabase仪表板</a></p>
        </body>
      </html>
    `, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
} 