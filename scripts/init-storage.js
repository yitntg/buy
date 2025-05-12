const { execSync } = require('child_process');

/**
 * 执行存储初始化
 * 此脚本可以在项目启动前运行，确保存储桶已正确配置
 */
async function main() {
  try {
    console.log('正在初始化存储服务...');
    
    // 在开发模式下，通过调用API初始化存储
    // 在生产环境中可能会通过其他方式初始化
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const initUrl = `${baseUrl}/api/storage/init`;
    
    // 使用curl或fetch调用初始化API
    try {
      if (process.platform === 'win32') {
        // Windows环境
        execSync(`curl -s ${initUrl}`);
      } else {
        // Linux/macOS环境
        execSync(`curl -s ${initUrl}`);
      }
      console.log('存储初始化API调用成功');
    } catch (error) {
      console.error('存储初始化API调用失败，可能需要手动初始化:', error);
    }
    
    console.log('存储初始化完成');
  } catch (error) {
    console.error('存储初始化失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main().catch(error => {
  console.error('存储初始化脚本运行失败:', error);
  process.exit(1);
}); 