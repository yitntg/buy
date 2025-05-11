import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'

export default function NotFound() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>404 - 页面未找到</h1>
      <p style={{ fontSize: '18px', marginBottom: '40px', color: '#666' }}>
        您访问的页面不存在或已被移除
      </p>
      
      <a 
        href="/" 
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: '#4A90E2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        返回首页
      </a>
    </div>
  )
} 