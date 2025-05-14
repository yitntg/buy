import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'
import { supabase } from '@/shared/infrastructure/lib/supabase'

// 防止路由被静态生成
export const dynamic = 'force-dynamic'

// 添加示例数据API
export async function GET(request: Request) {
  try {
    // 获取URL参数，用于检查模式
    const { searchParams } = new URL(request.url)
    const checkOnly = searchParams.get('check') === 'true'
    
    console.log(checkOnly ? '检查数据...' : '开始添加示例数据...')
    
    // 选择连接URL
    const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING
    if (!connectionString) {
      throw new Error('未找到数据库连接URL环境变量')
    }

    // 创建PostgreSQL客户端
    const client = new pg.Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // 允许自签名证书
      }
    })
    
    // 连接到数据库
    console.log('尝试连接数据库...')
    await client.connect()
    console.log('数据库连接成功')
    
    // 如果只是检查数据，则查询表内容
    if (checkOnly) {
      const results: string[] = []
      
      // 检查分类表数据
      try {
        const { rows: categories } = await client.query('SELECT COUNT(*) as count FROM categories')
        results.push(`分类表中有 ${categories[0].count} 条记录`)
      } catch (err: any) {
        results.push(`分类表检查失败: ${err.message}`)
      }
      
      // 检查产品表数据
      try {
        const { rows: products } = await client.query('SELECT COUNT(*) as count FROM products')
        results.push(`产品表中有 ${products[0].count} 条记录`)
      } catch (err: any) {
        results.push(`产品表检查失败: ${err.message}`)
      }
      
      // 关闭数据库连接
      await client.end()
      
      return new NextResponse(`
        <html>
          <head>
            <title>检查数据</title>
            <meta charset="utf-8">
            <style>
              body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
              pre { background: #f0f0f0; padding: 1rem; border-radius: 0.5rem; overflow: auto; max-height: 400px; }
              .back { margin-top: 1rem; display: inline-block; }
            </style>
          </head>
          <body>
            <h1>数据检查结果</h1>
            <ul>
              ${results.map(result => `<li>${result}</li>`).join('')}
            </ul>
            <div>
              <a href="/setup" class="back">返回设置页面</a> | 
              <a href="/api/db/add-sample-data">添加示例数据</a>
            </div>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }
    
    // 准备添加的示例数据
    const categories = [
      { id: 1, name: '电子产品', description: '各类电子产品、数码设备' },
      { id: 2, name: '家居家具', description: '家具、家居用品' },
      { id: 3, name: '服装服饰', description: '各类衣物、服装、鞋帽' },
      { id: 4, name: '美妆个护', description: '美妆、个人护理用品' },
      { id: 5, name: '食品饮料', description: '零食、饮品、生鲜食品' },
      { id: 6, name: '运动户外', description: '运动器材、户外装备' }
    ]
    
    const products = [
      { name: '智能手表', description: '高级智能手表，支持多种运动模式和健康监测功能', price: 1299, image: 'https://picsum.photos/id/1/500/500', category: 1, inventory: 50, rating: 4.8, reviews: 120 },
      { name: '蓝牙耳机', description: '无线蓝牙耳机，支持降噪功能，续航时间长', price: 399, image: 'https://picsum.photos/id/3/500/500', category: 1, inventory: 200, rating: 4.5, reviews: 85 },
      { name: '真皮沙发', description: '进口真皮沙发，舒适耐用，适合家庭使用', price: 4999, image: 'https://picsum.photos/id/20/500/500', category: 2, inventory: 10, rating: 4.9, reviews: 32 },
      { name: '纯棉T恤', description: '100%纯棉材质，透气舒适，多色可选', price: 99, image: 'https://picsum.photos/id/25/500/500', category: 3, inventory: 500, rating: 4.3, reviews: 210 },
      { name: '保湿面霜', description: '深层保湿面霜，适合干性肌肤，改善肌肤干燥问题', price: 159, image: 'https://picsum.photos/id/30/500/500', category: 4, inventory: 80, rating: 4.6, reviews: 65 },
      { name: '有机坚果礼盒', description: '精选有机坚果礼盒，包含多种坚果，营养丰富', price: 169, image: 'https://picsum.photos/id/40/500/500', category: 5, inventory: 100, rating: 4.7, reviews: 48 },
      { name: '瑜伽垫', description: '专业瑜伽垫，防滑耐磨，厚度适中，适合各种瑜伽动作', price: 128, image: 'https://picsum.photos/id/50/500/500', category: 6, inventory: 60, rating: 4.4, reviews: 72 }
    ]
    
    // 执行SQL添加分类数据
    console.log('添加分类数据...')
    let results: string[] = []
    
    try {
      // 使用ON CONFLICT DO UPDATE保证幂等性
      const insertCategoriesSQL = `
        INSERT INTO categories (id, name, description)
        VALUES 
          (1, '电子产品', '各类电子产品、数码设备'),
          (2, '家居家具', '家具、家居用品'),
          (3, '服装服饰', '各类衣物、服装、鞋帽'),
          (4, '美妆个护', '美妆、个人护理用品'),
          (5, '食品饮料', '零食、饮品、生鲜食品'),
          (6, '运动户外', '运动器材、户外装备')
        ON CONFLICT (id) DO UPDATE 
        SET 
          name = EXCLUDED.name, 
          description = EXCLUDED.description;
      `
      await client.query(insertCategoriesSQL)
      results.push('分类数据添加成功')
    } catch (err: any) {
      console.error('添加分类数据失败:', err)
      results.push(`分类数据添加失败: ${err.message}`)
    }
    
    // 执行SQL添加产品数据
    console.log('添加产品数据...')
    try {
      // 先检查分类表中是否有数据，如果没有，先添加分类数据
      const { rows: categoryCount } = await client.query('SELECT COUNT(*) as count FROM categories')
      if (parseInt(categoryCount[0].count) === 0) {
        console.log('分类表为空，可能需要先确保分类数据已添加')
        // 如果要在这里添加额外的分类检查和处理代码，可以添加
      }
      
      // 先清空产品表，以避免重复
      console.log('清空产品表...')
      try {
        // 使用更安全的方式清空表
        try {
          // 如果存在外键约束，可能需要临时禁用
          await client.query('SET CONSTRAINTS ALL DEFERRED')
        } catch (err) {
          console.log('无法设置约束延迟，继续尝试删除')
        }
        
        await client.query('DELETE FROM products')
        console.log('产品表已清空')
      } catch (err) {
        console.error('清空产品表失败:', err)
        results.push(`清空产品表失败: ${err instanceof Error ? err.message : '未知错误'}`) 
        // 继续执行，尝试插入数据
      }
      
      // 为每个产品准备SQL，使用INSERT IGNORE语法
      for (const product of products) {
        try {
          const insertProductSQL = `
            INSERT INTO products (name, description, price, image, category, inventory, rating, reviews)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `
          await client.query(insertProductSQL, [
            product.name,
            product.description,
            product.price,
            product.image,
            product.category,
            product.inventory,
            product.rating,
            product.reviews
          ])
        } catch (err: any) {
          console.error(`添加产品 "${product.name}" 失败:`, err)
          // 继续添加其他产品
        }
      }
      results.push('产品数据添加操作完成')
    } catch (err: any) {
      console.error('添加产品数据失败:', err)
      results.push(`产品数据添加失败: ${err.message}`)
    }
    
    // 检查添加后的数据
    try {
      const { rows: categories } = await client.query('SELECT COUNT(*) as count FROM categories')
      results.push(`现在分类表中有 ${categories[0].count} 条记录`)
      
      const { rows: products } = await client.query('SELECT COUNT(*) as count FROM products')
      results.push(`现在产品表中有 ${products[0].count} 条记录`)
    } catch (err: any) {
      results.push(`数据验证失败: ${err.message}`)
    }
    
    // 关闭数据库连接
    await client.end()
    
    const success = results.every(r => !r.includes('失败'))
    
    // 返回结果
    return new NextResponse(`
      <html>
        <head>
          <title>添加示例数据</title>
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
          <h1 class="${success ? 'success' : 'error'}">${success ? '示例数据添加成功！' : '示例数据添加部分失败'}</h1>
          <p>数据库操作已执行。</p>
          <div>
            <h3>执行结果:</h3>
            <ul>
              ${results.map(result => `<li>${result}</li>`).join('')}
            </ul>
          </div>
          <p>3秒后将自动返回到初始化页面，或者 <a href="/setup" class="back">立即返回</a></p>
          <p><a href="/api/db/add-sample-data?check=true">检查当前数据</a></p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (error: any) {
    console.error('添加示例数据时发生错误:', error)
    
    // 返回错误页面
    return new NextResponse(`
      <html>
        <head>
          <title>添加示例数据</title>
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
          <h1 class="error">添加示例数据失败</h1>
          <p>执行数据库操作时发生错误：</p>
          <pre>${error instanceof Error ? error.message : '未知错误'}</pre>
          
          <p>5秒后将自动返回到初始化页面，或者 <a href="/setup" class="back">立即返回</a></p>
        </body>
      </html>
    `, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
} 