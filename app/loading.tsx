export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div 
          style={{ 
            display: 'inline-block',
            width: '48px',
            height: '48px',
            border: '4px solid #E2E8F0',
            borderTopColor: '#4A90E2',
            borderRadius: '50%',
            marginBottom: '16px',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '500', 
          color: '#4A5568',
          margin: '0 0 8px'
        }}>
          页面加载中
        </h2>
        <p style={{ color: '#718096', margin: '0' }}>请稍候...</p>
      </div>
    </div>
  )
} 