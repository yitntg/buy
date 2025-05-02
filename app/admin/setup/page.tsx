'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

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

const insertSampleCategories = `
INSERT INTO categories (id, name, description)
VALUES
  (1, '电子产品', '各类电子产品、数码设备'),
  (2, '家居家具', '家具、家居用品'),
  (3, '服装服饰', '各类衣物、服装、鞋帽'),
  (4, '美妆个护', '美妆、个人护理用品'),
  (5, '食品饮料', '零食、饮品、生鲜食品'),
  (6, '运动户外', '运动器材、户外装备');`

export default function AdminSetupPage() {
  const [status, setStatus] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // 执行单个SQL命令
  async function executeSQL(name: string, sql: string) {
    setStatus(prev => ({ ...prev, [name]: '执行中...' }))
    try {
      // 使用Supabase的RPC函数执行SQL
      // 注意：这需要在Supabase中启用RPC函数，或者使用REST API
      // 这里采用直接使用数据库操作的方式
      if (name === 'createProductsTable') {
        const { error } = await supabase.from('products').select().limit(1)
        if (error && error.code === '42P01') { // 表不存在错误
          setStatus(prev => ({ ...prev, [name]: '表不存在，需要创建' }))
          await createTable('products')
        } else {
          setStatus(prev => ({ ...prev, [name]: '表已存在' }))
        }
      } 
      else if (name === 'createCategoriesTable') {
        const { error } = await supabase.from('categories').select().limit(1)
        if (error && error.code === '42P01') { // 表不存在错误
          setStatus(prev => ({ ...prev, [name]: '表不存在，需要创建' }))
          await createTable('categories')
        } else {
          setStatus(prev => ({ ...prev, [name]: '表已存在' }))
        }
      }
      else if (name === 'insertSampleProducts') {
        const { data, error } = await supabase.from('products').select('id').limit(1)
        if (!error && (!data || data.length === 0)) {
          const { error } = await supabase.from('products').insert([
            { name: '智能手表', description: '高级智能手表，支持多种运动模式和健康监测功能', price: 1299, image: 'https://picsum.photos/id/1/500/500', category: 1, inventory: 50, rating: 4.8, reviews: 120 },
            { name: '蓝牙耳机', description: '无线蓝牙耳机，支持降噪功能，续航时间长', price: 399, image: 'https://picsum.photos/id/3/500/500', category: 1, inventory: 200, rating: 4.5, reviews: 85 },
            { name: '真皮沙发', description: '进口真皮沙发，舒适耐用，适合家庭使用', price: 4999, image: 'https://picsum.photos/id/20/500/500', category: 2, inventory: 10, rating: 4.9, reviews: 32 },
            { name: '纯棉T恤', description: '100%纯棉材质，透气舒适，多色可选', price: 99, image: 'https://picsum.photos/id/25/500/500', category: 3, inventory: 500, rating: 4.3, reviews: 210 },
            { name: '保湿面霜', description: '深层保湿面霜，适合干性肌肤，改善肌肤干燥问题', price: 159, image: 'https://picsum.photos/id/30/500/500', category: 4, inventory: 80, rating: 4.6, reviews: 65 },
            { name: '有机坚果礼盒', description: '精选有机坚果礼盒，包含多种坚果，营养丰富', price: 169, image: 'https://picsum.photos/id/40/500/500', category: 5, inventory: 100, rating: 4.7, reviews: 48 },
            { name: '瑜伽垫', description: '专业瑜伽垫，防滑耐磨，厚度适中，适合各种瑜伽动作', price: 128, image: 'https://picsum.photos/id/50/500/500', category: 6, inventory: 60, rating: 4.4, reviews: 72 }
          ])
          if (error) {
            setStatus(prev => ({ ...prev, [name]: `插入失败: ${error.message}` }))
          } else {
            setStatus(prev => ({ ...prev, [name]: '样例产品插入成功' }))
          }
        } else {
          setStatus(prev => ({ ...prev, [name]: '产品表已有数据' }))
        }
      }
      else if (name === 'insertSampleCategories') {
        const { data, error } = await supabase.from('categories').select('id').limit(1)
        if (!error && (!data || data.length === 0)) {
          const { error } = await supabase.from('categories').insert([
            { id: 1, name: '电子产品', description: '各类电子产品、数码设备' },
            { id: 2, name: '家居家具', description: '家具、家居用品' },
            { id: 3, name: '服装服饰', description: '各类衣物、服装、鞋帽' },
            { id: 4, name: '美妆个护', description: '美妆、个人护理用品' },
            { id: 5, name: '食品饮料', description: '零食、饮品、生鲜食品' },
            { id: 6, name: '运动户外', description: '运动器材、户外装备' }
          ])
          if (error) {
            setStatus(prev => ({ ...prev, [name]: `插入失败: ${error.message}` }))
          } else {
            setStatus(prev => ({ ...prev, [name]: '样例分类插入成功' }))
          }
        } else {
          setStatus(prev => ({ ...prev, [name]: '分类表已有数据' }))
        }
      }
    } catch (error: any) {
      console.error(`执行 ${name} 时出错:`, error)
      setStatus(prev => ({ ...prev, [name]: `错误: ${error.message}` }))
    }
  }

  // 创建表（通过定义结构）
  async function createTable(tableName: string) {
    if (tableName === 'products') {
      const { error } = await supabase.rpc('create_products_table', {})
      if (error) {
        console.error('创建产品表失败:', error)
        setStatus(prev => ({ ...prev, createProductsTable: `创建失败: ${error.message}` }))
        
        // 尝试使用直接接口
        const createResult = await fetch('/api/admin/create-tables', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'products' })
        })
        
        if (createResult.ok) {
          setStatus(prev => ({ ...prev, createProductsTable: '使用API创建成功' }))
        } else {
          const errorData = await createResult.json()
          setStatus(prev => ({ ...prev, createProductsTable: `API创建失败: ${errorData.error}` }))
        }
      } else {
        setStatus(prev => ({ ...prev, createProductsTable: '创建成功' }))
      }
    } else if (tableName === 'categories') {
      const { error } = await supabase.rpc('create_categories_table', {})
      if (error) {
        console.error('创建分类表失败:', error)
        setStatus(prev => ({ ...prev, createCategoriesTable: `创建失败: ${error.message}` }))
        
        // 尝试使用直接接口
        const createResult = await fetch('/api/admin/create-tables', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'categories' })
        })
        
        if (createResult.ok) {
          setStatus(prev => ({ ...prev, createCategoriesTable: '使用API创建成功' }))
        } else {
          const errorData = await createResult.json()
          setStatus(prev => ({ ...prev, createCategoriesTable: `API创建失败: ${errorData.error}` }))
        }
      } else {
        setStatus(prev => ({ ...prev, createCategoriesTable: '创建成功' }))
      }
    }
  }

  // 初始化所有数据
  async function initializeAll() {
    setIsLoading(true)
    setMessage('开始初始化数据库...')
    
    try {
      // 检查表结构是否已创建
      await executeSQL('createProductsTable', createProductsTable)
      await executeSQL('createCategoriesTable', createCategoriesTable)
      
      // 插入示例数据
      await executeSQL('insertSampleProducts', insertSampleProducts)
      await executeSQL('insertSampleCategories', insertSampleCategories)
      
      setMessage('数据库初始化完成！您可以开始使用应用程序了。')
    } catch (error: any) {
      setMessage(`发生错误: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">数据库设置</h1>
      <p className="mb-4">此页面用于初始化应用程序所需的数据库结构和示例数据。</p>
      
      <div className="mb-6">
        <button 
          onClick={initializeAll}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? '初始化中...' : '初始化数据库'}
        </button>
      </div>
      
      {message && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          {message}
        </div>
      )}
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">初始化状态</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusCard 
            title="创建产品表" 
            status={status.createProductsTable || '未执行'} 
          />
          <StatusCard 
            title="创建分类表" 
            status={status.createCategoriesTable || '未执行'} 
          />
          <StatusCard 
            title="添加示例产品" 
            status={status.insertSampleProducts || '未执行'} 
          />
          <StatusCard 
            title="添加示例分类" 
            status={status.insertSampleCategories || '未执行'} 
          />
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">如果自动初始化失败</h2>
        <p>
          如果自动初始化失败，您可能需要在Supabase控制台中手动执行SQL脚本。
          请访问<a 
            href="https://app.supabase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Supabase控制台
          </a>，
          进入您的项目，打开"SQL编辑器"，并执行scripts/init-db.sql文件中的SQL脚本。
        </p>
      </div>
    </div>
  )
}

function StatusCard({ title, status }: { title: string, status: string }) {
  // 根据状态设置不同的颜色
  let statusColor = 'text-gray-600'
  
  if (status.includes('成功')) {
    statusColor = 'text-green-600'
  } else if (status.includes('错误') || status.includes('失败')) {
    statusColor = 'text-red-600'
  } else if (status.includes('执行中')) {
    statusColor = 'text-blue-600'
  } else if (status.includes('已有') || status.includes('已存在')) {
    statusColor = 'text-yellow-600'
  }
  
  return (
    <div className="border p-4 rounded shadow-sm">
      <h3 className="font-medium">{title}</h3>
      <p className={`mt-2 ${statusColor}`}>{status}</p>
    </div>
  )
} 