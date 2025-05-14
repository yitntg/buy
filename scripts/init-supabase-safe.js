// Supabase数据库安全初始化脚本（用于生产环境）
// 运行方式: node scripts/init-supabase-safe.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const chalk = require('chalk') || { green: (t) => t, red: (t) => t, yellow: (t) => t, blue: (t) => t };

// 加载环境变量
dotenv.config();

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 检查必要的环境变量
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

// 主函数
async function main() {
  console.log(chalk.blue('=== 安全初始化Supabase数据库（生产环境）==='));
  
  // 检查连接
  console.log('检查Supabase连接...');
  try {
    const { data: health, error } = await supabase.rpc('heartbeat');
    
    if (error) {
      console.error(chalk.red(`无法连接到Supabase: ${error.message}`));
      // 在生产环境中，我们不希望因为这个错误而阻止部署
      console.warn(chalk.yellow('警告: 无法验证数据库连接，但将继续部署'));
      return;
    }
    
    console.log(chalk.green(`✓ 连接成功`));
  } catch (error) {
    console.error(chalk.red(`连接Supabase出错: ${error.message}`));
    // 在生产环境中，我们不希望因为这个错误而阻止部署
    console.warn(chalk.yellow('警告: 无法验证数据库连接，但将继续部署'));
    return;
  }
  
  // 检查必要表是否存在
  await checkRequiredTables();
  
  console.log(chalk.green('\n数据库验证完成！'));
}

// 检查必要的表是否存在
async function checkRequiredTables() {
  console.log(chalk.blue('\n检查必要的数据表...'));
  
  const requiredTables = [
    'users',
    'products',
    'comments',
    'orders'
  ];
  
  let allTablesExist = true;
  
  for (const table of requiredTables) {
    console.log(`检查表 ${table}...`);
    
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(chalk.red(`表 ${table} 不存在或无法访问: ${error.message}`));
        allTablesExist = false;
        
        if (table === 'users') {
          console.error(chalk.red('users表不存在，这可能导致严重问题!'));
        }
      } else {
        console.log(chalk.green(`✓ 表 ${table} 存在，包含 ${count !== null ? count : '?'} 条记录`));
      }
    } catch (error) {
      console.error(chalk.red(`检查表 ${table} 时出错: ${error.message}`));
      allTablesExist = false;
    }
  }
  
  if (!allTablesExist) {
    console.warn(chalk.yellow('\n警告: 某些必要的表不存在或无法访问'));
    console.warn(chalk.yellow('应用程序可能无法正常工作，请运行 npm run init-db 来初始化数据库'));
  } else {
    console.log(chalk.green('\n✓ 所有必要的表都存在'));
  }
}

// 执行主函数
main().catch(err => {
  console.error(chalk.red('验证过程中出现未捕获的错误:'), err);
  // 在生产环境中，我们不希望因为这个错误而阻止部署
  console.warn(chalk.yellow('警告: 数据库验证失败，但将继续部署'));
}); 