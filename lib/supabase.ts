// 兼容层: 重新导出shared/infrastructure/lib/supabase的exports
// 注意: 这个文件仅用于向后兼容，新代码应该直接使用 @/shared/infrastructure/lib/supabase

import { supabase, getSupabaseClient } from '@/shared/infrastructure/lib/supabase';
export { supabase, getSupabaseClient };

// 重新导出类型
export type { User, Session } from '@supabase/supabase-js';

// 添加警告日志
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '警告: 使用的是兼容层 @/lib/supabase，' + 
    '应改为直接使用 @/shared/infrastructure/lib/supabase'
  );
} 