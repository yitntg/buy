#!/usr/bin/env node

/**
 * 禁用管理员页面的静态生成
 * 此脚本在构建前运行，强制管理员页面使用服务器端渲染
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const rootDir = path.resolve(__dirname);

console.log('🔧 开始处理管理员页面...');

// 查找所有管理员页面
const adminPages = globSync('src/app/admin/**/*.{js,jsx,ts,tsx}', { cwd: rootDir });

if (adminPages.length === 0) {
  console.log('❓ 没有找到管理员页面');
  process.exit(0);
}

console.log(`🔍 找到 ${adminPages.length} 个管理员页面文件`);

// 处理每个页面
adminPages.forEach(pagePath => {
  const fullPath = path.join(rootDir, pagePath);
  console.log(`📄 处理: ${pagePath}`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 1. 移除现有的revalidate导出
    content = content.replace(/export\s+const\s+revalidate\s*=\s*[^;]+;/g, '');
    
    // 2. 添加新的强制动态渲染配置
    const dynamicExports = `
// 强制动态渲染 - 设置
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
`;
    
    // 如果是客户端组件，在'use client'声明后添加
    if (content.includes("'use client'")) {
      content = content.replace("'use client'", `'use client'\n${dynamicExports}`);
    } 
    // 如果使用双引号的'use client'声明
    else if (content.includes('"use client"')) {
      content = content.replace('"use client"', `"use client"\n${dynamicExports}`);
    }
    // 否则添加到文件顶部
    else {
      content = `${dynamicExports}\n${content}`;
    }
    
    // 3. 写回文件
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ 已修改: ${pagePath}`);
  } catch (error) {
    console.error(`❌ 处理 ${pagePath} 时出错:`, error);
  }
});

console.log('\n🎉 所有管理员页面处理完成！');

// 4. 修改next.config.js添加禁用静态生成的配置
const nextConfigPath = path.join(rootDir, 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  try {
    console.log('📝 正在更新 next.config.js...');
    let configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // 确保配置文件包含禁用静态生成的设置
    if (!configContent.includes('experimental') || !configContent.includes('runtime: ')) {
      // 查找配置对象
      const configMatch = configContent.match(/(const\s+nextConfig\s*=\s*\{)/);
      if (configMatch) {
        const replacement = `$1
  // 禁用静态生成
  experimental: {
    esmExternals: true,
    runtime: 'nodejs',
    fetchCache: false
  },`;
        
        configContent = configContent.replace(configMatch[0], replacement);
        fs.writeFileSync(nextConfigPath, configContent, 'utf8');
        console.log('✅ 已更新 next.config.js');
      }
    }
  } catch (error) {
    console.error('❌ 更新 next.config.js 时出错:', error);
  }
}

// 5. 创建必要的环境变量文件
const envPath = path.join(rootDir, '.env.production');
console.log('📝 创建生产环境变量文件...');

const envContent = `# 禁用静态生成
NEXT_DISABLE_STATIC_GENERATION=true
NEXT_PUBLIC_DISABLE_ISR=true
NEXT_PUBLIC_STATIC_PAGE_CACHE_TTL=0
`;

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('✅ 已创建 .env.production');

console.log('\n✨ 所有修改已完成，现在可以构建应用了 ✨'); 