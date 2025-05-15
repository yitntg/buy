/**
 * 通用分页参数接口
 */
export interface PaginationParams {
  /** 页码，从1开始 */
  page: number;
  
  /** 每页条数 */
  pageSize: number;
  
  /** 排序字段 */
  sortBy?: string;
  
  /** 排序方向：'asc'升序，'desc'降序 */
  sortDirection?: 'asc' | 'desc';
}

/**
 * 创建默认分页参数
 */
export function createDefaultPaginationParams(
  overrides: Partial<PaginationParams> = {}
): PaginationParams {
  return {
    page: 1,
    pageSize: 10,
    sortDirection: 'desc',
    ...overrides
  };
} 