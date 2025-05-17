/**
 * 创建Supabase中缺失的数据库表
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// 尝试加载环境变量
const envFiles = [
  path.join(rootDir, '.env.local'),
  path.join(rootDir, '.env'),
  path.join(rootDir, '.env.development.local')
];

let envLoaded = false;

for (const file of envFiles) {
  if (fs.existsSync(file)) {
    console.log(`加载环境变量文件: ${file}`);
    dotenv.config({ path: file });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('未找到环境变量文件，请先创建.env.local文件');
  process.exit(1);
}

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少必要的Supabase环境变量');
  process.exit(1);
}

console.log('使用以下配置连接Supabase:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseServiceKey ? '*'.repeat(10) : '未设置'}`);

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 需要创建的表结构定义
const TABLES_SCHEMA = {
  // 订单表
  orders: `
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tracking_number VARCHAR(100),
    notes TEXT
  `,

  // 订单明细表
  order_items: `
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `,

  // 用户资料表
  profiles: `
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `,

  // 购物车表
  carts: `
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `,

  // 购物车明细表
  cart_items: `
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `,

  // 收藏夹表
  favorites: `
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
  `,
  
  // 顾客表
  customers: `
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    customer_type VARCHAR(20) DEFAULT 'regular',
    membership_level VARCHAR(20) DEFAULT 'basic',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `
};

// 检查数据库中可能存在的表
const EXISTING_TABLES = [
  'products',
  'users',
  'categories',
  'reviews'
];

// 需要创建的表
const TABLES_TO_CREATE = Object.keys(TABLES_SCHEMA);

// 创建表的函数
async function createTable(tableName, schema) {
  console.log(`\n创建表 "${tableName}"...`);
  
  try {
    // 检查表是否已存在
    const { error: checkError } = await supabase
      .from(tableName)
      .select('count(*)', { count: 'exact', head: true });
    
    if (!checkError) {
      console.log(`⚠️ 表 "${tableName}" 已存在，跳过创建`);
      return true;
    }
    
    // 创建表
    const { error } = await supabase.rpc('create_table', { 
      table_name: tableName,
      table_schema: schema
    });
    
    if (error) {
      if (error.message && error.message.includes('function "create_table" does not exist')) {
        console.error(`❌ 失败: Supabase不允许直接通过RPC创建表`);
        console.log(`请在Supabase控制台中手动创建表或使用迁移工具`);
        console.log(`表 "${tableName}" 的建议结构:`);
        console.log(`CREATE TABLE ${tableName} (${schema});`);
      } else {
        console.error(`❌ 创建表 "${tableName}" 失败:`, error.message);
      }
      return false;
    }
    
    console.log(`✅ 表 "${tableName}" 创建成功`);
    return true;
  } catch (error) {
    console.error(`❌ 创建表 "${tableName}" 时发生异常:`, error.message);
    return false;
  }
}

// 获取表结构
async function getTableInfo(tableName) {
  console.log(`\n获取表 "${tableName}" 结构...`);
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`❌ 获取表 "${tableName}" 结构失败:`, error.message);
      return null;
    }
    
    // 获取表字段信息
    const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', { 
      target_table: tableName 
    });
    
    if (columnsError) {
      console.log(`⚠️ 无法获取表 "${tableName}" 的详细结构:`, columnsError.message);
      
      // 至少返回数据结构
      if (data && data.length > 0) {
        const sampleObj = data[0];
        console.log(`表 "${tableName}" 的样本数据:`, sampleObj);
        return Object.keys(sampleObj);
      }
      
      return null;
    }
    
    console.log(`✅ 表 "${tableName}" 结构:`, columns);
    return columns;
  } catch (error) {
    console.error(`❌ 获取表 "${tableName}" 结构时发生异常:`, error.message);
    return null;
  }
}

// 检查已存在表和缺失表
async function checkExistingTables() {
  console.log('\n检查已存在的表...');
  
  const results = {};
  
  for (const table of [...EXISTING_TABLES, ...TABLES_TO_CREATE]) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count(*)', { count: 'exact', head: true });
        
      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { 
          exists: true, 
          count: data?.count || 0 
        };
      }
    } catch (error) {
      results[table] = { exists: false, error: error.message };
    }
  }
  
  return results;
}

// 主函数
async function main() {
  console.log('开始检查并创建缺失的表...');
  
  // 检查已存在的表
  const existingTablesInfo = await checkExistingTables();
  
  console.log('\n=== 数据库表状态 ===');
  
  const existingTables = [];
  const missingTables = [];
  
  for (const table in existingTablesInfo) {
    if (existingTablesInfo[table].exists) {
      existingTables.push(table);
      console.log(`✅ "${table}" 表已存在，包含 ${existingTablesInfo[table].count} 条记录`);
    } else {
      missingTables.push(table);
      console.log(`❌ "${table}" 表缺失`);
    }
  }
  
  if (missingTables.length === 0) {
    console.log('\n✅ 所有需要的表都已存在，无需创建新表');
    return;
  }
  
  console.log(`\n需要创建 ${missingTables.length} 个表`);
  
  // 输出建议的SQL语句
  console.log('\n=== 建议的SQL语句 ===');
  console.log('请在Supabase控制台的SQL编辑器中执行以下语句：\n');
  
  for (const table of missingTables) {
    if (TABLES_SCHEMA[table]) {
      console.log(`-- 创建 ${table} 表`);
      console.log(`CREATE TABLE IF NOT EXISTS ${table} (`);
      console.log(TABLES_SCHEMA[table]);
      console.log(`);\n`);
    }
  }
  
  console.log('\n注意：无法通过API直接创建表，请在Supabase控制台中手动执行上述SQL语句');
}

// 执行主函数
main().catch(error => {
  console.error('程序执行出错:', error);
}); 