import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .lt('stock', 10);

    if (error) {
      console.error('获取库存不足商品失败:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('获取库存不足商品失败:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 