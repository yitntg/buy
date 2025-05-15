const fs = require('fs');
const path = require('path');

// 递归获取目录中的所有文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 检查 app 和 src/app 目录下是否存在同名文件
function checkConflicts() {
  // 检查 app 目录是否存在
  if (!fs.existsSync('app')) {
    console.log('app 目录不存在');
    return;
  }
  
  // 检查 src/app 目录是否存在
  if (!fs.existsSync('src/app')) {
    console.log('src/app 目录不存在');
    return;
  }
  
  // 获取 app 目录下的所有文件
  const appFiles = getAllFiles('app');
  
  // 获取 src/app 目录下的所有文件
  const srcAppFiles = getAllFiles('src/app');
  
  // 将文件路径转换为相对路径以便比较
  const appRelativePaths = appFiles.map(file => path.relative('app', file));
  const srcAppRelativePaths = srcAppFiles.map(file => path.relative('src/app', file));
  
  // 查找重复的文件
  const duplicateFiles = [];
  
  appRelativePaths.forEach(appFile => {
    if (srcAppRelativePaths.includes(appFile)) {
      duplicateFiles.push(appFile);
    }
  });
  
  // 输出结果
  if (duplicateFiles.length > 0) {
    console.log('发现以下冲突文件:');
    duplicateFiles.forEach(file => {
      console.log(`- ${file}`);
    });
    console.log(`\n总计: ${duplicateFiles.length} 个冲突文件`);
  } else {
    console.log('未发现冲突文件');
  }
}

// 执行检查
checkConflicts(); 