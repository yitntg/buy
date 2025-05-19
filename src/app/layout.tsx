import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { Metadata } from 'next'
import ClientProviders from '@/app/(shared)/components/ui/ClientProviders'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// 定义元数据导出
export const metadata: Metadata = {
  title: '乐购商城-测试版本e835f8c',
  description: '现代化电商平台',
  icons: {
    icon: '/favicon.ico'
  }
}

// 加载中状态组件
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

// 修改为使用全局页眉页脚的布局
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ClientProviders>
          <main className="pt-20 pb-40 flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              {children}
            </Suspense>
          </main>
        </ClientProviders>
      </body>
    </html>
  )
} 
