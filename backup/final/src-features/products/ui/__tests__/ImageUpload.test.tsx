import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from '../ImageUpload';

describe('ImageUpload', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    mockOnUpload.mockClear();
  });

  it('应该正确渲染上传组件', () => {
    render(<ImageUpload onUpload={mockOnUpload} />);

    expect(screen.getByText(/拖放图片到此处/i)).toBeInTheDocument();
    expect(screen.getByText(/或点击选择图片/i)).toBeInTheDocument();
  });

  it('应该显示最大文件数量限制', () => {
    const maxFiles = 3;
    render(<ImageUpload onUpload={mockOnUpload} maxFiles={maxFiles} />);

    expect(screen.getByText(`最多上传 ${maxFiles} 张图片`)).toBeInTheDocument();
  });

  it('应该在禁用状态下显示禁用样式', () => {
    render(<ImageUpload onUpload={mockOnUpload} disabled={true} />);

    const container = screen.getByText(/拖放图片到此处/i).parentElement?.parentElement;
    expect(container).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('应该应用自定义className', () => {
    const customClass = 'custom-upload';
    render(<ImageUpload onUpload={mockOnUpload} className={customClass} />);

    const container = screen.getByText(/拖放图片到此处/i).parentElement?.parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('应该在拖放激活时显示激活样式', () => {
    render(<ImageUpload onUpload={mockOnUpload} />);

    const container = screen.getByText(/拖放图片到此处/i).parentElement?.parentElement;
    fireEvent.dragEnter(container!);

    expect(container).toHaveClass('border-indigo-500');
  });
}); 