import React from 'react';
import { Card, Rate, Button, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Comment } from '../domain/Comment';

const { Text } = Typography;

interface CommentItemProps {
  comment: Comment;
  onEdit: () => void;
  onDelete: () => void;
  isOwner: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete,
  isOwner
}) => {
  return (
    <div className="comment-item">
      <div className="comment-header">
        <Space>
          <Text strong>用户 {comment.userId}</Text>
          <Rate disabled defaultValue={comment.rating} />
          <Text type="secondary">
            {new Date(comment.createdAt).toLocaleString()}
          </Text>
        </Space>
      </div>

      <div className="comment-content">
        <Text>{comment.content}</Text>
      </div>

      {comment.images && comment.images.length > 0 && (
        <div className="comment-images">
          {comment.images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`评论图片 ${index + 1}`}
              style={{ maxWidth: 200, marginRight: 8 }}
            />
          ))}
        </div>
      )}

      {isOwner && (
        <div className="comment-actions">
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={onEdit}
            >
              编辑
            </Button>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={onDelete}
            >
              删除
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}; 