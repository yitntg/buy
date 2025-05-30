// 预构建脚本 - 在构建之前运行
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

console.log('开始执行预构建脚本...');

// 确保critters被安装
try {
  console.log('检查critters是否已安装...');
  require.resolve('critters');
  console.log('critters已安装');
} catch (e) {
  console.log('安装critters...');
  childProcess.execSync('npm install critters', { stdio: 'inherit' });
}

// 创建临时的配置文件来覆盖某些属性
console.log('创建临时构建配置...');

// 如果不存在node_modules/.cache目录，则创建
const cacheDir = path.join(process.cwd(), 'node_modules', '.cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// 确保src/app/admin目录中的所有页面都具有强制动态渲染配置
console.log('检查admin页面的动态渲染配置...');

const adminDir = path.join(process.cwd(), 'src', 'app', 'admin');
if (fs.existsSync(adminDir)) {
  function addDynamicExportToFiles(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        addDynamicExportToFiles(fullPath);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
        console.log(`处理文件：${fullPath}`);
        
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // 检查文件是否已经有'use client'指令
        if (!content.includes("'use client'")) {
          content = "'use client';\n\n" + content;
          console.log(`已添加'use client'指令到：${fullPath}`);
        }
        
        // 确保文件有dynamic导出和其他必要的导出
        const dynamicExports = [
          "export const dynamic = 'force-dynamic';",
          "export const fetchCache = 'force-no-store';",
          "export const revalidate = 0;"
        ];
        
        let missingExports = [];
        for (const exp of dynamicExports) {
          if (!content.includes(exp)) {
            missingExports.push(exp);
          }
        }
        
        if (missingExports.length > 0) {
          // 在'use client'后添加缺少的导出
          const exportBlock = missingExports.join('\n');
          if (content.includes("'use client';")) {
            content = content.replace("'use client';", `'use client';\n\n// 强制动态渲染\n${exportBlock}`);
          } else {
            content = `${exportBlock}\n\n${content}`;
          }
          
          console.log(`已添加动态渲染导出到：${fullPath}`);
        }
        
        // 确保该文件导入revalidate-config.js
        if (!content.includes("import '../revalidate-config.js'") && !content.includes("import '../../revalidate-config.js'") && !content.includes("import './revalidate-config.js'")) {
          // 计算相对路径
          let relativePath = path.relative(path.dirname(fullPath), adminDir).replace(/\\/g, '/');
          if (!relativePath) relativePath = '.';
          
          // 在'use client'后添加导入
          content = content.replace("'use client';", `'use client';\n\n// 导入动态配置\nimport '${relativePath}/revalidate-config.js';`);
          console.log(`已添加revalidate-config.js导入到：${fullPath}`);
        }
        
        fs.writeFileSync(fullPath, content);
      }
    }
  }
  
  addDynamicExportToFiles(adminDir);
}

console.log('预构建脚本执行完成'); 