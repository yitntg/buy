'use client'

import { useState } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Customer Home Page (Minimal Test)</h1>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <p>This is a minimal client component for testing build issues.</p>
    </div>
  );
}
