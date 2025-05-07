import { supabase } from './supabase';

// 备用默认图片URL，如果上传失败可以使用
const DEFAULT_IMAGE_URL = 'https://picsum.photos/id/1/500/500';

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
    console.log(`开始上传图片到Supabase: 文件名=${file.name}, 大小=${file.size}字节, 类型=${file.type}`);
    
    // 确保文件名唯一，避免覆盖
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    
    // 检查Supabase配置
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzjhupjfojvlbthnsgqt.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log(`Supabase配置检查: URL=${supabaseUrl}, 密钥存在=${!!supabaseKey}`);
    
    if (!supabaseKey) {
      console.error('缺少Supabase API密钥，这可能导致权限错误');
      throw new Error('Supabase API密钥未配置');
    }
    
    try {
      // 尝试创建存储桶（如果不存在）
      try {
        // 检查存储桶是否存在
        console.log(`检查存储桶是否存在: ${bucket}`);
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error('获取存储桶列表失败:', listError);
          if (listError.message.includes('Unauthorized') || listError.message.includes('权限')) {
            throw new Error(`Supabase权限错误: ${listError.message}`);
          }
          // 继续尝试创建，即使获取失败
        } else {
          const bucketExists = buckets?.some(b => b.name === bucket);
          console.log(`存储桶"${bucket}"存在状态: ${bucketExists}`);
          
          if (!bucketExists) {
            // 尝试创建存储桶
            console.log(`尝试创建存储桶: ${bucket}`);
            const { error: createError } = await supabase.storage.createBucket(bucket, {
              public: true, // 允许公开访问
              fileSizeLimit: 5 * 1024 * 1024, // 5MB 限制
            });
            
            if (createError) {
              console.error('创建存储桶失败:', createError);
              if (createError.message.includes('Unauthorized') || createError.message.includes('权限')) {
                throw new Error(`创建存储桶权限错误: ${createError.message}`);
              }
              // 尝试继续上传，即使创建存储桶失败
            } else {
              console.log(`成功创建存储桶: ${bucket}`);
            }
          }
        }
      } catch (bucketError: any) {
        if (bucketError.message.includes('权限错误') || bucketError.message.includes('Unauthorized')) {
          console.error('存储桶权限错误:', bucketError);
          throw bucketError; // 重新抛出权限错误，不继续尝试上传
        }
        console.error('处理存储桶时出错，但将尝试继续上传:', bucketError);
        // 尝试继续上传，即使检查/创建存储桶失败
      }
      
      // 上传文件
      console.log(`开始上传文件: ${fileName}`);
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // 即使存在同名文件也覆盖
        });
        
      if (error) {
        console.error('上传图片错误:', error);
        // 检查是否为权限错误
        if (error.message.includes('Unauthorized') || error.message.includes('permission') || error.message.includes('权限')) {
          throw new Error(`上传权限错误: ${error.message}`);
        }
        // 返回默认图片
        console.log('使用默认图片URL作为回退');
        return DEFAULT_IMAGE_URL;
      }
      
      if (!data) {
        console.error('上传成功但未返回数据');
        // 返回默认图片
        console.log('使用默认图片URL作为回退');
        return DEFAULT_IMAGE_URL;
      }
      
      // 获取公开访问URL
      try {
        console.log(`获取已上传文件的公开URL: ${data.path}`);
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);
        
        console.log('成功获取上传图片URL:', publicUrl);
        return publicUrl;
      } catch (urlError) {
        console.error('获取公开URL失败:', urlError);
        
        // 尝试构建URL
        try {
          // 构建一个基于当前Supabase实例的URL
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;
          console.log('手动构建公开URL:', publicUrl);
          return publicUrl;
        } catch (buildError) {
          console.error('构建URL失败:', buildError);
          // 返回默认图片
          console.log('使用默认图片URL作为回退');
          return DEFAULT_IMAGE_URL;
        }
      }
    } catch (uploadError: any) {
      if (uploadError.message.includes('权限错误') || uploadError.message.includes('Unauthorized')) {
        console.error('Supabase权限错误:', uploadError);
        throw uploadError; // 重新抛出权限错误
      }
      console.error('执行上传操作失败:', uploadError);
      // 返回默认图片
      console.log('使用默认图片URL作为回退');
      return DEFAULT_IMAGE_URL;
    }
  } catch (error: any) {
    if (error.message.includes('权限错误') || error.message.includes('Unauthorized')) {
      console.error('Supabase访问被拒绝:', error);
      throw error; // 向上抛出权限错误以便调用者处理
    }
    console.error('上传图片失败:', error);
    // 返回默认图片
    console.log('使用默认图片URL作为回退');
    return DEFAULT_IMAGE_URL;
  }
} 