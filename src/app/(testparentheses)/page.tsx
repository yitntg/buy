// No 'use client' directive, this is a Server Component

export default function TestParenthesesPage() {
  const serverTime = new Date().toLocaleTimeString();

  return (
    <div>
      <h1>Test Page inside (testparentheses) - Server Component</h1>
      <p>URL should be effectively the root or segment before this group.</p>
      <p>Server time: {serverTime}</p>
      <p>This page is now a Server Component.</p>
    </div>
  );
} 