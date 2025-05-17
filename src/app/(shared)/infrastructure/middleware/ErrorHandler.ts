import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // 处理 Supabase 错误
  if (err.message && err.message.includes('Supabase') || 
      (err as any).code === 'PGRST') {
    return res.status(400).json({
      status: 'error',
      message: '数据库操作失败',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }

  // 处理验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

  // 处理未知错误
  console.error('未处理的错误:', err);
  return res.status(500).json({
    status: 'error',
    message: '服务器内部错误'
  });
}; 
