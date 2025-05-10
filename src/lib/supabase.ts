import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function backupDatabase() {
  try {
    // 获取所有表的数据
    const tables = ['products', 'categories', 'reviews', 'orders'];
    const backup: Record<string, any[]> = {};

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      backup[table] = data;
    }

    return backup;
  } catch (error) {
    console.error('数据库备份失败:', error);
    throw error;
  }
}

export async function restoreDatabase(backup: Record<string, any[]>) {
  try {
    for (const [table, data] of Object.entries(backup)) {
      // 清空表
      const { error: deleteError } = await supabase.from(table).delete().neq('id', 0);
      if (deleteError) throw deleteError;

      // 恢复数据
      if (data.length > 0) {
        const { error: insertError } = await supabase.from(table).insert(data);
        if (insertError) throw insertError;
      }
    }
  } catch (error) {
    console.error('数据库恢复失败:', error);
    throw error;
  }
}

export async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('数据库连接检查失败:', error);
    return false;
  }
} 