import { supabase } from '@/src/app/(shared)/utils/supabase/client';
import { STORAGE_BUCKETS } from '@/src/app/(shared)/utils/supabase/client';

export async function initializeStorage() {
  try {
    console.log('开始初始化存储...');
    
    // 检查产品存储桶是否存在
    const { data: buckets } = await supabase.storage.listBuckets();
    const productsBucket = buckets?.find(b => b.name === STORAGE_BUCKETS.PRODUCTS);
    
    console.log('产品存储桶是否存在:', !!productsBucket);
    
    if (!productsBucket) {
      console.log('尝试创建产品存储桶...');
      
      // 创建存储桶
      const { data: bucket, error: createError } = await supabase.storage.createBucket(STORAGE_BUCKETS.PRODUCTS, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });

      if (createError) {
        console.error('创建产品存储桶失败:', createError);
        throw createError;
      }

      // 设置RLS策略
      const { error: policyError } = await supabase.rpc('set_storage_policy', {
        bucket_name: STORAGE_BUCKETS.PRODUCTS,
        policy: `
          CREATE POLICY "Public Access"
          ON storage.objects
          FOR SELECT
          USING (bucket_id = '${STORAGE_BUCKETS.PRODUCTS}');
          
          CREATE POLICY "Authenticated Users Can Upload"
          ON storage.objects
          FOR INSERT
          WITH CHECK (
            bucket_id = '${STORAGE_BUCKETS.PRODUCTS}' AND
            auth.role() = 'authenticated'
          );
        `
      });

      if (policyError) {
        console.error('设置存储策略失败:', policyError);
        throw policyError;
      }

      console.log('产品存储桶创建成功');
    }

    return true;
  } catch (error) {
    console.error('初始化存储失败:', error);
    return false;
  }
}

export async function uploadProductImage(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.PRODUCTS)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.PRODUCTS)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('上传产品图片失败:', error);
    throw error;
  }
} 
