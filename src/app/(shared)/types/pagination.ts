/**
 * 分页参数接口
 * 用于API请求中指定分页相关参数
 */
export interface PaginationParams {
  /** 当前页码，从1开始 */
  page: number;
  
  /** 每页条目数 */
  pageSize: number;
  
  /** 排序字段 */
  sortBy?: string;
  
  /** 排序方向: asc(升序) 或 desc(降序) */
  sortDirection?: 'asc' | 'desc';
  
  /** 过滤条件 */
  filters?: Record<string, any>;
  
  /** 搜索关键词 */
  searchTerm?: string;
}

/**
 * 分页结果接口
 * 用于API响应中返回分页数据
 */
export interface PaginatedResult<T> {
  /** 当前页数据 */
  data: T[];
  
  /** 元数据 */
  meta: {
    /** 当前页码 */
    currentPage: number;
    
    /** 每页条目数 */
    pageSize: number;
    
    /** 总条目数 */
    total: number;
    
    /** 总页数 */
    totalPages: number;
    
    /** 是否有上一页 */
    hasPrevPage: boolean;
    
    /** 是否有下一页 */
    hasNextPage: boolean;
  };
  
  /** 链接信息 */
  links?: {
    /** 首页链接 */
    first?: string;
    
    /** 上一页链接 */
    prev?: string;
    
    /** 下一页链接 */
    next?: string;
    
    /** 尾页链接 */
    last?: string;
  };
}

/**
 * 创建空的分页结果
 * @param pageSize 每页条目数
 * @returns 空的分页结果对象
 */
export function createEmptyPaginatedResult<T>(pageSize: number = 10): PaginatedResult<T> {
  return {
    data: [],
    meta: {
      currentPage: 1,
      pageSize,
      total: 0,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false
    }
  };
}

/**
 * 计算分页元数据
 * @param total 总条目数
 * @param pageSize 每页条目数
 * @param currentPage 当前页码
 * @returns 分页元数据
 */
export function calculatePaginationMeta(total: number, pageSize: number, currentPage: number) {
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages
  };
} 