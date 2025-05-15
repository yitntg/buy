const fs = require('fs');
const path = require('path');

// 确保目录存在
const dirPath = path.join(process.cwd(), 'node_modules', 'rc-util', 'es', 'Dom');
if (!fs.existsSync(dirPath)) {
  console.log('创建目录:', dirPath);
  fs.mkdirSync(dirPath, { recursive: true });
}

// 创建canUseDom.js文件
const filePath = path.join(dirPath, 'canUseDom.js');
const fileContent = `export default function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
`;

// 创建canUseDom.mjs文件 (ESM格式)
const mfilePath = path.join(dirPath, 'canUseDom.mjs');

// 写入文件
fs.writeFileSync(filePath, fileContent);
fs.writeFileSync(mfilePath, fileContent);
console.log('已创建文件:', filePath);
console.log('已创建ESM文件:', mfilePath);

// 创建package.json文件指定模块类型
const pkgPath = path.join(dirPath, 'package.json');
const pkgContent = JSON.stringify({
  "name": "canUseDom",
  "type": "module"
}, null, 2);
fs.writeFileSync(pkgPath, pkgContent);
console.log('已创建package.json:', pkgPath);

// 尝试修改动态导入模块
try {
  // 查找引用这个模块的文件
  const dynamicPath = path.join(process.cwd(), 'node_modules', 'rc-util', 'es', 'Dom', 'dynamicCSS.js');
  if (fs.existsSync(dynamicPath)) {
    console.log('正在修改dynamicCSS.js...');
    let content = fs.readFileSync(dynamicPath, 'utf8');
    
    // 尝试解决导入问题
    if (content.includes('import canUseDom from')) {
      // 替换为内联实现
      content = content.replace(
        /import\s+canUseDom\s+from\s+['"](\.\/)?canUseDom['"];?/,
        `// Inline implementation of canUseDom
const canUseDom = () => !!(typeof window !== 'undefined' && window.document && window.document.createElement);`
      );
      
      fs.writeFileSync(dynamicPath, content);
      console.log('已修改dynamicCSS.js，内联实现canUseDom');
    }
  }
} catch (error) {
  console.error('修改dynamicCSS.js失败:', error);
} 