// 引入客户端用户API处理函数
import { handleUserRequest } from '../../../src/customer/backend/api/users';

export default function handler(req, res) {
  return handleUserRequest(req, res);
} 