import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { CommentRepository } from '@/features/products/domain/CommentRepository';
import { PrismaCommentRepository } from '@/features/products/infrastructure/persistence/PrismaCommentRepository';
import { CachedCommentRepository } from '@/features/products/infrastructure/cache/CachedCommentRepository';
import { EventBus } from '@/shared/domain/events/EventBus';
import { InMemoryEventBus } from '@/shared/infrastructure/events/InMemoryEventBus';
import { Logger } from '@/shared/infrastructure/logging/Logger';
import { appConfig } from '@/config/app.config';

const container = new Container();

// 注册基础设施服务
container.bind<PrismaClient>('PrismaClient').toConstantValue(new PrismaClient());
container.bind<Redis>('Redis').toConstantValue(new Redis(appConfig.redis.url));
container.bind<Logger>('Logger').toSingleton(Logger);
container.bind<EventBus>('EventBus').toSingleton(InMemoryEventBus);

// 注册仓储
container.bind<CommentRepository>('CommentRepository').toDynamicValue((context) => {
  const prisma = context.container.get<PrismaClient>('PrismaClient');
  const redis = context.container.get<Redis>('Redis');
  const baseRepository = new PrismaCommentRepository(prisma);
  return new CachedCommentRepository(baseRepository, redis);
});

export { container }; 