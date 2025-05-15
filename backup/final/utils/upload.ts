import { supabase } from './supabase';

/**
 * 上传工具 - 提供各种图片上传方法
 */

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log(`Supabase配置检查: URL=${supabaseUrl}, 密钥存在=${!!supabaseKey}`);
    
    if (!supabaseKey) {
      console.error('缺少Supabase API密钥，这可能导致权限错误');
      throw new Error('Supabase API密钥未配置');
    }

    // 直接尝试上传文件，不检查存储桶状态
    try {
      console.log(`直接上传文件: ${fileName} 到 ${bucket} 存储桶`);
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // 即使存在同名文件也覆盖
        });
        
      if (error) {
        // 如果错误是因为存储桶不存在
        if (error.message.includes('Bucket not found')) {
          console.error('存储桶不存在，需要在Supabase控制台手动创建:', error);
          throw new Error(`存储桶 ${bucket} 不存在，请在Supabase控制台中创建`);
        }
        
        // 检查是否为权限错误
        if (error.message.includes('Unauthorized') || error.message.includes('permission') || error.message.includes('权限')) {
          console.error('上传图片权限错误:', error);
          throw new Error(`上传权限错误: ${error.message}`);
        }
        
        // 其他错误
        console.error('上传图片错误:', error);
        throw new Error(`上传图片失败: ${error.message}`);
      }
      
      if (!data) {
        console.error('上传成功但未返回数据');
        throw new Error('上传成功但未返回数据路径');
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
          throw new Error('无法获取上传图片的公开URL');
        }
      }
    } catch (uploadError: any) {
      if (uploadError.message.includes('存储桶') && uploadError.message.includes('不存在')) {
        throw uploadError; // 传递存储桶不存在错误
      }
      
      if (uploadError.message.includes('权限错误') || uploadError.message.includes('Unauthorized')) {
        console.error('Supabase权限错误:', uploadError);
        throw uploadError; // 重新抛出权限错误
      }
      
      console.error('执行上传操作失败:', uploadError);
      throw uploadError; // 直接抛出错误，不再返回默认图片
    }
  } catch (error: any) {
    if (error.message.includes('权限错误') || error.message.includes('Unauthorized')) {
      console.error('Supabase访问被拒绝:', error);
      throw error; // 向上抛出权限错误以便调用者处理
    }
    
    if (error.message.includes('存储桶') && error.message.includes('不存在')) {
      console.error('存储桶错误:', error);
      throw error; // 向上抛出存储桶错误
    }
    
    console.error('上传图片失败:', error);
    throw error; // 直接抛出错误，不再返回默认图片
  }
}

/**
 * 将图片上传到本地服务器
 * @param file 要上传的文件
 * @returns 上传成功后的图片 URL
 */
export async function uploadImageToLocalServer(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('上传图片到本地服务器失败:', errorData);
      throw new Error(`上传失败: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.url) {
      console.error('上传响应缺少必要字段:', data);
      throw new Error('上传成功但返回数据无效');
    }
    
    console.log('成功上传图片到本地服务器:', data.url);
    return data.url;
  } catch (error) {
    console.error('上传图片到本地服务器时出错:', error);
    throw error;
  }
} 