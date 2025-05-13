const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initStorageBuckets() {
  try {
    console.log('初始化存储桶...');

    // 头像存储桶
    const { data: avatarBucket, error: avatarBucketError } = await supabase.storage.createBucket('avatars', {
      public: false,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      fileSizeLimit: 1024 * 1024 * 5 // 5MB
    });

    if (avatarBucketError) {
      console.warn('头像存储桶已存在或创建失败:', avatarBucketError);
    } else {
      console.log('头像存储桶已就绪');
    }

    // 应用头像存储桶策略
    await supabase.rpc('apply_storage_policy', {
      bucket_name: 'avatars',
      policy: JSON.stringify({
        type: 'rls',
        action: 'select',
        role: 'authenticated',
        condition: 'auth.uid() = owner'
      })
    });

    // 产品存储桶
    const { data: productBucket, error: productBucketError } = await supabase.storage.createBucket('products', {
      public: false,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 1024 * 1024 * 10 // 10MB
    });

    if (productBucketError) {
      console.warn('产品存储桶已存在或创建失败:', productBucketError);
    } else {
      console.log('产品存储桶已就绪');
    }

    // 应用产品存储桶策略
    await supabase.rpc('apply_storage_policy', {
      bucket_name: 'products',
      policy: JSON.stringify({
        type: 'rls',
        action: 'select',
        role: 'authenticated',
        condition: 'auth.role() IN (\'admin\', \'seller\')'
      })
    });

    console.log('存储桶初始化完成');
  } catch (error) {
    console.error('存储桶初始化失败:', error);
    process.exit(1);
  }
}

initStorageBuckets(); 