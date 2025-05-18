// 检查Supabase认证的脚本
// 运行方式: node scripts/check-auth.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const EMAIL = process.argv[2]; // 通过命令行参数传递邮箱
const PASSWORD = process.argv[3]; // 通过命令行参数传递密码

// 如果命令行没提供邮箱和密码，给出提示
if (!EMAIL || !PASSWORD) {
  console.log('使用方法: node scripts/check-auth.js 邮箱 密码');
  console.log('例如: node scripts/check-auth.js test@example.com password123');
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
  console.log('开始检查Supabase认证...');
  console.log(`Supabase URL: ${supabaseUrl.substring(0, 15)}...`);
  console.log(`测试用户: ${EMAIL}`);
  
  try {
    // 1. 尝试登录
    console.log('\n1. 尝试登录:');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD
    });
    
    if (signInError) {
      console.error('  登录失败:', signInError.message);
      
      // 如果是凭据无效的问题
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('\n  检查用户是否存在:');
        
        // 检查auth.users表中是否有该用户
        try {
          // 因为无法直接查询auth.users表，我们尝试重置密码
          // 如果用户存在，这会成功；如果不存在，会返回错误
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(EMAIL);
          
          if (resetError) {
            console.error('  用户检查失败:', resetError.message);
            if (resetError.message.includes('not found')) {
              console.log('  用户不存在，需要先注册');
            }
          } else {
            console.log('  用户存在，但密码不正确');
            console.log('  已发送密码重置邮件到', EMAIL);
            console.log('  尝试创建用户记录...');
            
            // 2. 检查用户记录
            console.log('\n2. 检查users表中的用户记录:');
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('email', EMAIL);
            
            if (userError) {
              console.error('  查询users表失败:', userError.message);
            } else if (!userData || userData.length === 0) {
              console.log('  未在users表中找到用户记录');
              console.log('  请确保在auth.users中的用户在users表中也有记录');
            } else {
              console.log('  找到users表中的用户记录:', userData.length, '条');
              console.log('  用户记录:', JSON.stringify(userData[0], null, 2).replace(/"email":"[^@]*@[^"]*"/, '"email":"***@***"'));
            }
          }
        } catch (err) {
          console.error('  检查用户存在性时出错:', err.message);
        }
      }
    } else {
      console.log('  登录成功!');
      console.log('  用户信息:', {
        id: signInData.user.id,
        email: signInData.user.email,
        role: signInData.user.user_metadata?.role || '未指定'
      });
      
      // 3. 获取用户详情
      console.log('\n3. 获取用户详情:');
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signInData.user.id);
      
      if (profileError) {
        console.error('  获取用户详情失败:', profileError.message);
      } else if (!profileData || profileData.length === 0) {
        console.log('  未找到用户详情，这可能是导致问题的原因');
        
        // 尝试创建用户记录
        console.log('  尝试创建用户记录...');
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: signInData.user.id,
            email: signInData.user.email,
            first_name: signInData.user.user_metadata?.firstName || null,
            last_name: signInData.user.user_metadata?.lastName || null,
            username: signInData.user.user_metadata?.username || null,
            role: 'user',
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('  创建用户记录失败:', insertError.message);
        } else {
          console.log('  成功创建用户记录！请尝试再次登录');
        }
      } else {
        console.log('  用户详情:', JSON.stringify(profileData[0], null, 2).replace(/"email":"[^@]*@[^"]*"/, '"email":"***@***"'));
      }
      
      // 登出
      await supabase.auth.signOut();
    }
    
  } catch (error) {
    console.error('执行测试时发生错误:', error.message);
  }
  
  console.log('\n检查完成!');
}

main(); 