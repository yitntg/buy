'use client'

// 明确指定此页面是静态的
export const dynamic = 'force-static'
export const revalidate = 3600 // 每小时重新验证一次

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
        网站正在维护中，请稍后访问
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h2 style={{ marginTop: '0' }}>临时维护通知</h2>
          <p>我们正在进行系统升级，以提供更好的购物体验。</p>
          <p style={{ marginBottom: '0' }}>预计恢复时间：尽快</p>
        </div>
      </div>
      
      <div style={{ color: '#888', fontSize: '14px' }}>
        © 2023 乐购商城 | 所有权利保留
      </div>
    </div>
  )
} 