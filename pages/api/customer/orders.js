// 引入客户端订单API处理函数
import { handleOrdersRequest } from '../../../src/customer/backend/api/orders';

export default function handler(req, res) {
  return handleOrdersRequest(req, res);
} 