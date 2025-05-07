import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 检查产品存储桶是否存在
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('获取存储桶列表失败:', listError);
      return NextResponse.json(
        { error: '获取存储桶列表失败', details: listError.message },
        { status: 500 }
      );
    }
    
    const productsBucketExists = buckets.some(bucket => bucket.name === 'products');
    
    // 如果不存在，创建产品存储桶
    if (!productsBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('products', {
        public: true,  // 允许公开访问
        fileSizeLimit: 5 * 1024 * 1024,  // 限制为 5MB
      });
      
      if (createError) {
        console.error('创建产品存储桶失败:', createError);
        return NextResponse.json(
          { error: '创建产品存储桶失败', details: createError.message },
          { status: 500 }
        );
      }
      
      console.log('成功创建产品存储桶');
    } else {
      console.log('产品存储桶已存在');
    }
    
    // 检查并设置存储桶的公开访问权限
    if (productsBucketExists) {
      // 获取当前存储桶策略
      const { data: policy, error: policyError } = await supabase.storage.getBucket('products');
      
      if (policyError) {
        console.error('获取存储桶策略失败:', policyError);
      } else if (!policy.public) {
        // 如果不是公开的，更新为公开
        const { error: updateError } = await supabase.storage.updateBucket('products', {
          public: true,
        });
        
        if (updateError) {
          console.error('更新存储桶权限失败:', updateError);
        } else {
          console.log('已将产品存储桶设置为公开访问');
        }
      }
    }
    
    return NextResponse.json({ success: true, message: '存储已初始化' });
  } catch (error) {
    console.error('初始化存储时出错:', error);
    return NextResponse.json(
      { error: '初始化存储时出错', details: (error as Error).message },
      { status: 500 }
    );
  }
} 