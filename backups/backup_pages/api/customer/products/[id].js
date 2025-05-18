// 引入客户端产品详情API处理函数
import { getProductById } from '../../../../src/customer/backend/api/products';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }
  
  try {
    const { data, error } = await getProductById(id);
    
    if (error) {
      return res.status(500).json({ error });
    }
    
    if (!data) {
      return res.status(404).json({ error: '产品不存在' });
    }
    
    return res.status(200).json(data);
  } catch (err) {
    console.error('产品详情API错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 