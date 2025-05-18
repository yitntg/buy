// 认证系统验证脚本
// 运行方式: node scripts/verify-auth.js

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
const jwtSecret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // JWT验证密钥

// 检查必要的环境变量
if (!supabaseUrl || !supabaseKey) {
  console.error(log.red('错误: 缺少必要的环境变量'));
  console.error(log.red('请确保以下环境变量已设置:'));
  console.error(log.red('- NEXT_PUBLIC_SUPABASE_URL'));
  console.error(log.red('- SUPABASE_SERVICE_ROLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 状态变量
let filesOk = false;
let configOk = false;
let middlewareOk = false;

// 检查认证文件结构
async function checkAuthFiles() {
  const rootDir = path.join(__dirname, '..');
  
  // 查找认证相关文件
  const authFiles = [];
  
  // 一些可能包含认证逻辑的目录
  const dirsToCheck = [
    'app/auth',
    'app/api/auth',
    'lib',
    'context',
    'app/context',
    'shared',
    'src/context',
    'utils',
    'hooks'
  ];
  
  for (const dir of dirsToCheck) {
    const fullPath = path.join(rootDir, dir);
    if (fs.existsSync(fullPath)) {
      findAuthFiles(fullPath, authFiles);
    }
  }
  
  if (authFiles.length > 0) {
    console.log(log.blue(`找到 ${authFiles.length} 个认证相关文件:`));
    authFiles.forEach(file => console.log(` - ${file}`));
    
    // 检查是否有多个AuthContext文件
    const authContextFiles = authFiles.filter(file => file.includes('AuthContext'));
    if (authContextFiles.length > 1) {
      console.log(log.yellow(`警告: 发现多个AuthContext文件，这可能导致冲突:`));
      authContextFiles.forEach(file => console.log(` - ${file}`));
    }
    
    filesOk = true;
  } else {
    console.log(log.yellow('警告: 未找到认证相关文件'));
    filesOk = false;
  }
}

// 递归查找认证相关文件
function findAuthFiles(dir, result) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findAuthFiles(fullPath, result);
    } else if (
      file.includes('auth') || 
      file.includes('Auth') || 
      file.includes('login') || 
      file.includes('register') ||
      file.includes('user')
    ) {
      result.push(fullPath);
    }
  }
}

// 验证Supabase认证配置
async function validateSupabaseAuth() {
  // 检查是否可以获取认证会话
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error(log.red(`无法获取认证会话: ${error.message}`));
      configOk = false;
      return;
    }
    
    console.log(log.green('✓ 可以成功调用Supabase认证API'));
    
    // 检查是否可以访问用户表
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (userError) {
        console.error(log.red(`无法访问用户表: ${userError.message}`));
        configOk = false;
        return;
      }
      
      console.log(log.green('✓ 可以访问用户表'));
      configOk = true;
    } catch (error) {
      console.error(log.red(`验证Supabase认证配置时出错: ${error.message}`));
      configOk = false;
    }
  } catch (error) {
    console.error(log.red(`验证Supabase认证配置时出错: ${error.message}`));
    configOk = false;
  }
}

// 检查中间件
async function checkMiddleware() {
  const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
  
  if (!fs.existsSync(middlewarePath)) {
    console.log(log.yellow('警告: middleware.ts文件不存在'));
    middlewareOk = false;
    return;
  }
  
  // 读取中间件内容
  const content = fs.readFileSync(middlewarePath, 'utf8');
  
  // 检查是否包含认证相关代码
  if (!content.includes('auth') && !content.includes('supabase')) {
    console.log(log.yellow('警告: 中间件中可能缺少认证逻辑'));
    middlewareOk = false;
  } else {
    console.log(log.green('✓ 中间件包含认证逻辑'));
    middlewareOk = true;
  }
}

// 主函数
async function main() {
  console.log(log.blue('=== 认证系统验证 ==='));
  
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
  
  // 执行验证检查
  await checkAuthFiles();
  await validateSupabaseAuth();
  await checkMiddleware();
  
  // 输出结果
  console.log(log.blue('\n=== 验证结果 ==='));
  
  // 认证文件结构
  if (filesOk) {
    console.log(log.green('✓ 认证文件结构正常'));
  } else {
    console.error(log.red('✗ 认证文件结构有问题'));
  }
  
  // Supabase认证配置
  if (configOk) {
    console.log(log.green('✓ Supabase认证配置正常'));
  } else {
    console.error(log.red('✗ Supabase认证配置有问题'));
  }
  
  // 中间件
  if (middlewareOk) {
    console.log(log.green('✓ 中间件认证配置正常'));
  } else {
    console.error(log.red('✗ 中间件认证配置有问题'));
  }
  
  // 总结
  if (filesOk && configOk && middlewareOk) {
    console.log(log.green('\n认证系统验证通过！'));
  } else {
    console.error(log.red('\n认证系统验证失败！请修复上述问题'));
    process.exit(1);
  }
}

// 执行主函数
main().catch(err => {
  console.error(log.red('验证过程中出现未捕获的错误:'), err);
  process.exit(1);
}); 