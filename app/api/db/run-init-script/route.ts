import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
  try {
    // 记录执行开始
    console.log('正在执行初始化命令: npm run init-db')
    
    // 执行命令
    const { stdout, stderr } = await execAsync('npm run init-db')
    
    // 检查是否有错误
    if (stderr && !stderr.includes('npm notice')) {
      console.error('命令执行出错:', stderr)
      return new NextResponse(`
        <html>
          <head>
            <title>数据库初始化</title>
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="5;url=/setup">
            <style>
              body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
              pre { background: #f0f0f0; padding: 1rem; border-radius: 0.5rem; overflow: auto; }
              .error { color: #e53e3e; }
              .back { margin-top: 1rem; display: inline-block; }
            </style>
          </head>
          <body>
            <h1 class="error">初始化失败</h1>
            <p>执行数据库初始化命令时出错：</p>
            <pre>${stderr}</pre>
            <p>5秒后将自动返回到初始化页面，或者 <a href="/setup" class="back">立即返回</a></p>
          </body>
        </html>
      `, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }
    
    console.log('命令执行成功:', stdout)
    
    // 返回成功页面
    return new NextResponse(`
      <html>
        <head>
          <title>数据库初始化</title>
          <meta charset="utf-8">
          <meta http-equiv="refresh" content="3;url=/setup">
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            pre { background: #f0f0f0; padding: 1rem; border-radius: 0.5rem; overflow: auto; max-height: 400px; }
            .success { color: #38a169; }
            .back { margin-top: 1rem; display: inline-block; }
          </style>
        </head>
        <body>
          <h1 class="success">初始化成功！</h1>
          <p>数据库初始化命令已成功执行。</p>
          <details>
            <summary>查看详细输出</summary>
            <pre>${stdout}</pre>
          </details>
          <p>3秒后将自动返回到初始化页面，或者 <a href="/setup" class="back">立即返回</a></p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (error) {
    console.error('执行命令时发生错误:', error)
    
    // 返回错误页面
    return new NextResponse(`
      <html>
        <head>
          <title>数据库初始化</title>
          <meta charset="utf-8">
          <meta http-equiv="refresh" content="5;url=/setup">
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            .error { color: #e53e3e; }
            .back { margin-top: 1rem; display: inline-block; }
          </style>
        </head>
        <body>
          <h1 class="error">初始化失败</h1>
          <p>执行数据库初始化命令时发生错误：</p>
          <p>${error instanceof Error ? error.message : '未知错误'}</p>
          <p>5秒后将自动返回到初始化页面，或者 <a href="/setup" class="back">立即返回</a></p>
        </body>
      </html>
    `, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
} 