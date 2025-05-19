'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorDisplayProps {
  error: Error;
  reset: () => void;
}

// 错误显示组件
export function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 flex items-center justify-center rounded-full mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">出现错误</h2>
        <p className="text-gray-600 mb-6">{error.message || '页面加载过程中发生错误'}</p>
        <div className="flex flex-col space-y-2">
          <button
            onClick={reset}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            重试
          </button>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

// 错误边界组件
export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return fallback || <ErrorDisplay error={error} reset={() => setError(null)} />;
  }

  return <>{children}</>;
} 