import { Container } from 'inversify';
import { Redis } from 'ioredis';
import { CommentRepository } from '@/features/products/domain/CommentRepository';
import { SupabaseCommentRepository } from '@/shared/infrastructure/repositories/SupabaseCommentRepository';
import { CachedCommentRepository } from '@/features/products/infrastructure/cache/CachedCommentRepository';
import { EventBus } from '@/shared/domain/events/EventBus';
import { InMemoryEventBus } from '@/shared/infrastructure/events/InMemoryEventBus';
import { Logger } from '@/shared/infrastructure/logging/Logger';
import { appConfig } from '@/config/app.config';
import { UserRepository } from '@/core/application/interfaces/UserRepository';
import { ProductRepository } from '@/core/application/interfaces/ProductRepository';
import { CartRepository } from '@/core/application/interfaces/CartRepository';
import { OrderRepository } from '@/core/application/interfaces/OrderRepository';
import { UserRepositoryImpl } from '@/infrastructure/repositories/UserRepositoryImpl';
import { ProductRepositoryImpl } from '@/infrastructure/repositories/ProductRepositoryImpl';
import { CartRepositoryImpl } from '@/infrastructure/repositories/CartRepositoryImpl';
import { OrderRepositoryImpl } from '@/infrastructure/repositories/OrderRepositoryImpl';
import { supabase } from '@/shared/infrastructure/lib/supabase';

const container = new Container();

// 注册基础设施服务
container.bind('SupabaseClient').toConstantValue(supabase);
container.bind<Redis>('Redis').toConstantValue(new Redis(appConfig.redis.url));
container.bind<Logger>('Logger').toSingleton(Logger);
container.bind<EventBus>('EventBus').toSingleton(InMemoryEventBus);

// 注册仓储
container.bind<UserRepository>('UserRepository').to(UserRepositoryImpl);
container.bind<ProductRepository>('ProductRepository').to(ProductRepositoryImpl);
container.bind<CartRepository>('CartRepository').to(CartRepositoryImpl);
container.bind<OrderRepository>('OrderRepository').to(OrderRepositoryImpl);
container.bind<CommentRepository>('CommentRepository').toDynamicValue((context) => {
  const redis = context.container.get<Redis>('Redis');
  const baseRepository = new SupabaseCommentRepository();
  return new CachedCommentRepository(baseRepository, redis);
});

export { container }; 