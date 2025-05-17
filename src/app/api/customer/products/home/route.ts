import { NextRequest, NextResponse } from 'next/server';
import '../../../config';

/**
 * 获取首页产品API
 */
export async function GET(request: NextRequest) {
  try {
    // 模拟首页产品数据，避免自引用API
    const homeProducts = {
      featured: [
        // 精选产品数据
      ],
      newArrivals: [
        // 新品数据
      ],
      bestSellers: [
        // 畅销品数据
      ],
      onSale: [
        // 促销品数据
      ]
    };
    
    return NextResponse.json(homeProducts);
  } catch (error) {
    console.error('获取首页产品时出错:', error);
    return NextResponse.json(
      { error: '获取首页产品失败' },
      { status: 500 }
    );
  }
} 