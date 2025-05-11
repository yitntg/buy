'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('应用发生错误:', error)
  }, [error])

  return (
    <html lang="zh">
      <body>
        <div style={{ 
          fontFamily: 'sans-serif', 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '40px 20px',
          textAlign: 'center' 
        }}>
          <h1 style={{ fontSize: '36px', marginBottom: '20px', color: '#E53E3E' }}>系统错误</h1>
          <p style={{ fontSize: '18px', marginBottom: '20px', color: '#666' }}>
            抱歉，系统遇到了意外错误
          </p>
          
          <div style={{ 
            padding: '15px',
            margin: '0 auto 30px',
            maxWidth: '500px',
            background: '#F7FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 5px', fontWeight: 'bold' }}>错误信息:</p>
            <p style={{ margin: '0', wordBreak: 'break-word', color: '#718096' }}>
              {error.message || '未知错误'}
            </p>
            {error.digest && (
              <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#A0AEC0' }}>
                错误ID: {error.digest}
              </p>
            )}
          </div>
          
          <button
            onClick={() => reset()}
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  )
} 