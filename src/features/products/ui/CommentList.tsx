import React, { useEffect, useState, useCallback } from 'react';
import { Comment } from '../domain/Comment';
import { CommentApi } from '../api/CommentApi';
import { CreateCommentUseCase } from '../domain/use-cases/CreateComment';
import { UpdateCommentUseCase } from '../domain/use-cases/UpdateComment';
import { DeleteCommentUseCase } from '../domain/use-cases/DeleteComment';
import { PaginatedResult, SortParams, FilterParams } from '../domain/CommentRepository';
import { useAuth } from '../../../auth/context/AuthContext';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { Pagination } from '../../../shared/ui/Pagination';
import { Button, Select, DatePicker, Space, Card, Typography, Divider } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined } from '@ant-design/icons';
import { GetCommentsUseCase } from '../application/use-cases/GetCommentsUseCase';
import { LikeCommentUseCase } from '../application/use-cases/LikeCommentUseCase';
import { UnlikeCommentUseCase } from '../application/use-cases/UnlikeCommentUseCase';
import { AddReplyUseCase } from '../application/use-cases/AddReplyUseCase';
import { useCommentEvent, emitCommentEvent } from './useCommentEvents';
import ReplyList from './ReplyList';
import LikeButton from './LikeButton';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface CommentListProps {
  productId: string;
  userId: string;
  getCommentsUseCase: GetCommentsUseCase;
  likeCommentUseCase: LikeCommentUseCase;
  unlikeCommentUseCase: UnlikeCommentUseCase;
  addReplyUseCase: AddReplyUseCase;
}

interface CommentImage {
  url: string;
  index: number;
}

const defaultSort: SortParams = { field: 'createdAt', order: 'desc' };

export const CommentList: React.FC<CommentListProps> = ({
  productId,
  userId,
  getCommentsUseCase,
  likeCommentUseCase,
  unlikeCommentUseCase,
  addReplyUseCase
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState({
    content: '',
    rating: 5,
    images: [] as string[]
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [sort, setSort] = useState<SortParams>(defaultSort);
  const [filter, setFilter] = useState<FilterParams>({
    rating: undefined,
    hasImages: undefined,
    startDate: undefined,
    endDate: undefined
  });
  const [commentLikes, setCommentLikes] = useState<Record<string, string[]>>({});
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [replyComments, setReplyComments] = useState<Record<string, Comment[]>>({});
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const commentRepository = new CommentApi();
  const createCommentUseCase = new CreateCommentUseCase(commentRepository);
  const updateCommentUseCase = new UpdateCommentUseCase(commentRepository);
  const deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: CommentQueryParams = {
      pagination: {
        page: pagination.current,
        pageSize: pagination.pageSize
      },
      sort: {
        sortField: sort.field,
        sortOrder: sort.order
      },
      filter: {
        rating: filter.rating,
        hasImages: filter.hasImages,
        startDate: filter.startDate,
        endDate: filter.endDate
      }
    };

    const result = await getCommentsUseCase.execute({ productId, params });
    setComments(result.items);
    setPagination(prev => ({
      ...prev,
      total: result.total,
      totalPages: Math.ceil(result.total / result.pageSize)
    }));

    // 加载评论的点赞和回复数
    await Promise.all([
      ...result.items.map(comment => loadCommentLikes(comment.id)),
      ...result.items.map(comment => loadReplyCount(comment.id))
    ]);

    setLoading(false);
  }, [productId, getCommentsUseCase, pagination.current, pagination.pageSize, sort, filter]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // 事件驱动自动刷新
  useCommentEvent('comment.changed', loadComments);

  useEffect(() => {
    // 加载所有评论的点赞信息
    comments.forEach(comment => {
      loadCommentLikes(comment.id);
    });
  }, [comments]);

  const loadCommentLikes = async (commentId: string) => {
    try {
      const likes = await commentRepository.getCommentLikes(commentId);
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: likes
      }));
    } catch (err) {
      console.error('加载评论点赞失败:', err);
    }
  };

  const loadReplyCount = async (commentId: string) => {
    try {
      const count = await commentRepository.getReplyCount(commentId);
      setReplyCounts(prev => ({
        ...prev,
        [commentId]: count
      }));
    } catch (err) {
      console.error('加载回复数失败:', err);
    }
  };

  const loadReplies = async (commentId: string) => {
    try {
      const params: CommentQueryParams = {
        pagination: {
          page: 1,
          pageSize: 10
        },
        sort: {
          sortField: 'createdAt',
          sortOrder: 'asc'
        }
      };

      const result = await commentRepository.findByParentId(commentId, params);
      setReplyComments(prev => ({
        ...prev,
        [commentId]: result.items
      }));
    } catch (err) {
      console.error('加载回复失败:', err);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    try {
      await likeCommentUseCase.execute({ commentId, productId, userId: user.id });
      emitCommentEvent('comment.changed');
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  const handleUnlike = async (commentId: string) => {
    if (!user) return;
    try {
      await unlikeCommentUseCase.execute({ commentId, productId, userId: user.id });
      emitCommentEvent('comment.changed');
    } catch (err) {
      console.error('取消点赞失败:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    try {
      const comment = await createCommentUseCase.execute({
        content: newComment.content,
        rating: newComment.rating,
        userId,
        productId,
        images: newComment.images
      });

      setComments(prev => [comment, ...prev]);
      setNewComment({ content: '', rating: 5, images: [] });
      // 重新加载第一页
      setPagination(prev => ({ ...prev, current: 1 }));
    } catch (err) {
      setError('发表评论失败');
      console.error('Error creating comment:', err);
    }
  };

  const handleEdit = async (comment: Comment) => {
    setEditingComment(comment);
    setNewComment({
      content: comment.content,
      rating: comment.rating,
      images: comment.images || []
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment || !newComment.content.trim()) return;

    try {
      const updatedComment = await updateCommentUseCase.execute(editingComment.id, {
        content: newComment.content,
        rating: newComment.rating,
        images: newComment.images
      });

      setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
      setEditingComment(null);
      setNewComment({ content: '', rating: 5, images: [] });
    } catch (err) {
      setError('更新评论失败');
      console.error('Error updating comment:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;

    try {
      await deleteCommentUseCase.execute(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      // 如果当前页没有评论了，且不是第一页，则回到上一页
      if (comments.length === 1 && pagination.current > 1) {
        setPagination(prev => ({ ...prev, current: prev.current - 1 }));
      }
    } catch (err) {
      setError('删除评论失败');
      console.error('Error deleting comment:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setNewComment(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, current: newPage }));
  };

  const handleSort = (field: SortParams['field']) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (newFilter: Partial<FilterParams>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    // 重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setFilter(prev => ({ ...prev, startDate, endDate }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
  };

  const handleReplySubmit = async (content: string, rating: number, images: string[]) => {
    if (!replyTo) return;
    await addReplyUseCase.execute({
      parentId: replyTo,
      productId,
      userId: user.id,
      content,
      rating,
      images
    });
    setReplyTo(null);
    emitCommentEvent('comment.changed');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 评论表单 */}
      <form onSubmit={editingComment ? handleUpdate : handleSubmit} className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingComment ? '编辑评论' : '发表评论'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              评分
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewComment(prev => ({ ...prev, rating }))}
                  className={`text-2xl ${
                    newComment.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              评论内容
            </label>
            <textarea
              value={newComment.content}
              onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="分享您的使用体验..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              上传图片
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full"
            />
            {newComment.images.length > 0 && (
              <div className="mt-2 flex space-x-2">
                {newComment.images.map((image: string, index: number) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`预览图 ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setNewComment(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
            >
              {editingComment ? '更新评论' : '发表评论'}
            </button>
            {editingComment && (
              <button
                type="button"
                onClick={() => {
                  setEditingComment(null);
                  setNewComment({ content: '', rating: 5, images: [] });
                }}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                取消编辑
              </button>
            )}
          </div>
        </div>
      </form>

      {/* 筛选和排序控件 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4">
          {/* 评分筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              评分筛选
            </label>
            <select
              value={filter.rating || ''}
              onChange={(e) => handleFilterChange({ rating: e.target.value ? Number(e.target.value) : undefined })}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              <option value="">全部评分</option>
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>
                  {rating}星及以上
                </option>
              ))}
            </select>
          </div>

          {/* 图片筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              图片筛选
            </label>
            <select
              value={filter.hasImages === undefined ? '' : filter.hasImages.toString()}
              onChange={(e) => handleFilterChange({ hasImages: e.target.value === '' ? undefined : e.target.value === 'true' })}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              <option value="">全部评论</option>
              <option value="true">有图片</option>
              <option value="false">无图片</option>
            </select>
          </div>

          {/* 日期范围筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日期范围
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filter.startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleDateRangeChange(
                  e.target.value ? new Date(e.target.value) : undefined,
                  filter.endDate
                )}
                className="px-3 py-1 border border-gray-300 rounded"
              />
              <span className="self-center">至</span>
              <input
                type="date"
                value={filter.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleDateRangeChange(
                  filter.startDate,
                  e.target.value ? new Date(e.target.value) : undefined
                )}
                className="px-3 py-1 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* 排序控件 */}
          <div className="flex items-end space-x-4">
            <button
              onClick={() => handleSort('createdAt')}
              className={`px-3 py-1 rounded border ${
                sort.field === 'createdAt'
                  ? 'border-primary text-primary'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              时间 {sort.field === 'createdAt' && (sort.order === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('rating')}
              className={`px-3 py-1 rounded border ${
                sort.field === 'rating'
                  ? 'border-primary text-primary'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              评分 {sort.field === 'rating' && (sort.order === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('likes')}
              className={`px-3 py-1 rounded border ${
                sort.field === 'likes'
                  ? 'border-primary text-primary'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              点赞 {sort.field === 'likes' && (sort.order === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-xl">
                  {'★'.repeat(comment.rating)}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {/* 点赞按钮 */}
                <LikeButton
                  liked={commentLikes[comment.id]?.includes(user.id)}
                  count={commentLikes[comment.id]?.length || 0}
                  onLike={() => handleLike(comment.id)}
                  onUnlike={() => handleUnlike(comment.id)}
                />
                {comment.userId === user.id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      删除
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-700 mb-2">{comment.content}</p>
            {comment.images && comment.images.length > 0 && (
              <div className="flex space-x-2 mt-2">
                {comment.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`评论图片 ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <ReplyList parentId={comment.id} productId={productId} />
            {replyTo === comment.id && (
              <CommentForm onSubmit={handleReplySubmit} onCancel={() => setReplyTo(null)} />
            )}
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="px-3 py-1">
            第 {pagination.current} 页，共 {pagination.totalPages} 页
          </span>
          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}; 