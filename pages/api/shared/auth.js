// 引入共享认证API处理函数
import { handleAuthRequest } from '../../../src/shared/api/auth';

export default function handler(req, res) {
  return handleAuthRequest(req, res);
} 