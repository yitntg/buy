'use client';

import { useState, useEffect } from 'react';
import { AvatarService } from '@/utils/avatarUtils';

export default function TestStorage() {
  const [status, setStatus] = useState<any>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStorage();
  }, []);

  async function checkStorage() {
    try {
      const result = await AvatarService.checkStorageStatus();
      setStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '检查存储状态失败');
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const url = await AvatarService.uploadAvatar(file);
      setUploadResult({ success: true, url });
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
      setUploadResult({ success: false });
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">存储测试页面</h1>
      
      {/* 存储状态 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">存储桶状态：</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(status, null, 2)}
        </pre>
      </div>

      {/* 上传测试 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">测试上传：</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-4"
        />
        
        {uploadResult && (
          <div className="mt-4">
            <h3 className="font-semibold">上传结果：</h3>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="text-red-500 mt-4">
          错误：{error}
        </div>
      )}
    </div>
  );
} 