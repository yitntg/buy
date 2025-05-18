import { useEffect } from 'react';

// 简单事件总线实现
const listeners: Record<string, Function[]> = {};

export function emitCommentEvent(event: string, payload?: any) {
  (listeners[event] || []).forEach(fn => fn(payload));
}

export function onCommentEvent(event: string, handler: (payload?: any) => void) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(handler);
  return () => {
    listeners[event] = listeners[event].filter(fn => fn !== handler);
  };
}

// React Hook 用于自动订阅/取消订阅
export function useCommentEvent(event: string, handler: (payload?: any) => void) {
  useEffect(() => {
    const off = onCommentEvent(event, handler);
    return () => off();
  }, [event, handler]);
} 