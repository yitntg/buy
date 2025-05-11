'use client';

// 导入动态配置
import '../../revalidate-config.js';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function SQLExecutorPage() {
  const [isClient, setIsClient] = useState(false);
  const [sql, setSql] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 确保在客户端渲染时调用useAuth
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 使用条件渲染
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">SQL执行器</h1>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 w-32 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }
  
  // 以下代码只会在客户端执行
  const { user } = useAuth();
  
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