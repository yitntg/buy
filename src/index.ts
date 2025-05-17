// 导出领域层
export * from './app/shared/domain/events/DomainEvent';
export * from './app/shared/domain/events/EventBus';
export * from './app/shared/domain/events/EventStore';
export * from './app/shared/domain/PaginatedResult';

// 导出共享服务
export * from './app/shared/services/productService';
export * from './app/shared/infrastructure/repositories/SupabaseCommentRepository';

// 导出用户端API（使用命名空间避免命名冲突）
import * as ProductAPI from './app/customer/backend/api/products';
import * as OrderAPI from './app/customer/backend/api/orders';
import * as UserAPI from './app/customer/backend/api/users';
import * as CategoryAPI from './app/customer/backend/api/categories';
import * as CommentAPI from './app/customer/backend/api/comments/index';

export {
  ProductAPI,
  OrderAPI,
  UserAPI,
  CategoryAPI,
  CommentAPI
};

// 导出用户端组件
export * from './app/customer/frontend/components/StarRating';

// 注意：原有的许多引用文件在新结构中不存在，
// 如需使用这些功能，请先创建相应的文件 
