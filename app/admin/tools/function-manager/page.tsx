'use client';

// 移除对配置文件的导入，统一从layout继承配置
// import '../../revalidate-config.js';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/shared/infrastructure/lib/supabase';

// 移除本地revalidate配置，依赖layout中的全局设置
// export const dynamic = 'force-dynamic'
// export const fetchCache = 'force-no-store'
// export const revalidate = 0;

export default function FunctionManagerPage() {
  const [isClient, setIsClient] = useState(false);
  const [functionName, setFunctionName] = useState('');
  const [functionBody, setFunctionBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 确保在客户端渲染时调用useAuth
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 使用条件渲染
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">数据库函数管理器</h1>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 w-32 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }
  
  // 以下代码只会在客户端执行
  const { user } = useAuth();
  
  const createFunction = async () => {
    if (!functionName.trim() || !functionBody.trim()) {
      setError('函数名称和函数体都不能为空');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 构建创建函数的SQL
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION ${functionName}()
        RETURNS VOID AS $$
        BEGIN
          ${functionBody}
        END;
        $$ LANGUAGE plpgsql;
      `;
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql: createFunctionSQL 
      });
      
      if (error) throw error;
      
      setSuccess(`函数 ${functionName} 创建成功！`);
    } catch (err: any) {
      console.error('创建函数失败:', err);
      setError(`创建函数失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">数据库函数管理器</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">创建新函数</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">函数名称</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="my_new_function"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">函数体 (SQL/PLPGSQL)</label>
          <textarea
            className="w-full p-4 border rounded-md bg-gray-50 font-mono text-sm h-48"
            placeholder="-- 在此输入函数体内容"
            value={functionBody}
            onChange={(e) => setFunctionBody(e.target.value)}
          />
        </div>
        
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={createFunction}
          disabled={loading}
        >
          {loading ? '创建中...' : '创建函数'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded mb-4">
          {success}
        </div>
      )}
    </div>
  );
} 