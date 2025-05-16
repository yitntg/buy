// 引入客户端产品API相关函数
import { getHomeProducts } from '../../../../src/customer/backend/api/products';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }
  
  try {
    const result = await getHomeProducts();
    
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    
    return res.status(200).json({
      featured: result.featured || [],
      newArrivals: result.newArrivals || []
    });
  } catch (err) {
    console.error('首页产品API错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 