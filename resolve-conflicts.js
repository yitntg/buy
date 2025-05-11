const fs = require('fs');
const path = require('path');

// 递归获取目录中的所有文件
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
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

// 确保目录存在
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 移动文件并添加force-dynamic配置
function moveAndAddDynamic(srcFile, destFile, isAdminFile) {
  // 读取源文件内容
  const content = fs.readFileSync(srcFile, 'utf8');
  
  // 检查文件是否已包含force-dynamic配置
  const hasDynamicConfig = content.includes("export const dynamic = 'force-dynamic'");
  
  // 创建目标目录
  ensureDirectoryExists(path.dirname(destFile));
  
  // 如果是admin文件且没有dynamic配置，添加它
  if (isAdminFile && !hasDynamicConfig && content.includes("'use client'")) {
    // 在'use client'之后添加动态配置
    const modifiedContent = content.replace(
      "'use client'", 
      "'use client'\n\n// 强制动态渲染\nexport const dynamic = 'force-dynamic'"
    );
    fs.writeFileSync(destFile, modifiedContent);
  } else {
    // 否则直接复制文件
    fs.copyFileSync(srcFile, destFile);
  }
  
  console.log(`已移动: ${srcFile} -> ${destFile}`);
}

// 解决冲突的主函数
function resolveConflicts() {
  // 检查目录是否存在
  const appDirExists = fs.existsSync('app');
  const srcAppDirExists = fs.existsSync('src/app');
  
  if (!appDirExists && !srcAppDirExists) {
    console.log('错误: app 和 src/app 目录都不存在');
    return;
  }
  
  // 获取所有文件
  const appFiles = appDirExists ? getAllFiles('app') : [];
  const srcAppFiles = srcAppDirExists ? getAllFiles('src/app') : [];
  
  // 将文件路径转换为相对路径
  const appRelativeFiles = appFiles.map(file => ({
    relative: path.relative('app', file),
    absolute: file
  }));
  
  const srcAppRelativeFiles = srcAppFiles.map(file => ({
    relative: path.relative('src/app', file),
    absolute: file
  }));
  
  // 创建索引以快速查找文件
  const srcAppIndex = {};
  srcAppRelativeFiles.forEach(file => {
    srcAppIndex[file.relative] = file.absolute;
  });
  
  // 处理每个app文件
  appRelativeFiles.forEach(file => {
    // 检查是否为管理员相关文件
    const isAdminFile = file.relative.startsWith('admin/');
    const isAPIFile = file.relative.startsWith('api/admin/');
    
    // 目标文件路径
    const destFile = path.join('src/app', file.relative);
    
    // 如果src/app中已存在此文件
    if (srcAppIndex[file.relative]) {
      console.log(`冲突: ${file.relative} 在两个目录中都存在`);
      
      // 比较文件内容来决定使用哪个版本
      const appContent = fs.readFileSync(file.absolute, 'utf8');
      const srcAppContent = fs.readFileSync(srcAppIndex[file.relative], 'utf8');
      
      // 这里我们优先使用app目录下的文件，因为它很可能是最新版本
      if (appContent.includes('force-dynamic') && !srcAppContent.includes('force-dynamic')) {
        moveAndAddDynamic(file.absolute, destFile, isAdminFile || isAPIFile);
      } else {
        console.log(`保留src/app版本: ${file.relative}`);
      }
    } else {
      // 如果src/app中不存在此文件，直接移动过去
      moveAndAddDynamic(file.absolute, destFile, isAdminFile || isAPIFile);
    }
  });
  
  console.log('\n冲突解决完成!');
  console.log('请运行 "node check-conflict.js" 再次检查冲突是否已全部解决');
}

// 执行函数
resolveConflicts(); 