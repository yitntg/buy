import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/src/app/(shared)/infrastructure/supabase/server';

export async function middleware(request: NextRequest) {
  // 创建服务器端Supabase客户端
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  // 获取当前会话
  const { data: { session } } = await supabase.auth.getSession();
  
  // 检查用户是否已登录
  if (!session) {
    // 用户未登录，重定向到登录页
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // 获取用户角色
  const { data: userRoles, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();
  
  // 检查用户是否有管理员权限
  if (error || !userRoles || userRoles.role !== 'admin') {
    // 用户无管理员权限，重定向到首页
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // 用户有管理员权限，允许访问
  return NextResponse.next();
}

// 指定此中间件应用于admin路径下的所有页面
export const config = {
  matcher: '/admin/:path*',
}; 