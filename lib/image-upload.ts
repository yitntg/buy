import { supabase } from './supabase';

/**
 * 将图片上传到 Supabase Storage
 * @param file 要上传的文件
 * @param bucket 存储桶名称，默认为 'products'
 * @returns 上传成功后的图片 URL
 */
export async function uploadImageToSupabase(
  file: File, 
  bucket: string = 'products'
): Promise<string> {
  try {
    // 确保文件名唯一，避免覆盖
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    
    // 检查存储桶是否存在，不存在则创建
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucket, {
        public: true, // 允许公开访问
        fileSizeLimit: 5 * 1024 * 1024, // 5MB 限制
      });
    }
    
    // 上传文件
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('上传图片错误:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('上传成功但未返回数据');
    }
    
    // 获取公开访问URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return publicUrl;
  } catch (error) {
    console.error('上传图片失败:', error);
    throw error;
  }
} 