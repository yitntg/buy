import { supabase, STORAGE_BUCKETS } from '@/src/app/(shared)/utils/supabase/client';
import { StorageError, Bucket } from '@supabase/storage-js';

export interface AvatarOptions {
  size?: number;
  shape?: 'circle' | 'square' | 'rounded';
  backgroundColor?: string;
  style?: string;
}

export class AvatarService {
  private static AVATAR_BUCKET = 'avatars';
  private static DEFAULT_AVATAR_API = 'https://api.dicebear.com/6.x/avataaars/svg';
  
  // 添加测试方法
  static async checkStorageStatus(): Promise<{
    bucketExists: boolean;
    error?: string;
    bucketInfo?: any;
    authStatus?: any;
  }> {
    try {
      // 1. 检查认证状态
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        return {
          bucketExists: false,
          error: `认证错误: ${authError.message}`,
          authStatus: { error: authError.message }
        };
      }

      if (!session) {
        return {
          bucketExists: false,
          error: '未登录，请先登录',
          authStatus: { error: 'No session' }
        };
      }

      // 2. 检查存储桶是否存在
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        return {
          bucketExists: false,
          error: `获取存储桶列表失败: ${listError.message}`,
          authStatus: { session: session.user.email }
        };
      }
      
      const avatarBucket = buckets?.find((bucket: Bucket) => bucket.name === this.AVATAR_BUCKET);
      
      if (!avatarBucket) {
        return {
          bucketExists: false,
          error: '头像存储桶不存在',
          authStatus: { session: session.user.email },
          bucketInfo: { availableBuckets: buckets.map((b: Bucket) => b.name) }
        };
      }
      
      // 3. 尝试获取存储桶信息
      const { data: bucketInfo, error: bucketError } = await supabase.storage
        .getBucket(this.AVATAR_BUCKET);
      
      if (bucketError) {
        return {
          bucketExists: true,
          error: `获取存储桶信息失败: ${bucketError.message}`,
          authStatus: { session: session.user.email },
          bucketInfo: avatarBucket
        };
      }
      
      return {
        bucketExists: true,
        bucketInfo,
        authStatus: { session: session.user.email }
      };
    } catch (error) {
      console.error('检查存储状态失败:', error);
      return {
        bucketExists: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
  
  // 生成默认头像URL
  static getDefaultAvatarUrl(username: string, options: AvatarOptions = {}): string {
    const seed = username || Date.now().toString();
    const size = options.size || 128;
    return `${this.DEFAULT_AVATAR_API}?seed=${seed}&size=${size}`;
  }
  
  // 上传头像到Supabase存储
  static async uploadAvatar(file: File): Promise<string> {
    try {
      // 检查认证状态
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) {
        throw new Error('认证错误，请重新登录');
      }
      if (!session) {
        throw new Error('请先登录');
      }

      // 验证文件
      this.validateFile(file);
      
      // 生成文件名
      const fileName = this.generateUniqueFileName(file);
      
      // 上传文件
      const { data, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .upload(fileName, file, {
          upsert: true
        });
      
      if (uploadError) {
        console.error('上传错误:', uploadError);
        if (uploadError.message.includes('Unauthorized')) {
          throw new Error('没有权限上传文件，请确保已登录');
        }
        throw new Error('头像上传失败，请稍后重试');
      }
      
      // 获取公开URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('头像上传失败:', error);
      throw error;
    }
  }
  
  // 从URL或base64创建File对象
  static async createFileFromUrl(url: string, fileName = 'avatar.jpg'): Promise<File> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error('从URL创建文件失败:', error);
      throw error;
    }
  }
  
  // 验证文件
  private static validateFile(file: File): void {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('不支持的文件类型，请上传JPG、PNG、WEBP或GIF图片');
    }
    
    if (file.size > maxSize) {
      throw new Error('文件大小超过限制，最大支持2MB');
    }
  }
  
  // 生成唯一文件名
  private static generateUniqueFileName(file: File): string {
    const fileExt = file.name.split('.').pop() || 'jpg';
    return `${Date.now()}.${fileExt}`;
  }
} 
