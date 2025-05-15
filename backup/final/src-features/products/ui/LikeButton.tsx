import React from 'react';

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onLike: () => void;
  onUnlike: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ liked, count, onLike, onUnlike }) => {
  return (
    <button
      onClick={liked ? onUnlike : onLike}
      className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
    >
      <svg
        className="w-5 h-5"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
};

export default LikeButton; 