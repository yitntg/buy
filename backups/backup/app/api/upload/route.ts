import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

// 确保上传目录存在
async function ensureUploadDir() {
  const publicDir = join(process.cwd(), 'public');
  const uploadDir = join(publicDir, 'uploads');
  
  if (!existsSync(uploadDir)) {
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('创建上传目录:', uploadDir);
    } catch (error) {
      console.error('创建上传目录失败:', error);
      throw error;
    }
  }
  
  return uploadDir;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '未找到上传文件' },
        { status: 400 }
      );
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型，仅支持JPEG、PNG、GIF和WEBP' },
        { status: 400 }
      );
    }
    
    const fileSize = file.size;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: '文件过大，最大支持5MB' },
        { status: 400 }
      );
    }
    
    // 生成唯一文件名
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const ext = originalName.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 10)}.${ext}`;
    
    // 确保上传目录存在
    const uploadDir = await ensureUploadDir();
    const filePath = join(uploadDir, fileName);
    
    // 保存文件
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // 构建公开URL
    const publicUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName,
      originalName: originalName,
      size: fileSize,
      type: file.type
    });
    
  } catch (error) {
    console.error('处理文件上传时出错:', error);
    return NextResponse.json(
      { error: '处理文件上传时出错', details: (error as Error).message },
      { status: 500 }
    );
  }
} 