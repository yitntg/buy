// 引入客户端分类API处理函数
import { handleCategoriesRequest } from '../../../src/customer/backend/api/categories';

export default function handler(req, res) {
  return handleCategoriesRequest(req, res);
} 