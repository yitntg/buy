import { redirect } from 'next/navigation'

// 主页直接重定向到产品页面
export default function Home() {
  // 强制重定向到产品页面
  redirect('/products')
} 
