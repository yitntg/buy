// Supabase数据库初始化脚本
// 运行方式: node scripts/init-supabase.js

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
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 主函数
async function main() {
  console.log(log.blue('=== 初始化Supabase数据库 ==='));
  
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
  
  // 执行迁移脚本
  await runMigrations();
  
  // 创建示例数据（开发环境）
  if (process.env.NODE_ENV !== 'production') {
    await createSampleData();
  } else {
    console.log(log.yellow('跳过示例数据创建（生产环境）'));
  }
  
  console.log(log.green('\n数据库初始化完成！'));
}

// 执行迁移脚本
async function runMigrations() {
  console.log(log.blue('\n运行数据库迁移...'));
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  // 检查目录是否存在
  if (!fs.existsSync(migrationsDir)) {
    console.error(log.red(`迁移目录不存在: ${migrationsDir}`));
    return;
  }
  
  // 读取迁移文件
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // 保证按文件名顺序执行
  
  if (migrationFiles.length === 0) {
    console.log(log.yellow('没有找到迁移文件'));
    return;
  }
  
  console.log(`找到 ${migrationFiles.length} 个迁移文件`);
  
  // 逐个执行迁移文件
  for (const file of migrationFiles) {
    console.log(`执行迁移: ${file}`);
    
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { error } = await supabase.rpc('exec_sql', { query: sql });
      
      if (error) {
        console.error(log.red(`执行迁移 ${file} 失败: ${error.message}`));
        continue;
      }
      
      console.log(log.green(`✓ 迁移 ${file} 成功`));
    } catch (error) {
      console.error(log.red(`执行迁移 ${file} 出错: ${error.message}`));
    }
  }
}

// 创建示例数据
async function createSampleData() {
  console.log(log.blue('\n创建示例数据...'));
  
  // 检查是否已存在数据
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error(log.red(`检查产品表失败: ${error.message}`));
    return;
  }
  
  if (count > 0) {
    console.log(log.yellow('产品表已包含数据，跳过示例数据创建'));
    return;
  }
  
  // 创建示例产品
  console.log('创建示例产品...');
  
  const products = [
    {
      name: '高级笔记本电脑',
      description: '强大的笔记本电脑，适合工作和游戏',
      price: 1299.99,
      category: '电子产品',
      stock: 10,
      status: 'active',
      images: [
        'https://example.com/images/laptop1.jpg',
        'https://example.com/images/laptop2.jpg'
      ]
    },
    {
      name: '智能手机',
      description: '最新款智能手机，配备高清摄像头',
      price: 799.99,
      category: '电子产品',
      stock: 15,
      status: 'active',
      images: [
        'https://example.com/images/phone1.jpg'
      ]
    },
    {
      name: '无线耳机',
      description: '高品质无线耳机，降噪功能',
      price: 149.99,
      category: '配件',
      stock: 25,
      status: 'active',
      images: [
        'https://example.com/images/headphones.jpg'
      ]
    }
  ];
  
  // 插入产品
  const { error: productsError } = await supabase
    .from('products')
    .insert(products);
  
  if (productsError) {
    console.error(log.red(`创建示例产品失败: ${productsError.message}`));
  } else {
    console.log(log.green(`✓ 创建了 ${products.length} 个示例产品`));
  }
}

// 执行主函数
main().catch(err => {
  console.error(log.red('初始化过程中出现未捕获的错误:'), err);
  process.exit(1);
}); 