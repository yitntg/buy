// 修复CustomerLayout引用问题脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const readFileAsync = fs.promises.readFile;
const writeFileAsync = fs.promises.writeFile;

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 客户端页面目录
const customerDir = path.join(__dirname, '../app/(customer)');

// 处理已知需要修复的文件路径
const knownFiles = [
  path.join(customerDir, 'terms/page.tsx'),
  path.join(customerDir, 'privacy/page.tsx'),
  path.join(customerDir, 'products/page.tsx'),
  path.join(customerDir, 'products/[id]/page.tsx'),
  path.join(customerDir, 'products/[id]/ProductDetailPage.tsx'),
  path.join(customerDir, 'favorites/page.tsx'),
  path.join(customerDir, 'contact/page.tsx'),
  path.join(customerDir, 'cart/page.tsx'),
  path.join(customerDir, 'checkout/page.tsx'),
  path.join(customerDir, 'account/page.tsx'),
  path.join(customerDir, 'account/orders/[id]/page.tsx'),
  path.join(customerDir, 'account/orders/page.tsx')
];

// 处理单个文件
async function processFile(filePath) {
  try {
    console.log(`处理文件: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`! 文件不存在: ${filePath}`);
      return;
    }
    
    const content = await readFileAsync(filePath, 'utf8');
    
    // 如果文件不包含CustomerLayout，跳过
    if (!content.includes('CustomerLayout')) {
      console.log(`- 无需处理: ${filePath}`);
      return;
    }
    
    // 移除import语句
    let updatedContent = content.replace(/import\s+CustomerLayout\s+from\s+['"][^'"]+['"].*?;?/g, '');
    
    // 移除组件包裹 (处理多行和嵌套)
    updatedContent = updatedContent.replace(/<CustomerLayout[^>]*>\s*/g, '');
    updatedContent = updatedContent.replace(/\s*<\/CustomerLayout>/g, '');
    
    // 如果有修改，才写入文件
    if (content !== updatedContent) {
      await writeFileAsync(filePath, updatedContent);
      console.log(`✓ 已修复: ${filePath}`);
    } else {
      console.log(`! 无法自动修复，需要手动检查: ${filePath}`);
    }
  } catch (err) {
    console.error(`处理文件时出错: ${filePath}`, err);
  }
}

// 执行主函数
async function main() {
  console.log('开始修复CustomerLayout引用问题...');
  
  try {
    for (const filePath of knownFiles) {
      await processFile(filePath);
    }
    console.log('修复完成!');
  } catch (err) {
    console.error('修复过程中出错:', err);
    process.exit(1);
  }
}

main(); 