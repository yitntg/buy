// 临时初始化脚本，使用硬编码的Supabase凭据
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 读取SQL文件
console.log('读取SQL文件...');
const sqlFilePath = path.join(__dirname, 'init-db.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log(`已读取SQL文件: ${sqlFilePath} (${sqlContent.length} 字符)`);
} catch (err) {
  console.error('读取SQL文件失败:', err);
  process.exit(1);
}

// 创建临时.env文件
console.log('创建临时环境变量文件...');
const envContent = `
NEXT_PUBLIC_SUPABASE_URL=https://pzjhupjfojvlbthnsgqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6amh1cGpmb2p2bGJ0aG5zZ3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2ODAxOTIsImV4cCI6MjAzMTI1NjE5Mn0.COXs_t1-J5XhZXu7X0W3DlsgI1UByhgA-hezLhWALN0
`;

const tempEnvPath = path.join(__dirname, '..', '.env.local');
fs.writeFileSync(tempEnvPath, envContent);
console.log(`临时.env.local文件已创建在: ${tempEnvPath}`);

// 运行初始化脚本
console.log('运行数据库初始化脚本...');
try {
  execSync('npm run init-db-local', { stdio: 'inherit' });
  console.log('数据库初始化成功!');
} catch (err) {
  console.error('数据库初始化失败:', err);
}

console.log('临时初始化完成!'); 