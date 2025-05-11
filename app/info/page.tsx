// 基础静态页面，用于排查部署问题
export const dynamic = 'force-static'
export const revalidate = 31536000 

export default function InfoPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>基本信息页面</h1>
      <p>这是一个简单的静态页面，用于测试部署。</p>
      <p>构建时间: {new Date().toISOString()}</p>
      
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/"
          style={{ 
            display: 'inline-block',
            background: '#0070f3',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            marginRight: '10px'
          }}
        >
          返回首页
        </a>
        
        <a 
          href="/test-page"
          style={{ 
            display: 'inline-block',
            background: '#eee',
            color: '#333',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}
        >
          测试页面
        </a>
      </div>
    </div>
  )
} 