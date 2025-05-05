'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// 数据库初始化SQL语句
const createProductsTable = `
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category INTEGER NOT NULL,
  inventory INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`

const createCategoriesTable = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`

const createOrdersTable = `
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  shipping_address TEXT,
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`

const createOrderItemsTable = `
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`

const createReviewsTable = `
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`

const insertSampleCategories = `
INSERT INTO categories (id, name, description)
VALUES
  (1, '电子产品', '各类电子产品、数码设备'),
  (2, '家居家具', '家具、家居用品'),
  (3, '服装服饰', '各类衣物、服装、鞋帽'),
  (4, '美妆个护', '美妆、个人护理用品'),
  (5, '食品饮料', '零食、饮品、生鲜食品'),
  (6, '运动户外', '运动器材、户外装备');`

const insertSampleProducts = `
INSERT INTO products (name, description, price, image, category, inventory, rating, reviews)
VALUES
  ('智能手表', '高级智能手表，支持多种运动模式和健康监测功能', 1299, 'https://picsum.photos/id/1/500/500', 1, 50, 4.8, 120),
  ('蓝牙耳机', '无线蓝牙耳机，支持降噪功能，续航时间长', 399, 'https://picsum.photos/id/3/500/500', 1, 200, 4.5, 85),
  ('真皮沙发', '进口真皮沙发，舒适耐用，适合家庭使用', 4999, 'https://picsum.photos/id/20/500/500', 2, 10, 4.9, 32),
  ('纯棉T恤', '100%纯棉材质，透气舒适，多色可选', 99, 'https://picsum.photos/id/25/500/500', 3, 500, 4.3, 210),
  ('保湿面霜', '深层保湿面霜，适合干性肌肤，改善肌肤干燥问题', 159, 'https://picsum.photos/id/30/500/500', 4, 80, 4.6, 65),
  ('有机坚果礼盒', '精选有机坚果礼盒，包含多种坚果，营养丰富', 169, 'https://picsum.photos/id/40/500/500', 5, 100, 4.7, 48),
  ('瑜伽垫', '专业瑜伽垫，防滑耐磨，厚度适中，适合各种瑜伽动作', 128, 'https://picsum.photos/id/50/500/500', 6, 60, 4.4, 72);`

export default function DatabaseSetupPage() {
  const router = useRouter()
  const [status, setStatus] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [shouldResetTables, setShouldResetTables] = useState(false)
  const [shouldAddSampleData, setShouldAddSampleData] = useState(true)
  const [isSqlFunctionReady, setIsSqlFunctionReady] = useState(false)
  
  // 在组件加载时检查SQL函数是否可用
  useEffect(() => {
    checkSqlFunctionStatus()
  }, [])
  
  // 检查SQL函数是否已创建
  const checkSqlFunctionStatus = async () => {
    try {
      await supabase.rpc('exec_sql', { sql: 'SELECT 1' })
      setIsSqlFunctionReady(true)
    } catch (error: any) {
      if (error.message && error.message.includes('function') && error.message.includes('does not exist')) {
        setIsSqlFunctionReady(false)
        setMessage('请先创建exec_sql函数，才能使用本工具。')
      }
    }
  }
  
  // 处理导航到SQL函数管理页面
  const handleNavigateToFunctionManager = () => {
    router.push('/admin/tools/function-manager')
  }
  
  // 检查表是否存在
  const checkTable = async (tableName: string) => {
    try {
      const { error } = await supabase.from(tableName).select('id').limit(1)
      
      if (error && error.code === '42P01') { // 表不存在错误
        return false
      }
      
      return true
    } catch (error) {
      console.error(`检查表 ${tableName} 时出错:`, error)
      return false
    }
  }
  
  // 删除表
  const dropTable = async (tableName: string) => {
    try {
      setStatus(prev => ({ ...prev, [`drop_${tableName}`]: '删除中...' }))
      
      // 使用exec_sql函数删除表
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `DROP TABLE IF EXISTS ${tableName} CASCADE` 
      })
      
      if (error) {
        throw error
      }
      
      setStatus(prev => ({ ...prev, [`drop_${tableName}`]: '删除成功' }))
      return true
    } catch (error: any) {
      console.error(`删除表 ${tableName} 失败:`, error)
      setStatus(prev => ({ ...prev, [`drop_${tableName}`]: `删除失败: ${error.message}` }))
      return false
    }
  }
  
  // 创建表
  const createTable = async (createStatement: string, tableName: string) => {
    try {
      setStatus(prev => ({ ...prev, [`create_${tableName}`]: '创建中...' }))
      
      // 使用exec_sql函数创建表
      const { error } = await supabase.rpc('exec_sql', { 
        sql: createStatement 
      })
      
      if (error) {
        throw error
      }
      
      setStatus(prev => ({ ...prev, [`create_${tableName}`]: '创建成功' }))
      return true
    } catch (error: any) {
      console.error(`创建表 ${tableName} 失败:`, error)
      setStatus(prev => ({ ...prev, [`create_${tableName}`]: `创建失败: ${error.message}` }))
      return false
    }
  }
  
  // 插入示例数据
  const insertSampleData = async (insertStatement: string, tableName: string) => {
    try {
      setStatus(prev => ({ ...prev, [`insert_${tableName}`]: '插入中...' }))
      
      // 检查表是否为空
      const { data, error: checkError } = await supabase.from(tableName).select('id').limit(1)
      
      if (checkError) {
        throw checkError
      }
      
      if (data && data.length > 0) {
        setStatus(prev => ({ ...prev, [`insert_${tableName}`]: '表已有数据，跳过' }))
        return true
      }
      
      // 使用exec_sql函数插入数据
      const { error } = await supabase.rpc('exec_sql', { 
        sql: insertStatement 
      })
      
      if (error) {
        throw error
      }
      
      setStatus(prev => ({ ...prev, [`insert_${tableName}`]: '插入成功' }))
      return true
    } catch (error: any) {
      console.error(`插入示例数据到 ${tableName} 失败:`, error)
      setStatus(prev => ({ ...prev, [`insert_${tableName}`]: `插入失败: ${error.message}` }))
      return false
    }
  }
  
  // 初始化数据库
  const initializeDatabase = async () => {
    if (!isSqlFunctionReady) {
      setMessage('请先创建exec_sql函数！请前往 SQL函数管理 工具进行创建。')
      return
    }
    
    setIsLoading(true)
    setMessage('开始初始化数据库...')
    
    try {
      // 如果选择重置表，先删除现有表
      if (shouldResetTables) {
        setMessage('正在删除现有表...')
        await dropTable('order_items')
        await dropTable('orders')
        await dropTable('reviews')
        await dropTable('products')
        await dropTable('categories')
        // users表关联到auth.users，需谨慎删除
        await dropTable('users')
      }
      
      // 创建表结构
      setMessage('正在创建表结构...')
      
      const createTableOrder = [
        { name: 'categories', sql: createCategoriesTable },
        { name: 'products', sql: createProductsTable },
        { name: 'users', sql: createUsersTable },
        { name: 'orders', sql: createOrdersTable },
        { name: 'order_items', sql: createOrderItemsTable },
        { name: 'reviews', sql: createReviewsTable }
      ]
      
      for (const table of createTableOrder) {
        const exists = await checkTable(table.name)
        if (!exists) {
          await createTable(table.sql, table.name)
        } else {
          setStatus(prev => ({ ...prev, [`create_${table.name}`]: '表已存在' }))
        }
      }
      
      // 添加示例数据
      if (shouldAddSampleData) {
        setMessage('正在添加示例数据...')
        await insertSampleData(insertSampleCategories, 'categories')
        await insertSampleData(insertSampleProducts, 'products')
      }
      
      setMessage('数据库初始化完成！')
    } catch (error: any) {
      console.error('初始化数据库失败:', error)
      setMessage(`初始化数据库失败: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 状态卡片组件
  const StatusCard = ({ title, status }: { title: string, status: string }) => {
    let statusColor = 'text-gray-600'
    
    if (status.includes('成功')) {
      statusColor = 'text-green-600'
    } else if (status.includes('失败')) {
      statusColor = 'text-red-600'
    } else if (status.includes('表已存在') || status.includes('表已有数据')) {
      statusColor = 'text-blue-600'
    } else if (status.includes('中...')) {
      statusColor = 'text-yellow-600'
    }
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-medium mb-2">{title}</h3>
        <div className={`${statusColor}`}>{status}</div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/tools" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回工具列表
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">数据库初始化工具</h1>
      <p className="mb-6 text-gray-600">
        此工具用于创建应用程序所需的数据库表结构和示例数据。
      </p>
      
      {!isSqlFunctionReady && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>注意：</strong> 在使用此工具前，请先创建SQL执行函数(exec_sql)。
              </p>
              <div className="mt-4">
                <button
                  onClick={handleNavigateToFunctionManager}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  前往创建SQL函数
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">初始化设置</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="addSampleData"
                checked={shouldAddSampleData}
                onChange={(e) => setShouldAddSampleData(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="addSampleData" className="ml-2 text-gray-700">
                添加示例数据（包括商品和分类）
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="resetTables"
                checked={shouldResetTables}
                onChange={(e) => setShouldResetTables(e.target.checked)}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="resetTables" className="ml-2 text-red-600 font-medium">
                重置所有表（危险操作）
              </label>
            </div>
            
            {shouldResetTables && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md">
                警告：此操作将删除所有现有表和数据，并重新创建。此操作不可撤销！
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-600 hover:underline flex items-center"
            >
              {showAdvanced ? '隐藏高级选项' : '显示数据库表结构'}
              <svg 
                className={`w-4 h-4 ml-1 transform ${showAdvanced ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button
              onClick={initializeDatabase}
              disabled={isLoading || !isSqlFunctionReady}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? '初始化中...' : '初始化数据库'}
            </button>
          </div>
        </div>
      </div>
      
      {showAdvanced && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">数据库表结构</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">产品表 (products)</h3>
                <pre className="text-xs overflow-auto max-h-40">
                  {createProductsTable}
                </pre>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">分类表 (categories)</h3>
                <pre className="text-xs overflow-auto max-h-40">
                  {createCategoriesTable}
                </pre>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">用户表 (users)</h3>
                <pre className="text-xs overflow-auto max-h-40">
                  {createUsersTable}
                </pre>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">订单表 (orders)</h3>
                <pre className="text-xs overflow-auto max-h-40">
                  {createOrdersTable}
                </pre>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">订单项表 (order_items)</h3>
                <pre className="text-xs overflow-auto max-h-40">
                  {createOrderItemsTable}
                </pre>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">评论表 (reviews)</h3>
                <pre className="text-xs overflow-auto max-h-40">
                  {createReviewsTable}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {message && (
        <div className={`p-4 rounded-md mb-6 ${message.includes('失败') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {message}
        </div>
      )}
      
      {Object.keys(status).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">初始化状态</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 删除表状态 */}
            {shouldResetTables && (
              <>
                {Object.entries(status)
                  .filter(([key]) => key.startsWith('drop_'))
                  .map(([key, value]) => (
                    <StatusCard 
                      key={key}
                      title={`删除${key.replace('drop_', '')}表`}
                      status={value}
                    />
                  ))
                }
              </>
            )}
            
            {/* 创建表状态 */}
            {Object.entries(status)
              .filter(([key]) => key.startsWith('create_'))
              .map(([key, value]) => (
                <StatusCard 
                  key={key}
                  title={`创建${key.replace('create_', '')}表`}
                  status={value}
                />
              ))
            }
            
            {/* 插入数据状态 */}
            {shouldAddSampleData && (
              <>
                {Object.entries(status)
                  .filter(([key]) => key.startsWith('insert_'))
                  .map(([key, value]) => (
                    <StatusCard 
                      key={key}
                      title={`添加示例${key.replace('insert_', '')}`}
                      status={value}
                    />
                  ))
                }
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 