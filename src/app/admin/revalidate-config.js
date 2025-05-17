'use client'

// 导入管理员配置
import { adminPageConfig } from '../config';

// 管理员页面动态配置
// 确保这些页面始终动态渲染，不缓存

// 导出管理员配置的各个属性
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0; 