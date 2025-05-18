'use client'

import { useState } from 'react';

export default function CustomerRoutesPage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test Page at /customerroutes</h1>
      <p>This page mimics the proposed fix for the original (customer) route.</p>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
} 