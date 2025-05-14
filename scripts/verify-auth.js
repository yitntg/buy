// 认证系统验证脚本
// 运行方式: node scripts/verify-auth.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const chalk = require('chalk') || { green: (t) => t, red: (t) => t, yellow: (t) => t, blue: (t) => t };
const fs = require('fs');
const path = require('path');

// 加载环境变量
dotenv.config();

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const jwtSecret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // JWT验证密钥

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

// 检查文件是否存在
function checkFileExists(filepath) {
  try {
    return fs.existsSync(filepath);
  } catch (err) {
    return false;
  }
}

// 检查认证文件是否有重复
async function checkAuthFiles() {
  console.log('检查认证文件...');
  
  const authFiles = [];
  const searchDirs = ['app', 'src', 'utils', 'lib', 'components'];
  
  // 查找所有AuthContext或Auth相关文件
  for (const dir of searchDirs) {
    if (checkFileExists(dir)) {
      const files = searchFilesRecursively(dir, /auth|Auth/);
      authFiles.push(...files);
    }
  }
  
  // 输出找到的文件
  if (authFiles.length > 0) {
    console.log(chalk.blue(`找到 ${authFiles.length} 个认证相关文件:`));
    authFiles.forEach(file => {
      console.log(` - ${file}`);
    });
    
    // 检测可能的重复文件
    const contextFiles = authFiles.filter(f => f.includes('AuthContext') || f.includes('authContext'));
    if (contextFiles.length > 1) {
      console.log(chalk.yellow(`警告: 发现多个AuthContext文件，这可能导致冲突:`));
      contextFiles.forEach(file => {
        console.log(` - ${file}`);
      });
      return false;
    }
  } else {
    console.log(chalk.yellow('警告: 未找到认证相关文件'));
    return false;
  }
  
  return true;
}

// 递归搜索文件
function searchFilesRecursively(dir, pattern) {
  let results = [];
  
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      // 递归搜索子目录
      results = results.concat(searchFilesRecursively(file, pattern));
    } else {
      // 检查文件名是否匹配模式
      if (pattern.test(file)) {
        results.push(file);
      }
    }
  });
  
  return results;
}

// 检查Supabase认证配置
async function checkSupabaseAuth() {
  console.log('检查Supabase认证配置...');
  
  try {
    // 尝试获取当前设置
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error(chalk.red(`无法获取认证会话: ${error.message}`));
      return false;
    }
    
    console.log(chalk.green('✓ 可以成功调用Supabase认证API'));
    
    // 检查用户表
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (userError) {
      console.error(chalk.red(`无法访问用户表: ${userError.message}`));
      return false;
    }
    
    console.log(chalk.green('✓ 可以访问用户表'));
    
    return true;
  } catch (error) {
    console.error(chalk.red(`验证Supabase认证配置时出错: ${error.message}`));
    return false;
  }
}

// 检查中间件认证配置
async function checkMiddleware() {
  console.log('检查中间件认证配置...');
  
  // 检查中间件文件是否存在
  if (!checkFileExists('middleware.ts')) {
    console.log(chalk.yellow('警告: middleware.ts文件不存在'));
    return false;
  }
  
  // 读取中间件文件
  const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');
  
  // 检查是否包含关键认证代码
  if (!middlewareContent.includes('supabase.auth.getSession()')) {
    console.log(chalk.yellow('警告: 中间件中可能缺少认证逻辑'));
    return false;
  }
  
  console.log(chalk.green('✓ 中间件包含认证逻辑'));
  return true;
}

// 主函数
async function main() {
  console.log(chalk.blue('=== 认证系统验证 ==='));
  
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
  
  // 检查认证文件
  const authFilesOk = await checkAuthFiles();
  
  // 检查Supabase认证
  const supabaseAuthOk = await checkSupabaseAuth();
  
  // 检查中间件
  const middlewareOk = await checkMiddleware();
  
  // 总结
  console.log(chalk.blue('\n=== 验证结果 ==='));
  
  if (authFilesOk) {
    console.log(chalk.green('✓ 认证文件结构正常'));
  } else {
    console.error(chalk.red('✗ 认证文件结构有问题'));
  }
  
  if (supabaseAuthOk) {
    console.log(chalk.green('✓ Supabase认证配置正常'));
  } else {
    console.error(chalk.red('✗ Supabase认证配置有问题'));
  }
  
  if (middlewareOk) {
    console.log(chalk.green('✓ 中间件认证配置正常'));
  } else {
    console.error(chalk.red('✗ 中间件认证配置有问题'));
  }
  
  if (authFilesOk && supabaseAuthOk && middlewareOk) {
    console.log(chalk.green('\n认证系统验证通过！'));
  } else {
    console.error(chalk.red('\n认证系统验证失败！请修复上述问题'));
    process.exit(1);
  }
}

// 执行主函数
main().catch(err => {
  console.error(chalk.red('验证过程中出现未捕获的错误:'), err);
  process.exit(1);
}); 