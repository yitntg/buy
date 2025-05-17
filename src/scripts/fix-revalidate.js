#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const rootDir = path.resolve(__dirname, '../..');

// 管理员页面目录
const adminDir = path.join(rootDir, 'src', 'app', 'admin');

// 需要扫描的文件扩展名
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// 查找所有需要修复的文件
function findFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findFiles(fullPath));
    } else if (stat.isFile() && extensions.includes(path.extname(file))) {
      results.push(fullPath);
    }
  }

  return results;
}

// 修复文件中的revalidate配置
function fixRevalidate(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;

  // 修复adminPageConfig.revalidate引用
  const patterns = [
    {
      // 匹配 export const revalidate = adminPageConfig.revalidate
      pattern: /export\s+const\s+revalidate\s*=\s*adminPageConfig(?:\.revalidate)?/g,
      replacement: 'export const revalidate = 0'
    },
    {
      // 匹配 revalidate: adminPageConfig.revalidate
      pattern: /revalidate\s*:\s*adminPageConfig(?:\.revalidate)?/g,
      replacement: 'revalidate: 0'
    },
    {
      // 匹配 export const revalidate = {object}
      pattern: /export\s+const\s+revalidate\s*=\s*\{[^}]*\}/g,
      replacement: 'export const revalidate = 0'
    },
    {
      // 匹配引号包裹的revalidate值
      pattern: /export\s+const\s+revalidate\s*=\s*["']0["']/g,
      replacement: 'export const revalidate = 0'
    }
  ];

  for (const { pattern, replacement } of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      fixed = true;
    }
  }

  if (fixed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`已修复文件: ${filePath}`);
    return true;
  }

  return false;
}

// 主函数
async function main() {
  console.log('开始扫描需要修复的文件...');
  const files = findFiles(adminDir);
  
  console.log(`找到 ${files.length} 个文件，开始检查revalidate配置...`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixRevalidate(file)) {
      fixedCount++;
    }
  }
  
  if (fixedCount > 0) {
    console.log(`\n成功修复 ${fixedCount} 个文件中的revalidate配置问题。`);
  } else {
    console.log('\n没有找到需要修复的revalidate配置问题。');
  }
}

// 执行主函数
main().catch(error => {
  console.error('发生错误:', error);
  process.exit(1);
}); 