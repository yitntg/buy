const fs = require('fs');
const path = require('path');

// 要备份和删除的目录
const dirsToProcess = [
  { src: 'app', dest: 'backup/final' },
  { src: 'src/app', dest: 'backup/final/src-app' },
  { src: 'src/components', dest: 'backup/final/src-components' },
  { src: 'src/context', dest: 'backup/final/src-context' },
  { src: 'src/types', dest: 'backup/final/src-types' },
  { src: 'src/utils', dest: 'backup/final/src-utils' },
  { src: 'src/features', dest: 'backup/final/src-features' },
  { src: 'src/infrastructure', dest: 'backup/final/src-infrastructure' },
  { src: 'src/presentation', dest: 'backup/final/src-presentation' },
  { src: 'src/core', dest: 'backup/final/src-core' },
  { src: 'src/ui', dest: 'backup/final/src-ui' },
  { src: 'src/config', dest: 'backup/final/src-config' },
  { src: 'utils', dest: 'backup/final/utils' }
];

// 创建备份目录
function createBackupDir(dir) {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`创建备份目录: ${fullPath}`);
  }
}

// 递归复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`源目录不存在，跳过: ${src}`);
    return;
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      createBackupDir(destPath);
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`备份文件: ${srcPath} -> ${destPath}`);
    }
  }
}

// 递归删除目录
function removeDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`目录不存在，跳过删除: ${dir}`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      removeDir(fullPath);
    } else {
      fs.unlinkSync(fullPath);
      console.log(`删除文件: ${fullPath}`);
    }
  }
  
  fs.rmdirSync(dir);
  console.log(`删除目录: ${dir}`);
}

// 主函数
function main() {
  console.log('开始备份和删除已迁移文件...');
  
  // 创建总备份目录
  createBackupDir('backup/final');
  
  // 处理每个目录
  for (const { src, dest } of dirsToProcess) {
    console.log(`\n处理目录: ${src}`);
    
    // 创建目标备份目录
    createBackupDir(dest);
    
    // 备份文件
    copyDir(src, dest);
    
    // 删除原始目录
    removeDir(src);
  }
  
  console.log('\n备份和删除操作完成！');
}

// 执行主函数
main(); 