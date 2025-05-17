'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新状态，下次渲染将显示备用UI
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    })
    // 可以在这里记录错误信息
    console.error('错误边界捕获到错误:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 可以自定义备用UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 bg-red-50 border border-red-100 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-4">出错了</h2>
          <p className="text-red-600 mb-4">应用程序遇到了一个意外错误。</p>
          <details className="mb-4 text-sm text-gray-700 bg-white p-4 rounded border border-gray-200">
            <summary>错误详情</summary>
            <pre className="mt-2 whitespace-pre-wrap">
              {this.state.error && this.state.error.toString()}
            </pre>
            <pre className="mt-2 whitespace-pre-wrap">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 