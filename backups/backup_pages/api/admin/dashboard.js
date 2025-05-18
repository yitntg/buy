// 引入管理员仪表盘API处理函数
import { handleDashboardRequest } from '../../../src/admin/backend/api/dashboard';

export default function handler(req, res) {
  return handleDashboardRequest(req, res);
} 