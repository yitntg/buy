import { supabase } from './supabase';
import { appConfig } from '../config/app.config';

export async function uploadImage(file: File): Promise<string> {
  if (!appConfig.upload.allowedTypes.includes(file.type)) {
    throw new Error('不支持的文件类型');
  }

  if (file.size > appConfig.upload.maxFileSize) {
    throw new Error('文件大小超过限制');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('public')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('public')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const path = url.split('/').pop();
  if (!path) throw new Error('无效的图片URL');

  const { error } = await supabase.storage
    .from('public')
    .remove([`images/${path}`]);

  if (error) throw error;
} 
