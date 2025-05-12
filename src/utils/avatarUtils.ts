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
      console.log('开始上传头像...', new Date().toISOString());
      
      // 验证文件类型和大小
      this.validateFile(file);
      console.log('文件验证通过');
      
      // 生成唯一文件名
      const fileName = this.generateUniqueFileName(file);
      
      console.log(`准备上传头像文件: ${fileName}, 大小: ${file.size} 字节, 类型: ${file.type}`);
      
      // 上传到Supabase
      const uploadResult = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadResult.error) {
        console.error('头像上传失败:', uploadResult.error);
        throw uploadResult.error;
      }
      
      if (!uploadResult.data) {
        throw new Error('上传成功但没有返回数据');
      }
      
      // 获取公开URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.AVATAR_BUCKET)
        .getPublicUrl(uploadResult.data.path);
      
      console.log('头像上传成功，URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('头像上传失败:', error);
      
      // 如果失败，返回默认头像
      const defaultAvatar = this.getDefaultAvatarUrl(Date.now().toString());
      console.log('使用默认头像:', defaultAvatar);
      return defaultAvatar;
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
} 