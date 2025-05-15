// 引入管理员订单API处理函数
import { handleOrdersRequest } from '../../../src/admin/backend/api/orders';

export default function handler(req, res) {
  return handleOrdersRequest(req, res);
} 