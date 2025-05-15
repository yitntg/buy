import { NextResponse } from 'next/server';

// 模拟产品数据
function getMockProducts(count, prefix = '') {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}mock-product-${i}`,
    name: `Mock Product ${i}`,
    description: 'This is a mock product for display purposes.',
    price: 99.99,
    images: ['/images/placeholder.jpg'],
    category: `mock-category-${i % 3}`,
    stock: 100,
    created_at: new Date().toISOString(),
  }));
}

export default function handler(req, res) {
  try {
    // 在实际项目中，这里会从数据库或其他服务获取数据
    const featuredProducts = getMockProducts(4, 'featured-');
    const newArrivals = getMockProducts(6, 'new-');
    
    res.status(200).json({
      featured: featuredProducts,
      newArrivals: newArrivals
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: '获取产品失败' });
  }
} 