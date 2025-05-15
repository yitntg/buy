/**
 * Supabase 客户端和工具的统一入口点
 * 应用代码应该从这里导入Supabase相关功能
 */

// 导出客户端创建函数
export { createClient as createBrowserClient } from './client';
export { createClient as createServerClient } from './server';

// 导出认证服务
export { supabase, SupabaseAuthService, checkSupabaseConfig } from './auth';

// 为方便使用，创建默认导出的客户端实例
import { createClient } from './client';
const supabaseClient = createClient();
export default supabaseClient; 