import { NextResponse } from 'next/server'
import pg from 'pg'

// 使用Postgres环境变量，而不是依赖npm run init-db
export async function GET() {
  try {
    // 记录当前环境变量情况（非敏感信息）
    const postgresUrlExists = !!process.env.POSTGRES_URL
    const postgresUrlNonPoolingExists = !!process.env.POSTGRES_URL_NON_POOLING
    console.log('数据库URL环境变量情况:', { 
      postgresUrlExists, 
      postgresUrlNonPoolingExists 
    })

    // 选择连接URL并添加sslmode=require参数
    let connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING
    if (!connectionString) {
      throw new Error('未找到数据库连接URL环境变量')
    }
    
    // 如果URL包含?，使用&添加参数，否则使用?添加参数
    if (connectionString.includes('?')) {
      connectionString += '&sslmode=require'
    } else {
      connectionString += '?sslmode=require'
    }
    
    console.log('已修改连接字符串添加SSL模式参数')

    // 创建一个PostgreSQL客户端 - 使用连接参数控制SSL
    const client = new pg.Client(connectionString)
    
    // 记录执行开始
    console.log('正在连接到PostgreSQL数据库并创建表...')
    
    // 连接到数据库
    try {
      await client.connect()
      console.log('数据库连接成功')
    } catch (err: any) {
      console.error('数据库连接失败:', err)
      throw new Error(`无法连接到数据库: ${err.message}`)
    }
    
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
      console.log('正在执行创建分类表SQL...')
      const result1 = await client.query(createCategoriesTableSQL)
      console.log('分类表创建结果:', result1)
      results.push('分类表创建成功')
    } catch (err: any) {
      console.error('分类表创建失败:', err)
      results.push(`分类表创建失败: ${err.message}`)
    }
    
    try {
      console.log('正在执行创建产品表SQL...')
      const result2 = await client.query(createProductsTableSQL)
      console.log('产品表创建结果:', result2)
      results.push('产品表创建成功')
    } catch (err: any) {
      console.error('产品表创建失败:', err)
      results.push(`产品表创建失败: ${err.message}`)
    }
    
    try {
      console.log('正在执行创建评论表SQL...')
      const result3 = await client.query(createReviewsTableSQL)
      console.log('评论表创建结果:', result3)
      results.push('评论表创建成功')
    } catch (err: any) {
      console.error('评论表创建失败:', err)
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
          </style>
        </head>
        <body>
          <h1 class="${success ? 'success' : 'error'}">${success ? '初始化成功！' : '初始化部分失败'}</h1>
          <p>数据库初始化操作已执行。</p>
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
    
    // 返回错误页面，包含重试链接和更多选项
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
            .btn-group { margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; }
            .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 0.25rem; text-decoration: none; font-weight: 500; }
            .btn-primary { background-color: #3182ce; color: white; }
            .btn-secondary { background-color: #718096; color: white; }
          </style>
        </head>
        <body>
          <h1 class="error">初始化失败</h1>
          <p>执行数据库初始化操作时发生错误：</p>
          <pre>${error instanceof Error ? error.message : '未知错误'}</pre>
          
          <div>
            <h3>可能的解决方案：</h3>
            <ol>
              <li>检查数据库连接环境变量是否正确设置</li>
              <li>确认Supabase项目已经创建且正常运行</li>
              <li>在Supabase仪表板中手动创建表</li>
            </ol>
          </div>
          
          <div class="btn-group">
            <a href="/setup" class="btn btn-secondary">返回设置页面</a>
            <a href="/api/db/run-init-script-fallback" class="btn btn-primary">尝试备用方式创建表</a>
            <a href="https://app.supabase.com" target="_blank" class="btn btn-secondary">打开Supabase仪表板</a>
          </div>
        </body>
      </html>
    `, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
} 