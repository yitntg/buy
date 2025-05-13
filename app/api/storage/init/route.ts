import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  PRODUCTS: 'products'
};

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

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: '缺少Supabase配置' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 创建头像存储桶
    const { error: avatarsError } = await supabase
      .storage
      .createBucket(STORAGE_BUCKETS.AVATARS, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });

    if (avatarsError && !avatarsError.message.includes('already exists')) {
      console.error('创建头像存储桶失败:', avatarsError);
      return NextResponse.json({ error: '头像存储桶创建失败', details: avatarsError }, { status: 500 });
    }

    // 应用头像存储桶策略
    const { error: policyError } = await supabase.rpc('apply_storage_policy', {
      bucket_name: STORAGE_BUCKETS.AVATARS,
      policy: AVATAR_POLICY
    });

    if (policyError) {
      console.error('应用头像存储桶策略失败:', policyError);
      return NextResponse.json({ error: '头像存储桶策略应用失败', details: policyError }, { status: 500 });
    }

    // 创建产品图片存储桶
    const { error: productsError } = await supabase
      .storage
      .createBucket(STORAGE_BUCKETS.PRODUCTS, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 5, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });

    if (productsError && !productsError.message.includes('already exists')) {
      console.error('创建产品存储桶失败:', productsError);
      return NextResponse.json({ error: '产品存储桶创建失败', details: productsError }, { status: 500 });
    }

    // 应用产品存储桶策略
    const { error: productPolicyError } = await supabase.rpc('apply_storage_policy', {
      bucket_name: STORAGE_BUCKETS.PRODUCTS,
      policy: PRODUCT_POLICY
    });

    if (productPolicyError) {
      console.error('应用产品存储桶策略失败:', productPolicyError);
      return NextResponse.json({ error: '产品存储桶策略应用失败', details: productPolicyError }, { status: 500 });
    }

    return NextResponse.json({ 
      message: '存储桶初始化成功',
      buckets: [STORAGE_BUCKETS.AVATARS, STORAGE_BUCKETS.PRODUCTS]
    });

  } catch (error) {
    console.error('存储初始化失败:', error);
    return NextResponse.json({ error: '存储初始化失败', details: error }, { status: 500 });
  }
} 