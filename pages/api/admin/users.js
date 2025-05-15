// 引入管理员用户API处理函数
import { handleUsersRequest } from '../../../src/admin/backend/api/users';

export default function handler(req, res) {
  return handleUsersRequest(req, res);
} 