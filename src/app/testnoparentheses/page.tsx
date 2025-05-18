'use client'

import { useState } from 'react';

export default function TestNoParenthesesPage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test Page at /testnoparentheses</h1>
      <p>This page is a regular route without parentheses.</p>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
} 