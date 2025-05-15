import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// 扩展NextApiRequest接口，添加files属性
interface ExtendedNextApiRequest extends NextApiRequest {
  files?: {
    file: {
      data: Buffer;
      name: string;
      size: number;
      mimetype: string;
    } | {
      data: Buffer;
      name: string;
      size: number;
      mimetype: string;
    }[];
  };
}

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

/**
 * 处理上传API请求
 * @param req 请求对象
 * @param res 响应对象
 */
export async function handleUploadRequest(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: '方法不允许' });
    }

    // 检查请求中是否有文件
    if (!req.body || !req.files) {
      return res.status(400).json({ error: '未找到上传文件' });
    }

    const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
    
    if (!file) {
      return res.status(400).json({ error: '未找到上传文件' });
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: '不支持的文件类型，仅支持JPEG、PNG、GIF和WEBP' });
    }

    // 检查文件大小
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({ error: '文件过大，最大支持5MB' });
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
    await writeFile(filePath, file.data);

    // 构建公开URL
    const publicUrl = `/uploads/${fileName}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      originalName: originalName,
      size: file.size,
      type: file.mimetype
    });
  } catch (error) {
    console.error('处理文件上传时出错:', error);
    return res.status(500).json({ 
      error: '处理文件上传时出错', 
      details: error instanceof Error ? error.message : '未知错误' 
    });
  }
}