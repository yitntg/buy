import { UserRepository } from '../core/application/interfaces/UserRepository';
import { ProductRepository } from '../core/application/interfaces/ProductRepository';
import { CartRepository } from '../core/application/interfaces/CartRepository';
import { OrderRepository } from '../core/application/interfaces/OrderRepository';
import { UserRepositoryImpl } from './repositories/UserRepositoryImpl';
import { ProductRepositoryImpl } from './repositories/ProductRepositoryImpl';
import { CartRepositoryImpl } from './repositories/CartRepositoryImpl';
import { OrderRepositoryImpl } from './repositories/OrderRepositoryImpl';
import { GetUserProfileUseCase } from '../core/application/use-cases/GetUserProfile';
import { GetProductsUseCase } from '../core/application/use-cases/GetProducts';
import { GetUserCartUseCase } from '../core/application/use-cases/GetUserCart';
import { GetUserOrdersUseCase } from '../core/application/use-cases/GetUserOrders';
import { UpdateOrderStatusUseCase } from '../core/application/use-cases/UpdateOrderStatus';
import { CreateOrderUseCase } from '../core/application/use-cases/CreateOrder';
import { GetRepliesUseCase } from '../features/products/application/use-cases/GetRepliesUseCase';
import { CommentRepository } from '../features/products/domain/CommentRepository';
import { CommentRepositoryImpl } from './repositories/CommentRepositoryImpl';

export class Container {
  private static instance: Container;
  private repositories: Map<string, any> = new Map();
  private useCases: Map<string, any> = new Map();

  private constructor() {
    this.initializeRepositories();
    this.initializeUseCases();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeRepositories(): void {
    this.repositories.set('UserRepository', new UserRepositoryImpl());
    this.repositories.set('ProductRepository', new ProductRepositoryImpl());
    this.repositories.set('CartRepository', new CartRepositoryImpl());
    this.repositories.set('OrderRepository', new OrderRepositoryImpl());
    this.repositories.set('CommentRepository', new CommentRepositoryImpl());
  }

  private initializeUseCases(): void {
    this.useCases.set(
      'GetUserProfileUseCase',
      new GetUserProfileUseCase(this.repositories.get('UserRepository'))
    );
    this.useCases.set(
      'GetProductsUseCase',
      new GetProductsUseCase(this.repositories.get('ProductRepository'))
    );
    this.useCases.set(
      'GetUserCartUseCase',
      new GetUserCartUseCase(this.repositories.get('CartRepository'))
    );
    this.useCases.set(
      'GetUserOrdersUseCase',
      new GetUserOrdersUseCase(this.repositories.get('OrderRepository'))
    );
    this.useCases.set(
      'UpdateOrderStatusUseCase',
      new UpdateOrderStatusUseCase(this.repositories.get('OrderRepository'))
    );
    this.useCases.set(
      'CreateOrderUseCase',
      new CreateOrderUseCase(
        this.repositories.get('OrderRepository'),
        this.repositories.get('CartRepository')
      )
    );
    this.useCases.set(
      'GetRepliesUseCase',
      new GetRepliesUseCase(this.repositories.get('CommentRepository'))
    );
  }

  public getRepository<T>(name: string): T {
    return this.repositories.get(name);
  }

  public getUseCase<T>(name: string): T {
    return this.useCases.get(name);
  }
}

export const container = Container.getInstance(); 