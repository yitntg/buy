const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 需要更新的导入路径映射
const importMappings = [
  {
    from: '@/src/app/(customer-code)/components/',
    to: '@/src/app/(customer)/components/'
  },
  {
    from: '@/src/app/(admin-code)/components/',
    to: '@/src/app/admin/components/'
  }
];

// 递归处理目录中的所有.tsx和.ts文件
function processDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      processDirectory(fullPath); // 递归处理子目录
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      updateImports(fullPath);
    }
  }
}

// 更新单个文件中的导入语句
function updateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    for (const mapping of importMappings) {
      const regex = new RegExp(`import\\s+(.*)\\s+from\\s+['"]${mapping.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(.*)['"]`, 'g');
      
      const newContent = content.replace(regex, (match, importPart, componentPath) => {
        modified = true;
        return `import ${importPart} from '${mapping.to}${componentPath}'`;
      });
      
      if (content !== newContent) {
        content = newContent;
      }
    }
    
    if (modified) {
      console.log(`更新文件: ${filePath}`);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

// 开始处理
console.log('开始更新导入路径...');
processDirectory(path.join(__dirname, '../src/app'));
console.log('导入路径更新完成！'); 