// 修复用户记录脚本
// 用法: node scripts/fix-user-record.js <email>
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// 获取命令行参数
const EMAIL = process.argv[2];

if (!EMAIL) {
  console.log('使用方法: node scripts/fix-user-record.js <email>');
  console.log('例如: node scripts/fix-user-record.js test@example.com');
  process.exit(1);
}

// 检查环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('错误: 未找到 Supabase 环境变量');
  console.error('请确保您的 .env.local 文件中包含以下变量:');
  console.error('NEXT_PUBLIC_SUPABASE_URL');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// 创建客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log(`开始修复用户 ${EMAIL} 的记录...`);

  try {
    // 1. 获取用户的auth信息
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('获取用户列表失败:', authError.message);
      // 尝试替代方案 - 通过密码重置请求检查用户
      console.log('尝试通过密码重置API检查用户...');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(EMAIL);
      
      if (resetError) {
        console.error('用户检查失败:', resetError.message);
        process.exit(1);
      } else {
        console.log('用户存在，但无法获取详细信息');
        console.log('请使用密码重置邮件设置新密码');
      }
      return;
    }

    // 查找指定邮箱的用户
    const user = authData.users?.find(u => u.email === EMAIL);
    
    if (!user) {
      console.error(`找不到邮箱为 ${EMAIL} 的用户`);
      console.log('请先注册此用户');
      process.exit(1);
    }

    console.log('找到用户:', { id: user.id, email: user.email });

    // 2. 检查users表中是否有记录
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id);

    if (userError) {
      console.error('查询users表失败:', userError.message);
      process.exit(1);
    }

    if (userData && userData.length > 0) {
      console.log('users表中已存在此用户记录:', userData.length, '条');
      console.log('用户记录:', JSON.stringify(userData[0], null, 2).replace(/"email":"[^@]*@[^"]*"/, '"email":"***@***"'));
    } else {
      console.log('在users表中未找到此用户记录，正在创建...');

      // 3. 创建用户记录
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email.split('@')[0],
          firstName: user.user_metadata?.firstName || '',
          lastName: user.user_metadata?.lastName || '',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('创建用户记录失败:', insertError.message);
        
        // 检查是否是缺少必要字段或表结构不匹配的问题
        if (insertError.message.includes('column') || insertError.message.includes('field')) {
          console.log('\n可能是表结构问题，尝试使用最小字段集...');
          
          const { error: retryError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              role: 'user',
              created_at: new Date().toISOString()
            });
            
          if (retryError) {
            console.error('再次尝试失败:', retryError.message);
          } else {
            console.log('成功创建基本用户记录！');
            console.log('请尝试登录，如果问题解决，您可以稍后补充其他用户信息。');
          }
        }
      } else {
        console.log('成功创建用户记录！');
        console.log('请尝试重新登录。');
      }
    }
  } catch (error) {
    console.error('执行脚本时发生错误:', error.message);
  }
}

main(); 