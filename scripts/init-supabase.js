// 这个脚本用于自动创建Supabase数据库表和初始数据
// 运行方式: node scripts/init-supabase.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('错误: 找不到Supabase URL或密钥，请确保.env文件中存在NEXT_PUBLIC_SUPABASE_URL和NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 读取SQL文件
const sqlFilePath = path.join(process.cwd(), 'scripts', 'init-db.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// 拆分SQL命令 (简单的分隔方式，不能处理复杂SQL)
const sqlCommands = sql.split(';').filter(cmd => cmd.trim());

// 执行所有SQL命令
async function initDatabase() {
  console.log('正在初始化数据库...');
  
  for (let i = 0; i < sqlCommands.length; i++) {
    const command = sqlCommands[i].trim();
    if (command) {
      try {
        console.log(`执行SQL命令 ${i + 1}/${sqlCommands.length}`);
        const { error } = await supabase.rpc('exec_sql', { query: command + ';' });
        
        if (error) {
          console.error(`命令执行失败: ${error.message}`);
        }
      } catch (err) {
        console.error(`执行出错: ${err.message}`);
      }
    }
  }
  
  console.log('数据库初始化完成！');
}

initDatabase().catch(err => {
  console.error('初始化数据库时出错:', err);
  process.exit(1);
}); 