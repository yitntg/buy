// 导出领域层
export * from './features/products/domain/Comment';
export * from './features/products/domain/CommentAggregate';
export * from './features/products/domain/CommentRepository';
export * from './features/products/domain/services/CommentDomainService';

// 导出应用层
export * from './features/products/application/use-cases/CreateCommentUseCase';
export * from './features/products/application/use-cases/UpdateCommentUseCase';
export * from './features/products/application/use-cases/DeleteCommentUseCase';
export * from './features/products/application/use-cases/LikeCommentUseCase';
export * from './features/products/application/use-cases/UnlikeCommentUseCase';
export * from './features/products/application/use-cases/ReplyToCommentUseCase';
export * from './features/products/application/use-cases/GetCommentsUseCase';
export * from './features/products/application/use-cases/GetCommentDetailUseCase';

// 导出基础设施层
export * from './features/products/infrastructure/persistence/PrismaCommentRepository';
export * from './features/products/infrastructure/cache/CachedCommentRepository';
export * from './features/products/infrastructure/events/PrismaEventStore';

// 导出表现层
export * from './features/products/ui/CommentForm';
export * from './features/products/ui/CommentList';
export * from './features/products/ui/CommentDetail';
export * from './features/products/ui/Rating';
export * from './features/products/ui/ImageUpload';

// 导出共享模块
export * from './shared/domain/events/DomainEvent';
export * from './shared/domain/events/EventBus';
export * from './shared/domain/PaginatedResult';
export * from './shared/infrastructure/middleware/ErrorHandler';
export * from './shared/infrastructure/logging/Logger'; 