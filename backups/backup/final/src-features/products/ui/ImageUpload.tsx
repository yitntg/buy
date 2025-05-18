import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxFiles = 5,
  disabled = false,
  className = ''
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const urls: string[] = [];
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          urls.push(result);
          if (urls.length === acceptedFiles.length) {
            onUpload(urls);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles,
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isDragActive ? 'border-indigo-500' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-2 text-sm text-gray-600">
          {isDragActive ? (
            <p>将图片拖放到此处...</p>
          ) : (
            <p>
              拖放图片到此处，或点击选择图片
              <br />
              最多上传 {maxFiles} 张图片
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 