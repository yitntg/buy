import React, { useState } from 'react';
import { Rating } from './Rating';
import { ImageUpload } from './ImageUpload';

interface CommentFormProps {
  onSubmit: (content: string, rating: number, images: string[]) => Promise<void>;
  loading?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  loading = false
}) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('请输入评论内容');
      return;
    }

    if (rating === 0) {
      setError('请选择评分');
      return;
    }

    try {
      await onSubmit(content, rating, images);
      setContent('');
      setRating(0);
      setImages([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交评论失败');
    }
  };

  const handleImageUpload = (urls: string[]) => {
    setImages(urls);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          评分
        </label>
        <Rating
          value={rating}
          onChange={setRating}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          评论内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="请输入您的评论..."
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          上传图片
        </label>
        <ImageUpload
          onUpload={handleImageUpload}
          maxFiles={5}
          disabled={loading}
          className="mt-1"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? '提交中...' : '提交评论'}
      </button>
    </form>
  );
}; 