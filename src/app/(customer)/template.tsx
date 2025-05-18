// 客户区域模板 - 服务器组件

import { ReactNode } from 'react';
import { dynamic, fetchCache, revalidate } from './config';

// 导出服务器配置
export { dynamic, fetchCache, revalidate };

// 客户区域模板组件 - 不添加任何额外UI
export default function CustomerTemplate({ children }: { children: ReactNode }) {
  return children;
} 