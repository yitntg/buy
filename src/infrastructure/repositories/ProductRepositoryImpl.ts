import { PrismaClient } from '@prisma/client';
import { Product } from '@/core/domain/entities/Product';
import { ProductRepository, ProductSearchParams, ProductSearchResult } from '@/core/application/interfaces/ProductRepository';
import { Money } from '@/core/domain/value-objects/Money';

export class ProductRepositoryImpl implements ProductRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id }
    });

    if (!product) return null;

    return Product.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Money.create(product.price),
      images: [],
      categoryId: '0',
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    
    return products.map(dbProduct => Product.create({
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description,
      price: Money.create(dbProduct.price),
      images: [],
      categoryId: '0',
      stock: dbProduct.stock,
      createdAt: dbProduct.createdAt,
      updatedAt: dbProduct.updatedAt
    }));
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    // 暂时简单实现，实际可能需要在产品表添加categoryId字段
    const products = await this.prisma.product.findMany();
    
    return products.map(dbProduct => Product.create({
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description,
      price: Money.create(dbProduct.price),
      images: [],
      categoryId: categoryId,
      stock: dbProduct.stock,
      createdAt: dbProduct.createdAt,
      updatedAt: dbProduct.updatedAt
    }));
  }

  async findFeatured(limit: number = 4): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    
    return products.map(product => new Product(
      product.id,
      product.name,
      product.description,
      product.price,
      [], 
      0,
      product.stock,
      product.createdAt,
      product.updatedAt
    ));
  }

  async search(params: ProductSearchParams): Promise<ProductSearchResult> {
    const { 
      query, 
      categoryId, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = params;

    const where: any = {};
    
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }
    
    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }
    
    // 假设我们有一个分类ID
    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      this.prisma.product.count({ where })
    ]);

    const mappedProducts = products.map(dbProduct => Product.create({
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description,
      price: Money.create(dbProduct.price),
      images: [],
      categoryId: '0',
      stock: dbProduct.stock,
      createdAt: dbProduct.createdAt,
      updatedAt: dbProduct.updatedAt
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items: mappedProducts,
      total,
      page,
      limit,
      totalPages
    };
  }

  async save(product: Product): Promise<void> {
    await this.prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price.getAmount(),
        stock: product.stock
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.getAmount(),
        stock: product.stock
      }
    });
  }

  async update(id: string, product: Product): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price.getAmount(),
        stock: product.stock
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id }
    });
  }
} 