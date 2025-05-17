import { NextResponse } from 'next/server';
import { createClient } from '@/src/app/(shared)/infrastructure/supabase/server';

// 设置revalidate时间
export const revalidate = 60;

// GET - 获取产品详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // 创建Supabase客户端
    const supabase = createClient();
    
    // 查询产品
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // 记录不存在
        return NextResponse.json(
          { error: '产品不存在' },
          { status: 404 }
        );
      }
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取产品详情时出错:', error);
    return NextResponse.json(
      { error: '获取产品详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新产品
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const body = await request.json();
    
    // 创建Supabase客户端
    const supabase = createClient();
    
    // 更新产品
    const { data, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('更新产品时出错:', error);
    return NextResponse.json(
      { error: '更新产品失败' },
      { status: 500 }
    );
  }
}

// PATCH - 部分更新产品
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 与PUT方法相同的实现
  return PUT(request, { params });
}

// DELETE - 删除产品
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // 创建Supabase客户端
    const supabase = createClient();
    
    // 删除产品
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除产品时出错:', error);
    return NextResponse.json(
      { error: '删除产品失败' },
      { status: 500 }
    );
  }
} 