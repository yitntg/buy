// 修复所有页面中错误的revalidate值
const fs = require('fs');
const path = require('path');

console.log('开始修复revalidate值...');

// 递归查找目录下的所有文件
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      findFiles(filePath, fileList);
    } else if (stat.isFile() && /\.(tsx|ts|jsx|js)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 查找可能的问题文件
function findPotentialIssues(file) {
  const content = fs.readFileSync(file, 'utf8');
  
  // 检查文件是否包含revalidate
  if (content.includes('revalidate')) {
    console.log(`检查文件: ${file}`);
    
    // 多种可能的错误模式
    const patterns = [
      { 
        regex: /revalidate\s*[=:]\s*\{[^}]*\}/g, 
        description: "对象形式的revalidate" 
      },
      { 
        regex: /revalidate\s*[=:]\s*\[([^\]]*)\]/g, 
        description: "数组形式的revalidate" 
      },
      {
        regex: /revalidate\s*[=:]\s*(['"]).*\1/g,
        description: "字符串形式的revalidate"
      },
      {
        regex: /revalidate\s*[=:]\s*.*\?.*/g,
        description: "条件表达式形式的revalidate"
      }
    ];
    
    for (const pattern of patterns) {
      if (pattern.regex.test(content)) {
        console.log(`  发现问题: ${pattern.description}`);
        const correctedContent = content.replace(pattern.regex, 'revalidate = 3600');
        fs.writeFileSync(file, correctedContent, 'utf8');
        console.log(`  已修复文件`);
        return true;
      }
    }
    
    // 输出当前的revalidate设置，帮助调试
    const revalidateMatch = content.match(/revalidate\s*[=:]\s*([^;\n]*)/);
    if (revalidateMatch) {
      console.log(`  当前revalidate值: ${revalidateMatch[1].trim()}`);
    }
  }
  
  return false;
}

// 查找app目录下的所有页面文件
console.log("正在扫描src目录...");
let srcFiles = [];
try {
  srcFiles = findFiles('src');
} catch (e) {
  console.log("src目录不存在或扫描错误:", e.message);
}

console.log("正在扫描app目录...");
const appFiles = findFiles('app');
const allFiles = [...appFiles, ...srcFiles];

console.log(`找到 ${allFiles.length} 个文件进行检查`);

let fixedFiles = 0;
allFiles.forEach(file => {
  if (findPotentialIssues(file)) {
    fixedFiles++;
  }
});

console.log(`检查完成，修复了 ${fixedFiles} 个文件`); 