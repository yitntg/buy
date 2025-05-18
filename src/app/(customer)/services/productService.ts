import { Product } from '@/src/app/(shared)/types/product';
import { API_PATHS } from '@/src/app/api/config';

/**
 * 获取首页产品数据
 * @returns 首页产品数据，包括精选商品和新品上市
 */
export async function getHomePageProducts(): Promise<{
  featured: Product[];
  newArrivals: Product[];
}> {
  try {
    // 实际项目中应该调用API
    // const response = await fetch(API_PATHS.CUSTOMER.PRODUCTS_HOME);
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.error || '获取产品数据失败');
    // }
    // return await response.json();
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟数据
    return {
      featured: [
        {
          id: 1,
          name: '高端无线蓝牙耳机',
          price: 999,
          description: '高音质无线蓝牙耳机，主动降噪，长达30小时续航',
          primary_image: 'https://via.placeholder.com/300x300?text=Headphones',
          category: '电子产品',
          category_id: '1',
          inventory: 100,
          created_at: '2023-10-01'
        },
        {
          id: 2,
          name: '智能手表',
          price: 1599,
          description: '多功能智能手表，心率监测，GPS定位，5ATM防水',
          primary_image: 'https://via.placeholder.com/300x300?text=Watch',
          category: '电子产品',
          category_id: '1',
          inventory: 50,
          created_at: '2023-10-05'
        },
        {
          id: 3,
          name: '便携式移动电源',
          price: 199,
          description: '20000mAh大容量，支持快充，轻薄便携',
          primary_image: 'https://via.placeholder.com/300x300?text=PowerBank',
          category: '电子产品',
          category_id: '1',
          inventory: 200,
          created_at: '2023-10-10'
        },
        {
          id: 4, 
          name: '智能家居摄像头',
          price: 299,
          description: '高清夜视，双向通话，移动侦测报警',
          primary_image: 'https://via.placeholder.com/300x300?text=Camera',
          category: '电子产品',
          category_id: '1',
          inventory: 80,
          created_at: '2023-10-15'
        }
      ],
      newArrivals: [
        {
          id: 5,
          name: '时尚休闲背包',
          price: 399,
          description: '大容量休闲背包，防水面料，适合旅行和日常使用',
          primary_image: 'https://via.placeholder.com/300x300?text=Backpack',
          category: '服饰鞋包',
          category_id: '3',
          inventory: 60,
          created_at: '2023-11-01'
        },
        {
          id: 6,
          name: '便携咖啡机',
          price: 599,
          description: '随身携带的咖啡机，随时随地享受一杯新鲜咖啡',
          primary_image: 'https://via.placeholder.com/300x300?text=CoffeeMaker',
          category: '家居日用',
          category_id: '2',
          inventory: 30,
          created_at: '2023-11-05'
        },
        {
          id: 7,
          name: '多功能护肤套装',
          price: 699,
          description: '精选护肤成分，全面呵护肌肤',
          primary_image: 'https://via.placeholder.com/300x300?text=SkinCare',
          category: '美妆个护',
          category_id: '4',
          inventory: 40,
          created_at: '2023-11-10'
        }
      ]
    };
  } catch (error) {
    console.error('获取首页产品数据失败:', error);
    throw new Error('获取首页产品数据失败');
  }
} 