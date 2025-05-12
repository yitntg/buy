import { supabase } from './lib/supabase';
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
      // 获取当前会话
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`认证错误: ${sessionError.message}`);
      }
      
      if (!session?.user) {
        throw new Error('请先登录后再上传头像');
      }
      
      // 验证文件
      if (!file.type.startsWith('image/')) {
        throw new Error('请上传图片文件');
      }
      
      // 生成文件名
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
      
      // 上传文件
      const { data, error: uploadError } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .upload(fileName, file, {
          upsert: true
        });
      
      if (uploadError) {
        console.error('上传错误:', uploadError);
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          throw new Error('存储桶未找到，请联系管理员');
        }
        throw uploadError;
      }
      
      // 获取公开URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.AVATAR_BUCKET)
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
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('不支持的文件类型，请上传JPG、PNG、WEBP或GIF图片');
    }
    
    if (file.size > maxSize) {
      throw new Error('文件大小超过限制，最大支持5MB');
    }
  }
  
  // 生成唯一文件名
  private static generateUniqueFileName(file: File, userId: string): string {
    const fileExt = file.name.split('.').pop() || 'jpg';
    return `avatar-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  }
} 