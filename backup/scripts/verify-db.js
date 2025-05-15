#!/usr/bin/env node
// Supabase数据库验证脚本
// 运行方式: node scripts/verify-db.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// 定义简单的日志着色函数
const log = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`
};

// 加载环境变量
dotenv.config();

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 检查必要的环境变量
if (!supabaseUrl || !supabaseKey) {
  console.error(log.red('错误: 缺少必要的环境变量'));
  console.error(log.red('请确保以下环境变量已设置:'));
  console.error(log.red('- NEXT_PUBLIC_SUPABASE_URL'));
  console.error(log.red('- SUPABASE_SERVICE_ROLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 主函数
async function main() {
  console.log(log.blue('=== 数据库验证 ==='));
  console.log(log.green('数据库验证脚本已创建，待实现具体验证逻辑'));
  console.log(log.yellow('此脚本将检查数据库表结构、函数和约束是否符合要求'));
  
  // 执行验证
  await validateDatabase();
}

// 状态变量
let tablesOk = true;
let viewsOk = true;

// 检查表是否存在
async function checkTableExists(tableName) {
  console.log(`检查表 ${tableName}...`);
  
  try {
    // 使用count来检查表是否存在并且可以访问
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(log.red(`表 ${tableName} 不存在或无法访问: ${error.message}`));
      tablesOk = false;
      return false;
    }
    
    console.log(log.green(`✓ 表 ${tableName} 存在，包含 ${count !== null ? count : '?'} 条记录`));
    return true;
  } catch (error) {
    console.error(log.red(`检查表 ${tableName} 时出错: ${error.message}`));
    tablesOk = false;
    return false;
  }
}

// 检查视图是否存在
async function checkViewExists(viewName) {
  console.log(`检查视图 ${viewName}...`);
  
  try {
    // 尝试从视图中选择数据
    const { data, error } = await supabase
      .from(viewName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(log.red(`视图 ${viewName} 不存在或无法访问: ${error.message}`));
      viewsOk = false;
      return false;
    }
    
    console.log(log.green(`✓ 视图 ${viewName} 存在`));
    return true;
  } catch (error) {
    console.error(log.red(`检查视图 ${viewName} 时出错: ${error.message}`));
    viewsOk = false;
    return false;
  }
}

// 数据库验证函数
async function validateDatabase() {
  console.log(log.blue('=== 数据库结构验证 ==='));
  
  // 检查连接
  console.log('检查Supabase连接...');
  try {
    const { data: health, error } = await supabase.rpc('heartbeat');
    
    if (error) {
      console.error(log.red(`无法连接到Supabase: ${error.message}`));
      process.exit(1);
    }
    
    console.log(log.green(`✓ 连接成功`));
  } catch (error) {
    console.error(log.red(`连接Supabase出错: ${error.message}`));
    process.exit(1);
  }
  
  // 检查必要的表
  console.log(log.blue('\n检查数据表...'));
  const requiredTables = [
    'users',
    'products',
    'comments',
    'orders',
    'order_items',
    'carts',
    'cart_items',
    'categories'
  ];
  
  for (const table of requiredTables) {
    await checkTableExists(table);
  }
  
  // 检查视图
  console.log(log.blue('\n检查数据视图...'));
  const requiredViews = [
    'comment_stats',
    'user_order_stats'
  ];
  
  for (const view of requiredViews) {
    await checkViewExists(view);
  }
  
  // 输出结果
  console.log(log.blue('\n=== 验证结果 ==='));
  
  // 表结构
  if (tablesOk) {
    console.log(log.green('✓ 所有必需的表都存在'));
  } else {
    console.error(log.red('✗ 一些表不存在或无法访问'));
  }
  
  // 视图
  if (viewsOk) {
    console.log(log.green('✓ 所有必需的视图都存在'));
  } else {
    console.error(log.red('✗ 一些视图不存在或无法访问'));
  }
  
  // 总结
  if (tablesOk && viewsOk) {
    console.log(log.green('\n数据库结构验证通过！'));
  } else {
    console.error(log.red('\n数据库结构验证失败！请修复上述问题'));
    process.exit(1);
  }
}

// 执行主函数
main().catch(err => {
  console.error(log.red('验证过程中出现未捕获的错误:'), err);
  process.exit(1);
}); 