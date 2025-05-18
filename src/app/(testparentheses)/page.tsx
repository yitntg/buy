'use client'

import { useState } from 'react';

export default function TestParenthesesPage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test Page inside (testparentheses)</h1>
      <p>URL should be effectively the root or segment before this group.</p>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
} 