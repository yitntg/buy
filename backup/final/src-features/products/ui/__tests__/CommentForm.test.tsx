import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CommentForm } from '../CommentForm';

describe('CommentForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('应该正确渲染表单', () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/评分/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/评论内容/i)).toBeInTheDocument();
    expect(screen.getByText(/上传图片/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /提交评论/i })).toBeInTheDocument();
  });

  it('应该验证必填字段', async () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /提交评论/i }));

    expect(await screen.findByText(/请输入评论内容/i)).toBeInTheDocument();
    expect(await screen.findByText(/请选择评分/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('应该成功提交表单', async () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);

    // 设置评分
    fireEvent.click(screen.getByLabelText(/评分/i).querySelectorAll('button')[4]);

    // 输入评论内容
    fireEvent.change(screen.getByLabelText(/评论内容/i), {
      target: { value: '测试评论内容' }
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /提交评论/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        '测试评论内容',
        5,
        []
      );
    });
  });

  it('应该在加载状态下禁用表单', () => {
    render(<CommentForm onSubmit={mockOnSubmit} loading={true} />);

    expect(screen.getByLabelText(/评论内容/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /提交中/i })).toBeDisabled();
  });

  it('应该处理提交错误', async () => {
    const error = new Error('提交失败');
    mockOnSubmit.mockRejectedValueOnce(error);

    render(<CommentForm onSubmit={mockOnSubmit} />);

    // 设置评分
    fireEvent.click(screen.getByLabelText(/评分/i).querySelectorAll('button')[4]);

    // 输入评论内容
    fireEvent.change(screen.getByLabelText(/评论内容/i), {
      target: { value: '测试评论内容' }
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /提交评论/i }));

    expect(await screen.findByText(/提交失败/i)).toBeInTheDocument();
  });
}); 