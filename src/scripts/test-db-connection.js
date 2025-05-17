/**
 * 测试Supabase数据库连接脚本
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

// 尝试加载不同位置的环境变量文件
const envFiles = [
  path.join(rootDir, '.env.local'),
  path.join(rootDir, '.env'),
  path.join(rootDir, '.env.development.local'),
  path.join(rootDir, '.env.test')
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
  console.log('未找到环境变量文件，使用手动输入方式');

  // 如果找不到环境变量文件，则使用占位符
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzjhupjfojvlbthnsgqt.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTl9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
}

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('使用以下配置连接Supabase:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseAnonKey ? '*'.repeat(10) : '未设置'}`);

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 检查数据库中可能存在的表
const POSSIBLE_TABLES = [
  'products',
  'users',
  'orders',
  'categories',
  'reviews',
  'auth_users',
  'customers',
  'profiles'
];

// 测试数据库连接
async function testConnection() {
  console.log('测试Supabase连接...');
  
  let authSuccessful = false;
  let tableAccessSuccessful = false;
  
  // 测试方法1: 检查Supabase状态
  try {
    console.log('\n1. 检查认证服务状态...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ 认证API检查结果: 失败');
      console.error('错误信息:', error.message);
    } else {
      console.log('✅ 认证API检查结果: 成功');
      console.log('会话状态:', data.session ? '已登录' : '未登录');
      authSuccessful = true;
    }
  } catch (error) {
    console.error('❌ 认证API调用异常:', error.message);
  }
  
  // 测试方法2: 尝试获取数据库版本信息
  try {
    console.log('\n2. 检查数据库版本信息...');
    const { data, error } = await supabase.rpc('get_version');
    
    if (error) {
      console.log('❌ 数据库版本检查失败');
      console.log('错误类型:', error.code);
      console.log('错误信息:', error.message);
      console.log('可能原因: 数据库函数不存在或无权访问');
    } else {
      console.log('✅ 数据库版本:', data);
    }
  } catch (error) {
    console.error('❌ 数据库版本检查异常:', error.message);
  }
  
  // 测试方法3: 尝试查询现有的表
  console.log('\n3. 尝试查询可能存在的表...');
  
  let tableResults = {};
  
  for (const table of POSSIBLE_TABLES) {
    try {
      console.log(`检查 "${table}" 表...`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`  ❌ 结果: 失败`);
        
        if (error.code === '42P01') { // 表不存在
          console.log(`  原因: 表不存在`);
          tableResults[table] = { exists: false, error: '表不存在' };
        } else {
          console.log(`  错误: ${error.message}`);
          tableResults[table] = { exists: false, error: error.message };
        }
      } else {
        console.log(`  ✅ 结果: 成功`);
        console.log(`  数据: ${data && data.length > 0 ? '有数据' : '无数据'}`);
        tableResults[table] = { 
          exists: true, 
          hasData: data && data.length > 0,
          data: data
        };
        tableAccessSuccessful = true;
        
        if (data && data.length > 0) {
          console.log(`  示例数据:`, data[0]);
        }
      }
    } catch (error) {
      console.error(`  ❌ 异常: ${error.message}`);
      tableResults[table] = { exists: false, error: error.message };
    }
  }
  
  // 总结测试结果
  console.log('\n=== 数据库连接测试结果 ===');
  
  // 认证服务测试结果
  console.log(`认证服务: ${authSuccessful ? '✅ 可访问' : '❌ 无法访问'}`);
  
  // 表访问测试结果
  console.log('表访问测试:');
  let foundTables = Object.keys(tableResults).filter(table => tableResults[table].exists);
  
  if (foundTables.length > 0) {
    console.log(`✅ 可访问的表: ${foundTables.join(', ')}`);
    tableAccessSuccessful = true;
  } else {
    console.log('❌ 无法访问任何表');
  }
  
  // 最终结论
  if (authSuccessful || tableAccessSuccessful) {
    console.log('\n✅ 数据库连接测试成功!');
    console.log('Supabase连接正常工作');
    
    if (!tableAccessSuccessful) {
      console.log('⚠️ 警告: 可以连接到Supabase，但无法访问任何表或没有数据');
      console.log('可能原因: 数据库为空、表未创建或无权限访问');
    }
  } else {
    console.log('\n❌ 数据库连接测试失败，可能原因:');
    console.log('1. Supabase URL或ANON KEY不正确');
    console.log('2. 数据库服务未运行或无法访问');
    console.log('3. 数据库中没有创建表或没有访问权限');
    console.log('4. 网络连接问题');
    console.log('\n建议检查以下内容:');
    console.log('- .env.local文件中的Supabase配置是否正确');
    console.log('- Supabase项目是否已启动并可访问');
    console.log('- 是否在Supabase控制台中创建了必要的表和权限');
  }
}

// 执行测试
testConnection(); 