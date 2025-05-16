// 引入管理员产品API处理函数
import { getProductById, updateProduct, deleteProduct } from '../../../../src/admin/backend/api/products';

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    switch (req.method) {
      case 'GET': {
        // 获取单个产品详情
        const { data, error } = await getProductById(id);
        
        if (error) {
          return res.status(500).json({ error });
        }
        
        if (!data) {
          return res.status(404).json({ error: '产品不存在' });
        }
        
        return res.status(200).json(data);
      }
      
      case 'PUT':
      case 'PATCH': {
        // 更新产品
        const productData = req.body;
        const { data, error } = await updateProduct(id, productData);
        
        if (error) {
          return res.status(500).json({ error });
        }
        
        if (!data) {
          return res.status(404).json({ error: '产品不存在或更新失败' });
        }
        
        return res.status(200).json(data);
      }
      
      case 'DELETE': {
        // 删除产品
        const { success, error } = await deleteProduct(id);
        
        if (error) {
          return res.status(500).json({ error });
        }
        
        if (!success) {
          return res.status(404).json({ error: '产品不存在或删除失败' });
        }
        
        return res.status(200).json({ success: true, message: '产品已成功删除' });
      }
      
      default:
        return res.status(405).json({ error: '方法不允许' });
    }
  } catch (err) {
    console.error('产品详情API错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
} 