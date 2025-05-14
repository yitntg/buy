#!/usr/bin/env node
// 数据库验证脚本
// 运行方式: node scripts/verify-db.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const chalk = require('chalk') || { green: (t) => t, red: (t) => t, yellow: (t) => t, blue: (t) => t };

// 加载环境变量
dotenv.config();

// 获取Supabase连接信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 确保环境变量存在
if (!supabaseUrl || !supabaseKey) {
  console.error(chalk.red('错误: 缺少必要的环境变量'));
  console.error(chalk.red('请确保以下环境变量已设置:'));
  console.error(chalk.red('- NEXT_PUBLIC_SUPABASE_URL'));
  console.error(chalk.red('- SUPABASE_SERVICE_ROLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log(chalk.blue('=== 数据库验证 ==='));
console.log(chalk.green('数据库验证脚本已创建，待实现具体验证逻辑'));
console.log(chalk.yellow('此脚本将检查数据库表结构、函数和约束是否符合要求'));

// 需要验证的表
const requiredTables = [
  'users',
  'user_permissions',
  'user_mfa_factors',
  'user_mfa_backup_codes',
  'products',
  'comments',
  'comment_likes',
  'orders',
  'order_items'
];

// 验证视图
const requiredViews = [
  'comment_stats',
  'user_order_stats'
];

// 验证表是否存在
async function checkTable(tableName) {
  console.log(`检查表 ${tableName}...`);
  
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(chalk.red(`表 ${tableName} 不存在或无法访问: ${error.message}`));
      return false;
    }
    
    console.log(chalk.green(`✓ 表 ${tableName} 存在，包含 ${count !== null ? count : '?'} 条记录`));
    return true;
  } catch (error) {
    console.error(chalk.red(`检查表 ${tableName} 时出错: ${error.message}`));
    return false;
  }
}

// 验证视图是否存在
async function checkView(viewName) {
  console.log(`检查视图 ${viewName}...`);
  
  try {
    // 视图验证比较特殊，我们简单查询视图以确定其是否存在
    const { error } = await supabase
      .from(viewName)
      .select('*')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116是"结果为空"的错误，说明视图存在但没有数据
      console.error(chalk.red(`视图 ${viewName} 不存在或无法访问: ${error.message}`));
      return false;
    }
    
    console.log(chalk.green(`✓ 视图 ${viewName} 存在`));
    return true;
  } catch (error) {
    console.error(chalk.red(`检查视图 ${viewName} 时出错: ${error.message}`));
    return false;
  }
}

// 主函数
async function main() {
  console.log(chalk.blue('=== 数据库结构验证 ==='));
  
  // 检查连接
  console.log('检查Supabase连接...');
  try {
    const { data: health, error } = await supabase.rpc('heartbeat');
    
    if (error) {
      console.error(chalk.red(`无法连接到Supabase: ${error.message}`));
      process.exit(1);
    }
    
    console.log(chalk.green(`✓ 连接成功`));
  } catch (error) {
    console.error(chalk.red(`连接Supabase出错: ${error.message}`));
    process.exit(1);
  }
  
  // 检查表
  console.log(chalk.blue('\n检查数据表...'));
  let tablesOk = true;
  
  for (const table of requiredTables) {
    const ok = await checkTable(table);
    if (!ok) tablesOk = false;
  }
  
  // 检查视图
  console.log(chalk.blue('\n检查数据视图...'));
  let viewsOk = true;
  
  for (const view of requiredViews) {
    const ok = await checkView(view);
    if (!ok) viewsOk = false;
  }
  
  // 总结
  console.log(chalk.blue('\n=== 验证结果 ==='));
  
  if (tablesOk) {
    console.log(chalk.green('✓ 所有必需的表都存在'));
  } else {
    console.error(chalk.red('✗ 一些表不存在或无法访问'));
  }
  
  if (viewsOk) {
    console.log(chalk.green('✓ 所有必需的视图都存在'));
  } else {
    console.error(chalk.red('✗ 一些视图不存在或无法访问'));
  }
  
  if (tablesOk && viewsOk) {
    console.log(chalk.green('\n数据库结构验证通过！'));
  } else {
    console.error(chalk.red('\n数据库结构验证失败！请修复上述问题'));
    process.exit(1);
  }
}

// 执行主函数
main().catch(err => {
  console.error(chalk.red('验证过程中出现未捕获的错误:'), err);
  process.exit(1);
}); 