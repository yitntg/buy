import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // 确保每次请求都执行

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    region: process.env.VERCEL_REGION || 'unknown'
  });
} 