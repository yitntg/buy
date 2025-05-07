import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('开始初始化存储...');
    
    try {
      // 检查产品存储桶是否存在
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('获取存储桶列表失败:', listError);
        // 继续尝试创建，由于列出失败不一定意味着不能创建
      }
      
      const productsBucketExists = buckets?.some(bucket => bucket.name === 'products');
      console.log('产品存储桶是否存在:', productsBucketExists);
      
      // 如果不存在，创建产品存储桶
      if (!productsBucketExists) {
        try {
          console.log('尝试创建产品存储桶...');
          const { error: createError } = await supabase.storage.createBucket('products', {
            public: true,  // 允许公开访问
            fileSizeLimit: 5 * 1024 * 1024,  // 限制为 5MB
          });
          
          if (createError) {
            console.error('创建产品存储桶失败:', createError);
            // 创建失败但继续执行，因为可能是权限问题或已存在
          } else {
            console.log('成功创建产品存储桶');
          }
        } catch (createBucketError) {
          console.error('创建产品存储桶时出错:', createBucketError);
          // 发生异常但继续执行，以允许后续流程
        }
      } else {
        console.log('产品存储桶已存在');
      }
      
      // 检查并设置存储桶的公开访问权限
      if (productsBucketExists) {
        try {
          // 获取当前存储桶策略
          const { data: policy, error: policyError } = await supabase.storage.getBucket('products');
          
          if (policyError) {
            console.error('获取存储桶策略失败:', policyError);
            // 获取策略失败但继续执行
          } else if (!policy.public) {
            try {
              // 如果不是公开的，更新为公开
              const { error: updateError } = await supabase.storage.updateBucket('products', {
                public: true,
              });
              
              if (updateError) {
                console.error('更新存储桶权限失败:', updateError);
                // 更新权限失败但继续执行
              } else {
                console.log('已将产品存储桶设置为公开访问');
              }
            } catch (updateBucketError) {
              console.error('更新存储桶权限时出错:', updateBucketError);
              // 发生异常但继续执行
            }
          } else {
            console.log('存储桶已经是公开访问');
          }
        } catch (getBucketError) {
          console.error('获取存储桶策略时出错:', getBucketError);
          // 发生异常但继续执行
        }
      }
      
      // 返回正常成功响应，即使遇到一些错误
      return NextResponse.json({ 
        success: true, 
        message: '存储初始化完成（可能有一些警告，详见服务器日志）' 
      });
    } catch (storageProcessError) {
      console.error('处理存储初始化过程中发生错误:', storageProcessError);
      return NextResponse.json({ 
        success: false, 
        message: '存储初始化过程中出错，但系统将尝试继续正常运行', 
        error: (storageProcessError as Error).message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('初始化存储时出错:', error);
    return NextResponse.json(
      { error: '初始化存储时出错', details: (error as Error).message },
      { status: 500 }
    );
  }
} 