import React, { useEffect, useState } from 'react';
import { Comment } from '../domain/Comment';
import { CommentApi } from '../api/CommentApi';
import { LikeCommentUseCase } from '../application/use-cases/LikeCommentUseCase';
import { UnlikeCommentUseCase } from '../application/use-cases/UnlikeCommentUseCase';
import { AddReplyUseCase } from '../application/use-cases/AddReplyUseCase';
import LikeButton from './LikeButton';
import CommentForm from './CommentForm';
import { useCommentEvent, emitCommentEvent } from './useCommentEvents';

interface ReplyListProps {
  parentId: string;
  productId: string;
}

const ReplyList: React.FC<ReplyListProps> = ({ parentId, productId }) => {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const commentRepository = new CommentApi();
  const likeCommentUseCase = new LikeCommentUseCase(commentRepository);
  const unlikeCommentUseCase = new UnlikeCommentUseCase(commentRepository);
  const addReplyUseCase = new AddReplyUseCase(commentRepository);

  const loadReplies = async () => {
    setLoading(true);
    const result = await commentRepository.findByParentId(parentId, { page: 1, pageSize: 10 });
    setReplies(result.items);
    setLoading(false);
  };

  useEffect(() => {
    loadReplies();
  }, [parentId]);

  useCommentEvent('comment.changed', loadReplies);

  const handleLike = async (commentId: string) => {
    await likeCommentUseCase.execute({ commentId, productId, userId: 'currentUserId' });
    emitCommentEvent('comment.changed');
  };

  const handleUnlike = async (commentId: string) => {
    await unlikeCommentUseCase.execute({ commentId, productId, userId: 'currentUserId' });
    emitCommentEvent('comment.changed');
  };

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
  };

  const handleReplySubmit = async (content: string, rating: number, images: string[]) => {
    if (!replyTo) return;
    await addReplyUseCase.execute({
      parentId: replyTo,
      productId,
      userId: 'currentUserId',
      content,
      rating,
      images
    });
    setReplyTo(null);
    emitCommentEvent('comment.changed');
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div className="ml-8 space-y-2">
      {replies.map(reply => (
        <div key={reply.id} className="bg-gray-50 rounded p-2">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400 text-lg">{'★'.repeat(reply.rating)}</span>
            <span className="text-gray-500 text-xs">{new Date(reply.createdAt).toLocaleDateString()}</span>
            <LikeButton
              liked={reply.likes.includes('currentUserId')}
              count={reply.likes.length}
              onLike={() => handleLike(reply.id)}
              onUnlike={() => handleUnlike(reply.id)}
            />
            <button onClick={() => handleReply(reply.id)} className="text-blue-500 text-xs">回复</button>
          </div>
          <div className="text-gray-700 text-sm mt-1">{reply.content}</div>
          {replyTo === reply.id && (
            <CommentForm onSubmit={handleReplySubmit} onCancel={() => setReplyTo(null)} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ReplyList; 