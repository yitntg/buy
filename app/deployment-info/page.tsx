'use client'

import { useEffect, useState } from 'react'

// 使用简单的字面量数字值
export const dynamic = 'force-static'
export const revalidate = 3600

// 定义健康检查API的响应类型
interface HealthData {
  status: string;
  timestamp: string;
  environment: string;
  region: string;
}

export default function DeploymentInfo() {
  const [deployInfo, setDeployInfo] = useState({
    buildTime: '',
    clientTime: '',
    userAgent: '',
    screenSize: ''
  })

  useEffect(() => {
    setDeployInfo({
      buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || '未知',
      clientTime: new Date().toString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    })
  }, [])

  // 加载健康检查API数据
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function fetchHealthData() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/health')
        if (response.ok) {
          const data = await response.json()
          setHealthData(data)
        }
      } catch (error) {
        console.error('健康检查API请求失败', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchHealthData()
  }, [])

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px' 
    }}>
      <h1 style={{ marginBottom: '20px' }}>部署信息</h1>
      
      <div style={{ 
        display: 'grid', 
        gap: '20px',
        marginBottom: '30px' 
      }}>
        <div style={{ 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #eee',
          background: '#f9f9f9' 
        }}>
          <h2 style={{ marginTop: 0 }}>客户端信息</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li>构建时间: {deployInfo.buildTime}</li>
            <li>客户端时间: {deployInfo.clientTime}</li>
            <li>浏览器: {deployInfo.userAgent}</li>
            <li>屏幕尺寸: {deployInfo.screenSize}</li>
          </ul>
        </div>
        
        <div style={{ 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #eee',
          background: '#f9f9f9' 
        }}>
          <h2 style={{ marginTop: 0 }}>服务器状态</h2>
          {isLoading ? (
            <p>加载中...</p>
          ) : healthData ? (
            <ul style={{ paddingLeft: '20px' }}>
              <li>状态: {healthData.status}</li>
              <li>时间戳: {healthData.timestamp}</li>
              <li>环境: {healthData.environment}</li>
              <li>区域: {healthData.region}</li>
            </ul>
          ) : (
            <p>无法连接到健康检查API</p>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <a 
          href="/" 
          style={{ 
            padding: '8px 16px', 
            background: '#0070f3', 
            color: 'white', 
            borderRadius: '4px', 
            textDecoration: 'none' 
          }}
        >
          返回首页
        </a>
        <a 
          href="/static-only" 
          style={{ 
            padding: '8px 16px', 
            background: '#eaeaea', 
            color: '#333', 
            borderRadius: '4px', 
            textDecoration: 'none' 
          }}
        >
          访问静态页面
        </a>
      </div>
    </div>
  )
} 