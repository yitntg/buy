import { CommentRepository } from '../../features/products/domain/CommentRepository';
import { CommentApi } from '../../features/products/api/CommentApi';

export class Container {
  private static instance: Container;
  private repositories: Map<string, any> = new Map();

  private constructor() {
    this.initializeRepositories();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeRepositories(): void {
    this.repositories.set('CommentRepository', new CommentApi());
  }

  public getRepository<T>(name: string): T {
    return this.repositories.get(name);
  }
}

export const container = Container.getInstance(); 
