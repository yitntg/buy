import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/shared/types/supabase';

// 存储桶名称常量
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  PRODUCTS: 'products',
  UPLOADS: 'uploads'
};

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function getImageUrl(bucket: string, path: string): string {
  if (!path) return '';
  
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function getProductImageUrl(path: string): string {
  return getImageUrl(STORAGE_BUCKETS.PRODUCTS, path);
}

export function getAvatarUrl(path: string): string {
  return getImageUrl(STORAGE_BUCKETS.AVATARS, path);
}

export function getUploadUrl(path: string): string {
  return getImageUrl(STORAGE_BUCKETS.UPLOADS, path);
}

export default createClient; 
