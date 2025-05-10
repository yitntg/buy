import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onChange(star)}
          className={`focus:outline-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={disabled}
        >
          {value >= star ? (
            <StarIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-6 w-6 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
}; 