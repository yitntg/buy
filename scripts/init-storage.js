const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('错误: 缺少Supabase配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  PRODUCTS: 'products'
};

// SQL策略
const AVATAR_POLICY = `
  CREATE POLICY IF NOT EXISTS "允许所有用户上传头像" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'avatars'
  );
  
  CREATE POLICY IF NOT EXISTS "允许所有用户查看头像" ON storage.objects
  FOR SELECT TO public USING (
    bucket_id = 'avatars'
  );
  
  CREATE POLICY IF NOT EXISTS "允许用户更新自己的头像" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'avatars'
  );
  
  CREATE POLICY IF NOT EXISTS "允许用户删除自己的头像" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'avatars'
  );
`;

const PRODUCT_POLICY = `
  CREATE POLICY IF NOT EXISTS "允许认证用户上传产品图片" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'products'
  );
  
  CREATE POLICY IF NOT EXISTS "允许所有人查看产品图片" ON storage.objects
  FOR SELECT TO public USING (
    bucket_id = 'products'
  );
`;

/**
 * 执行存储初始化
 * 此脚本可以在项目启动前运行，确保存储桶已正确配置
 */
async function initStorage() {
  try {
    // 创建头像存储桶
    const { data: avatarsBucket, error: avatarsError } = await supabase
      .storage
      .createBucket(STORAGE_BUCKETS.AVATARS, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });

    if (avatarsError && !avatarsError.message.includes('already exists')) {
      console.error('创建头像存储桶失败:', avatarsError);
    } else {
      console.log('头像存储桶已就绪');
      
      // 直接执行策略SQL
      const { error: policyError } = await supabase.rpc('apply_storage_policy', {
        bucket_name: STORAGE_BUCKETS.AVATARS,
        policy: AVATAR_POLICY.replace(/\n/g, ' ').replace(/\s+/g, ' ')
      });
      if (policyError) {
        console.error('应用头像存储桶策略失败:', policyError);
      } else {
        console.log('头像存储桶策略已应用');
      }
    }

    // 创建产品图片存储桶
    const { data: productsBucket, error: productsError } = await supabase
      .storage
      .createBucket(STORAGE_BUCKETS.PRODUCTS, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 5, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });

    if (productsError && !productsError.message.includes('already exists')) {
      console.error('创建产品存储桶失败:', productsError);
    } else {
      console.log('产品存储桶已就绪');
      
      // 直接执行策略SQL
      const { error: productPolicyError } = await supabase.rpc('apply_storage_policy', {
        bucket_name: STORAGE_BUCKETS.PRODUCTS,
        policy: PRODUCT_POLICY.replace(/\n/g, ' ').replace(/\s+/g, ' ')
      });
      if (productPolicyError) {
        console.error('应用产品存储桶策略失败:', productPolicyError);
      } else {
        console.log('产品存储桶策略已应用');
      }
    }

  } catch (error) {
    console.error('初始化存储失败:', error);
    process.exit(1);
  }
}

// 执行主函数
initStorage().catch(error => {
  console.error('存储初始化脚本运行失败:', error);
  process.exit(1);
}); 