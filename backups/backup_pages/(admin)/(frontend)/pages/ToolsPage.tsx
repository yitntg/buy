import React, { useState } from 'react';
import { Tabs } from 'antd';
import { DatabaseOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons';

// 假设我们有一个管理员布局组件
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = '管理工具' }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

// 数据库工具组件
const DatabaseTool: React.FC = () => {
  const [sql, setSql] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecute = async () => {
    if (!sql.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // 这里应该是实际的SQL执行，现在用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (sql.toLowerCase().includes('select')) {
        setResult({
          columns: ['id', 'name', 'created_at'],
          rows: [
            { id: 1, name: '示例数据1', created_at: new Date().toISOString() },
            { id: 2, name: '示例数据2', created_at: new Date().toISOString() },
            { id: 3, name: '示例数据3', created_at: new Date().toISOString() },
          ]
        });
      } else {
        setResult({ message: 'SQL执行成功，影响了3行数据。' });
      }
    } catch (err: any) {
      setError(err.message || '执行SQL时发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">SQL执行工具</h2>
      <div className="mb-4">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="输入SQL查询语句..."
          className="w-full h-40 p-3 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-6">
        <button
          onClick={handleExecute}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? '执行中...' : '执行查询'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">查询结果</h3>
          {result.message ? (
            <div className="bg-green-50 text-green-600 p-4 rounded-md">
              {result.message}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {result.columns.map((column: string) => (
                      <th key={column} className="py-2 px-4 text-left border border-gray-200">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {result.columns.map((column: string) => (
                        <td key={column} className="py-2 px-4 border border-gray-200">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 系统配置工具组件
const SystemConfigTool: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">系统配置</h2>
      <p className="text-gray-600 mb-4">此功能用于调整系统配置参数，需要管理员权限。</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">缓存设置</h3>
          <div className="mb-3">
            <label className="block text-sm mb-1">缓存过期时间（秒）</label>
            <input type="number" defaultValue={3600} className="w-full p-2 border rounded-md" />
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1">最大缓存大小 (MB)</label>
            <input type="number" defaultValue={100} className="w-full p-2 border rounded-md" />
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            保存设置
          </button>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">备份设置</h3>
          <div className="mb-3">
            <label className="block text-sm mb-1">自动备份频率</label>
            <select className="w-full p-2 border rounded-md">
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1">保留备份数量</label>
            <input type="number" defaultValue={10} className="w-full p-2 border rounded-md" />
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

// 其他工具组件
const MiscTools: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">实用工具</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">日志查看器</h3>
          <p className="text-sm text-gray-600 mb-3">查看系统日志，支持筛选和导出</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            打开日志查看器
          </button>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">性能监控</h3>
          <p className="text-sm text-gray-600 mb-3">监控系统性能指标，包括CPU、内存使用率等</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            查看性能监控
          </button>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">清理缓存</h3>
          <p className="text-sm text-gray-600 mb-3">清理系统缓存数据，释放存储空间</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            清理系统缓存
          </button>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">数据导出</h3>
          <p className="text-sm text-gray-600 mb-3">导出系统数据，支持多种格式</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            导出数据
          </button>
        </div>
      </div>
    </div>
  );
};

// 主工具页面
const ToolsPage: React.FC = () => {
  return (
    <AdminLayout title="管理工具中心">
      <Tabs
        defaultActiveKey="database"
        items={[
          {
            key: 'database',
            label: (
              <span>
                <DatabaseOutlined />
                数据库工具
              </span>
            ),
            children: <DatabaseTool />,
          },
          {
            key: 'system',
            label: (
              <span>
                <SettingOutlined />
                系统配置
              </span>
            ),
            children: <SystemConfigTool />,
          },
          {
            key: 'misc',
            label: (
              <span>
                <ToolOutlined />
                实用工具
              </span>
            ),
            children: <MiscTools />,
          },
        ]}
      />
    </AdminLayout>
  );
};

export default ToolsPage; 