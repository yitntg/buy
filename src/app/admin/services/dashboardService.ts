import { OrderStatus } from '@/src/app/(shared)/types/order';

// 定义仪表盘数据类型
export interface DashboardStats {
  orders: {
    total: number;
    trend: number;
  };
  revenue: {
    total: number;
    trend: number;
  };
  users: {
    total: number;
    trend: number;
  };
  products: {
    total: number;
    trend: number;
  };
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

// 最近订单类型
export interface RecentOrder {
  id: string;
  date: string;
  customer: string;
  status: OrderStatus;
  total: number;
}

// 热门商品类型
export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

// 时间范围类型
export type TimeRange = 'day' | 'week' | 'month';

/**
 * 获取仪表盘统计数据
 * @param timeRange 时间范围
 */
export async function getDashboardStats(timeRange: TimeRange = 'week'): Promise<DashboardStats> {
  try {
    // 实际项目中，这里应该从API获取数据
    // 例如: const response = await fetch(`/api/admin/dashboard?timeRange=${timeRange}`);
    // const data = await response.json();
    // return data;
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 生成随机趋势数据
    const generateTrend = () => {
      const value = Math.floor(Math.random() * 25) + 1;
      return Math.random() > 0.3 ? value : -value;
    };
    
    // 模拟数据
    return {
      orders: {
        total: 142,
        trend: generateTrend()
      },
      revenue: {
        total: 24680,
        trend: generateTrend()
      },
      users: {
        total: 327,
        trend: generateTrend()
      },
      products: {
        total: 86,
        trend: generateTrend()
      },
      recentOrders: [
        {
          id: 'ORD123456',
          date: '2023-12-12',
          customer: '张三',
          status: OrderStatus.DELIVERED,
          total: 399,
        },
        {
          id: 'ORD123457',
          date: '2023-12-11',
          customer: '李四',
          status: OrderStatus.PAID,
          total: 1299,
        },
        {
          id: 'ORD123458',
          date: '2023-12-10',
          customer: '王五',
          status: OrderStatus.DELIVERED,
          total: 599,
        },
        {
          id: 'ORD123459',
          date: '2023-12-09',
          customer: '赵六',
          status: OrderStatus.CANCELLED,
          total: 799,
        },
        {
          id: 'ORD123460',
          date: '2023-12-08',
          customer: '钱七',
          status: OrderStatus.DELIVERED,
          total: 1999,
        }
      ],
      topProducts: [
        {
          id: '1',
          name: '高品质蓝牙耳机',
          sales: 42,
          revenue: 12558,
        },
        {
          id: '3',
          name: '轻薄笔记本电脑',
          sales: 18,
          revenue: 89982,
        },
        {
          id: '2',
          name: '智能手表',
          sales: 35,
          revenue: 20965,
        },
        {
          id: '6',
          name: '多功能厨房料理机',
          sales: 29,
          revenue: 17371,
        },
        {
          id: '4',
          name: '专业摄影相机',
          sales: 15,
          revenue: 49485,
        }
      ]
    };
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    throw new Error('获取仪表盘数据失败');
  }
} 