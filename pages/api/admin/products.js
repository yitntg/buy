// 引入管理员产品API处理函数
import { handleProductsRequest } from '../../../src/admin/backend/api/products';

export default function handler(req, res) {
  return handleProductsRequest(req, res);
} 