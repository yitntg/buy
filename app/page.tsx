'use client'

// 明确指定此页面是静态的
export const dynamic = 'force-static'
export const revalidate = 3600

export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>乐购商城</h1>
      <p style={{ fontSize: '18px', marginBottom: '40px', color: '#666' }}>
        简化版购物系统
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <a href="/static-only" style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333'
        }}>
          <h2 style={{ marginTop: '0' }}>静态页面</h2>
          <p>超快速加载，没有服务器连接</p>
        </a>
        <a href="/env-debug" style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333'
        }}>
          <h2 style={{ marginTop: '0' }}>环境诊断</h2>
          <p>检查系统配置和连接状态</p>
        </a>

        <a href="/deployment-info" style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333'
        }}>
          <h2 style={{ marginTop: '0' }}>部署信息</h2>
          <p>查看部署详情和服务器状态</p>
        </a>

        <a href="/api/health" style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333'
        }}>
          <h2 style={{ marginTop: '0' }}>健康检查API</h2>
          <p>不依赖数据库的API测试</p>
        </a>
      </div>
      
      <div style={{ color: '#888', fontSize: '14px' }}>
        © 2023 乐购商城 | 所有权利保留
      </div>
    </div>
  )
} 