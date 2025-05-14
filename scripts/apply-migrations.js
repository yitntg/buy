#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// 定义简单的日志着色函数
const log = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`
};

// 加载环境变量
dotenv.config();

// 获取Supabase连接信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 确保环境变量存在
if (!supabaseUrl || !supabaseKey) {
  console.error(log.red('错误: 缺少必要的环境变量'));
  console.error(log.red('请确保以下环境变量已设置:'));
  console.error(log.red('- NEXT_PUBLIC_SUPABASE_URL'));
  console.error(log.red('- SUPABASE_SERVICE_ROLE_KEY'));
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 迁移文件的基本目录
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

// 迁移文件按正确顺序执行 - 自动扫描目录并排序
async function applyMigrations() {
  try {
    console.log(log.blue('开始应用数据库迁移...'));
    
    // 1. 首先确保迁移文件目录存在
    if (!fs.existsSync(migrationsDir)) {
      console.error(log.red(`错误: 迁移文件目录 ${migrationsDir} 不存在`));
      process.exit(1);
    }
    
    // 2. 获取所有迁移文件并排序
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort((a, b) => {
        // 按文件名数字前缀排序
        const numA = parseInt(a.split('_')[0].replace(/\D/g, ''));
        const numB = parseInt(b.split('_')[0].replace(/\D/g, ''));
        return numA - numB;
      });
    
    if (migrationFiles.length === 0) {
      console.log(log.yellow('没有找到迁移文件'));
      return;
    }
    
    console.log(`找到 ${migrationFiles.length} 个迁移文件`);
    
    // 3. 获取已应用的迁移记录
    // 检查迁移记录表是否存在
    const { data: schema, error: schemaError } = await supabase
      .from('migrations')
      .select('id')
      .limit(1);
      
    // 如果迁移表不存在，创建它
    if (schemaError && schemaError.code === 'PGRST116') {
      console.log(log.blue('创建迁移记录表...'));
      
      await supabase.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    }
    
    // 获取已应用的迁移
    const { data: appliedMigrations, error } = await supabase
      .from('migrations')
      .select('name')
      .order('id', { ascending: true });
      
    if (error) {
      console.error(log.red('获取已应用迁移记录出错:'), error);
      process.exit(1);
    }
    
    const appliedSet = new Set((appliedMigrations || []).map(m => m.name));
    console.log(`已应用 ${appliedSet.size} 个迁移`);
    
    // 4. 执行未应用的迁移
    let successCount = 0;
    let failCount = 0;
    
    for (const file of migrationFiles) {
      if (appliedSet.has(file)) {
        console.log(log.yellow(`已跳过: ${file}`));
        continue;
      }
      
      console.log(log.blue(`应用迁移: ${file}`));
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        // 执行SQL
        await supabase.rpc('exec_sql', { query: sql });
        
        // 记录成功的迁移
        await supabase
          .from('migrations')
          .insert({ name: file });
          
        console.log(log.green(`✅ 成功: ${file}`));
        successCount++;
      } catch (sqlError) {
        console.error(log.red(`❌ 失败: ${file}`));
        console.error(log.red('错误详情:'), sqlError);
        failCount++;
        
        // 如果使用了--strict标志，则在遇到错误时停止
        if (process.argv.includes('--strict')) {
          console.error(log.red('由于使用了--strict标志，停止迁移过程'));
          process.exit(1);
        }
      }
    }
    
    // 5. 输出结果摘要
    console.log(log.blue('\n迁移完成!'));
    console.log(`总共: ${migrationFiles.length}`);
    console.log(`跳过: ${appliedSet.size}`);
    console.log(log.green(`成功: ${successCount}`));
    if (failCount > 0) {
      console.log(log.red(`失败: ${failCount}`));
    } else {
      console.log(`失败: ${failCount}`);
    }
    
    if (failCount > 0) {
      console.error(log.red('有迁移失败，请检查错误信息'));
      process.exit(1);
    }
    
  } catch (error) {
    console.error(log.red('迁移过程中发生错误:'), error);
    process.exit(1);
  }
}

// 执行迁移
applyMigrations().catch(err => {
  console.error(log.red('运行迁移时出错:'), err);
  process.exit(1);
}); 