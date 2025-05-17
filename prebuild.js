#!/usr/bin/env node

/**
 * 预构建脚本
 * 在Next.js构建前自动执行的脚本，用于解决页面配置问题
 */

import fs from 'fs';
import path from 'path';
import * as glob from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const rootDir = path.resolve(__dirname);

console.log('🔄 开始运行预构建脚本...');

// 修复admin目录下所有页面的revalidate配置
function fixAdminPagesRevalidate() {
  console.log('\n📄 检查管理员页面revalidate配置...');
  
  // 查找所有管理员页面
  const adminPages = glob.sync('src/app/admin/**/page.{js,jsx,ts,tsx}', { cwd: rootDir });
  
  if (adminPages.length === 0) {
    console.log('❓ 没有找到管理员页面');
    return;
  }
  
  console.log(`🔍 找到 ${adminPages.length} 个管理员页面`);
  
  let fixedCount = 0;
  
  // 处理每个页面
  for (const pagePath of adminPages) {
    const fullPath = path.join(rootDir, pagePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // 检查页面是否已经有revalidate=0导出
    if (!content.includes('export const revalidate = 0')) {
      // 如果是客户端组件（有'use client'声明），在它后面添加
      if (content.includes("'use client'") || content.includes('"use client"')) {
        content = content.replace(
          /(['"]use client['"];?\s*)/,
          "$1\n// 禁用缓存，确保页面实时更新\nexport const dynamic = 'force-dynamic';\nexport const fetchCache = 'force-no-store';\nexport const revalidate = 0;\n\n"
        );
        modified = true;
      } else {
        // 否则添加到文件顶部
        content = `// 禁用缓存，确保页面实时更新\nexport const dynamic = 'force-dynamic';\nexport const fetchCache = 'force-no-store';\nexport const revalidate = 0;\n\n${content}`;
        modified = true;
      }
    }
    
    // 替换可能导致问题的revalidate配置
    const patterns = [
      // 匹配 export const revalidate = adminPageConfig.revalidate
      { 
        pattern: /export\s+const\s+revalidate\s*=\s*adminPageConfig(?:\.revalidate)?/g,
        replacement: 'export const revalidate = 0'
      },
      // 匹配 revalidate: adminPageConfig.revalidate
      {
        pattern: /revalidate\s*:\s*adminPageConfig(?:\.revalidate)?/g,
        replacement: 'revalidate: 0'
      },
      // 匹配 export const revalidate = {object}
      {
        pattern: /export\s+const\s+revalidate\s*=\s*\{[^}]*\}/g,
        replacement: 'export const revalidate = 0'
      },
      // 匹配引号包裹的revalidate值
      {
        pattern: /export\s+const\s+revalidate\s*=\s*["']0["']/g,
        replacement: 'export const revalidate = 0'
      }
    ];
    
    for (const { pattern, replacement } of patterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ 已修复: ${pagePath}`);
      fixedCount++;
    }
  }
  
  console.log(`\n🎉 完成修复 ${fixedCount} 个管理员页面的revalidate配置`);
}

// 修复Next.js配置文件
function fixNextConfig() {
  console.log('\n📄 检查Next.js配置...');
  const configPath = path.join(rootDir, 'next.config.js');
  
  if (!fs.existsSync(configPath)) {
    console.log('❓ 未找到next.config.js');
    return;
  }
  
  let content = fs.readFileSync(configPath, 'utf8');
  const hasExperimentalConfig = content.includes('experimental:');
  
  // 添加experimental配置以允许ESM导入并禁用类型检查
  if (!hasExperimentalConfig) {
    // 查找module.exports或export default语句
    const match = content.match(/(module\.exports\s*=\s*\{|export\s+default\s*\{)/);
    
    if (match) {
      // 在配置对象中添加experimental属性
      content = content.replace(
        match[0],
        `${match[0]}\n  // 配置实验性功能\n  experimental: {\n    // 允许导入外部包的ESM模块\n    esmExternals: true,\n    // 禁用静态生成时的严格检查\n    isrFlushToDisk: false\n  },\n`
      );
      
      fs.writeFileSync(configPath, content, 'utf8');
      console.log('✅ 已更新next.config.js添加experimental配置');
    }
  }
}

// 执行所有修复
async function runAllFixes() {
  try {
    fixAdminPagesRevalidate();
    fixNextConfig();
    
    console.log('\n✨ 预构建处理完成 ✨');
  } catch (error) {
    console.error('❌ 预构建过程中发生错误:', error);
    process.exit(1);
  }
}

runAllFixes(); 