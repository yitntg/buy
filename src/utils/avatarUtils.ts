import { supabase } from './lib/supabase';

export interface AvatarOptions {
  size?: number;
  shape?: 'circle' | 'square' | 'rounded';
  backgroundColor?: string;
  style?: string;
}

export class AvatarService {
  private static AVATAR_BUCKET = 'avatars';
  private static DEFAULT_AVATAR_API = 'https://api.dicebear.com/6.x/avataaars/svg';
  
  // 生成默认头像URL
  static getDefaultAvatarUrl(username: string, options: AvatarOptions = {}): string {
    const seed = username || Date.now().toString();
    const size = options.size || 128;
    return `${this.DEFAULT_AVATAR_API}?seed=${seed}&size=${size}`;
  }
  
  // 上传头像到Supabase存储
  static async uploadAvatar(file: File): Promise<string> {
    try {
      // 验证文件类型和大小
      this.validateFile(file);
      
      // 生成唯一文件名
      const fileName = this.generateUniqueFileName(file);
      
      // 上传到Supabase
      const { data, error } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) throw error;
      
      // 获取公开URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.AVATAR_BUCKET)
        .getPublicUrl(data!.path);
      
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
  private static generateUniqueFileName(file: File): string {
    const fileExt = file.name.split('.').pop() || 'jpg';
    return `avatar-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  }
  
  // 初始化头像存储桶（系统启动时调用）
  static async initializeAvatarStorage(): Promise<boolean> {
    try {
      // 检查存储桶是否存在
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucket = buckets?.find(b => b.name === this.AVATAR_BUCKET);
      
      if (!avatarBucket) {
        // 创建存储桶
        const { error: createError } = await supabase.storage.createBucket(this.AVATAR_BUCKET, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        });
        
        if (createError) throw createError;
        
        // 设置存储策略
        const { error: policyError } = await supabase.rpc('set_storage_policy', {
          bucket_name: this.AVATAR_BUCKET,
          policy: `
            CREATE POLICY "Public Access"
            ON storage.objects
            FOR SELECT
            USING (bucket_id = '${this.AVATAR_BUCKET}');
            
            CREATE POLICY "Authenticated Users Can Upload"
            ON storage.objects
            FOR INSERT
            WITH CHECK (
              bucket_id = '${this.AVATAR_BUCKET}' AND
              auth.role() = 'authenticated'
            );
          `
        });
        
        if (policyError) {
          console.error('设置头像存储策略失败:', policyError);
        }
      }
      
      return true;
    } catch (error) {
      console.error('初始化头像存储失败:', error);
      return false;
    }
  }
} 