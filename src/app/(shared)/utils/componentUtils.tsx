'use client'

import { lazy, memo, ComponentType, LazyExoticComponent } from 'react';

/**
 * 使用React.memo包装组件以避免不必要的重渲染
 * @param Component 需要包装的组件
 * @returns 包装后的组件
 */
export function withMemo<Props>(Component: ComponentType<Props>) {
  return memo(Component);
}

/**
 * 包装组件为懒加载组件
 * @param importFn 导入组件的函数
 * @returns 懒加载的组件
 */
export function withLazy<Props>(
  importFn: () => Promise<{ default: ComponentType<Props> }>
): LazyExoticComponent<ComponentType<Props>> {
  return lazy(importFn);
}

/**
 * 创建具有默认加载状态的懒加载组件包装器
 * @param importFn 导入组件的函数
 * @param LoadingComponent 加载中显示的组件
 * @returns 带有加载状态的懒加载组件
 */
export function createLazyComponent<Props>(
  importFn: () => Promise<{ default: ComponentType<Props> }>,
  LoadingComponent: ComponentType = () => <div className="animate-pulse">加载中...</div>
) {
  return {
    Component: lazy(importFn),
    Loading: LoadingComponent
  };
} 