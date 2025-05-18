import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 需要修复的路径模式
const pathMappings = [
  {
    from: /@\/src\/app\/shared\//g,
    to: '@/src/app/(shared)/'
  },
  {
    from: /@\/src\/app\/customer\//g,
    to: '@/src/app/(customer)/'
  }
];

// 需要扫描的文件扩展名
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// 扫描目录
function scanDirectory(dir) {
  const results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results.push(...scanDirectory(fullPath));
    } else if (stat.isFile() && extensions.includes(path.extname(file))) {
      results.push(fullPath);
    }
  }

  return results;
}

// 修复文件中的导入路径
function fixImports(file) {
  let content = fs.readFileSync(file, 'utf8');
  let hasChanges = false;

  for (const mapping of pathMappings) {
    if (mapping.from.test(content)) {
      content = content.replace(mapping.from, mapping.to);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`已修复文件: ${file}`);
    return true;
  }

  return false;
}

// 主函数
async function main() {
  console.log('开始扫描源代码文件...');
  const srcPath = path.join(__dirname, '../src');
  const files = scanDirectory(srcPath);
  
  console.log(`找到 ${files.length} 个源代码文件，开始检查导入路径...`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixImports(file)) {
      fixedCount++;
    }
  }
  
  if (fixedCount > 0) {
    console.log(`\n成功修复 ${fixedCount} 个文件中的导入路径问题。`);
  } else {
    console.log('\n没有找到需要修复的导入路径问题。');
  }
}

// 执行主函数
main().catch(error => {
  console.error('发生错误:', error);
  process.exit(1);
}); 