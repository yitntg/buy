'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function StorageTestPage() {
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [configInfo, setConfigInfo] = useState({
    supabaseUrl: '',
    hasApiKey: false,
    keyPrefix: '',
  })
  
  useEffect(() => {
    // 获取配置信息（仅用于显示）
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzjhupjfojvlbthnsgqt.supabase.co'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    setConfigInfo({
      supabaseUrl: url,
      hasApiKey: !!key,
      keyPrefix: key ? `${key.substring(0, 10)}...` : '未设置'
    })
  }, [])
  
  const runStorageTests = async () => {
    setLoading(true)
    setErrorMsg(null)
    
    try {
      const response = await fetch('/api/test-supabase-storage', {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      if (!response.ok) {
        throw new Error(`测试请求失败: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      console.error('运行测试时出错:', error)
      setErrorMsg((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const initializeProductsBucket = async () => {
    setLoading(true)
    setErrorMsg(null)
    
    try {
      // 检查products存储桶是否存在
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        throw new Error(`获取存储桶列表失败: ${listError.message}`)
      }
      
      const productsBucketExists = buckets?.some(bucket => bucket.name === 'products')
      
      if (!productsBucketExists) {
        // 创建products存储桶
        const { error: createError } = await supabase.storage.createBucket('products', {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024 // 5MB
        })
        
        if (createError) {
          throw new Error(`创建products存储桶失败: ${createError.message}`)
        }
        
        alert('成功创建products存储桶！')
      } else {
        // 确保存储桶是公开的
        const { error: updateError } = await supabase.storage.updateBucket('products', {
          public: true
        })
        
        if (updateError) {
          throw new Error(`更新products存储桶权限失败: ${updateError.message}`)
        }
        
        alert('products存储桶已存在，已设置为公开访问。')
      }
      
      // 刷新测试结果
      await runStorageTests()
    } catch (error) {
      console.error('初始化products存储桶失败:', error)
      setErrorMsg((error as Error).message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supabase Storage 测试</h1>
        <Link 
          href="/admin/tools" 
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回开发工具
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-2">Supabase 配置信息</h2>
          <div className="bg-gray-50 p-4 rounded border mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Supabase URL:</p>
                <p className="text-sm text-gray-900 font-mono bg-gray-100 p-1 rounded">{configInfo.supabaseUrl}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">API 密钥状态:</p>
                <p className={`text-sm font-mono p-1 rounded ${configInfo.hasApiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {configInfo.hasApiKey ? `已设置 (${configInfo.keyPrefix})` : '未设置'}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                <strong>注意:</strong> 如需修改，请在项目根目录的 <code className="px-1 py-0.5 bg-gray-200 rounded">.env.local</code> 文件中设置：
              </p>
              <pre className="mt-2 text-xs bg-gray-800 text-gray-200 p-2 rounded">
                NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{'\n'}
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
              </pre>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            这个工具会运行一系列测试来检查 Supabase Storage 的连接和权限情况，帮助诊断上传图片的问题。
          </p>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={runStorageTests}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </>
              ) : '运行测试'}
            </button>
            
            <button
              onClick={initializeProductsBucket}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              初始化 Products 存储桶
            </button>
          </div>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              <strong>错误:</strong> {errorMsg}
            </div>
          )}
          
          {testResults && (
            <div className="mt-6">
              <h2 className="text-xl font-medium mb-2">测试结果</h2>
              
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <div className="text-3xl font-bold">{testResults.summary.total}</div>
                  <div className="text-sm text-gray-600">总测试数</div>
                </div>
                <div className="p-4 bg-green-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{testResults.summary.success}</div>
                  <div className="text-sm text-gray-600">通过测试</div>
                </div>
                <div className="p-4 bg-red-100 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{testResults.summary.failed}</div>
                  <div className="text-sm text-gray-600">失败测试</div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                {testResults.tests.map((test: any, index: number) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${test.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${test.success ? 'bg-green-500' : 'bg-red-500'}`}>
                        {test.success ? (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        )}
                      </div>
                      <h3 className={`font-medium ${test.success ? 'text-green-800' : 'text-red-800'}`}>
                        {index + 1}. {test.name}
                      </h3>
                    </div>
                    
                    {test.error && (
                      <div className="ml-7 p-2 bg-red-100 text-red-700 text-sm rounded">
                        <strong>错误:</strong> {test.error}
                      </div>
                    )}
                    
                    {test.data && (
                      <div className="ml-7 mt-2">
                        <div className="text-sm font-medium text-gray-700">数据:</div>
                        <pre className="bg-gray-800 text-gray-200 p-2 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-2">诊断和建议</h3>
                
                {testResults.summary.failed > 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="font-medium text-yellow-800 mb-2">检测到 Supabase Storage 问题</p>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>存在 {testResults.summary.failed} 个测试失败，可能影响图片上传功能</li>
                      <li>请检查 Supabase 项目的 Storage 权限设置</li>
                      <li>考虑在 Supabase 控制台创建公开的 "products" bucket</li>
                      <li>检查 Row Level Security (RLS) 策略是否允许匿名用户上传</li>
                      <li>验证使用的 API 密钥是否有足够权限</li>
                      <li>使用上方的"初始化 Products 存储桶"按钮尝试自动修复</li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="font-medium text-green-800 mb-2">Supabase Storage 配置正常</p>
                    <p className="text-sm text-gray-700">所有测试通过，Storage 功能应该可以正常工作。如果仍然遇到上传问题，可能是其他因素导致的。</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">在 Supabase 控制台中修复</h3>
                <p className="text-sm text-gray-700 mb-2">
                  如果自动修复不成功，您可以在 Supabase 控制台中手动创建和配置存储桶：
                </p>
                <ol className="list-decimal ml-5 text-sm space-y-1 text-gray-700">
                  <li>登录 <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase 控制台</a></li>
                  <li>选择您的项目</li>
                  <li>点击左侧导航栏中的 "Storage"</li>
                  <li>创建名为 "products" 的新存储桶</li>
                  <li>确保勾选 "Public bucket" 选项</li>
                  <li>在 RLS 策略中，允许匿名用户上传文件</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 