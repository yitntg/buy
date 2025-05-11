// 用于在构建前更新BUILD_TIME环境变量的脚本
const fs = require('fs');
const path = require('path');

console.log('更新构建时间...');

// 获取当前时间
const buildTime = new Date().toISOString();

// 创建或更新环境变量
const envContent = `NEXT_PUBLIC_BUILD_TIME="${buildTime}"`;

// 写入到.env.local文件
fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);

console.log(`构建时间已更新: ${buildTime}`); 