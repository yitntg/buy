// 主要的根页面
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function RootPage() {
  return (
    <div>
      <h1>Main Root Page (app/page.tsx)</h1>
      <p>This is the primary page for the / path.</p>
    </div>
  );
} 