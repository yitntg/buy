// 引入客户端产品API处理函数
import { handleProductsRequest } from '../../../src/app/customer/backend/api/products';

export default function handler(req, res) {
  return handleProductsRequest(req, res);
} 