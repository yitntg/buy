'use client';

import { useState, useEffect } from 'react';
import { AvatarService } from '@/utils/avatarUtils';
import { supabase } from '@/utils/lib/supabase';

export default function TestStorage() {
  const [status, setStatus] = useState<any>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      // 登录成功后重新检查存储状态
      await checkStorage();
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    }
  }

  async function handleCreateBucket() {
    try {
      setError(null);
      const { error } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });
      
      if (error) throw error;
      
      // 创建成功后重新检查状态
      await checkStorage();
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建存储桶失败');
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
      
      {/* 登录表单 */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">登录</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            登录
          </button>
        </form>
      </div>
      
      {/* 存储状态 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">存储桶状态：</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(status, null, 2)}
        </pre>
        {status?.bucketExists === false && (
          <button
            onClick={handleCreateBucket}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            创建存储桶
          </button>
        )}
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