/**
 * 修复管理员页面中的revalidate配置问题
 * 将从adminPageConfig对象引用的revalidate替换为具体的数值0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确定项目根目录和管理员目录
const projectRoot = path.resolve(__dirname, '..');
const adminDir = path.join(projectRoot, 'app', 'admin');

console.log('开始修复管理员页面的配置...');
console.log(`管理员目录路径: ${adminDir}`);

// 查找所有typescript和javascript文件
function findFiles(dir, extensions) {
  const results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...findFiles(filePath, extensions));
    } else if (extensions.includes(path.extname(file))) {
      results.push(filePath);
    }
  }
  
  return results;
}

// 检查文件是否包含特定内容
function checkFileContents(filePath, searchText) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(searchText);
  } catch (error) {
    console.error(`检查文件 ${filePath} 内容时出错:`, error);
    return false;
  }
}

// 修复指定文件中的配置
function fixConfigInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;
    
    // 输出文件内容以便调试
    if (filePath.includes('page.tsx') || filePath.includes('layout.tsx')) {
      console.log(`\n文件内容: ${filePath}`);
      console.log('------------------------------');
      console.log(content.substring(0, 500) + '...');
      console.log('------------------------------');
    }
    
    // 一系列替换模式
    const replacements = [
      // 直接引用adminPageConfig对象作为参数
      {
        pattern: /export\s+const\s+revalidate\s*=\s*adminPageConfig(?:\.revalidate)?/g,
        replacement: 'export const revalidate = 0'
      },
      {
        pattern: /export\s+const\s+dynamic\s*=\s*adminPageConfig(?:\.dynamic)?/g,
        replacement: "export const dynamic = 'force-dynamic'"
      },
      {
        pattern: /export\s+const\s+fetchCache\s*=\s*adminPageConfig(?:\.fetchCache)?/g,
        replacement: "export const fetchCache = 'force-no-store'"
      },
      // 处理其他可能的引用方式
      {
        pattern: /revalidate\s*:\s*adminPageConfig(?:\.revalidate)?/g,
        replacement: 'revalidate: 0'
      },
      {
        pattern: /revalidate\s*=\s*adminPageConfig(?:\.revalidate)?/g,
        replacement: 'revalidate = 0'
      },
      // 处理对象形式的revalidate
      {
        pattern: /export\s+const\s+revalidate\s*=\s*\{[^}]*\}/g,
        replacement: 'export const revalidate = 0'
      },
      // 处理nextConfig对象中的revalidate
      {
        pattern: /(?:export\s+default\s+(?:async\s+)?function\s+generateMetadata|\[generateMetadata\])\s*\([^)]*\)\s*\{[^}]*revalidate\s*:[^,}]*/g,
        replacement: match => match.replace(/revalidate\s*:[^,}]*/, 'revalidate: 0')
      }
    ];
    
    // 应用所有替换
    for (const { pattern, replacement } of replacements) {
      if (pattern.test(newContent)) {
        console.log(`处理文件: ${filePath}`);
        console.log(`- 匹配模式: ${pattern}`);
        
        const updated = newContent.replace(pattern, replacement);
        if (updated !== newContent) {
          newContent = updated;
          modified = true;
          console.log(`- 替换为: ${replacement}`);
        }
      }
    }
    
    // 如果文件有修改，保存更新后的内容
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`- 文件已更新`);
    }
    
    return modified;
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
    return false;
  }
}

try {
  // 获取所有TS和JS文件
  console.log(`查找所有TS和JS文件...`);
  const adminFiles = findFiles(adminDir, ['.ts', '.tsx', '.js', '.jsx']);
  console.log(`找到 ${adminFiles.length} 个管理员文件`);
  
  // 特别处理config.js文件
  const configFile = path.join(projectRoot, 'app', 'config.js');
  if (fs.existsSync(configFile)) {
    adminFiles.push(configFile);
    console.log(`添加配置文件: ${configFile}`);
  }
  
  // 处理next.config.js文件
  const nextConfigFile = path.join(projectRoot, '..', 'next.config.js');
  if (fs.existsSync(nextConfigFile)) {
    adminFiles.push(nextConfigFile);
    console.log(`添加Next配置文件: ${nextConfigFile}`);
  }
  
  let fixedCount = 0;
  
  // 处理每个文件
  for (const file of adminFiles) {
    if (fixConfigInFile(file)) {
      fixedCount++;
    }
  }
  
  // 检查使用adminPageConfig的其他文件
  console.log(`\n检查使用adminPageConfig的其他文件...`);
  const allFiles = findFiles(projectRoot, ['.ts', '.tsx', '.js', '.jsx']);
  const adminConfigFiles = allFiles.filter(file => 
    checkFileContents(file, 'adminPageConfig') && !adminFiles.includes(file)
  );
  
  console.log(`找到 ${adminConfigFiles.length} 个额外使用adminPageConfig的文件`);
  
  for (const file of adminConfigFiles) {
    console.log(`检查额外文件: ${file}`);
    if (fixConfigInFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n完成! 共修复了 ${fixedCount} 个文件的配置。`);
} catch (error) {
  console.error('修复过程中出错:', error);
} 