// 纯静态测试页面，不使用任何复杂特性
export const dynamic = 'force-static'
export const revalidate = 31536000

export default function TestPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ margin: '20px 0' }}>测试页面</h1>
      <p>这是一个简单的测试页面，用于验证部署是否正常工作。</p>
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
            textDecoration: 'none'
          }}
        >
          返回首页
        </a>
      </div>
    </div>
  )
} 
