'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SetupPage() {
  const [isCreatingTables, setIsCreatingTables] = useState(false)
  const [isInsertingData, setIsInsertingData] = useState(false)
  const [tablesResult, setTablesResult] = useState<{success: boolean, message: string} | null>(null)
  const [dataResult, setDataResult] = useState<{success: boolean, message: string} | null>(null)
  const [statusMessages, setStatusMessages] = useState<string[]>([])

  // 添加日志
  const addLog = (message: string) => {
    setStatusMessages(prev => [...prev, message])
  }

  // 创建表结构
  const createTables = async () => {
    setIsCreatingTables(true)
    setTablesResult(null)
    addLog('开始创建表结构...')

    try {
      // 1. 检查分类表是否存在
      addLog('正在检查分类表...')
      const { error: catCheckError } = await supabase
        .from('categories')
        .select('count')
        .limit(1)
      
      const categoriesExists = !catCheckError
      if (categoriesExists) {
        addLog('分类表已存在')
      } else {
        addLog('分类表不存在，将创建此表')
      }

      // 2. 检查产品表是否存在
      addLog('正在检查产品表...')
      const { error: prodCheckError } = await supabase
        .from('products')
        .select('count')
        .limit(1)
      
      const productsExists = !prodCheckError
      if (productsExists) {
        addLog('产品表已存在')
      } else {
        addLog('产品表不存在，将创建此表')
      }

      // 3. 检查评论表是否存在
      addLog('正在检查评论表...')
      const { error: reviewCheckError } = await supabase
        .from('reviews')
        .select('count')
        .limit(1)
      
      const reviewsExists = !reviewCheckError
      if (reviewsExists) {
        addLog('评论表已存在')
      } else {
        addLog('评论表不存在，将创建此表')
      }

      // 如果有任何表不存在，尝试直接创建
      if (!categoriesExists || !productsExists || !reviewsExists) {
        addLog('开始创建缺失的表...')

        // 创建分类表
        if (!categoriesExists) {
          addLog('正在创建分类表...')
          const { error: createCatError } = await supabase.rpc('execute_sql', {
            sql: `
            CREATE TABLE IF NOT EXISTS categories (
              id SERIAL PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              description TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`
          })
          
          if (createCatError) {
            // 如果RPC失败，尝试使用REST API
            const result = await fetch('/api/db/create-table', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                table: 'categories',
                sql: `
                CREATE TABLE IF NOT EXISTS categories (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(100) NOT NULL,
                  description TEXT,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );`
              }),
            })
            
            if (!result.ok) {
              throw new Error(`创建分类表失败: ${await result.text()}`)
            }
            
            addLog('分类表创建成功（通过API）')
          } else {
            addLog('分类表创建成功（通过RPC）')
          }
        }
        
        // 创建产品表
        if (!productsExists) {
          addLog('正在创建产品表...')
          const { error: createProdError } = await supabase.rpc('execute_sql', {
            sql: `
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
          })
          
          if (createProdError) {
            // 如果RPC失败，尝试使用REST API
            const result = await fetch('/api/db/create-table', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                table: 'products',
                sql: `
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
              }),
            })
            
            if (!result.ok) {
              throw new Error(`创建产品表失败: ${await result.text()}`)
            }
            
            addLog('产品表创建成功（通过API）')
          } else {
            addLog('产品表创建成功（通过RPC）')
          }
        }
        
        // 创建评论表
        if (!reviewsExists) {
          addLog('正在创建评论表...')
          const { error: createReviewError } = await supabase.rpc('execute_sql', {
            sql: `
            CREATE TABLE IF NOT EXISTS reviews (
              id SERIAL PRIMARY KEY,
              product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
              user_id VARCHAR(255) NOT NULL,
              username VARCHAR(255) NOT NULL,
              rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
              comment TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
            );`
          })
          
          if (createReviewError) {
            // 如果RPC失败，尝试使用REST API
            const result = await fetch('/api/db/create-table', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                table: 'reviews',
                sql: `
                CREATE TABLE IF NOT EXISTS reviews (
                  id SERIAL PRIMARY KEY,
                  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                  user_id VARCHAR(255) NOT NULL,
                  username VARCHAR(255) NOT NULL,
                  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                  comment TEXT,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
                );`
              }),
            })
            
            if (!result.ok) {
              throw new Error(`创建评论表失败: ${await result.text()}`)
            }
            
            addLog('评论表创建成功（通过API）')
          } else {
            addLog('评论表创建成功（通过RPC）')
          }
        }
        
        // 再次检查表是否都创建成功
        addLog('正在验证表创建结果...')
        const { error: verifyError } = await supabase
          .from('categories')
          .select('count')
          .limit(1)
        
        if (verifyError) {
          setTablesResult({
            success: false,
            message: '表创建失败。请尝试使用终端命令 npm run init-db 初始化数据库。'
          })
          addLog('表创建验证失败，请使用以下方法之一:')
          addLog('1. 在Supabase仪表板中运行SQL脚本')
          addLog('2. 在终端运行命令: npm run init-db')
        } else {
          setTablesResult({
            success: true,
            message: '所有表都已成功创建！可以继续添加数据。'
          })
          addLog('表创建验证成功，所有表已准备就绪')
        }
      } else {
        setTablesResult({
          success: true,
          message: '所有表都已存在！可以继续添加数据。'
        })
      }
    } catch (error) {
      console.error('创建表结构出错:', error)
      setTablesResult({
        success: false,
        message: error instanceof Error ? error.message : '创建表结构时发生未知错误'
      })
      addLog(`错误: ${error instanceof Error ? error.message : '未知错误'}`)
      addLog('建议在终端运行命令: npm run init-db')
    } finally {
      setIsCreatingTables(false)
    }
  }

  // 添加示例数据
  const insertSampleData = async () => {
    setIsInsertingData(true)
    setDataResult(null)
    addLog('开始添加示例数据...')

    try {
      // 1. 添加分类数据
      addLog('正在添加分类数据...')
      const categories = [
        { id: 1, name: '电子产品', description: '各类电子产品、数码设备' },
        { id: 2, name: '家居家具', description: '家具、家居用品' },
        { id: 3, name: '服装服饰', description: '各类衣物、服装、鞋帽' },
        { id: 4, name: '美妆个护', description: '美妆、个人护理用品' },
        { id: 5, name: '食品饮料', description: '零食、饮品、生鲜食品' },
        { id: 6, name: '运动户外', description: '运动器材、户外装备' }
      ]

      const { error: categoriesError } = await supabase
        .from('categories')
        .upsert(categories, { onConflict: 'id' })

      if (categoriesError) {
        throw new Error(`添加分类数据失败: ${categoriesError.message}`)
      }
      addLog('分类数据添加成功')

      // 2. 添加产品数据
      addLog('正在添加产品数据...')
      const products = [
        { name: '智能手表', description: '高级智能手表，支持多种运动模式和健康监测功能', price: 1299, image: 'https://picsum.photos/id/1/500/500', category: 1, inventory: 50, rating: 4.8, reviews: 120 },
        { name: '蓝牙耳机', description: '无线蓝牙耳机，支持降噪功能，续航时间长', price: 399, image: 'https://picsum.photos/id/3/500/500', category: 1, inventory: 200, rating: 4.5, reviews: 85 },
        { name: '真皮沙发', description: '进口真皮沙发，舒适耐用，适合家庭使用', price: 4999, image: 'https://picsum.photos/id/20/500/500', category: 2, inventory: 10, rating: 4.9, reviews: 32 },
        { name: '纯棉T恤', description: '100%纯棉材质，透气舒适，多色可选', price: 99, image: 'https://picsum.photos/id/25/500/500', category: 3, inventory: 500, rating: 4.3, reviews: 210 },
        { name: '保湿面霜', description: '深层保湿面霜，适合干性肌肤，改善肌肤干燥问题', price: 159, image: 'https://picsum.photos/id/30/500/500', category: 4, inventory: 80, rating: 4.6, reviews: 65 },
        { name: '有机坚果礼盒', description: '精选有机坚果礼盒，包含多种坚果，营养丰富', price: 169, image: 'https://picsum.photos/id/40/500/500', category: 5, inventory: 100, rating: 4.7, reviews: 48 },
        { name: '瑜伽垫', description: '专业瑜伽垫，防滑耐磨，厚度适中，适合各种瑜伽动作', price: 128, image: 'https://picsum.photos/id/50/500/500', category: 6, inventory: 60, rating: 4.4, reviews: 72 }
      ]

      // 逐个插入产品数据
      for (const product of products) {
        const { error: prodError } = await supabase
          .from('products')
          .upsert(product)

        if (prodError) {
          throw new Error(`添加产品数据失败: ${prodError.message}`)
        }
      }
      addLog('产品数据添加成功')

      setDataResult({
        success: true,
        message: '所有示例数据添加成功！'
      })
    } catch (error) {
      console.error('添加示例数据出错:', error)
      setDataResult({
        success: false,
        message: error instanceof Error ? error.message : '添加示例数据时发生未知错误'
      })
      addLog(`错误: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsInsertingData(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">数据库初始化工具</h1>
            <p className="text-gray-600">
              此页面可帮助您初始化数据库表结构并添加示例数据
            </p>
            <div className="mt-4">
              <Link href="/" className="text-primary hover:underline">
                ← 返回首页
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">步骤1: 检查表结构</h2>
                <p className="text-gray-600 mb-4">
                  点击下方按钮检查必要的数据库表结构是否存在
                </p>
                <button
                  onClick={createTables}
                  disabled={isCreatingTables}
                  className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${
                    isCreatingTables 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-blue-600'
                  }`}
                >
                  {isCreatingTables ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      检查中...
                    </>
                  ) : '检查表结构'}
                </button>
                {tablesResult && (
                  <div className={`mt-4 p-4 rounded-md ${tablesResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {tablesResult.message}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">步骤2: 添加示例数据</h2>
                <p className="text-gray-600 mb-4">
                  点击下方按钮添加示例分类和产品数据
                </p>
                <button
                  onClick={insertSampleData}
                  disabled={isInsertingData || (tablesResult !== null && !tablesResult.success)}
                  className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${
                    isInsertingData || (tablesResult !== null && !tablesResult.success)
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-blue-600'
                  }`}
                >
                  {isInsertingData ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      添加中...
                    </>
                  ) : '添加示例数据'}
                </button>
                {dataResult && (
                  <div className={`mt-4 p-4 rounded-md ${dataResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {dataResult.message}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">执行日志</h2>
              <div className="h-96 overflow-y-auto font-mono text-sm bg-gray-900 text-green-400 p-4 rounded">
                {statusMessages.length === 0 ? (
                  <p className="text-gray-500">等待操作...</p>
                ) : (
                  statusMessages.map((message, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-gray-400">{`[${new Date().toLocaleTimeString()}]`}</span> {message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {(tablesResult?.success && dataResult?.success) && (
            <div className="mt-8 bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-700 mb-4">✓ 初始化完成</h2>
              <p className="mb-4">
                数据库初始化已完成。现在您可以：
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600">
                  返回首页
                </Link>
                <Link href="/upload" className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-blue-50">
                  添加商品
                </Link>
                <Link href="/env-debug" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100">
                  环境变量检查
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 