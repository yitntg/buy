import { NextRequest, NextResponse } from 'next/server';
import '../../config';

// 使用常量定义不变的API基础URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// GET处理函数 - 获取仪表盘数据
export async function GET(request: NextRequest) {
  try {
    // 模拟数据，避免自引用API
    const dashboardData = {
      stats: {
        orders: { total: 142, trend: 5 },
        revenue: { total: 24680, trend: 12 },
        users: { total: 327, trend: 8 },
        products: { total: 86, trend: -3 }
      },
      recentOrders: [
        // 订单数据...
      ],
      topProducts: [
        // 产品数据...
      ]
    };
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('获取仪表盘数据时出错:', error);
    return NextResponse.json(
      { error: '获取仪表盘数据失败' },
      { status: 500 }
    );
  }
} 