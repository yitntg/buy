'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * 错误边界组件
 * 用于捕获子组件树中的JavaScript错误，记录错误并显示备用UI
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新状态，下一次渲染将显示备用UI
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 可以将错误记录到错误报告服务
    console.error('ErrorBoundary捕获到错误:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义的fallback，则使用它
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      // 默认的错误UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">出错了</h2>
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md text-left">
                <p className="text-red-800 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-48">
                  {this.state.error?.toString()}
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                很抱歉，页面渲染过程中发生了错误。我们已记录此问题，并将尽快修复。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  刷新页面
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  返回上一页
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 