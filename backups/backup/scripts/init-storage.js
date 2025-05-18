// Supabase存储初始化脚本
// 运行方式: node scripts/init-storage.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// 定义一个简单的 chalk 替代
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
  console.warn(log.yellow('警告: 缺少Supabase环境变量，跳过存储初始化'));
  process.exit(0);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 需要创建的存储桶配置
const storageBuckets = [
  {
    name: 'products',
    isPublic: true,
    folderStructure: ['images', 'thumbnails', 'temp']
  },
  {
    name: 'avatars',
    isPublic: true,
    folderStructure: ['users', 'temp']
  },
  {
    name: 'documents',
    isPublic: false,
    folderStructure: ['orders', 'invoices', 'returns']
  },
  {
    name: 'uploads',
    isPublic: true,
    folderStructure: ['comments', 'misc']
  }
];

// 主函数
async function main() {
  console.log(log.blue('=== 初始化Supabase存储 ==='));
  
  // 检查连接
  try {
    const { data: health, error } = await supabase.rpc('heartbeat');
    
    if (error) {
      console.warn(log.yellow(`警告: 无法连接到Supabase，跳过存储初始化: ${error.message}`));
      return;
    }
  } catch (error) {
    console.warn(log.yellow(`警告: 连接Supabase出错，跳过存储初始化: ${error.message}`));
    return;
  }
  
  console.log('正在检查和创建存储桶...');
  
  // 获取现有存储桶
  const { data: existingBuckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error(log.red(`无法获取存储桶列表: ${bucketsError.message}`));
    // 如果是因为权限问题，我们继续运行，不要中断
    console.warn(log.yellow('这可能是权限问题，跳过存储桶创建'));
    return;
  }
  
  const existingBucketNames = existingBuckets ? existingBuckets.map(b => b.name) : [];
  console.log(`发现 ${existingBucketNames.length} 个现有存储桶`);
  
  // 创建缺失的存储桶
  for (const bucket of storageBuckets) {
    if (!existingBucketNames.includes(bucket.name)) {
      console.log(`创建存储桶: ${bucket.name}`);
      
      try {
        const { data, error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.isPublic,
          fileSizeLimit: 50 * 1024 * 1024 // 50MB 限制
        });
        
        if (error) {
          console.error(log.red(`创建存储桶 ${bucket.name} 失败: ${error.message}`));
          continue;
        }
        
        console.log(log.green(`✓ 创建存储桶 ${bucket.name} 成功`));
      } catch (error) {
        console.error(log.red(`创建存储桶时出错: ${error.message}`));
      }
    } else {
      console.log(log.green(`✓ 存储桶 ${bucket.name} 已存在`));
    }
    
    // 为每个存储桶创建文件夹结构
    for (const folder of bucket.folderStructure) {
      try {
        // 上传一个空文件来创建文件夹（Supabase中创建文件夹的方式）
        const { data, error } = await supabase.storage
          .from(bucket.name)
          .upload(`${folder}/.keep`, new Uint8Array(0), {
            contentType: 'text/plain',
            upsert: true
          });
          
        if (error && error.message !== 'The resource already exists') {
          console.warn(log.yellow(`创建文件夹 ${bucket.name}/${folder} 失败: ${error.message}`));
        } else {
          console.log(log.green(`✓ 文件夹 ${bucket.name}/${folder} 已就绪`));
        }
      } catch (error) {
        console.warn(log.yellow(`创建文件夹结构时出错: ${error.message}`));
      }
    }
  }
  
  console.log(log.green('\n存储初始化完成！'));
}

// 执行主函数
main().catch(err => {
  console.error(log.red('初始化过程中出现未捕获的错误:'), err);
  // 不要中断构建过程
}); 