// 这个脚本用于自动创建Supabase数据库表和初始数据
// 运行方式: node scripts/init-supabase.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 硬编码凭据，确保脚本始终能够运行
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzjhupjfojvlbthnsgqt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6amh1cGpmb2p2bGJ0aG5zZ3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2ODAxOTIsImV4cCI6MjAzMTI1NjE5Mn0.COXs_t1-J5XhZXu7X0W3DlsgI1UByhgA-hezLhWALN0';

console.log('使用Supabase URL:', supabaseUrl);
console.log('使用API密钥:', supabaseKey.substring(0, 10) + '...');

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

async function initDatabase() {
  console.log('正在初始化数据库...');

  try {
    // 创建表结构
    await createTables();
    
    // 插入示例数据
    console.log('添加示例数据...');
    await insertSampleData();

    console.log('数据库初始化完成！');
  } catch (err) {
    console.error('初始化数据库时出错:', err);
    process.exit(1);
  }
}

async function createTables() {
  console.log('开始创建表结构...');
  
  // 使用Supabase的存储过程创建表
  const { error } = await supabase.rpc('create_tables');
  
  if (error) {
    console.error('创建表结构失败:', error);
    console.log('尝试创建存储过程...');
    
    // 如果存储过程不存在，先创建它
    await createStoredProcedure();
    
    // 再次尝试创建表
    const { error: retryError } = await supabase.rpc('create_tables');
    if (retryError) {
      console.error('再次尝试创建表结构失败:', retryError);
      throw new Error('无法创建表结构');
    }
  }
  
  console.log('表结构创建成功');
}

async function createStoredProcedure() {
  console.log('创建存储过程...');
  
  // 直接创建存储过程
  const sql = `
  CREATE OR REPLACE FUNCTION create_tables()
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
    -- 创建产品分类表
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 创建产品表
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

    -- 创建评论表
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
  END;
  $$;
  `;
  
  // 使用Postgres-specific API执行SQL
  const { error } = await supabase.rpc('exec_sql', { query: sql });
  
  if (error) {
    console.error('创建存储过程失败:', error);
    console.log('尝试创建exec_sql函数...');
    
    // 如果exec_sql不存在，先创建它
    await createExecSqlFunction();
    
    // 再次尝试创建存储过程
    const { error: retryError } = await supabase.rpc('exec_sql', { query: sql });
    if (retryError) {
      console.error('再次尝试创建存储过程失败:', retryError);
      throw new Error('无法创建存储过程');
    }
  }
}

async function createExecSqlFunction() {
  console.log('创建exec_sql函数...');
  
  // 使用REST API直接发送SQL
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: `
        CREATE OR REPLACE FUNCTION exec_sql(query text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE query;
        END;
        $$;
        `
      })
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('创建exec_sql函数失败:', responseText);
      throw new Error('无法创建exec_sql函数');
    }
    
    console.log('exec_sql函数创建成功');
  } catch (err) {
    console.error('HTTP请求失败:', err);
    throw err;
  }
}

async function insertSampleData() {
  // 插入分类数据
  const categories = [
    { id: 1, name: '电子产品', description: '各类电子产品、数码设备' },
    { id: 2, name: '家居家具', description: '家具、家居用品' },
    { id: 3, name: '服装服饰', description: '各类衣物、服装、鞋帽' },
    { id: 4, name: '美妆个护', description: '美妆、个人护理用品' },
    { id: 5, name: '食品饮料', description: '零食、饮品、生鲜食品' },
    { id: 6, name: '运动户外', description: '运动器材、户外装备' }
  ];

  // 插入产品数据
  const products = [
    { name: '智能手表', description: '高级智能手表，支持多种运动模式和健康监测功能', price: 1299, image: 'https://picsum.photos/id/1/500/500', category: 1, inventory: 50, rating: 4.8, reviews: 120 },
    { name: '蓝牙耳机', description: '无线蓝牙耳机，支持降噪功能，续航时间长', price: 399, image: 'https://picsum.photos/id/3/500/500', category: 1, inventory: 200, rating: 4.5, reviews: 85 },
    { name: '真皮沙发', description: '进口真皮沙发，舒适耐用，适合家庭使用', price: 4999, image: 'https://picsum.photos/id/20/500/500', category: 2, inventory: 10, rating: 4.9, reviews: 32 },
    { name: '纯棉T恤', description: '100%纯棉材质，透气舒适，多色可选', price: 99, image: 'https://picsum.photos/id/25/500/500', category: 3, inventory: 500, rating: 4.3, reviews: 210 },
    { name: '保湿面霜', description: '深层保湿面霜，适合干性肌肤，改善肌肤干燥问题', price: 159, image: 'https://picsum.photos/id/30/500/500', category: 4, inventory: 80, rating: 4.6, reviews: 65 },
    { name: '有机坚果礼盒', description: '精选有机坚果礼盒，包含多种坚果，营养丰富', price: 169, image: 'https://picsum.photos/id/40/500/500', category: 5, inventory: 100, rating: 4.7, reviews: 48 },
    { name: '瑜伽垫', description: '专业瑜伽垫，防滑耐磨，厚度适中，适合各种瑜伽动作', price: 128, image: 'https://picsum.photos/id/50/500/500', category: 6, inventory: 60, rating: 4.4, reviews: 72 }
  ];

  try {
    // 先插入分类数据
    const { error: catError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' });

    if (catError) {
      console.error('插入分类数据失败:', catError);
      return;
    }

    console.log('成功插入分类数据');

    // 再插入产品数据
    const { error: prodError } = await supabase
      .from('products')
      .upsert(products, { onConflict: ['name', 'category'] });

    if (prodError) {
      console.error('插入产品数据失败:', prodError);
      return;
    }

    console.log('成功插入产品数据');
  } catch (err) {
    console.error('插入示例数据时出错:', err);
  }
}

initDatabase(); 