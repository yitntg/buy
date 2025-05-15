import { createClient } from '@supabase/supabase-js';
import { AvatarService } from '@/utils/avatarUtils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateUsers() {
  try {
    // 获取所有现有用户
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*');

    if (fetchError) {
      console.error('获取用户失败:', fetchError);
      return;
    }

    // 迁移每个用户
    for (const user of users) {
      const updateData: any = {
        username: user.email.split('@')[0],
        first_name: user.name || '',
        last_name: '',
        avatar_url: AvatarService.getDefaultAvatarUrl(user.email),
        join_date: user.created_at || new Date().toISOString(),
        role: user.role || 'user'
      };

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        console.error(`更新用户 ${user.id} 失败:`, updateError);
      }
    }

    console.log('用户迁移完成');
  } catch (error) {
    console.error('迁移过程发生错误:', error);
  }
}

migrateUsers(); 