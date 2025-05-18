// 主要的根页面
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function HomePage() {
  return (
    <div>
      <h1>欢迎来到首页</h1>
    </div>
  );
} 