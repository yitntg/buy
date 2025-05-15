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

// 写入文件
fs.writeFileSync(filePath, fileContent);
console.log('已创建文件:', filePath); 