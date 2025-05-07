import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const results = {
    tests: [] as Array<{
      name: string;
      success: boolean;
      error?: string;
      data?: any;
    }>,
    summary: {
      total: 0,
      success: 0,
      failed: 0
    }
  };

  // 测试函数
  async function runTest(name: string, testFn: () => Promise<any>) {
    results.summary.total++;
    try {
      const data = await testFn();
      results.tests.push({
        name,
        success: true,
        data
      });
      results.summary.success++;
      console.log(`✅ 测试通过: ${name}`);
      return true;
    } catch (error) {
      results.tests.push({
        name,
        success: false,
        error: (error as Error).message
      });
      results.summary.failed++;
      console.error(`❌ 测试失败: ${name}`, error);
      return false;
    }
  }

  // 测试 1: 检查 Storage API 基本连接
  await runTest('检查 Storage API 连接', async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('test-bucket-name');
      // 我们期望这里可能会404，因为bucket可能不存在，但应该不会有权限错误
      if (error && error.message.includes('Unauthorized')) {
        throw new Error(`权限错误: ${error.message}`);
      }
      return { message: '连接成功，无权限问题' };
    } catch (err) {
      if ((err as Error).message.includes('404')) {
        return { message: '连接成功，bucket不存在 (404 错误是预期的)' };
      }
      throw err;
    }
  });

  // 测试 2: 列出所有存储桶
  await runTest('列出所有存储桶', async () => {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    return { buckets: data.map(b => ({ name: b.name, public: b.public })) };
  });

  // 测试 3: 创建测试存储桶
  const testBucketName = `test-bucket-${Date.now()}`;
  const canCreateBucket = await runTest('创建测试存储桶', async () => {
    const { data, error } = await supabase.storage.createBucket(testBucketName, {
      public: true
    });
    if (error) throw error;
    return { name: testBucketName };
  });

  // 如果能够创建存储桶，继续测试上传文件
  if (canCreateBucket) {
    // 测试 4: 上传测试文件
    await runTest('上传测试文件', async () => {
      // 创建一个简单的文本文件作为测试
      const testData = 'Hello, this is a test file';
      const testBuffer = new TextEncoder().encode(testData);
      const testBlob = new Blob([testBuffer], { type: 'text/plain' });
      
      const { data, error } = await supabase.storage
        .from(testBucketName)
        .upload('test-file.txt', testBlob, {
          contentType: 'text/plain',
          cacheControl: '3600'
        });
      
      if (error) throw error;
      return { path: data?.path };
    });

    // 测试 5: 获取文件公开URL
    await runTest('获取文件公开URL', async () => {
      const { data } = supabase.storage
        .from(testBucketName)
        .getPublicUrl('test-file.txt');
      
      return { publicUrl: data.publicUrl };
    });

    // 测试 6: 获取测试桶策略
    await runTest('获取存储桶策略', async () => {
      const { data, error } = await supabase.storage
        .getBucket(testBucketName);
      
      if (error) throw error;
      return { 
        name: data?.name, 
        public: data?.public,
        createdAt: data?.created_at
      };
    });

    // 测试 7: 列出存储桶中的文件
    await runTest('列出存储桶中的文件', async () => {
      const { data, error } = await supabase.storage
        .from(testBucketName)
        .list();
      
      if (error) throw error;
      return { files: data };
    });

    // 测试 8: 清理 - 删除测试文件
    await runTest('删除测试文件', async () => {
      const { data, error } = await supabase.storage
        .from(testBucketName)
        .remove(['test-file.txt']);
      
      if (error) throw error;
      return { deleted: data };
    });

    // 测试 9: 清理 - 删除测试存储桶
    await runTest('删除测试存储桶', async () => {
      const { error } = await supabase.storage.deleteBucket(testBucketName);
      if (error) throw error;
      return { message: '存储桶删除成功' };
    });
  }

  // 测试 10: 尝试获取RLS策略信息
  await runTest('获取RLS策略信息', async () => {
    // 这个不是标准API，但可以尝试查询系统表获取RLS信息
    try {
      const { data, error } = await supabase
        .from('_rls_policies')
        .select('*')
        .limit(10);
      
      if (error) {
        return { 
          message: '无法直接访问RLS策略表，这通常是正常的安全限制', 
          error: error.message 
        };
      }
      
      return { policies: data };
    } catch (error) {
      return { 
        message: '无法访问RLS策略表，这是预期的行为', 
        error: (error as Error).message 
      };
    }
  });

  // 返回所有测试结果
  return NextResponse.json(results);
} 