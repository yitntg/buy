// 这个脚本用于直接执行SQL文件初始化Supabase数据库
// 不依赖exec_sql函数，通过直接的API调用创建表和数据

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 尝试加载环境变量
try {
  dotenv.config();
} catch (e) {
  console.log('无法加载.env文件，将使用环境变量或命令行参数');
}

// 检查是否有命令行参数提供的URL和KEY
const args = process.argv.slice(2);
let cmdUrl = null;
let cmdKey = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && i + 1 < args.length) {
    cmdUrl = args[i + 1];
  } else if (args[i] === '--key' && i + 1 < args.length) {
    cmdKey = args[i + 1];
  }
}

// 从环境变量或命令行参数获取Supabase配置
const supabaseUrl = cmdUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = cmdKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const adminKey = serviceKey || anonKey;

// 检查配置
console.log('配置信息:');
console.log(`- Supabase URL: ${supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : '未设置'}`);
console.log(`- 服务密钥: ${serviceKey ? '已设置(隐藏)' : '未设置'}`);
console.log(`- 匿名密钥: ${anonKey ? '已设置(隐藏)' : '未设置'}`);
console.log(`- 使用密钥: ${adminKey ? '已配置(隐藏)' : '未配置'}`);

// 验证必要配置
if (!supabaseUrl || !adminKey) {
  console.error('\n错误: 缺少必要的Supabase配置。请提供Supabase URL和密钥。');
  console.error('您可以使用以下方式:');
  console.error('1. 环境变量: NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('2. 命令行参数: node scripts/direct-init.js --url YOUR_URL --key YOUR_KEY');
  console.error('例如: node scripts/direct-init.js --url https://your-project.supabase.co --key eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  process.exit(1);
}

// 创建Supabase客户端
console.log('\n创建Supabase客户端...');
const supabase = createClient(supabaseUrl, adminKey);

// 读取SQL文件
console.log('读取SQL文件...');
const sqlFilePath = path.join(__dirname, 'init-db.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log(`已读取SQL文件: ${sqlFilePath} (${sqlContent.length} 字符)`);
} catch (err) {
  console.error('读取SQL文件失败:', err);
  process.exit(1);
}

// 将SQL拆分为单独的语句
const sqlStatements = sqlContent
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

console.log(`找到 ${sqlStatements.length} 条SQL语句需要执行`);

// 直接使用REST API执行每条SQL语句
async function executeSQL() {
  console.log('开始执行SQL语句...');
  
  // 尝试使用多种可能的API端点
  const endpoints = [
    '/rest/v1/sql',
    '/rest/v1/query',
    '/rest/v1/',
    '/rest/v1'
  ];
  
  let totalSuccess = 0;
  
  for (const [index, statement] of sqlStatements.entries()) {
    console.log(`[${index + 1}/${sqlStatements.length}] 执行SQL: ${statement.substring(0, 50)}...`);
    
    let statementSuccess = false;
    
    // 尝试所有可能的API端点
    for (const endpoint of endpoints) {
      if (statementSuccess) break;
      
      try {
        console.log(`  尝试使用endpoint: ${endpoint}`);
        
        const response = await fetch(`${supabaseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': adminKey,
            'Authorization': `Bearer ${adminKey}`,
            'Prefer': 'resolution=ignore-duplicates'
          },
          body: JSON.stringify({
            query: statement,
            command: statement,
            sql: statement
          })
        });
        
        if (response.ok) {
          console.log(`  成功! (endpoint: ${endpoint})`);
          statementSuccess = true;
          totalSuccess++;
          break;
        } else {
          const responseText = await response.text();
          console.log(`  失败 (${response.status}): ${responseText.substring(0, 100)}`);
          
          // 如果是表已存在等非严重错误，视为成功
          if (responseText.includes('already exists')) {
            console.log('  表已存在，视为成功');
            statementSuccess = true;
            totalSuccess++;
            break;
          }
        }
      } catch (err) {
        console.error(`  请求错误: ${err.message}`);
      }
    }
    
    if (!statementSuccess) {
      console.error(`无法执行SQL语句 ${index + 1}，跳过...`);
    }
  }
  
  console.log(`\n执行完成! ${totalSuccess}/${sqlStatements.length} 条语句成功执行`);
  
  if (totalSuccess === sqlStatements.length) {
    console.log('数据库初始化成功! 所有语句已成功执行。');
  } else if (totalSuccess > 0) {
    console.log(`部分成功: ${totalSuccess}/${sqlStatements.length} 条语句执行成功。您可能需要手动检查数据库。`);
  } else {
    console.error('初始化失败! 没有成功执行任何SQL语句。');
    process.exit(1);
  }
}

// 执行初始化
executeSQL().catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
}); 