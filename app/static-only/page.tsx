// 通过强制静态生成和禁用服务端数据获取，确保极快的加载速度
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'
export const revalidate = false
export const runtime = 'edge' // 使用边缘运行时进一步加速

export default function StaticOnlyPage() {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      margin: '0 auto',
      maxWidth: '600px',
      padding: '40px 20px'
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333'
      }}>
        乐购商城
      </h1>
      
      <div style={{
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid #e9ecef'
      }}>
        <h2 style={{ 
          fontSize: '22px',
          color: '#495057',
          marginTop: '0',
          marginBottom: '16px' 
        }}>
          快速访问页面
        </h2>
        <p style={{ color: '#6c757d', marginBottom: '16px' }}>
          此页面是特殊设计的静态页面，用于确保即使服务器负载过重也能快速访问。
        </p>
      </div>
      
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          fontSize: '22px',
          color: '#495057',
          marginTop: '0',
          marginBottom: '16px' 
        }}>
          系统状态
        </h2>
        <ul style={{ 
          listStyle: 'none',
          padding: '0',
          margin: '0'
        }}>
          <li style={{ 
            padding: '10px 0',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>页面状态</span>
            <span style={{ color: '#28a745' }}>✓ 正常</span>
          </li>
          <li style={{ 
            padding: '10px 0',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>服务器</span>
            <span style={{ color: '#ffc107' }}>⚠ 维护中</span>
          </li>
        </ul>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            background: '#007bff',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          返回首页
        </a>
      </div>
    </div>
  )
} 