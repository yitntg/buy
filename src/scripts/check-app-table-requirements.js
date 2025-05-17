/**
 * 分析应用代码中引用的表结构与实际数据库中的表结构是否匹配
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// 尝试加载环境变量
const envFiles = [
  path.join(rootDir, '.env.local'),
  path.join(rootDir, '.env'),
  path.join(rootDir, '.env.development.local')
];

let envLoaded = false;

for (const file of envFiles) {
  if (fs.existsSync(file)) {
    console.log(`加载环境变量文件: ${file}`);
    dotenv.config({ path: file });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('未找到环境变量文件，请先创建.env.local文件');
  process.exit(1);
}

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少必要的Supabase环境变量');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 应用中需要的表
const APP_REQUIRED_TABLES = [
  'products',
  'users',
  'categories',
  'reviews',
  'orders',
  'order_items', 
  'profiles',
  'carts',
  'cart_items',
  'favorites',
  'customers'
];

// 检查表是否存在
async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('count(*)', { count: 'exact', head: true });
      
    if (error) {
      return { exists: false, error: error.message };
    }
    
    return { 
      exists: true, 
      count: data?.count || 0 
    };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

// 递归查找文件
function findFilesRecursive(dir, extensions) {
  const results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 排除node_modules和.next目录
      if (file !== 'node_modules' && file !== '.next' && file !== 'backup') {
        results.push(...findFilesRecursive(fullPath, extensions));
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  
  return results;
}

// 搜索文件内容中的表引用
function findTableReferencesInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const references = [];
    
    // 定义可能的表引用模式
    const patterns = [
      /\.from\(['"]([a-zA-Z_]+)['"]\)/g,        // .from('table')
      /\.table\(['"]([a-zA-Z_]+)['"]\)/g,       // .table('table')
      /\bFROM\s+([a-zA-Z_]+)\b/gi,              // SQL: FROM table
      /\bJOIN\s+([a-zA-Z_]+)\b/gi,              // SQL: JOIN table
      /\bTable\s+([a-zA-Z_]+)\b/g,              // Table table
      /\b([a-zA-Z_]+)Schema\b/g,                // tableSchema
      /\b([a-zA-Z_]+)Repository\b/g,            // tableRepository
      /\b([a-zA-Z_]+)Service\b/g,               // tableService
      /\b([a-zA-Z_]+)Model\b/g,                 // tableModel
      /\binterface\s+([A-Z][a-zA-Z]+)\b/g       // interface TableName
    ];
    
    // 非表名的常见词
    const exclusions = ['div', 'span', 'component', 'function', 'const', 'let', 'var', 'use', 'get'];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      for (const pattern of patterns) {
        let match;
        // 重置正则表达式状态
        pattern.lastIndex = 0;
        
        while ((match = pattern.exec(line)) !== null) {
          if (match && match[1]) {
            const tableName = match[1].toLowerCase();
            
            // 过滤掉常见的非表名
            if (!exclusions.includes(tableName) && tableName.length > 2) {
              references.push({
                table: tableName,
                line: `${filePath}:${i+1}: ${line.trim()}`
              });
            }
          }
        }
      }
    }
    
    return references;
  } catch (error) {
    console.error(`读取文件 ${filePath} 出错:`, error.message);
    return [];
  }
}

// 检查代码中表的引用
async function findTableReferencesInCode() {
  console.log('分析代码中的表引用...');
  
  const srcDir = path.join(rootDir, 'src');
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  
  // 查找所有符合条件的文件
  const files = findFilesRecursive(srcDir, extensions);
  console.log(`找到 ${files.length} 个代码文件进行分析`);
  
  // 搜索每个文件中的表引用
  const tableReferences = new Map();
  
  for (const file of files) {
    const references = findTableReferencesInFile(file);
    
    for (const ref of references) {
      const { table, line } = ref;
      const referencesForTable = tableReferences.get(table) || [];
      referencesForTable.push(line);
      tableReferences.set(table, referencesForTable);
    }
  }
  
  console.log(`在代码中找到了 ${tableReferences.size} 个可能的表引用`);
  return tableReferences;
}

// 主函数
async function main() {
  console.log('开始分析应用表需求与数据库表结构的匹配情况...\n');
  
  // 分析代码中的表引用
  const codeReferences = await findTableReferencesInCode();
  
  // 检查数据库中的表
  const dbTableStatus = {};
  for (const table of APP_REQUIRED_TABLES) {
    dbTableStatus[table] = await checkTableExists(table);
  }
  
  // 检查代码中引用的其他表
  for (const [table, _] of codeReferences.entries()) {
    if (!dbTableStatus[table]) {
      dbTableStatus[table] = await checkTableExists(table);
    }
  }
  
  // 生成分析报告
  console.log('\n=== 应用与数据库表匹配分析 ===\n');
  
  // 1. 应用必需的表
  console.log('应用必需的表:');
  for (const table of APP_REQUIRED_TABLES) {
    const status = dbTableStatus[table];
    console.log(`${status?.exists ? '✅' : '❌'} ${table}${status?.exists ? ` (包含${status.count}条记录)` : status ? ` - ${status.error}` : ' - 未检查'}`);
  }
  
  // 2. 代码中引用的表
  console.log('\n代码中引用的表:');
  const codeTables = Array.from(codeReferences.keys()).sort();
  for (const table of codeTables) {
    // 跳过一些非表名但是常被匹配到的词
    if (['product', 'user', 'category', 'order', 'profile', 'review'].includes(table)) {
      continue;
    }
    
    const status = dbTableStatus[table] || { exists: false, error: '未检查' };
    const references = codeReferences.get(table).length;
    console.log(`${status.exists ? '✅' : '❌'} ${table} - 在代码中引用了${references}次${status.exists ? '' : ` (${status.error})`}`);
  }
  
  // 3. 缺失的表
  const missingTables = APP_REQUIRED_TABLES.filter(table => dbTableStatus[table] && !dbTableStatus[table].exists);
  if (missingTables.length > 0) {
    console.log('\n❌ 缺失的表:');
    for (const table of missingTables) {
      const refs = codeReferences.get(table) || [];
      console.log(`- ${table} (在代码中有${refs.length}处引用)`);
      if (refs.length > 0) {
        console.log(`  示例引用: ${refs[0].substring(0, 120)}...`);
      }
    }
  }
  
  // 4. 总结
  console.log('\n=== 总结 ===');
  const existingCount = APP_REQUIRED_TABLES.filter(table => dbTableStatus[table]?.exists).length;
  console.log(`应用需要 ${APP_REQUIRED_TABLES.length} 个表，实际存在 ${existingCount} 个表`);
  
  if (missingTables.length > 0) {
    console.log(`❌ 缺少 ${missingTables.length} 个表: ${missingTables.join(', ')}`);
    console.log('这些表的缺失可能会导致应用功能不正常，请使用create-missing-tables.js脚本生成创建表的SQL语句');
  } else {
    console.log('✅ 所有需要的表都存在');
  }
}

// 执行主函数
main().catch(error => {
  console.error('程序执行出错:', error);
}); 