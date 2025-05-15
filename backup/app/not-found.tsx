import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'

// 静态404页面
export default function NotFound() {
  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '600px', 
      margin: '0 auto', 
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>404 - 页面不存在</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        您请求的页面不存在或已被移除。
      </p>
      <a 
        href="/"
        style={{ 
          display: 'inline-block',
          background: '#0070f3',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none'
        }}
      >
        返回首页
      </a>
    </div>
  )
} 