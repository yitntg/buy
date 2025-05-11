// 简单静态主页，无需客户端组件
export const dynamic = 'force-static'
export const revalidate = 31536000

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
        
        <a href="/test-page" style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333'
        }}>
          <h2 style={{ marginTop: '0' }}>测试页面</h2>
          <p>测试页面，最简单配置</p>
        </a>
        
        <a href="/info" style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333'
        }}>
          <h2 style={{ marginTop: '0' }}>信息页面</h2>
          <p>超简版，排除一切问题</p>
        </a>
        
        <a href="/api/health" style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333'
        }}>
          <h2 style={{ marginTop: '0' }}>健康API</h2>
          <p>基本API测试</p>
        </a>
      </div>
      
      <div style={{ color: '#888', fontSize: '14px' }}>
        © 2023 乐购商城 | 所有权利保留
      </div>
    </div>
  )
} 