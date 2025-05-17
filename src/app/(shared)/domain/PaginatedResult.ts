/**
 * 通用分页结果接口
 */
export interface PaginatedResult<T> {
  /** 当前页的项目列表 */
  items: T[];
  
  /** 总记录数 */
  total: number;
  
  /** 当前页码 */
  page: number;
  
  /** 每页大小 */
  pageSize: number;
  
  /** 总页数 */
  totalPages: number;
  
  /** 是否有上一页 */
  hasPrevPage: boolean;
  
  /** 是否有下一页 */
  hasNextPage: boolean;
}

/**
 * 创建分页结果的辅助函数
 */
export function createPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages
  };
} 
