'use client';

// 移除对配置文件的导入，统一从layout继承配置
// import '../../revalidate-config.js';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/shared/infrastructure/lib/supabase';
import { useRouter } from 'next/navigation';

// 移除本地revalidate配置，依赖layout中的全局设置
// export const dynamic = 'force-dynamic'
// export const fetchCache = 'force-no-store'
// export const revalidate = 0;

export default function SQLExecutorPage() {
  const [isClient, setIsClient] = useState(false);
  const [sql, setSql] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    setIsClient(true);
    
    // 检查用户权限
    if (isAuthenticated && user && user.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);
  
  // 如果在服务器端或者是客户端但未认证，显示加载中
  if (!isClient || (isClient && !isAuthenticated)) {
    return <div className="container mx-auto p-8">加载中...</div>;
  }
  
  // 如果用户不是管理员，不显示内容
  if (isClient && isAuthenticated && user?.role !== 'admin') {
    return <div className="container mx-auto p-8">您没有权限访问此页面</div>;
  }
  
  const executeSQL = async () => {
    if (!sql.trim()) {
      setError('请输入SQL语句');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: sql });
      
      if (error) throw error;
      
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const queryResult = await supabase.rpc('query_sql', { sql: sql });
        
        if (queryResult.error) {
          setError(`获取查询结果失败: ${queryResult.error.message}`);
        } else {
          setResults(queryResult.data || []);
        }
      } else {
        setResults({ message: 'SQL语句执行成功' });
      }
    } catch (err: any) {
      console.error('执行SQL失败:', err);
      setError(`执行SQL失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">SQL执行器</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          <strong>注意：</strong> 这个工具需要在Supabase中配置 exec_sql 和 query_sql 函数才能正常工作。
          请先在Supabase的SQL编辑器中运行以下SQL创建这些函数：
        </p>
        <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`-- 创建执行SQL的函数
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'SQL执行错误: %', SQLERRM;
END;
$$;

-- 创建查询SQL的函数
CREATE OR REPLACE FUNCTION query_sql(sql text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE 'SELECT to_jsonb(array_agg(row_to_json(t))) FROM (' || sql || ') t' INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION '执行查询失败: %', SQLERRM;
END;
$$;

-- 授予执行权限
GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
GRANT EXECUTE ON FUNCTION query_sql TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql TO anon;
GRANT EXECUTE ON FUNCTION query_sql TO anon;`}
        </pre>
      </div>
      
      <div className="mb-6">
        <textarea
          className="w-full p-4 border rounded-md bg-gray-50 font-mono text-sm h-48"
          placeholder="输入SQL语句..."
          value={sql}
          onChange={(e) => setSql(e.target.value)}
        />
      </div>
      
      <div className="mb-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={executeSQL}
          disabled={loading}
        >
          {loading ? '执行中...' : '执行SQL'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {results && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">执行结果</h2>
          
          {Array.isArray(results) ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    {results.length > 0 && Object.keys(results[0]).map(key => (
                      <th key={key} className="p-2 border text-left">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((value: any, j) => (
                        <td key={j} className="p-2 border">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 bg-green-50 text-green-700 rounded">
              {results.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 